# Power BI Implementation Status — VietNova Finance Case

## Objective

Turn the v2 Excel model into a reviewer-ready Power BI semantic model with an explicit finance grain, reusable measures and a management page flow. The workbook remains the calculation and audit source; Power BI is the consumption layer.

## Refreshable package status — 2026-08-30

- **Compiled `.pbit`:** created and package-validated; 15 tables, 37 measures, 23 relationships, six pages and 39 visual containers.
- **Editable `.pbip`:** generated with TMDL semantic model source, PBIR report binding, parameterized Power Query and source-controlled artifacts.
- **Data replacement contract:** passed a controlled VND 1,000,000 source mutation with identical schema and row count; all 14 CSV partitions reference the single `DataRoot` parameter.
- **Automated QA:** 29/29 package, source and refresh-contract checks passed.
- **Native `.pbix`:** not yet claimed. Power BI Desktop executable is missing on the current machine and MSI repair requires Administrator rights, so Desktop open/refresh/render QA remains pending.
- **Real-time interpretation:** current Import-mode CSV design updates on manual or scheduled refresh. True automatic page refresh requires migration to a supported DirectQuery/LiveConnect source.

## DirectQuery readiness extension — 2026-08-30

The migration path is now source-controlled under `powerbi/directquery/`. It includes a finance-schema DDL for Azure SQL/SQL Server/Fabric, query-path indexes, freshness/incident controls and machine-readable gates. The standalone readiness validator passes 30/30 checks. It is ready for database provisioning but does not claim a live connection, service capacity or a measured refresh interval.

## Model contract

### Fact tables

| Table | Grain | Key measures |
|---|---|---|
| `Sales_Fact` | invoice line × month | Gross sales, discount, net sales, units, COGS, contribution margin |
| `Commercial_Costs` | cost event × month × channel | trade spend, platform fee, freight, variable service cost |
| `Inventory` | SKU × month | ending inventory, inventory value, days on hand |
| `AR` | customer × month | invoice balance, overdue balance, DSO inputs |
| `AP` | supplier × month | payable balance, DPO inputs |
| `Budget` | month × channel × scenario | budget revenue, budget gross margin, budget opex |
| `Forecast_Versions` | month × scenario × channel | forecast revenue, forecast margin, confidence band |

### Dimensions

`Calendar`, `Product_Master`, `Customer_Master`, `Channel_Master`, plus a disconnected `Scenario Selector` table. Single-direction relationships flow from dimensions into facts; no fact-to-fact relationships are permitted.

### Peer benchmark and evidence tables

`Peer_Benchmark` is loaded at company × fiscal year with source status, original basis and calculated margins. The VNM FY2006–FY2020, QNS FY2016–FY2020 and KDC FY2016–FY2020 statement layers are now approved for metric-level use with page anchors; historical basis/perimeter caveats remain visible. `Peer_Review_Queue` is loaded separately and is never joined into benchmark trends as approved data. Only `reported_summary_verified` and `reported_statement_verified` rows are eligible for benchmark visuals; any residual candidate rows remain visible only on Controls & Evidence.

## Core DAX measure set

```DAX
Net Revenue := SUM ( Sales_Fact[Net_Revenue_VND] )
Gross Profit := [Net Revenue] - SUM ( Sales_Fact[COGS_VND] )
Contribution Margin := [Gross Profit] - SUM ( Commercial_Costs[Variable_Cost_VND] )
Contribution Margin % := DIVIDE ( [Contribution Margin], [Net Revenue] )
Budget Variance := [Net Revenue] - SUM ( Budget[Budget_Revenue_VND] )
Budget Variance % := DIVIDE ( [Budget Variance], SUM ( Budget[Budget_Revenue_VND] ) )
DSO := DIVIDE ( AVERAGE ( AR[Ending_AR_VND] ), [Net Revenue] ) * 365 / 12
DIO := DIVIDE ( AVERAGE ( Inventory[Inventory_Value_VND] ), SUM ( Sales_Fact[COGS_VND] ) ) * 365 / 12
DPO := DIVIDE ( AVERAGE ( AP[Ending_AP_VND] ), SUM ( Sales_Fact[COGS_VND] ) ) * 365 / 12
CCC := [DSO] + [DIO] - [DPO]
Promo ROI := DIVIDE ( [Incremental Contribution], SUM ( Commercial_Costs[Trade_Spend_VND] ) )
```

## Six report pages

1. **Executive Output** — scenario selector, revenue, EBITDA proxy, contribution margin, CCC, risk flag and three actions.
2. **P&L / Variance** — actual vs budget vs forecast by month, waterfall bridge and variance commentary.
3. **PVM Bridge** — price, volume, mix and promotion/trade-spend decomposition.
4. **Channel & Customer Profitability** — contribution margin by channel/customer, hurdle line at 25%, drill-through to SKU.
5. **Working Capital & Liquidity** — DSO/DIO/DPO/CCC trend, AR ageing, inventory cover, debt and liquidity stress.
6. **Controls & Evidence** — tie-outs, row counts, source register, synthetic-vs-reported legend and exception queue.

## QA acceptance criteria

- Revenue in Power BI ties to `Sales_Fact` and the Excel `PnL` tab within VND 100m deterministic rounding tolerance.
- Channel contribution reconciles to total contribution; any tolerance is shown on-page.
- `Checks[MODEL STATUS] = PASS`; no negative sales; row counts equal the v2 model contract.
- Every visual has a metric definition tooltip and source/evidence classification.
- Synthetic operating facts are labelled in the page subtitle and report metadata.
- Peer benchmark trends exclude unapproved candidates; the review queue remains auditable on Controls & Evidence.

## Reviewer hand-off

Open `Executive_Output` first, click the scenario selector, then use the page navigation to trace the decision back through PVM, channel economics and controls. The recommended interview walk-through is under five minutes.



## Peer statement layer update (2026-08-30)

VNM FY2016–FY2020 is now available as `data/vnm_statement_metrics_2016_2020.csv` and the native Sheet tab `VNM_Statement_Metrics_2016_2020`. These rows are eligible for peer benchmark visuals because they carry VAS consolidated statement metrics and page anchors. VNM FY2006–FY2015 candidates and QNS FY2016–FY2020 summary rows remain evidence-gated until statement-level review is complete.

## QNS statement layer update (2026-08-30)

QNS FY2016–FY2020 is now available as audited VAS consolidated statement rows with page anchors in `data/qns_statement_metrics_2016_2019.csv` plus `data/qns_statement_metrics_2020.csv`. All five rows are eligible for peer benchmark visuals. The consolidated benchmark now has 15 statement-verified rows; VNM FY2006–FY2015 candidates remain evidence-gated.

## VNM legacy statement layer update (2026-08-30)

VNM FY2012–FY2015 is now available in `data/vnm_statement_metrics_2012_2013.csv` and `data/vnm_statement_metrics_2014_2015.csv`, with audited VAS consolidated metrics, comparative-column labels and page anchors. These rows are statement-verified for the evidence layer but are intentionally outside the approved FY2016–FY2025 benchmark export until the benchmark scope is explicitly extended. Current queue counts: 19 `reported_statement_verified`, 5 `summary_candidate_review_required` (FY2007–FY2011) and 1 `statement_review_required` (FY2006).

## VNM FY2010–FY2011 statement layer update (2026-08-30)

The audited VAS consolidated FY2011 filing has promoted FY2010 (comparative column) and FY2011 (current column) into `data/vnm_statement_metrics_2010_2011.csv`. Page anchors 72–76 cover balance sheet, income statement and cash flow; all eight required metrics are captured. The evidence-gated queue is now 21 `reported_statement_verified`, 3 `summary_candidate_review_required` (FY2007–FY2009) and 1 `statement_review_required` (FY2006). The approved benchmark export remains FY2016–FY2025.

## VNM FY2009 statement layer update (2026-08-30)

FY2009 is now statement-verified from the audited VAS consolidated FY2010 filing's comparative column (pages 6–11) and archived in `data/vnm_statement_metrics_2009.csv`. Queue status is now 22 `reported_statement_verified`, 2 `summary_candidate_review_required` (FY2007–FY2008) and 1 `statement_review_required` (FY2006). The approved benchmark export remains FY2016–FY2025.

## VNM FY2008 statement layer update (2026-08-30)

FY2008 is now statement-verified from the audited VAS consolidated FY2009 filing's comparative column (pages 5–11) and archived in `data/vnm_statement_metrics_2008.csv`. Queue status is 23 `reported_statement_verified`, 1 `summary_candidate_review_required` (FY2007) and 1 `statement_review_required` (FY2006). The approved benchmark export remains FY2016–FY2025.

## VNM FY2007 statement layer update (2026-08-30)

FY2007 is now statement-verified from the audited VAS consolidated FY2008 filing's comparative column (pages 4–10) and archived in `data/vnm_statement_metrics_2007.csv`. The queue is now 24 `reported_statement_verified` and 1 `statement_review_required` (FY2006); the approved benchmark export remains FY2016–FY2025.

## VNM FY2006 statement layer update (2026-08-30)

FY2006 is now statement-verified from the audited VAS consolidated FY2007 filing's restated comparative column (pages 5–11) and archived in `data/vnm_statement_metrics_2006.csv`. The peer extraction queue is fully verified at 25 rows; the approved benchmark export remains FY2016–FY2025.

## Reproducible build guide (2026-08-30)

The step-by-step implementation guide is available at `powerbi/POWER_BI_BUILD_GUIDE_V2.md` and [Drive](https://drive.google.com/file/d/13BM9_oOwLxyMnO9IPGkaPWcyVB991q_Y/view). It specifies source mapping, import rules, one-to-many relationships, hardened scenario/evidence measures, six-page visual acceptance criteria, QA tolerances and the recruiter walkthrough. The only remaining environment-dependent artifact is the native `.pbix` created in Power BI Desktop.


## QA automation pack (2026-08-30)

The release gate now has a reviewer-facing matrix in [powerbi/QA_TEST_MATRIX.md](../powerbi/QA_TEST_MATRIX.md) and executable DAX controls in [powerbi/qa_validation_queries.dax](../powerbi/qa_validation_queries.dax). The matrix covers model grain, revenue/CM tie-outs, PVM, scenario determinism, working-capital conventions, peer evidence gating, unit/basis labelling, historical VNM caveats and a five-minute recruiter walkthrough. The DAX query returns a single PASS/FAIL status plus row-level diagnostics for negative sales, discount/return bounds, channel CM residual and peer PAT-margin residual. Drive copies: [QA matrix](https://drive.google.com/file/d/1goi-4XMbHbUAeqE9dIHkISHhdZf5MGtb/view) and [DAX controls](https://drive.google.com/file/d/1l2_xVOfEdXzozbON4-7BN6hTt6zlSAog/view).


## Desktop execution runbook (2026-08-30)

The native PBIX handoff is operationalized in [powerbi/POWER_BI_DESKTOP_RUNBOOK.md](../powerbi/POWER_BI_DESKTOP_RUNBOOK.md) and [Drive](https://drive.google.com/file/d/1GdN43ajowcg9qjIf5fmwnX9Qarfd64Us/view). It specifies remote inputs, Power BI data types, relationships, six-page build order, QA execution, PBIP/PBIR save options and the remote archive procedure.
