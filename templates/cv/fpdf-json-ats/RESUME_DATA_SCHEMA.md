# Resume Data Schema (Page Structure)

This is the **decoupled page structure** extracted from `generate_resume.py`.

**Flow**
1. Agent / human writes `<company>/resume_data.json` matching this schema (JD-tailored content).
2. Run: `source .venv/bin/activate && python generate_resume.py --data <company>/resume_data.json`
3. PDF is written into the same company folder (or `meta.output_dir`).

`generate_resume.py` owns **layout only** (fonts, colors, section chrome, 2-page limit).  
`resume_data.json` owns **all content**.

**Starter templates**
- Dubai / GCC: `templates/default_dubai.json` (`meta.location_key`: `"dubai"`) — used by `DUBAI_PROMPT_latest.md`
- India: `templates/default_india.json` (`meta.location_key`: `"india"`) — used by `INDIA_PROMPT_latest.md`

---

## Top-level keys

| Key | Required | Type | Notes |
|-----|----------|------|-------|
| `meta` | yes | object | Company folder, filename, location key |
| `header` | yes | object | Name, title, contact links |
| `location` | yes | object | Dubai/India logistics fields |
| `summary` | yes | string | Professional summary (4–5 sentences) |
| `key_metrics` | yes | string[] | Short banner metrics (4–6 items) |
| `skills` | yes | object[] | `{ "label", "text" }` |
| `certifications` | yes | string | Single line or pipe-separated |
| `experience` | yes | object[] | Roles, reverse-chronological |
| `awards` | no | object[] | `{ "title", "description" }` |
| `impact` | yes | object[] | `{ "area", "outcome" }` Career Impact Summary |
| `education` | yes | string | Degree line |
| `additional` | yes | object[] | `{ "label", "text" }` Dubai/GCC fields |
| `projects` | no | object[] | `{ "name", "description" }` — omit if unused |

---

## `meta`

```json
{
  "company_slug": "virtusa",
  "company": "Virtusa",
  "position": "DevOps Engineer",
  "location_key": "dubai",
  "output_dir": "virtusa",
  "output_filename": "Prasham_Tated_Virtusa_DevOps_Engineer_Dubai.pdf"
}
```

- `location_key`: `dubai` | `india` (affects PDF metadata / defaults only; content comes from `location` + `additional`)
- `output_dir`: relative to repo root; defaults to folder containing the JSON file
- `output_filename`: optional; default `{Name}_{Company}_{Position}_{Location}.pdf`

---

## `header`

```json
{
  "name": "PRASHAM TATED",
  "title": "DevOps Engineer | AWS | Kubernetes & Terraform",
  "email": "prashamtated@gmail.com",
  "linkedin": ["linkedin.com/in/prashamtated", "https://www.linkedin.com/in/prashamtated"],
  "github": ["github.com/prashamtated", "https://github.com/prashamtated"],
  "portfolio": ["prasham.com", "https://prasham.com"]
}
```

Link fields are `[display_text, url]` pairs.

---

## `location`

```json
{
  "phone": "+357 95910171",
  "current_location": "Limassol, Cyprus",
  "target_location": "Dubai / Abu Dhabi, UAE",
  "relocation_line": "Available for Immediate UAE Relocation",
  "availability": "Immediate | Open to travel across GCC",
  "authorization": "Indian National | UAE Visa Sponsorship Required",
  "work_mode": "Onsite or Hybrid | Dubai & Abu Dhabi",
  "global_exposure": "7+ years based in Cyprus (EU) with Fortune 500 delivery"
}
```

---

## `experience[]`

```json
{
  "title": "DevOps Expert | Software Technical Expert",
  "dates": "Jun 2024 - Present",
  "company": "Amdocs Ltd",
  "location": "Limassol, Cyprus",
  "bullets": [
    "Impact-first bullet with JD keywords and metrics...",
    "..."
  ]
}
```

Rules: 2–5 bullets per role (3–6 OK for latest senior role). Dates: `Mon YYYY - Mon YYYY` or `Present`.

---

## Section order rendered by `generate_resume.py`

1. Contact Header (from `header` + `location`)
2. Professional Summary + key metrics banner
3. Technical Skills
4. Certifications
5. Professional Experience
6. Awards & Recognition (if present)
7. Career Impact Summary
8. Education
9. Additional Information
10. Projects (only if `projects` non-empty)

This matches `DUBAI_PROMPT_latest.md` mandatory order.

---

## Agent contract (Dubai / India prompts)

When given `@DUBAI_PROMPT_latest.md` or `@INDIA_PROMPT_latest.md` + `@company/jd_*` + `@Resume`:

1. Write `<company_slug>/resume_data.json` using this schema (truthful to reference materials, JD-tailored).
   - Dubai: start from `templates/default_dubai.json`; set GCC/visa/relocation fields.
   - India: start from `templates/default_india.json`; set notice period, preferred India locations, work authorization, work mode (`meta.location_key`: `"india"`).
2. Run:
   ```bash
   source .venv/bin/activate
   python generate_resume.py --data <company_slug>/resume_data.json
   ```
3. Confirm PDF is exactly **2 pages** and lives under `<company_slug>/`.
4. Reply with ATS / location-field checklists + tailoring notes (do **not** emit a full `.tex` unless asked).
