# Forecast Capture Archive QA Report

As-of date: 2025-12-31  
Evidence class: DEMO_FIXTURE_v1 (synthetic control evidence; not live company performance).

**Overall status: PASS** (14/14 checks passed)

| Check | Status | Detail |
|---|---|---|
| Required headers | PASS | missing= |
| Row count | PASS | rows=29; expected=29 |
| Snapshot status counts | PASS | {"FROZEN":27,"EXCEPTION":1,"DRAFT":1} |
| Eligibility recomputation | PASS | mismatches=0 |
| Frozen rows are eligible | PASS | violations=0 |
| Exception is documented | PASS | exceptions=1 |
| Draft is held | PASS | drafts=1 |
| Frozen governance fields | PASS | violations=0 |
| Error arithmetic | PASS | mismatches=0 |
| FE-2025-01 backtest metrics | PASS | rows=12; bias=0.05; wape=0.05 |
| FE-2025-04 backtest metrics | PASS | rows=9; bias=-0.02; wape=0.02 |
| FE-2025-07 backtest metrics | PASS | rows=6; bias=0.1; wape=0.1 |
| Leakage exclusion count | PASS | future_leakage=1 |
| Late-actual exclusion count | PASS | not_eligible=1 |

## Interpretation

Only rows with snapshot_status=FROZEN and eligibility_status=ELIGIBLE feed the grouped Bias/WAPE metrics. The archive intentionally retains one future-leakage exception and one late-actual draft so exclusion behavior is visible and testable.

