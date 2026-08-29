# Native PBIX Release Evidence Template

Status: OPEN until completed in Power BI Desktop  
Owner: Finance Analyst  
Model version: `VietNova_FPA_Model_v2`  
Evidence policy: do not mark a test PASS without an observed value, screenshot/page reference and reviewer initials.

## Pre-build manifest

| Item | Expected input | Observed value / link | Status |
|---|---|---|---|
| Workbook | Remote `VietNova_FPA_Model_v2.xlsx` |  | OPEN |
| Approved peer CSV | `data/peer_benchmark_approved_2016_2025.csv` |  | OPEN |
| Model contract | `powerbi/model_contract.json` |  | OPEN |
| DAX measure pack | `powerbi/measures.dax` |  | OPEN |
| Refresh timestamp | Asia/Bangkok |  | OPEN |
| PBIX filename/version | `VietNova_Commercial_Finance_v2.pbix` |  | OPEN |

## QA-01 to QA-18 execution log

| ID | Test | Expected result / tolerance | Observed value | Evidence page/screenshot | Reviewer | Date | Status |
|---|---|---|---|---|---|---|---|
| QA-01 | Intended grain and row counts | Match v2 workbook metadata |  |  |  |  | OPEN |
| QA-02 | Net revenue reconciliation | Excel tie-out within ±VND 100m |  |  |  |  | OPEN |
| QA-03 | Gross profit reconciliation | Net revenue − COGS equals Excel within ±VND 100m |  |  |  |  | OPEN |
| QA-04 | Channel contribution reconciliation | Residual ≤VND 100m |  |  |  |  | OPEN |
| QA-05 | Impossible sales values | Negative revenue/units/COGS count = 0 |  |  |  |  | OPEN |
| QA-06 | Discount and return bound | Discount + returns ≤ gross sales; violations = 0 |  |  |  |  | OPEN |
| QA-07 | Scenario isolation | Actuals unchanged; forecast/variance changes |  |  |  |  | OPEN |
| QA-08 | Budget bridge direction | Actual − budget and components reconcile |  |  |  |  | OPEN |
| QA-09 | PVM bridge | Price + volume + mix + trade spend reconciles |  |  |  |  | OPEN |
| QA-10 | Channel hurdle rule | Below-hurdle flag matches CM% < hurdle |  |  |  |  | OPEN |
| QA-11 | Cash-cycle convention | CCC = DSO + DIO − DPO; monthly denominator |  |  |  |  | OPEN |
| QA-12 | Peer evidence filter | Only approved statement/summary rows in trends |  |  |  |  | OPEN |
| QA-13 | Peer coverage card | 25 verified queue rows; changes documented |  |  |  |  | OPEN |
| QA-14 | Peer margin math | Margin = profit / net revenue; no divide-by-zero errors |  |  |  |  | OPEN |
| QA-15 | Unit and basis labels | Synthetic VND vs reported VND bn visible |  |  |  |  | OPEN |
| QA-16 | VNM caveats | FY2006 restated and FY2021 basis break visible |  |  |  |  | OPEN |
| QA-17 | Refresh controls | Timestamp, source URLs, page anchors, model version populated |  |  |  |  | OPEN |
| QA-18 | Executive reproducibility | Reviewer reaches driver/owner/action in <5 minutes |  |  |  |  | OPEN |

## Sign-off rule

Release is **PASS** only when every row is PASS, the Controls & Evidence page contains the same observed values, and the reviewer can reproduce the executive answer without opening hidden calculations. A failed row must include owner, remediation and retest date; filtering a failed row out of a visual is not remediation.

## Forecast accuracy dependency

PBIX release does not create historical forecast accuracy. Bias and WAPE can be labelled **observed** only after a pre-close snapshot is frozen in the native forecast capture Sheet, actual close is recorded and the leakage-safe backtest returns `READY`. Until then, display `NOT_AVAILABLE — NO_FROZEN_SNAPSHOT`.

