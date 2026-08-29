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

`Peer_Benchmark` is loaded at company × fiscal year with source status, original basis and calculated margins. `Peer_Review_Queue` is loaded separately and is never joined into benchmark trends as approved data. Only `reported_summary_verified` and `reported_statement_verified` rows are eligible for benchmark visuals; `summary_candidate_review_required` and `statement_review_required` rows remain visible only on Controls & Evidence.

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

