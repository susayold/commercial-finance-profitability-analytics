# MCH Equity Research Rehearsal QA

**Status:** PASS  
**Checks:** 22/22 passed  
**Scope:** historical tie-outs, scorecard integrity, valuation linkage, report completeness and claim boundary.

| Check | Status | Detail |
|---|---|---|
| historical_row_count | PASS | rows=10 |
| historical_year_coverage | PASS | 2016,2017,2018,2019,2020,2021,2022,2023,2024,2025 |
| latest_anchor | PASS | FY2025 revenue=30556.5bn |
| revenue_cagr_tie_out | PASS | summary=9.24 |
| pat_cagr_tie_out | PASS | summary=10.34 |
| latest_yoy_tie_out | PASS | revenue=-1.1027; PAT=-14.5999 |
| margin_tie_out | PASS | FY2024=29.1696; FY2025=25.4109 |
| cash_conversion_tie_out | PASS | FY2024=116.4982; FY2025=31.5240 |
| peak_and_weak_cash_tie_out | PASS | peak=FY2024; weak_cash=FY2025 |
| scorecard_row_count | PASS | rows=5 |
| scorecard_unique_dimensions | PASS | dimension keys unique |
| scorecard_score_range | PASS | scores bounded 1–5 |
| scorecard_total_tie_out | PASS | total=16/25 |
| valuation_link_tie_out | PASS | base EV=75927.972496 |
| report_historical_table | PASS | ten fiscal-year rows present |
| report_thesis_and_stance | PASS | stance and thesis visible |
| report_scorecard | PASS | scorecard and composite visible |
| report_catalysts_risks | PASS | catalysts and risks visible |
| report_ev_boundary | PASS | EV-only output boundary visible |
| report_diligence_actions | PASS | actionable diligence table visible |
| report_limitations | PASS | limitations and evidence class visible |
| methodology_reproducibility | PASS | source lineage, formulas, scorecard and valuation boundary documented |

The validator treats the report as a portfolio research rehearsal. Historical values are calculated from the approved MCH trend layer; DCF outputs remain analyst assumptions; no price target is published.
