# Indeed URL Reference

Public, unauthenticated pages used by this skill. One platform per country subdomain;
this fork is built and tested against `in` (India) and `ae` (UAE) — other 2-letter
Indeed country codes should follow the same pattern but are untested.

> robots.txt for `indeed.com` explicitly **allows** the `Claude-User` agent (grouped
> with Google/Perplexity/other named agents under a broad `Allow: /`), verified
> 2026-09-12. Distinct from LinkedIn/other portal skills in this repo, this is not a
> ToS gray area — still, keep volume low and personal.

## Search

```
GET https://{country}.indeed.com/jobs
```

Query params:

| Param | Meaning | Example |
|-------|---------|---------|
| `q` | Free-text query | `devops engineer` |
| `l` | City/region (optional — omit to search the whole country) | `Pune`, `Dubai` |
| `fromage` | Posted-within window, in days | `1`, `3`, `7`, `14` |
| `start` | Pagination offset (~15 results/page) | `0`, `15`, `30`, … |

Returns an HTML page. Each result renders as `<a data-jk="<jobkey>" ...><span
title="<title>" id="jobTitle-<jobkey>">...` inside a `resultContent` cell, with company
(`data-testid="company-name"`) and location (`data-testid="text-location"`) nearby. The
CLI splits the page on `data-jk="..."` and parses each chunk independently so one
malformed card cannot break the rest (same pattern as `linkedin-search`).

### Post date recovery

The visible card does not reliably carry a "posted N days ago" string in every layout.
The page also embeds a large inline JS data blob containing, per job, `"createDate":
<epoch-ms>` shortly before that job's own `"jobkey":"<id>"` field. The CLI anchors on
the `jobkey` occurrence for a given id and scans backward (bounded window) for the
nearest preceding `createDate`, converting epoch-ms to an ISO date. If the blob doesn't
carry the field for a result (layout drift, A/B test variant, etc.), `date` is `null` —
never guessed from a relative string like "8 days ago" against an unknown "today".

## Detail

```
GET https://{country}.indeed.com/viewjob?jk=<jobkey>
```

Returns a single job's HTML page containing a `<script type="application/ld+json">`
block with a standard [schema.org `JobPosting`](https://schema.org/JobPosting) object:

```json
{
  "@type": "JobPosting",
  "datePosted": "2026-09-03T15:21:57.743Z",
  "description": "<div>...</div>",
  "employmentType": ["FULL_TIME"],
  "hiringOrganization": { "name": "Siemens" },
  "jobLocation": { "address": { "addressLocality": "Pune", "addressRegion": "MH", "addressCountry": "IN" } },
  "title": "DevOps Engineer",
  "validThrough": "2027-01-10T13:59:31.230Z"
}
```

This is a stable, standards-based source — not scraped from visual markup — so it is
the preferred parsing target for `detail`. `datePosted` -> `date`, `validThrough` ->
`deadline`, `description` has its HTML tags stripped with paragraph/list breaks kept as
newlines.

### Closed-state detection

If the JSON-LD block is absent entirely, `parseJobDetail` returns `null` (the CLI
reports `NOT_FOUND`/`PARSE_FAILED`). If the block is present but the page also contains
the phrase "no longer accepting applications" or "job has expired" near the top, the
CLI reports `isActive: false`. Absence of that phrase is absence of evidence, not proof
the posting is open — same convention as `linkedin-search`.

## Notes

- No authentication required.
- Respect rate limits — the CLI backs off on 429/5xx.
- Job keys (`jk`) are lowercase hex, typically 16 characters (e.g. `94d2771a7ab59509`).
- If Indeed changes its markup, the anchors to re-check are: `data-jk=`,
  `data-testid="company-name"`, `data-testid="text-location"` (search) and the
  `application/ld+json` script tag (detail) — update `helpers.ts` accordingly.
