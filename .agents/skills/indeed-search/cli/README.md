# indeed-cli

CLI for searching jobs on Indeed's public job listings, scoped to **India** (`in`) and
**UAE** (`ae`) — the two country subdomains this fork investigated and tested. Other
2-letter Indeed country codes follow the identical URL pattern but are untested.

**Data source**: Indeed's public search-results pages (HTML) and job-detail pages
(schema.org `JobPosting` JSON-LD).
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch`). `bun install` is optional and only pulls dev type defs.

> `indeed.com`'s `robots.txt` explicitly allows the `Claude-User` agent (verified
> 2026-09-12) — see `../url-reference.md`. Still, keep volume low and personal.

## Installation

```bash
cd .agents/skills/indeed-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search for job listings (`--country` required) |
| `detail` | Fetch full detail for a single job listing (`--country` required) |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts `--format json|plain`.
All errors are written to **stderr** as `{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# DevOps roles in Pune, last 14 days
bun run src/cli.ts search -c in -q "devops engineer" -l "Pune" --jobage 14 --format table

# SRE roles in Dubai
bun run src/cli.ts search -c ae -q "site reliability engineer" -l "Dubai" --format table

# Full detail for one job
bun run src/cli.ts detail 94d2771a7ab59509 -c in --format plain
```

See `../SKILL.md` for the full flag reference and the robots.txt note.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--country` | `-c` | **Required.** `in` or `ae` (tested); other 2-letter Indeed codes untested. |
| `--query` | `-q` | Keywords (title / skill / role). Recommended. |
| `--location` | `-l` | City/region, e.g. `"Pune"`, `"Dubai"`. Optional. |
| `--jobage` | | Posted within N days. |
| `--page` | | 1-indexed page (~15 results/page). |
| `--limit` | `-n` | Cap results emitted. |
| `--format` | | `json` \| `table` \| `plain`. |

## Testing

```bash
bun run typecheck
bun run test
```

`tests/parsing.test.ts` and `tests/cli-flag-validation.test.ts` are network-free.
`tests/search.test.ts` is a live smoke test against real Indeed pages (per
`add-portal.md`'s Step 4 contract) — it makes one search request and one detail
request per run.
