# Template: fpdf-json-ats

- **Type:** CV
- **Source extension:** .json
- **Engine/toolchain:** Python (fpdf2), via an external generator script — not LaTeX/Typst
- **Page limit:** 2 page(s) — hard-enforced by the script itself (exits with an error if the render exceeds 2 pages, rather than silently truncating)
- **Fonts:** Helvetica (built-in PDF core font, no bundling/installation needed)
- **Class/packages:** external — `generate_resume.py` lives in a separate repo (`/Users/prashamt/Resume`), run from its own `.venv` (fpdf2, jinja2, pyyaml). It is referenced by absolute path, not copied into this repo — see Known pitfalls.

## Two starter variants, not one skeleton

This template departs from the usual "one `template<ext>` skeleton" shape because the source mechanism has two location-specific starting points, both kept here as reference:

- **`template_dubai.json`** — starting content for UAE/GCC-targeted roles (`meta.location_key: "dubai"`). Drafting instructions: `DUBAI_PROMPT_latest.md`.
- **`template_india.json`** — starting content for India-targeted roles (`meta.location_key: "india"`). Drafting instructions: `INDIA_PROMPT_latest.md`.
- **`RESUME_DATA_SCHEMA.md`** — the authoritative JSON schema (required keys, section order, per-role bullet rules).

`/apply` picks the variant matching the target role's location (per CLAUDE.md's Target Sectors: Cyprus, India, UAE — Cyprus roles fall back to the Dubai/GCC variant's schema shape, since there is no Cyprus-specific starter) and copies/adapts the matching `template_<location>.json` into `cv/main_<company>_<role>.json`, following that location's prompt file for tailoring guidance.

## Compile command

    cd /Users/prashamt/Resume && source .venv/bin/activate && python generate_resume.py --data <file>.json --output <file>.pdf

`<file>` is the output basename **as an absolute path** (e.g. `/Users/prashamt/ai-job-search/cv/main_<company>_<role>`), not a path relative to the CV output folder. This is mandatory, not stylistic: `generate_resume.py` resolves any relative `--data`/`--output` path against *its own* repo root (`/Users/prashamt/Resume`), not the caller's CWD or the JSON file's own folder — a relative path here would silently write the PDF into the wrong repo. `--output` implies the matching `--data` path (swap `.pdf` for `.json`).

## Style rules

- Content lives entirely in the JSON (`resume_data.json` equivalent); `generate_resume.py` owns layout only (fonts, colors — teal/slate — section chrome, spacing). Do not try to restyle by editing the script.
- Section order is fixed by the script and must not be reordered in the JSON: Contact Header → Professional Summary + key metrics banner → Technical Skills → Certifications → Professional Experience → Awards & Recognition (if present) → Career Impact Summary → Education → Additional Information → Projects (only if non-empty).
- Follow `RESUME_DATA_SCHEMA.md` exactly for required keys and shapes (e.g. `linkedin`/`github`/`portfolio` as `[display_text, url]` pairs, `experience[].bullets` 2-5 per role / 3-6 for the latest senior role).
- Tailor `summary`, `key_metrics`, `skills[].text`, and `experience[].bullets` to the target JD, same as the stock moderncv workflow — this template does not reduce the tailoring work, only the rendering mechanics.
- Set `meta.company_slug`, `meta.company`, `meta.position`, `meta.location_key`, `meta.output_dir`, `meta.output_filename` per application (see schema `meta` block).

## Known pitfalls

- **Always use absolute paths** for `--data` and `--output` (see Compile command above) — relative paths resolve against `/Users/prashamt/Resume`, not this repo, and will write files into the wrong place without erroring.
- **The generator script is external, not vendored.** It is not copied into this repo; it must still exist at `/Users/prashamt/Resume/generate_resume.py` with its `.venv` intact for `/apply` to compile. If that repo/path ever moves, this template's compile command breaks and needs updating.
- **The two `template_<location>.json` files' own content does not fully match CLAUDE.md's canonical profile** (e.g. they say "14+ years" / CLAUDE.md's dated experience entries total ~11 years at Amdocs; they list "Marathi (native)" and "Married" which are not in CLAUDE.md; some figures like "$150K annual savings" differ from CLAUDE.md's "$500K/year" cost-optimization claim; they mention GCP/Datadog/Pulumi/Spinnaker which are not in CLAUDE.md's skills list). Treat these two files as **starting structure/tone only** — every fact drafted into a real application's JSON must be checked against CLAUDE.md per the repo's Verification Checklist, exactly as for the stock moderncv template.
- The script hard-fails (nonzero exit, "ERROR: Resume is N pages") instead of overflowing onto a 3rd page — treat that exit as "cut content and recompile," not as a broken compile command.
- No cover letter mechanism is bundled here — this covers CVs only. Cover letters still use the stock `cover.cls` template (or another registered cover-letter template) unless a matching cover-letter generator is registered separately.
