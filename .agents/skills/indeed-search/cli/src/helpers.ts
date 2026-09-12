// Data source: Indeed's public search-results pages (HTML) and job-detail pages
// (schema.org JobPosting JSON-LD, embedded in a <script type="application/ld+json">
// tag). No authentication required. robots.txt for indeed.com explicitly ALLOWS the
// "Claude-User" agent on /jobs and /viewjob (verified 2026-09-12) - see url-reference.md.
//
// Country handling: Indeed runs one platform per country subdomain (in.indeed.com,
// ae.indeed.com, ...). This fork is built and tested against India ("in") and UAE
// ("ae"); other two-letter Indeed country codes should work unchanged but are untested.

export function searchUrl(country: string): string {
  return `https://${country}.indeed.com/jobs`
}

export function detailUrl(country: string, id: string): string {
  return `https://${country}.indeed.com/viewjob?jk=${id}`
}

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA = "Mozilla/5.0 (compatible; indeed-search-cli/1.0)"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on a 404. */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface JobDetail extends JobCard {
  description: string | null
  employmentType: string | null
  deadline: string | null
  isActive: boolean
}

function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html))
}

/**
 * Parse the search-results page: a flat list of job cards, one per
 * `data-jk="<id>"` anchor. We split on that marker and parse each chunk
 * independently so one malformed card cannot break the rest.
 *
 * The visible card carries id/title/company/location reliably, but Indeed
 * dropped the human-readable "posted N days ago" text from the card markup
 * in some layouts; the absolute post date only survives in a large inline
 * JSON blob elsewhere on the page, keyed by the same job id ("jobkey"). We
 * look each id up there for `date` and fall back to null (never guessed)
 * when the blob doesn't contain it - see extractCreateDate below.
 */
export function parseJobCards(html: string, country: string): JobCard[] {
  const results: JobCard[] = []
  const chunks = html.split(/data-jk="([a-f0-9]{10,})"/)
  // String.split with a capturing group interleaves the captured id between
  // chunks: [pre, id0, chunk0, id1, chunk1, ...]. Walk it in (id, chunk) pairs.
  for (let i = 1; i + 1 < chunks.length; i += 2) {
    const id = chunks[i]
    const chunk = chunks[i + 1]

    const titleMatch =
      chunk.match(/<span title="([^"]*)"[^>]*id="jobTitle-[^"]*"/i) ??
      chunk.match(/class="jobTitle[^"]*"[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>/i)
    const title = titleMatch ? clean(decodeHtmlEntities(titleMatch[1])) : null
    if (!title) continue

    const companyMatch = chunk.match(/data-testid="company-name"[^>]*>([\s\S]*?)<\/span>/i)
    const company = companyMatch ? clean(companyMatch[1]) || null : null

    const locationMatch = chunk.match(/data-testid="text-location"[^>]*>([\s\S]*?)<\/div>/i)
    const location = locationMatch ? clean(locationMatch[1]) || null : null

    results.push({
      id,
      title,
      company,
      location,
      date: extractCreateDate(html, id),
      url: detailUrl(country, id),
    })
  }
  return results
}

/**
 * Best-effort absolute post date for one job id, read from the inline JSON
 * page-data blob (`"createDate":<epoch-ms>` appears once per job object,
 * shortly before that object's own `"jobkey":"<id>"` field). We anchor on
 * the jobkey occurrence and scan backward for the nearest createDate, which
 * keeps this a plain string search rather than parsing the full multi-MB
 * blob as JSON. Returns null - never a guess - if the field isn't found.
 */
function extractCreateDate(html: string, id: string): string | null {
  const anchor = html.indexOf(`"jobkey":"${id}"`)
  if (anchor === -1) return null
  const windowStart = Math.max(0, anchor - 6000)
  const before = html.slice(windowStart, anchor)
  const matches = [...before.matchAll(/"createDate":(\d+)/g)]
  if (matches.length === 0) return null
  const last = matches[matches.length - 1]
  const ms = Number(last[1])
  if (!Number.isFinite(ms)) return null
  try {
    return new Date(ms).toISOString().slice(0, 10)
  } catch {
    return null
  }
}

/** Parse the detail page's schema.org JobPosting JSON-LD block. */
export function parseJobDetail(html: string, id: string, country: string): JobDetail | null {
  const ldMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  )
  if (!ldMatch) return null

  let data: any
  try {
    data = JSON.parse(ldMatch[1])
  } catch {
    return null
  }
  if (data["@type"] !== "JobPosting") return null

  const descHtml: string = data.description || ""
  const withBreaks = descHtml
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
  const description = decodeHtmlEntities(stripTags(withBreaks)).replace(/\n{3,}/g, "\n\n").trim() || null

  const company: string | null = data.hiringOrganization?.name || null

  const addr = data.jobLocation?.address || {}
  const location =
    [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(", ") || null

  const employmentType: string | null = Array.isArray(data.employmentType)
    ? data.employmentType.join(", ")
    : data.employmentType || null

  const date: string | null = data.datePosted ? String(data.datePosted).slice(0, 10) : null
  const deadline: string | null = data.validThrough ? String(data.validThrough).slice(0, 10) : null

  // Closed-state detection: absence of the JSON-LD block already returns
  // null above. A still-present block plus an explicit "no longer accepting
  // applications" / "job has expired" phrase near the top of the page is the
  // only other signal Indeed renders for a dead posting on this layout.
  // Absence of that phrase is absence of evidence, not proof the posting is
  // open, matching linkedin-search's isActive convention.
  const isActive = !/no longer accepting applications|this job (?:posting )?has expired/i.test(
    html.slice(0, html.indexOf("</head>") > -1 ? html.indexOf("</head>") + 20000 : 20000),
  )

  return {
    id,
    title: data.title ? clean(String(data.title)) : "(untitled)",
    company,
    location,
    date,
    url: detailUrl(country, id),
    description,
    employmentType,
    deadline,
    isActive,
  }
}

/** Map a job-age in days to Indeed's `fromage` parameter (whole days, 1-30ish). */
export function jobageToFromage(days: number | undefined): string | null {
  if (!days || days <= 0 || days >= 9999) return null
  return String(Math.round(days))
}
