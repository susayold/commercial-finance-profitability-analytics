# MCH Financial Statement Analysis QA — 2026-08-30

Overall status: **PASS (11/11 controls)**

Validator: `scripts/validate_mch_financial_statement_analysis.mjs`

Controls:
- header and 15-field schema
- 10-row count
- contiguous FY2016–FY2025
- numeric parse and positive denominators
- net-margin recomputation
- ROA recomputation
- ROE recomputation
- DuPont recomputation
- CFO/revenue and debt/equity recomputation
- FY2017 comparative/corresponding provenance

Interpretation: the layer is arithmetically reproducible and evidence-labelled. It does not eliminate the FY2024 equity-base review or FY2025 cash-conversion follow-up; those are intentionally surfaced as analyst questions.
