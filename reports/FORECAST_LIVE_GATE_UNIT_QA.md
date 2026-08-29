# Live Forecast Submission QA

Mode: FIXTURE  
Release status: **FIXTURE_PASS_NOT_LIVE**  

**Checks: 12/12 passed**  

| Check | Status | Detail |
|---|---|---|
| Required headers | PASS | missing= |
| Non-empty submission | PASS | rows=6 |
| Date, month and numeric types | PASS | invalid_rows=0 |
| Allowed status and evidence values | PASS | invalid_rows=0 |
| Eligibility recomputation | PASS | mismatches=0 |
| Unique forecast grain | PASS | duplicate_rows=0 |
| Error arithmetic | PASS | mismatches=0 |
| Frozen rows are eligible | PASS | violations=0 |
| Frozen governance fields | PASS | violations=0 |
| Exceptions and drafts documented | PASS | undocumented=0 |
| Non-negative revenue | PASS | violations=0 |
| Fixture is not mislabelled live | PASS | live-labelled_fixture_rows=0 |

## Eligible Bias/WAPE output

| Forecast version | Company | Brand | Channel | Eligible rows | Forecast VND | Actual VND | Bias | WAPE | As-of date |
|---|---|---|---:|---:|---:|---:|---:|---:|---|
| FE-UNIT-01 | VietNova | NovaDaily | Marketplace | 1 | 110000000 | 100000000 | 0.1 | 0.1 | 2025-12-31 |
| FE-UNIT-01 | VietNova | NovaDaily | General_Trade | 1 | 90000000 | 100000000 | -0.1 | 0.1 | 2025-12-31 |
| FE-UNIT-02 | VietNova | NovaDaily | Marketplace | 1 | 120000000 | 100000000 | 0.2 | 0.2 | 2025-12-31 |
| FE-UNIT-02 | VietNova | NovaDaily | General_Trade | 1 | 80000000 | 100000000 | -0.2 | 0.2 | 2025-12-31 |

This is controlled structural evidence only. It must not be described as observed company performance.
