#!/usr/bin/env bun
// Self-contained CLI for searching jobs on Indeed's public pages, scoped to the
// country subdomains this fork was built and verified against: India (in) and
// UAE (ae). No external CLI framework, so it runs anywhere `bun` is available
// with zero install beyond the repo clone.
//
// robots.txt for indeed.com explicitly ALLOWS the "Claude-User" agent on /jobs
// and /viewjob (verified 2026-09-12; see url-reference.md). Still, keep volume
// low and personal - this reads public pages, not an official API.

import { runSearch, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit", c: "country" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `indeed-cli — search jobs on Indeed (India and UAE, tested; other country subdomains may work)

USAGE
  bun run src/cli.ts search --country <cc> [flags]
  bun run src/cli.ts detail <id|url> --country <cc> [--format json|plain]

SEARCH FLAGS
  --country, -c <cc>      Indeed country subdomain. REQUIRED. "in" (India) or "ae" (UAE)
                          are tested by this fork; other 2-letter Indeed country codes
                          (e.g. "uk", "de") are untested but follow the same pattern.
  --query, -q <text>      Keywords (job title, skill, or role). Recommended.
  --location, -l <text>   City/region to search, e.g. "Pune", "Dubai". Optional.
  --jobage <days>         Posted within N days, e.g. 1, 3, 7, 14. Omit for all postings.
  --page <n>              1-indexed page (~15 results/page). Default 1.
  --limit, -n <n>         Cap results emitted (client-side).
  --format <fmt>          json (default) | table | plain.

EXAMPLES
  bun run src/cli.ts search -c in -q "devops engineer" -l "Pune" --jobage 14 --format table
  bun run src/cli.ts search -c ae -q "site reliability engineer" -l "Dubai" --format table
  bun run src/cli.ts detail 94d2771a7ab59509 -c in --format plain

Reads Indeed's public job pages; robots.txt allows this agent on /jobs and /viewjob
(verified 2026-09-12) but keep volume low and personal.
`

const KNOWN_FLAGS: Record<string, Set<string>> = {
  search: new Set(["country", "query", "location", "jobage", "page", "limit", "format", "help", "h"]),
  detail: new Set(["country", "format", "help", "h"]),
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  const knownFlags = KNOWN_FLAGS[cmd]
  if (knownFlags) {
    for (const key of Object.keys(flags)) {
      if (key === "_" || knownFlags.has(key)) continue
      process.stderr.write(
        JSON.stringify({
          error: `unknown flag --${key} for '${cmd}' - flags are never silently ignored, because a discarded filter changes what the search returns; see --help for the supported flags`,
          code: "UNKNOWN_FLAG",
        }) + "\n",
      )
      return 1
    }
  }

  const country = typeof flags.country === "string" ? flags.country.toLowerCase() : undefined
  if (!country) {
    process.stderr.write(
      JSON.stringify({
        error: 'the --country/-c flag is required (e.g. -c in for India, -c ae for UAE)',
        code: "NO_COUNTRY",
      }) + "\n",
    )
    return 1
  }
  if (!/^[a-z]{2}$/.test(country)) {
    process.stderr.write(
      JSON.stringify({
        error: `--country must be a 2-letter Indeed country code, got "${country}"`,
        code: "BAD_COUNTRY",
      }) + "\n",
    )
    return 1
  }

  if (cmd === "search") {
    const fmt = (flags.format as string) || "json"

    const parseIntFlag = (name: string, raw: string | boolean | string[]): number | null => {
      const val = typeof raw === "string" ? Number(raw.trim()) : NaN
      if (!Number.isInteger(val) || val < 1) {
        process.stderr.write(
          JSON.stringify({ error: `--${name} must be a whole number of at least 1, got "${raw}"`, code: "BAD_ARG" }) + "\n",
        )
        return null
      }
      return val
    }

    let jobage: number | undefined
    if (flags.jobage !== undefined) {
      const v = parseIntFlag("jobage", flags.jobage)
      if (v === null) return 1
      jobage = v
    }
    let page = 1
    if (flags.page !== undefined) {
      const v = parseIntFlag("page", flags.page)
      if (v === null) return 1
      page = v
    }
    let limit: number | undefined
    if (flags.limit !== undefined) {
      const v = parseIntFlag("limit", flags.limit)
      if (v === null) return 1
      limit = v
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      country,
      jobage,
      page,
      limit,
      format: (["json", "table", "plain"].includes(fmt) ? fmt : "json") as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: "detail requires an <id|url>", code: "NO_ID" }) + "\n")
      return 1
    }
    const fmt = (flags.format as string) || "json"
    const opts: DetailOpts = {
      id,
      country,
      format: (fmt === "plain" ? "plain" : "json") as DetailOpts["format"],
    }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "INTERNAL_ERROR" }) + "\n",
    )
    process.exit(1)
  })
