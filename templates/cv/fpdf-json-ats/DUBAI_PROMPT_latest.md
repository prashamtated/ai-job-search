# Dubai + ATS / FAANG Resume Generation Prompt (Latest)

Use this prompt with any job description to generate a tailored **2-page ATS-friendly Dubai-format resume** that also clears FAANG / big-company ATS parsers (Workday, Greenhouse, Lever, Taleo, iCIMS, SmartRecruiters, SuccessFactors, Ashby, and proprietary FAANG portals).

Your goal: produce a resume that (1) parses cleanly in ATS, (2) ranks well on JD keyword/skills matching, (3) passes a 30–60 second recruiter screen with quantified impact, and (4) includes all Dubai/GCC hiring fields employers expect.

---

## INPUT (required)

1. **Target Job Description:** Paste the full JD (or `@jd_file`)
2. **Candidate Source of Truth:** Point to reference folder / past resumes / notes (e.g., `@resume_referenece`)
3. **Target Role Title:** Exact title to align to (e.g., Senior DevOps Engineer, Staff SRE)
4. **Experience Level:** Years of experience and seniority (e.g., 8 YOE, Senior / Staff)
5. **Output Format (default for this repo):** Decoupled JSON page structure → `generate_resume.py`
   - Write `<company_slug>/resume_data.json` matching `templates/RESUME_DATA_SCHEMA.md`
   - Render PDF with layout-only `generate_resume.py` (do **not** hardcode content into the Python file)
   - Optional alternatives only if user explicitly asks: LaTeX `.tex`, or plain-text for Taleo/DOCX
6. **File Type Preference:** Text-selectable PDF via `generate_resume.py` by default

---

## RESUME REQUIREMENTS (DUBAI + ATS)

1. **Format:** Exactly **two pages**, A4, ATS-friendly Dubai-format resume
2. **Layout:** Single-column only — clean sections, no graphics/icons/skill bars/photos/logos
3. **Dubai-specific fields (required in header and/or Additional Information):**
   - Nationality
   - Visa status
   - Availability / notice
   - Marital status
   - Willingness to relocate (UAE / GCC)
   - Willingness to travel across the region
   - Languages, driving license (if relevant)
4. **Header (body, not PDF header/footer):** Full name, title aligned to JD, email, phone, LinkedIn, location (Dubai/UAE as applicable), nationality, visa, availability, relocation statement

---

## ATS SYSTEMS TO OPTIMIZE FOR

Design so the resume parses and ranks across:
- **FAANG / Big Tech:** Proprietary portals + Greenhouse / Lever / Workday patterns
- **Enterprise:** Workday, Oracle Taleo, SAP SuccessFactors, iCIMS
- **Tech / growth:** Greenhouse, Lever, Ashby, SmartRecruiters
- **GCC / Dubai employers:** Same enterprise ATS family; keyword match + Dubai logistics fields for human screeners

Assume parsers extract: name, email, phone, LinkedIn, job titles, employers, dates, education, skills — then keyword-score against the JD.

---

## HARD FORMATTING RULES (NON-NEGOTIABLE)

1. **Single-column layout only** — no sidebars, two-column designs, or multi-column skill grids
2. **No layout tables, text boxes, images, icons, skill bars, charts, or graphics**
3. **No headers/footers for contact info** — contact + Dubai fields in the document body at the top
4. **Standard fonts only:**
   - LaTeX: default Computer Modern (or ATS-safe equivalents)
   - Otherwise: Arial, Calibri, Helvetica, Georgia, or Garamond; body 10–12pt; headings 12–14pt
5. **Margins:** 0.5–1.0 inch (or equivalent A4-safe margins)
6. **Selectable text PDF** (never scanned / image PDF)
7. **Standard section headings only** (exact labels below) — never creative titles like "My Journey" or "What I Bring"
8. **Reverse-chronological work history**
9. **Consistent dates:** `Month Year -- Month Year` (e.g., `Jan 2022 -- Present`)
10. **Plain bullets:** `•` only; **2–5 bullets per role** (3–6 allowed for most recent senior role if needed)
11. **No photos, logos, color blocks, or decorative lines that break parsing**
12. **No hyperlinks that replace visible text** — LinkedIn/GitHub as plain visible text/URLs
13. **Career Impact metrics must be ATS-safe:** use plain key-value lines or short bullets — **not** a visual/layout table that scrambles parsers
14. **No repeated header on page 2** — do not repeat the candidate name, contact details, page number, rule, or other running header/footer chrome; page 2 must continue directly with resume content

---

## MANDATORY SECTION ORDER (DUBAI HYBRID + ATS)

Use this exact order and these exact headings:

1. **Contact Header** (no section title) — includes Dubai logistics fields
2. **Professional Summary**
3. **Technical Skills**
4. **Certifications** (prominent before experience — Dubai preference)
5. **Professional Experience**
6. **Awards & Recognition** (if any)
7. **Career Impact Summary** (plain-text metrics block; ATS-safe)
8. **Education**
9. **Additional Information** (Dubai/GCC fields + languages + relocation/travel)
10. **Optional (only if strong and JD-relevant):** Projects | Publications | Patents | Open Source

Do **not** put Education above Experience for candidates with 5+ years of experience.

---

## CONTENT EXTRACTION RULES

1. **Source:** Use ALL reference files — extract relevant experience points from every role
2. **Point selection:** Select **2 to 5 bullet points** per experience, prioritizing relevance to the target JD
3. **Career progression:** Points must show **progressive growth** over time (foundation → operations → automation → platform → architecture/leadership)
4. **Quantified impact:** Most bullets should carry measurable results (percentages, dollar/AED amounts where applicable, scale numbers, latency, uptime, MTTR, deploy frequency, cost). Max **two metrics per bullet**; where the source has no number, use a scale/scope proof instead of inventing one
5. **Action verbs:** Lead with a strong, **varied** verb — Led, Architected, Designed, Engineered, Built, Migrated, Rebuilt, Owned, Mentored, Automated, Scaled, Reduced, Improved, Shifted, Collapsed, Onboarded, Compressed, Replaced, Consolidated, Took over. Do **not** start consecutive bullets with the same verb. Do **not** overuse Enabled, Delivered, Reduced, or Measured. Treat Spearheaded / Championed / Orchestrated / Streamlined as restricted (max once per resume)
6. **Truthfulness:** Do not invent tools, employers, titles, or metrics not present in candidate source materials
7. **Bullet sentence format:** Google XYZ (see next section) — required for every Professional Experience bullet

---

## GOOGLE XYZ BULLET FORMAT (REQUIRED)

Every Professional Experience bullet must use **Google XYZ** (Laszlo Bock):

> Accomplished **[X]** as measured by **[Y]**, by doing **[Z]**.

| Part | Meaning | Put here | Do not put here |
|------|---------|----------|-----------------|
| **X** | What changed for the business / platform | Qualitative accomplishment | The primary metric (keep numbers out of X) |
| **Y** | Proof | One number, %, currency, scale, SLA, or data source | Restating the same % already used as X; the how |
| **Z** | How | Tools, architecture, process, leadership action | Do not leak Z into X |

**Canonical example (keep this shape):**
- Accelerated enterprise software delivery as measured by a 75% reduction in release cycle time across 50+ environments (two weeks to weekly), by owning CI/CD technical direction and redesigning delivery workflows.

**Format rules:**
1. Order is always **X → Y → Z**. Never Y-first or Z-first.
2. Default connectors: `as measured by` (Y) and `by` (Z).
3. To avoid robotic repetition across a page, rotate connectors **only if X/Y/Z stay in that order**:
   - Y: `as measured by` | `demonstrated by` | `evidenced by` | `validated by` | `verified by` | `confirmed by` | `shown by` | `reflected in` | `tracked via` | `tracked in` | `documented in` | `seen in` | `resulting in`
   - Z: `by` | `through` | `using` | `after` | `via`
4. **Connector balance (anti-repetition cap):** no single Y connector may appear on more than **~25% of bullets**, and never on two consecutive bullets. Use `as measured by` as the anchor on the **first bullet of the most recent role** plus 2–3 others so the format is recognizable without sounding templated. `measured` must not appear on every line.
5. Do not duplicate the metric in X and Y. Wrong: `Cut errors 40%, as measured by a 40% drop in errors`. Right: `Cut production deployment failures as measured by a 40% drop in rollout error rate, by …`.
6. Do not put Z inside X. Wrong: `Sustained 99.9% uptime through AWS migration, shown in 3x scale, by replatforming…`. Right: `Sustained production reliability as measured by 99.9% uptime and 3x scalability, by replatforming 50+ microservices onto AWS with staged cutovers.`
7. One bullet = one XYZ triplet. Do not stack two Y metrics unless they prove the same X.
8. **Never print** `XYZ`, `Google XYZ`, `STAR`, `LPS`, or `ELITE` in `resume_data.json` / PDF / `.tex`.
9. **XYZ is a skeleton, not a chant.** Applying it identically to every line is the single biggest reason resumes read as machine-written. Obey the human-voice rules below while keeping X → Y → Z order.

---

## HUMAN VOICE — MUST NOT READ AS AI-GENERATED (REQUIRED)

The output must read like the candidate wrote it after a long week, not like a model filled a template. Recruiters now screen for these tells; treat each as a defect.

### 1) Banned vocabulary (never use)
`leverage` / `leveraged` / `leveraging`, `utilize` / `utilized`, `seamless` / `seamlessly`, `robust`, `cutting-edge`, `state-of-the-art`, `best-in-class`, `world-class`, `game-changing`, `next-generation`, `holistic`, `synergy`, `pivotal`, `instrumental`, `meticulous`, `delve`, `realm`, `landscape`, `tapestry`, `testament to`, `showcase` / `showcasing`, `underscore` / `underscoring`, `foster` / `fostering`, `empower` / `empowering`, `unlock the power of`, `transformative journey`, `results-driven`, `proven track record`, `passionate about technology`, `dynamic professional`, `team player`, `wear many hats`, `in today's fast-paced world`.

**Restricted (max once per resume, if at all):** `spearheaded`, `orchestrated`, `championed`, `streamlined`, `revolutionized`, `drove`.

**Still allowed** (real engineering terms, not buzzwords): `resource utilization`, `capacity`, `throughput`, `orchestration` when naming container orchestration. The ban targets the padding verbs (`utilized`, `leveraged`), not standard infrastructure nouns.

**Use plain engineering language instead:** built, ran, moved, migrated, rebuilt, fixed, cut, set up, owned, standardized, automated, debugged, tuned, split, consolidated, replaced, rolled out, took over.

### 2) Structural tells
1. **No em dashes or en dashes inside sentences** (`—`, `–`). Use commas, semicolons, or a second sentence. Date ranges use only the template's hyphen format.
2. No `not only … but also`, `it's worth noting`, `by leveraging`, `in order to`, `serves as a`.
3. **Break the uniform rhythm:** bullets must NOT all be the same length. Every role needs a visible mix — at least one short bullet (about one line) alongside two- and three-line bullets. Bullets within ±10 characters of each other across a whole page is a fail.
4. Do not phrase every X the same way. Rotate between outcome-first (`Cut release risk …`), scope-first (`Took over 50+ environments …`), and problem-first (`Replaced a manual release process …`).
5. Limit rule-of-three triads (`designed, developed, and deployed`) to **1–2 per resume**, not one per bullet.
6. Vary sentence length in the Summary: mix one short sentence (8–12 words) with longer ones. Four sentences of identical length reads as generated.
7. Skill category labels should be uneven and practical (`Kubernetes & Containers`, `CI/CD`, `Cloud & FinOps`), not a symmetrical matrix of equal-width labels.

### 3) Metric-credibility tells
1. Use the candidate's **actual** numbers from source material. Never invent precision (`improved efficiency by 37.4%`).
2. Keep uneven, real-looking values (`35%`, `45%`, `99.95%`). A resume where every number is `40% / 50% / 60%` looks synthesized.
3. **Cap Y at two proof metrics.** Three or more stacked numbers in one bullet is a classic generated-bullet signature. Scope figures in X or Z (`10M+ subscribers`, `15+ projects`, `10+ engineers`) don't count toward the cap.
4. Not every bullet needs a percentage. When the source has no number, make Y a **scope proof** instead (`across 50+ environments`, `for 10M+ subscribers`, `across 100+ production servers`).
5. Do not repeat the same headline metric in Summary, bullets, and Career Impact Summary all three times; pick two placements at most.
6. Round numbers the way a person would (`$500K+`, `10x`, `4x`), not as false decimals.

### 4) Specificity is what makes it human
1. Name real tools, platforms, environments, team sizes, regions, and constraints drawn from source material.
2. Prefer the concrete noun: `Jenkins shared library` over `CI/CD solutions`; `OpenShift` over `enterprise container platform`.
3. Keep the candidate's own register. If the reference says `OpenShift` or `Amdocs`, do not paraphrase into vendor-marketing language.
4. Where true and supported, keep one or two slightly unpolished operational details (on-call rotation, legacy constraint, audit deadline, rollback playbook). Perfectly clean achievement lists read as fake.
5. Never describe feelings, ambition, or culture fit ("eager to", "thrives in"). Only facts and outcomes.

### 5) Formatting tells
1. No emoji, icons, or decorative separators beyond the template.
2. Sentence case in bullets. Do Not Title Case Random Words.
3. Bold at most one short phrase per bullet; never bold a whole clause.
4. End bullets with a period; do not add trailing periods to skill or certification lists.

### 6) AI-tell self-audit (run before finalizing)
1. Grep the output for every banned word above; replace each hit with plain language.
2. Count `—` / `–` inside sentences: must be zero.
3. Check bullet lengths per role: at least two distinct length bands, and one noticeably short bullet somewhere.
4. Check no Y connector exceeds ~25% of bullets and no opening verb repeats on consecutive bullets.
5. Count metrics per bullet: none above two.
6. Read the Summary: if it could describe any DevOps engineer, rewrite it with candidate-specific scope, domain, and numbers.
7. Confirm every tool, title, and number traces to the candidate's source material.

---

## RECRUITER & ATS CREDIBILITY (REQUIRED — SAME FIXES AS THE MASTER RESUME)

These rules exist so the PDF survives a 30–60 second senior-recruiter screen, not only keyword ATS. Treat each as a defect if violated.

### 1) Honest titles (IC vs manager)
- `header.title`: JD-aligned **individual-contributor / technical-lead** title (e.g. `Senior DevOps Engineer | Platform Engineering | SRE`). Do **not** use Leader, Head of, Director, or VP unless the source materials show people-manager scope (named team size / direct reports).
- `experience[].title`: **official employer title only** (e.g. `Software Technical Expert`, `DevOps Specialist`). Do not append `| Platform Engineering Lead` or similar inflation.
- Mentoring ≠ managing. If the candidate mentored engineers but had no reports, say technical lead / IC in the summary. Never invent headcount.
- Manager / Head-of JDs: do not retitle the person into that job unless source materials support it. Tailor bullets; keep official titles.

### 2) One scoreboard, not four
- The same headline numbers (e.g. 75% faster releases, 99.9% uptime, $500K, $1M) must **not** appear in all of: Summary, `key_metrics` banner, experience bullets, and Career Impact.
- **Default:** set `key_metrics` to `[]` so `generate_resume.py` skips the banner (empty banner is not rendered).
- Summary: **at most three** headline metrics.
- Career Impact: the remaining scoreboard (4 rows max). Do not restate every summary number in every row.
- Revenue / deal numbers (e.g. $1M client win): put in **Awards** with ownership split (architecture vs commercial close). Do **not** write “won new business” in an IC bullet unless the candidate closed the deal.

### 3) Skills you can defend
- Skills section = tools that appear in **experience bullets** or that the candidate can speak to from source materials.
- Do **not** add JD-only tools (Spark, Harbor, ServiceNow, Pulumi, Spinnaker, Datadog, GCP, etc.) unless they are in the source of truth.
- Prefer fewer, concrete lists (`Jenkins, ArgoCD`) over marketing nouns (`enterprise CI/CD solutions`).
- If a JD requires a tool not in source: omit it and note it as Missing in the ATS checklist. Do not invent.

### 4) Employer and ATS parse hygiene
- One employer brand across consecutive roles at the same company (e.g. all Amdocs roles = `Amdocs`). Put India vs Cyprus in `location`, not in the company string (`Amdocs Ltd` vs `Amdocs India` can parse as two employers).
- Two phones: put the **reachable-for-this-market** number first (UAE/Cyprus as applicable).
- Dates LinkedIn-consistent. No parentheticals on the company line (revenue, headcount, Fortune, named clients).

### 5) Page-1 recruiter screen
- Page 1 must include: header logistics, summary, skills, certs, **full current role**, and **at least one prior-role bullet** with a wow metric (OpenShift platform, AWS migration, uptime, etc.). Recruiters often never scroll.
- Compress skills (about 5–6 short rows) rather than pushing experience onto page 2.
- Certifications: strongest first (CKA, CKAD). Junior certs (e.g. AWS Cloud Practitioner) go last on the cert line; **do not** put them in the summary as if they were Solutions Architect.

### 6) Claim ownership (interview-safe)
- Cost savings the candidate ran (FinOps, right-sizing) may stay in a bullet.
- Client revenue / awards: name what the candidate owned (platform, GitOps, architecture) vs what sales/account owned.
- Scale claims need a noun: `50+ environments`, `50+ microservices`, `10M+ subscribers`, not a percentage alone.

### 7) Dubai / GCC logistics (this prompt)
- Header must make UAE intent obvious: current city, nationality, visa / sponsorship, availability, relocate to Dubai/UAE, regional travel.
- Additional Information repeats visa, marital status (if used), relocate, travel, languages so GCC screeners can grep them.
- Do not hide visa-sponsorship need. Do not imply UAE residency unless it is true.

---

## FRAMEWORK ALIGNMENT (DO NOT name frameworks in the resume)

1. **Google XYZ (bullet syntax):** X = accomplishment, Y = measurement, Z = method — this is the **sentence format** of every experience bullet
2. **STAR (Situation-Task-Action-Result):** Implicit content inside XYZ (situation in X, action in Z, result in Y)
3. **LPS (Led-Problem-Solution):** Leadership bullets show ownership, the business problem, and the strategic solution delivered
4. **ELITE (Experience-Leadership-Impact-Technical-Evolution):** Overall resume shows breadth, leadership growth, quantified impact, technical depth, and clear career evolution
5. **No framework labels:** Framework names (Google XYZ, STAR, LPS, ELITE) must **never** appear in the resume text / `.tex` / PDF content

---

## SECTION CONTENT RULES

### 1) Contact Header
Include (compact, 2–4 lines):
- Full Name
- Target-aligned **IC / technical-lead** title (see Recruiter & ATS Credibility). Not Leader/Director unless source shows reports.
- City, Country (if abroad targeting UAE: current city + relocate intent)
- Phone | Email | LinkedIn | GitHub (if technical). Reachable number first
- Nationality | Visa status | Availability
- Relocation / regional travel readiness (short phrase)

### 2) Professional Summary (3–5 lines)
Must include:
- Years of experience + **honest** role identity (senior engineer / platform lead / SRE — not director)
- Domain / scale context (Amdocs telecom, environments, microservices)
- Top JD-matching technologies that also appear in bullets
- **At most three** quantified achievements (do not dump the full scoreboard)
- Strong certs only (CKA, CKAD). Do not lead with Cloud Practitioner.
- IC vs manager: one short clause if promotions could be misread as people leadership
- International / GCC signal (relocating, visa, EU delivery) without repeating every logistics field

No objective statements. No generic fluff. No first-person pronouns.

### 3) Technical Skills
- Grouped by category using plain comma- or pipe-separated lists (~5–6 rows, uneven practical labels)
- Example categories: Cloud | Kubernetes | CI/CD | IaC & Code | SRE & Security | Data & Network
- Mirror **exact JD wording** only for tools the candidate actually has
- Put highest-priority required JD skills first
- Include consulting/delivery skills when the JD requires them **and** they are true
- Skills list must be defendable in a screen; omit source-of-truth gaps rather than stuffing the JD

### 4) Certifications
- Full official names + issuer + year (if known)
- Order: strongest / JD-named first (CKA, CKAD), junior certs last
- Keep as a clean list (no icons)
- Do not repeat junior certs in the summary

### 5) Professional Experience
For each role:
```
Job Title
Company Name — City, Country
Month Year -- Month Year
• Bullet
• Bullet
```
Company-line rules:
- One brand per employer (e.g. `Amdocs` for Cyprus **and** Pune). Distinguish sites in the location field only
- Do **not** append parentheticals for company size, industry, revenue, employee count, Fortune ranking, or named clients
- Put scale, industry, or client impact in bullets / summary / awards if relevant — not in the company field
- Job title = official title only (no `| Lead` suffix unless that was the HR title)

Bullet rules:
- 2–5 bullets per role; prioritize JD relevance
- **Google XYZ required:** Accomplished [X] as measured by [Y], by doing [Z]
- Optional bold mini-lead-in within the bullet for scanability (keep single-column; do not create a second column)
- Implicit STAR lives inside XYZ (context in X, method in Z, quantified result in Y)
- Weave JD keywords naturally (no stuffing)
- Prefer impact over responsibilities
- Show increasing scope/ownership over career
- Avoid vague lines ("Worked on backend systems", "Responsible for CI/CD")
- Vary opening verbs; do not repeat Enabled / Delivered / Reduced / Measured across consecutive bullets
- Do not claim “won new business” / closed revenue unless the candidate owned the commercial motion; put deal context in Awards with ownership split

### 6) Awards & Recognition
- Named awards with business impact (only if real and relevant)
- If an award cites client revenue, state architecture vs account/sales ownership in one clause

### 7) Career Impact Summary (ATS-safe)
- Compact plain-text metrics block (key: value lines or short bullets); **4 rows max**
- This is the **only** full scoreboard. Do not also use a `key_metrics` banner unless the user explicitly wants it
- Examples: Deployment frequency, incident reduction, cost savings, uptime/SLO, platform scale
- **Do not use layout tables** that break Workday/Taleo/iCIMS parsing
- Skip metrics already used as the three summary headlines when possible
- **Traceability required:** every Career Impact row must trace to an experience bullet or a source-of-truth number. Do not put scoreboard-only metrics that no bullet supports — a sharp screen will ask which role delivered the number.

### 8) Education
- Degree, Major, University, Year
- GPA/honors only if strong and useful

### 9) Additional Information (Dubai / GCC)
Include:
- International experience
- Languages
- Marital status
- Driving license (if relevant)
- Nationality / visa (if not fully covered in header)
- Relocation readiness (UAE/GCC)
- Regional travel readiness
- Work authorization clarity for UAE employment
- **Portfolio context (if a portfolio URL sits in the header):** add a one-line entry naming what's there (e.g., `Portfolio: Kubernetes and Terraform samples at https://prasham.com.`). A bare URL with no context is dead decoration on a 30-second scan.

---

## KEYWORD & ATS RANKING STRATEGY

1. Extract required vs preferred skills from the JD
2. Place required keywords in:
   - Professional Summary
   - Technical Skills
   - Professional Experience bullets (contextual usage)
3. Prefer exact phrase matches from the JD (critical for Taleo / strict keyword ATS)
4. For Greenhouse/Lever-style systems, include contextual usage in bullets — not skills-only lists
5. Include acronym + expanded form once when useful (CI/CD, Infrastructure as Code / IaC)
6. Align **header** title to the JD's IC/senior title; keep **experience** titles as official employer titles (LinkedIn-consistent)
7. Keep titles/dates LinkedIn-consistent and explainable. Do not invent Director/Lead-of unless that was the job.

---

## FAANG / BIG-COMPANY CONTENT BAR (APPLY TO BULLETS)

Optimize for signals big-tech and top Dubai employers scan for:
- Scale (users, QPS, services, clusters, regions, data volume)
- Reliability (SLO/SLA, uptime, MTTR, incident reduction)
- Performance (latency, throughput, cost efficiency)
- Delivery speed (deploy frequency, lead time, change failure rate)
- Ownership (end-to-end, on-call, roadmap, cross-functional)
- Technical depth (distributed systems, cloud architecture, automation, security)
- Leadership (mentoring, tech strategy, stakeholder alignment) for senior+ roles

Company-culture keyword awareness (use only if true and JD-aligned):
- Amazon-style: ownership, customer obsession, operational excellence, bias for action
- Google-style: scalability, technical excellence, impact, complexity
- Meta-style: impact metrics, cross-functional alignment
- Microsoft-style: collaboration, customer outcomes, cloud platform depth
Do **not** fake leadership principles verbatim; demonstrate them through results.

---

## WHAT TO NEVER INCLUDE

- Multi-column layouts, sidebars, icons, photos, logos, skill bars
- Layout tables / text boxes / graphics that break ATS parsing
- Creative section names
- References / "References available upon request"
- Salary / CTC unless explicitly required by JD or user
- First-person pronouns (I / my)
- Keyword stuffing without evidence
- Fake metrics, tools, or experience
- Inflated titles (Leader / Director / Head of) without reports in source materials
- The same headline metrics in Summary + banner + bullets + Career Impact
- JD-only skills not in the candidate source of truth
- “Won new business” / closed $ revenue on an IC bullet without commercial ownership
- Junior certs (Cloud Practitioner) in the Professional Summary
- Two employer strings for the same company (`Amdocs Ltd` vs `Amdocs India`)
- Framework names (Google XYZ, STAR, LPS, ELITE) in resume output
- AI-tell buzzwords (leverage, utilize, seamless, robust, cutting-edge, holistic, showcase, foster, empower, results-driven, proven track record) — see Human Voice section
- Em dashes / en dashes inside sentences, identical-length bullets, or 3+ stacked metrics in one bullet
- More than 2 pages (or less than 2 — target exactly 2 for Dubai format)

---

## OUTPUT PIPELINE (DEFAULT — DECOUPLED STRUCTURE)

**Do not put JD content inside `generate_resume.py`.** That file is layout-only.

1. Create/update company folder: `<company_slug>/` (e.g., `virtusa/`)
2. Write JD-tailored content to `<company_slug>/resume_data.json` using the schema in `templates/RESUME_DATA_SCHEMA.md`. Start from `templates/default_dubai.json` **then apply Recruiter & ATS Credibility** (honest titles, empty `key_metrics` by default, defendable skills, one Amdocs brand). If `master_resume_india.json` exists, copy its experience/skills/certs/impact honesty, then swap in Dubai logistics.
3. Set `key_metrics` to `[]` unless the user explicitly wants the banner. Empty list = no banner in `generate_resume.py`.
3. Render PDF into that folder:
   ```bash
   source .venv/bin/activate
   python generate_resume.py --data <company_slug>/resume_data.json
   ```
4. If the generator exits with a **>2 pages** error, shorten summary / skills / bullets in the JSON and re-run until exactly 2 pages
5. Keep the JD file in the same folder (e.g., `virtusa/jd_devops`) for traceability

### `resume_data.json` must include
`meta`, `header`, `location`, `summary`, `key_metrics` (usually `[]`), `skills`, `certifications`, `experience`, `awards` (optional), `impact`, `education`, `additional` — section order matches this prompt (Awards before Career Impact).

## OUTPUT REQUIREMENTS

Produce:
1. **`<company_slug>/resume_data.json`** (page structure / content) + **PDF** via `generate_resume.py` in that folder
2. **ATS Checklist** (pass/fail):
   - Single column
   - Standard headings
   - Contact + Dubai fields in body (not header/footer)
   - No repeated header or footer on page 2
   - No layout tables/images/icons
   - Date consistency
   - JD required-keyword coverage list (Present / Missing)
3. **Dubai Fields Checklist:** nationality, visa, availability, marital status, relocate, regional travel, languages
4. **Tailoring Notes:** 5–8 bullets on what was emphasized for this JD
5. **Recruiter Scan Test:** 3 strongest impact lines a recruiter should notice in 30 seconds (must be on page 1)

---

## QUALITY GATE (MUST PASS BEFORE FINALIZING)

- [ ] Exactly **two pages** (Dubai format) — adjust spacing to fit, not more, not less
- [ ] Single-column reverse-chronological hybrid with standard headings
- [ ] Dubai fields present (nationality, visa, availability, marital status, relocate, travel)
- [ ] All major JD required keywords appear at least once (naturally)
- [ ] Every recent-role bullet has impact/metric where data exists
- [ ] Every experience bullet is Google XYZ (X → Y → Z); metric not duplicated in X and Y; Z not leaked into X
- [ ] Opening verbs and Y/Z connectors are varied — no connector on more than ~25% of bullets, none repeated back-to-back, `measured` not on every line
- [ ] **Human-voice audit passed:** zero banned buzzwords, zero em/en dashes inside sentences, bullet lengths visibly mixed (at least one short bullet), max 2 metrics per bullet, no feelings/culture-fit language
- [ ] Reads as candidate-specific: concrete tools, environments, and scope that could not describe a generic engineer
- [ ] **Recruiter credibility:** header is IC/senior not Leader/Director; experience titles are official; one employer brand; `key_metrics` is `[]` unless requested
- [ ] Summary has ≤3 headline metrics; Career Impact is the only full scoreboard; $ revenue only in Awards with ownership split
- [ ] Skills are defendable (in bullets or source); no JD-invented tools; CKA/CKAD before junior certs; Cloud Practitioner not in summary
- [ ] Page 1 includes full current role plus at least one prior-role wow bullet
- [ ] UAE intent is obvious (nationality, visa/sponsorship, relocate, availability)
- [ ] Career progression visible from earliest role → current role
- [ ] Certifications listed before Professional Experience
- [ ] Career Impact Summary is plain-text (not a layout table)
- [ ] Every Career Impact metric traces to an experience bullet or source-of-truth number; no scoreboard-only claims
- [ ] If a portfolio URL is in the header, Additional Information carries a one-line context for it
- [ ] No creative headings, graphics, or header/footer contact
- [ ] Page 2 starts directly with resume content — no repeated name, contact line, page number, rule, header, or footer
- [ ] No framework names (Google XYZ, STAR, LPS, ELITE) anywhere in output
- [ ] Summary + Skills front-load the highest-weight keywords
- [ ] Content is truthful to candidate source materials
