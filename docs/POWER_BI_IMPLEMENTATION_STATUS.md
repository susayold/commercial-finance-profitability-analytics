# Power BI Implementation Status — VietNova Finance Case

## Objective

Turn the v2 Excel model into a reviewer-ready Power BI semantic model with an explicit finance grain, reusable measures and a management page flow. The workbook remains the calculation and audit source; Power BI is the consumption layer.

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

`Peer_Benchmark` is loaded at company × fiscal year with source status, original basis and calculated margins. The KDC FY2016–FY2020 statement layer is approved for metric-level use with page anchors, while VNM/QNS legacy candidates remain review-required. `Peer_Review_Queue` is loaded separately and is never joined into benchmark trends as approved data. Only `reported_summary_verified` and `reported_statement_verified` rows are eligible for benchmark visuals; `summary_candidate_review_required` and `statement_review_required` rows remain visible only on Controls & Evidence.

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
