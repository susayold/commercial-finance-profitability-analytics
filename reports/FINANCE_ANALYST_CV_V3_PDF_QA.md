# Finance Analyst CV V3 PDF QA

**Status:** PASS  
**Checks:** 6/6 passed  
**Format:** A4, one page  
**Visual review:** rendered PNG inspected; no clipping, overlap, unreadable glyphs or broken section hierarchy observed.

| Check | Result | Evidence |
|---|---|---|
| PDF exists | PASS | `output/pdf/FINANCE_ANALYST_CV_ONE_PAGE_V3.pdf` |
| One-page constraint | PASS | `pypdf` reports 1 page |
| Text extractable | PASS | 3,393 extracted characters |
| Required sections / evidence | PASS | profile, skills, project, 28-tab model, 2,160 lines, CAGR metrics and QA claim present |
| Dash policy | PASS | no non-ASCII dash glyphs in extracted text |
| Claim boundary | PASS | internal forecast accuracy / price-target caveat visible |

The PDF is a derivative of the Markdown CV V3 template. Bracketed candidate fields remain intentionally unresolved; replace them before sending applications.
