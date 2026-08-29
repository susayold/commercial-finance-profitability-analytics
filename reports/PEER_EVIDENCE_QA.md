# Peer Evidence QA Report

Run date: 2026-08-30

**Overall status: PASS** (21/21 checks passed)

| Check | Status | Detail |
|---|---|---|
| Benchmark headers | PASS | missing=none |
| Queue headers | PASS | missing=none |
| VNM headers | PASS | missing=none |
| Benchmark row count | PASS | rows=30; expected=30 |
| Queue row count | PASS | rows=25; expected=25 |
| VNM row count | PASS | rows=15; expected=15 |
| Benchmark unique ticker-years | PASS | duplicates=none |
| Queue unique ticker-years | PASS | duplicates=none |
| VNM unique years | PASS | duplicates=none |
| Benchmark VNM FY2016-FY2025 | PASS | years=2016|2017|2018|2019|2020|2021|2022|2023|2024|2025 |
| Benchmark QNS FY2016-FY2025 | PASS | years=2016|2017|2018|2019|2020|2021|2022|2023|2024|2025 |
| Benchmark KDC FY2016-FY2025 | PASS | years=2016|2017|2018|2019|2020|2021|2022|2023|2024|2025 |
| VNM statement FY2006-FY2020 | PASS | years=2006|2007|2008|2009|2010|2011|2012|2013|2014|2015|2016|2017|2018|2019|2020 |
| Benchmark status is approved | PASS | invalid=0 |
| Queue all rows statement-verified | PASS | invalid=0 |
| VNM all rows statement-verified | PASS | invalid=0 |
| Benchmark source evidence | PASS | invalid=0 |
| Queue source evidence | PASS | invalid=0 |
| VNM source evidence | PASS | invalid=0 |
| Queue required metrics complete | PASS | invalid=0 |
| VNM statement metrics populated | PASS | invalid=0 |

## Release rule

Only rows that pass this evidence gate may feed the approved peer benchmark or recruiter-facing claims. Review-required candidates remain outside the approved dataset.
