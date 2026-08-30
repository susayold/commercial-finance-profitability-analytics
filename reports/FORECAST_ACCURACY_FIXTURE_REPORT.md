# Forecast Accuracy Report

Mode: FIXTURE  
Release status: **FIXTURE_PASS_NOT_LIVE**  
Evidence class: DEMO_FIXTURE_ONLY  
Source model version(s): none  
Actual-availability range: none  

**Checks: 8/8 passed**  

| Check | Status | Detail |
|---|---|---|
| Required headers | PASS | missing= |
| Non-empty submission | PASS | rows=2 |
| Date/month/numeric types | PASS | invalid=0 |
| Error arithmetic | PASS | rows=2 |
| Unique grain | PASS | duplicates=0 |
| Non-negative revenue | PASS | violations=0 |
| Eligibility rows internally consistent | PASS | violations=0 |
| Fixture is not live-labelled | PASS | live_rows=0 |

## Population

| Population | Rows | Forecast VND | Actual VND |
|---|---:|---:|---:|
| Eligible | 0 | 0 | 0 |
| Excluded | 2 | — | — |

## Accuracy metrics

| Scope | Rows | Bias | WAPE | MAPE diagnostic | MAPE rows | Zero-actual rows |
|---|---:|---:|---:|---:|---:|---:|
| Overall eligible | 0 | n/a | n/a | n/a | 0 | 0 |

## Exclusion reasons

- Synthetic fixture is not LIVE_INTERNAL
- Draft held for fixture test

## Management action

No live management action: fixture output only.

Release boundary: LIVE_OBSERVED_READY is allowed only for approved LIVE_INTERNAL evidence with pre-close cutoff, closed actuals, HTTPS source URIs and a non-empty eligible set. Fixture output is not observed company performance.
