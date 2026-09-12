# Search Queries for Job Scraper

<!-- SETUP: Customize these queries based on your skills, target roles, and location -->

## Installed portal CLIs (primary for `/scrape`)

`/scrape` discovers every portal skill under `.agents/skills/*/SKILL.md` and runs its CLI first. Installed CLIs: `linkedin-search` (global), `freehire-search` (global aggregator), and `indeed-search` (India + UAE, via `in.indeed.com`/`ae.indeed.com` — its `robots.txt` explicitly allows the `Claude-User` agent, verified 2026-09-12). Any skill you add with `/add-portal` is included the same way. You do **not** need a matching `site:` line below for those CLIs to run.

**Naukri.com investigated and not installed:** its `robots.txt` explicitly disallows `Claude-User` from all job-search paths, and its pages are client-rendered with no job data in a plain fetch (would require reverse-engineering an unverified API). Use the `site:naukri.com` WebSearch fallback below instead. Bayt.com and GulfTalent were also investigated and are behind bot-detection (Cloudflare/Akamai) that blocks even a `robots.txt` fetch from this environment.

The `site:` query templates in this file are the **WebSearch fallback** — for portals without a CLI, company career pages, or when a CLI fails.

**Language scope:** write every query category in every language listed in your CLAUDE.md Languages table (typically 1-2, sometimes more). A posting requiring a language you have *not* declared, as a job condition, is excluded before scoring; a posting requiring a *higher level* than you declared in a language you *do* work in is flagged for your own judgment, not excluded — see `04-job-evaluation.md`'s Language Gate, the single source of truth for this rule. Translate each category's keywords rather than machine-translating word-for-word (e.g. "Frontend Developer" -> "Desarrollador Frontend", not a literal word-for-word translation) if you work in more than one language.

## Search Sites

Primary:
- **linkedin.com/jobs** - LinkedIn job listings (filter: Cyprus / India / UAE); also covered by `linkedin-search` CLI
- **Indeed (India / UAE)** - `in.indeed.com` / `ae.indeed.com`; covered by `indeed-search` CLI (`--country in` or `--country ae`)
- **freehire.me** - tech-focused job aggregator, ~50 ATS platforms across many countries; covered by `freehire-search` CLI

Not covered by a CLI (use the `site:` WebSearch fallback below):
- **naukri.com** - India's largest portal; explicitly disallows automated access by this agent in its `robots.txt`
- **bayt.com**, **gulftalent.com** - UAE/Gulf boards behind bot-detection that blocks automated fetches entirely

Secondary (company career pages via Google):
- Direct Google searches with `site:` filters for known target companies

## Query Categories

Queries are grouped by priority. Write **each category in every language from your Languages table** (see Language scope above). Combine each query with your location terms (e.g. your city, region, or metro area) where the site supports it.

**Organize by function, not job title.** The same underlying work carries different titles across companies and markets (a "Data Scientist" role at one employer may be posted as "Insights Analyst" or "Data Consultant" at another). Name each priority category after the function it covers, and list several plausible job titles as query variants within that category rather than betting an entire priority tier on one exact title string.

### Priority 1: DevOps / Platform Engineering (senior/lead)

These match your strongest and most desired career direction.

```
site:linkedin.com/jobs "DevOps Architect" (Cyprus OR Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "Platform Engineer" Kubernetes (Cyprus OR Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "Senior DevOps Engineer" GitOps (Cyprus OR Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "DevOps Lead" Kubernetes (Cyprus OR Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:naukri.com "DevOps Architect" (Pune OR Hyderabad)
site:naukri.com "Platform Engineer" Kubernetes (Pune OR Hyderabad)
```

### Priority 2: Cloud/DevOps Architecture and SRE

These match your domain expertise.

```
site:linkedin.com/jobs "Cloud Architect" AWS (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "Site Reliability Engineer" Kubernetes (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "SRE" GitOps ArgoCD (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:naukri.com "Cloud Architect" AWS (Pune OR Hyderabad)
site:bayt.com "Site Reliability Engineer" OR "Cloud Architect" (Dubai OR "Abu Dhabi")
```

### Priority 3: Engineering Manager / Team Lead (DevOps)

Adjacent roles you could pivot into, leveraging your mentoring and process-improvement track record.

```
site:linkedin.com/jobs "DevOps Manager" OR "Engineering Manager DevOps" (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "Team Lead" DevOps Kubernetes (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
```

### Priority 4: Broader Technical / Consulting

Wider net for general technical roles.

```
site:linkedin.com/jobs "Cloud Consultant" AWS (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "Infrastructure Engineer" Terraform (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
site:linkedin.com/jobs "Technical Consultant" DevOps (Dubai OR "Abu Dhabi" OR Pune OR Hyderabad)
```

## Location Filter

Open to relocation - not filtering by commute distance from a single home base. Define acceptable areas:
- **Ideal:** Limassol, Cyprus (current base); Dubai, UAE; Abu Dhabi, UAE; Pune, India; Hyderabad, India
- **Acceptable:** Other UAE emirates (Sharjah, Ajman); other major India tech hubs (Bangalore, Mumbai, Gurgaon)
- **Borderline:** Other Gulf hubs (Doha, Riyadh) - flag for discussion, not auto-included
- **Too far:** Locations outside Cyprus/India/UAE/wider Gulf, unless fully remote

## Language Filter

Your working languages and levels are in CLAUDE.md's Languages table. When filtering scraped results, apply `04-job-evaluation.md`'s Language Gate: a posting requiring a language you haven't declared at all is excluded; a posting requiring a higher level than you declared in a language you do work in is not excluded, flag it clearly instead (see `job-scraper/SKILL.md`'s Step 3 "Quick Fit Assessment" for how the flag surfaces in `/scrape` output). Postings simply *written* in a language you don't work in, that don't require it on the job, are fine.

## Date Filter

Only include jobs posted within the last 14 days, or with an application deadline that has not yet passed. If a posting date cannot be determined, include it but flag as "date unknown".

## Adapting Queries

If the user specifies a focus area, select queries from the matching category and also generate 2-3 custom queries for that focus. For example:
- "/scrape [focus_area]" -> relevant category queries + custom focus-specific queries
