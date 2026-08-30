# MCH Statement Supplement QA — 2026-08-30

## Scope

Remote QA for `data/mch_statement_metrics_2024_2025_approved.csv`, the page-reviewed MCH supplement.

## Checks

| Check | Result |
|---|---:|
| Data rows | PASS — 80 |
| Grain | PASS — MCH × FY × metric |
| Fiscal years | PASS — FY2016–FY2025 |
| Metrics per year | PASS — 8 |
| Duplicate keys | PASS — 0 |
| Numeric reported values | PASS |
| Review status | PASS — all `approved` |
| Source-page anchors | PASS — pages 6/7/8/10 |
| FY2017 provenance gate | PASS — `audited_comparative` + `corresponding_column` |
| Local workspace persistence | PASS — no project files retained locally |

## Evidence controls

- FY2016 and FY2018–FY2025 were visually checked against the official audited PDFs.
- FY2017 is sourced from the audited FY2018 filing's comparative income column and 1/1/2018 corresponding balance-sheet column; this caveat is preserved in every FY2017 row.
- This QA is structural/provenance-focused. Downstream trend models must retain `audited_status`, `restatement_status`, `comparability_status` and `comparability_note`.

Validator: `scripts/validate_mch_statement_supplement.mjs`.
