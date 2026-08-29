# VNM Long-Run Panel QA Report

Run date: 2026-08-30

**Overall status: PASS** (17/17 checks passed)

| Check | Status | Detail |
|---|---|---|
| Required headers | PASS | missing=none |
| Row count | PASS | rows=20; expected=20 |
| Contiguous FY2006-FY2025 | PASS | first=2006; last=2025 |
| No duplicate ticker-year | PASS | duplicates=none |
| Source URLs present | PASS | missing=0 |
| Statement layer FY2006-FY2020 | PASS | all pre-2021 rows must be statement verified |
| Summary layer FY2021-FY2025 | PASS | all 2021+ rows must be summary verified |
| FY2021 basis-break flag | PASS | FY2021 is the statement-to-summary boundary |
| FY2006 restatement note | PASS | FY2006 must retain restated-comparative caveat |
| Derived gross_margin_pct | PASS | mismatches=none |
| Derived operating_margin_pct | PASS | mismatches=none |
| Derived pbt_margin_pct | PASS | mismatches=none |
| Derived pat_margin_pct | PASS | mismatches=none |
| Derived cfo_to_pat_pct | PASS | mismatches=none |
| Derived asset_turnover | PASS | mismatches=none |
| Derived equity_ratio | PASS | mismatches=none |
| Missing values remain blank | PASS | summary-only fields are blank, not zero |

## Interpretation

The panel intentionally combines statement-verified FY2006–FY2020 with summary-verified FY2021–FY2025. Missing gross profit, operating cash flow and their dependent ratios remain blank; zero is never used as a substitute for unavailable evidence. FY2006 and the FY2021 boundary remain explicit comparability flags.

## Release rule

Do not use the panel for cross-window ranking if any check fails or if a reviewer removes the restatement/basis-break caveats.
