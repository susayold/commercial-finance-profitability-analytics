# Executive Output Reconciliation — VietNova Commercial Finance Portfolio

Date: 2026-08-30  
Purpose: reviewer-facing traceability from a headline executive answer to the source layer, calculation, caveat and control test.

## How to read this file

The portfolio has three evidence classes:

- **SIMULATED** — deterministic VietNova operating ledger and management model created for the case.
- **OBSERVED** — public company figures extracted from annual reports / audited statements or explicitly identified annual-report summary tables.
- **DERIVED / ASSUMPTION** — calculations or scenario inputs built from the preceding layers.

No row below should be interpreted as audited VietNova performance. The fictional company exists to demonstrate the analyst workflow; the peer layer is public-company context.

## Headline-to-evidence map

| Executive answer / output | Evidence class | Source artifact | Calculation or control | Caveat / interpretation |
|---|---|---|---|---|
| Revenue, gross profit and operating profit in the Executive Output | SIMULATED + DERIVED | `VietNova_FPA_Model_v2.xlsx`; `data/synthetic_sales_ledger.csv` | P&L measures aggregate invoice-line net revenue, COGS and operating costs; Excel Checks and Power BI QA-02/03 reconcile to the P&L within ±VND 100m | Illustrative VND model outputs, not a real-company fact |
| Actual vs budget variance | SIMULATED + DERIVED | `Budget`, `P&L`, `Variance_Bridge` tabs; `powerbi/measures.dax` | Revenue variance = Actual − Budget; bridge components must sum to headline variance; QA-08 | Budget is a case assumption; rounding tolerance is disclosed rather than hidden |
| Price–volume–mix explanation | DERIVED | `PVM` tab; `powerbi/measures.dax` | Price + Volume + Mix + Trade-spend residual explains period-over-period movement; QA-09 | Residual is shown and investigated; no causal claim is made from synthetic data |
| Channel contribution and below-hurdle growth | SIMULATED + DERIVED | `Channel_Profitability`, `Channel_Master`, `Promotion_Pricing` | Contribution = net revenue − variable costs; below-hurdle flag compares CM% to channel hurdle; QA-04 and QA-10 | Hurdles and cost-to-serve are assumptions designed to force commercial trade-offs |
| Working-capital priority | SIMULATED + DERIVED | `Working_Capital`, `AR`, `Inventory`, `AP` | DSO + DIO − DPO = CCC using the approved ending-balance convention; QA-11 | FY2025 Base case is 54.0 days CCC; June escalation is a model flag, not observed cash performance |
| Scenario recommendation | ASSUMPTION + DERIVED | `Scenario_MonteCarlo`, `Budget_Allocation`, `Promotion_Pricing` | Base / Upside / Downside changes forecast and variance views while actuals remain unchanged; QA-07 | Scenario deltas are decision inputs, not forecasts of a public company |
| Public peer growth context | OBSERVED + DERIVED | `data/peer_benchmark_approved_2016_2025.csv`; `data/vnm_statement_metrics_2006_2020.csv` | CAGR = (FY2025 / FY2021)^(1/4) − 1 using reported summary net revenue: VNM **1.10%**, QNS **9.58%**, KDC **−3.63%** | FY2021–FY2025 rows are summary-layer evidence; revenue basis and perimeter notes remain attached |
| VNM long-run trend | OBSERVED + DERIVED | `data/vnm_statement_metrics_2006_2020.csv`; `data/peer_benchmark_approved_2016_2025.csv`; `reports/VNM_LONGRUN_PANEL_QA.md` | FY2006–FY2025 panel derives revenue growth, margins, cash conversion, asset turnover and equity ratio | FY2006 restated-comparative caveat and FY2021 statement-to-summary basis break must remain visible; unavailable fields stay blank |
| Peer evidence coverage | OBSERVED | `data/peer_extraction_queue.csv`; `reports/PEER_EVIDENCE_QA.md` | 25/25 extraction-queue rows are `reported_statement_verified`; approved benchmark has 30 unique ticker-years | “Verified” means page-level source/evidence checks passed the portfolio gate; it is not an assertion that all years use identical presentation bases |
| Forecast Bias / WAPE | DERIVED specification | `docs/FORECAST_ACCURACY_BACKTEST.md`; `scripts/compute_forecast_accuracy.mjs`; native Google Sheet | Only `ELIGIBLE` + `FROZEN` snapshots enter the calculation; native Sheet now proves this on 27 frozen demo rows and reproduces FE-2025-01 +5%/+5%, FE-2025-04 −2%/2% and FE-2025-07 +10%/10% | Results are controlled `DEMO_FIXTURE_v1` evidence, not live VietNova accuracy; real snapshot history is still required for a production claim |

## Quantified decision layer

The recommended action format is deliberately finance-oriented:

1. **Owner** — commercial, supply-chain, finance or account owner.
2. **Driver** — price, units, mix, trade spend, cost-to-serve, inventory or payment terms.
3. **Value equation** — incremental revenue, variable cost, contribution profit, cash release or hurdle-rate test.
4. **Guardrail** — contribution margin %, CCC, service level, stock cover or stop-loss threshold.
5. **Next review date** — monthly close / forecast cycle, with source and model version recorded.

This prevents a chart from being presented as a recommendation without a measurable decision rule.

## Control evidence currently available

| Control family | Current result | Reproducible artifact |
|---|---|---|
| Excel v2 model | PASS; nine control checks pass and formula-error scan returns zero | `reports/VALIDATION_REPORT.md`, workbook `Checks` tab |
| VNM long-run panel | PASS; 17/17 automated checks | `scripts/validate_vnm_longrun_panel.mjs`, `reports/VNM_LONGRUN_PANEL_QA.md` |
| Peer evidence | PASS; 21/21 checks, 25/25 queue rows statement-verified | `scripts/validate_peer_evidence.mjs`, `reports/PEER_EVIDENCE_QA.md` |
| Forecast backtest logic | PASS on deterministic fixture: 3 eligible rows, 1 future-leakage exclusion | `scripts/compute_forecast_accuracy.mjs`, `data/forecast_accuracy_unit_test_expected.csv` |
| Forecast capture governance | PASS for template controls; DRAFT rows are excluded from Backtest Output | Native Sheet `Forecast_Snapshot_Input` and `Backtest_Output` |
| Power BI semantic contract | PASS as metadata/specification | `powerbi/model_contract.json`, `powerbi/measures.dax` |
| Native Power BI release | OPEN | Run QA-01–QA-18 in `powerbi/QA_TEST_MATRIX.md` after PBIX creation |

## Reviewer walkthrough (under five minutes)

1. Start at **Executive Output** and select **Base**.
2. Note revenue, contribution margin and CCC; switch to **Upside** and **Downside** to confirm actuals do not move.
3. Open **P&L / Variance**, then **PVM Bridge**, and explain the largest driver plus the residual.
4. Drill from **Channel** to customer/SKU and identify a below-hurdle growth pocket.
5. Open **Working Capital & Liquidity** and state the cash-release action.
6. Finish on **Controls & Evidence**: show tie-outs, evidence status, queue count, model version and refresh timestamp.

## Release interpretation

The portfolio is communication-ready for a recruiter review when the remote artifacts, evidence labels and open gates are shown honestly. It is not a claim of audited company performance. Before calling the Power BI layer production-ready, create the native PBIX, execute QA-01–QA-18, record observed values and reviewer sign-off, and populate at least one real pre-close **FROZEN** forecast snapshot for live Bias/WAPE.

