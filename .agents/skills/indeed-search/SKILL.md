---
name: indeed-search
version: 1.0.0
description: >
  Use this skill to search live job listings on Indeed for India or the UAE —
  find open positions, vacancies, and hiring across any sector (software,
  data, design, marketing, finance, legal, operations, etc.) in Indian or
  Emirati cities, or look up a specific Indeed job posting. Trigger phrases:
  find a job in India, find a job in the UAE, job search Dubai, job search
  Pune, Indeed jobs, naukri jobs (fallback when naukri-search can't run),
  vacancies in Mumbai, hiring in Abu Dhabi, "are there any X jobs in <Indian
  or UAE city>", look up this Indeed job posting.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/indeed-search/cli/src/cli.ts *)
---

# Indeed Search Skill (India & UAE)

Search live job listings from Indeed's public pages for **India** (`in.indeed.com`) and
**UAE** (`ae.indeed.com`). No authentication, no API key, and **zero runtime
dependencies** — it runs with just `bun`.

## robots.txt status (verified 2026-09-12)

`indeed.com/robots.txt` **explicitly lists `Claude-User` in its `Allow: /` group**
alongside Google, Perplexity and other named agents — this is not an anti-bot
workaround, it is a portal-level policy of permitting this kind of automated,
user-directed access. Still, this reads public HTML pages rather than an official
API, so keep request volume low and personal (a handful of searches per run, not a
crawl) — the same courtesy the other portal skills in this repo observe.

## When to use this skill

- Search for job openings in an Indian or UAE city, or across the country generally
- Filter by recency (posted within the last N days)
- Get the full description, employment type, posted date, and apply-by deadline for
  a specific listing

## Commands

### Search job listings

```bash
bun run .agents/skills/indeed-search/cli/src/cli.ts search --country <cc> [flags]
```

Key flags:
- `--country <cc>` / `-c <cc>` — **required.** `in` for India, `ae` for UAE. These two
  are the ones this fork investigated and tested end-to-end; other 2-letter Indeed
  country codes (e.g. `uk`, `de`) follow the identical URL pattern and will likely
  work, but are untested by this skill.
- `--query <text>` / `-q <text>` — keyword search (title, skill, role). Recommended.
- `--location <text>` / `-l <text>` — city or region, e.g. `"Pune"`, `"Dubai"`. Optional
  — Indeed will search the whole country if omitted.
- `--jobage <days>` — posted within N days, e.g. `1`, `3`, `7`, `14`. Omit for all postings.
- `--page <n>` — page number (1-indexed, ~15 results per page).
- `--limit <n>` / `-n <n>` — cap total results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/indeed-search/cli/src/cli.ts detail <id|url> --country <cc> [--format json|plain]
```

`id` is the job key from `search` results (e.g. `94d2771a7ab59509`). You may also pass
a full `viewjob?jk=...` URL. Returns the full description, employment type, posted
date, and the apply-by deadline (`validThrough`) where Indeed states one.

## Usage examples

```bash
# DevOps roles in Pune, last 14 days
bun run .agents/skills/indeed-search/cli/src/cli.ts search -c in -q "devops engineer" -l "Pune" --jobage 14 --format table

# SRE roles in Dubai
bun run .agents/skills/indeed-search/cli/src/cli.ts search -c ae -q "site reliability engineer" -l "Dubai" --format table

# Cloud architect roles anywhere in the UAE, posted in the last 3 days
bun run .agents/skills/indeed-search/cli/src/cli.ts search -c ae -q "cloud architect" --jobage 3 --format table

# Full detail for a specific job
bun run .agents/skills/indeed-search/cli/src/cli.ts detail 94d2771a7ab59509 -c in --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing IDs to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

All errors are written to **stderr** as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Search results come from parsing the visible job-card HTML (title, company,
  location). Indeed's card markup dropped the human-readable "posted N days ago"
  text in some layouts; the CLI recovers an absolute post date from an inline JSON
  blob elsewhere on the page keyed by the same job id, and returns `date: null`
  (never a guess) when that blob doesn't carry it for a given result — see
  `url-reference.md` for the exact anchor.
- Job detail comes from the schema.org `JobPosting` JSON-LD block Indeed embeds on
  every listing page — a stable, standard format, not scraped from visual markup.
- Indeed may rate-limit; the CLI retries 429/5xx with exponential backoff.
- Job keys (`jk`) are lowercase hex strings (e.g. `94d2771a7ab59509`) — pass them
  as-is to `detail`.
