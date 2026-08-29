# Power BI Build Guide v2 — Commercial Finance / FP&A Case

## Purpose

This guide turns the repository's model contract and DAX measure library into a reproducible six-page Power BI report. The Excel v2 workbook is the calculation and audit source; Power BI is the consumption layer. The report must make evidence status visible and must never present synthetic VietNova operating data as reported company data.

## Required remote inputs

| Input | Location | Use |
|---|---|---|
| VietNova v2 workbook | Google Sheets: `VietNova_FPA_Model_v2` | operating facts, budget, forecast, working capital and checks |
| Approved peer benchmark | `data/peer_benchmark_approved_2016_2025.csv` | benchmark visuals only |
| Full VNM evidence layer | `data/vnm_statement_metrics_2006_2020.csv` | historical evidence table / optional scope extension |
| Peer extraction queue | `data/peer_extraction_queue.csv` | Controls & Evidence only; never join as approved benchmark |
| Model contract | `powerbi/model_contract.json` | grain, keys, relationships and acceptance rules |
| Measures | `powerbi/measures.dax` | starting measure set |

## Import and naming rules

1. In Power BI Desktop, connect to the remote v2 workbook or its exported `.xlsx` copy. Do not manually retype data.
2. Rename imported tables to the contract names exactly: `Sales_Fact`, `Commercial_Costs`, `Inventory`, `AR`, `AP`, `Budget`, `Forecast_Versions`, `Peer_Benchmark`, `Peer_Review_Queue`.
3. Set amount columns to Fixed decimal number and store VND at full precision. Apply display formats (`#,##0.0,,,.0 "bn"` or `#,##0.0 "m"`) only at the measure layer.
4. Parse `DateKey` as Date and create a marked date table called `Calendar` with `DateKey`, `Month`, `FiscalYear`, `FiscalQuarter`, `MonthNumber` and `YearMonth`.
5. Add `Scenario Selector = DATATABLE("Scenario", STRING, {{"Base"},{"Upside"},{"Downside"}})` as a disconnected table.
6. Load peer CSVs with UTF-8 encoding. Keep `Source_Status`, `Source_Layer`, `Revenue_Basis`, `Page_Anchor`, `Comparability_Note` and `Source_URL` as text attributes.

## Relationship design

Use single-direction, one-to-many relationships from dimensions to facts. Do not create fact-to-fact relationships.

| From (one) | To (many) | Active? |
|---|---|---|
| `Calendar[DateKey]` | every monthly fact `[DateKey]` | Yes |
| `Product_Master[ProductID]` | `Sales_Fact`, `Inventory` | Yes |
| `Customer_Master[CustomerID]` | `Sales_Fact`, `AR` | Yes |
| `Channel_Master[ChannelID]` | `Sales_Fact`, `Commercial_Costs`, `Budget`, `Forecast_Versions` | Yes |
| `Scenario Selector[Scenario]` | none | Disconnected |

`Peer_Benchmark` is a separate fiscal-year evidence table. Do not relate it to monthly `Calendar`; use its own `FiscalYear` slicer or a dedicated `Peer_Calendar` if cross-filtering is required. `Peer_Review_Queue` remains disconnected from approved benchmark visuals.

## Core measure hardening

Use the measures in `powerbi/measures.dax`, then add these control measures:

```DAX
Model Status :=
IF ( [Revenue Variance] = [Revenue Variance], "PASS", "CHECK" )

Peer Approved Rows :=
CALCULATE (
    COUNTROWS ( Peer_Benchmark ),
    Peer_Benchmark[Source_Status] IN { "reported_summary_verified", "reported_statement_verified" }
)

Peer Unapproved Rows :=
COUNTROWS ( Peer_Benchmark ) - [Peer Approved Rows]

Peer Evidence Coverage % :=
DIVIDE ( [Peer Approved Rows], COUNTROWS ( Peer_Benchmark ) )

Refresh Timestamp := FORMAT ( UTCNOW(), "yyyy-mm-dd hh:mm" )

Scenario Revenue :=
VAR s = [Selected Scenario]
RETURN
    SWITCH (
        s,
        "Upside", CALCULATE ( [Forecast Revenue], Forecast_Versions[Scenario] = "Upside" ),
        "Downside", CALCULATE ( [Forecast Revenue], Forecast_Versions[Scenario] = "Downside" ),
        CALCULATE ( [Forecast Revenue], Forecast_Versions[Scenario] = "Base" )
    )

Scenario CM :=
VAR s = [Selected Scenario]
RETURN
    SWITCH (
        s,
        "Upside", CALCULATE ( SUM ( Forecast_Versions[Forecast_CM_VND] ), Forecast_Versions[Scenario] = "Upside" ),
        "Downside", CALCULATE ( SUM ( Forecast_Versions[Forecast_CM_VND] ), Forecast_Versions[Scenario] = "Downside" ),
        CALCULATE ( SUM ( Forecast_Versions[Forecast_CM_VND] ), Forecast_Versions[Scenario] = "Base" )
    )

CM Hurdle Breach Count :=
COUNTROWS ( FILTER ( VALUES ( Channel_Master[ChannelID] ), [Contribution Margin %] < [CM Hurdle] ) )
```

For working-capital days, ensure the numerator and denominator use the same period context. If a visual is monthly, use monthly COGS; for a fiscal-year card, use fiscal-year COGS and average balance over that year. Never compare a month-end balance with a full-year revenue denominator without an explicit annualization label.

## Page-by-page build specification

### 1. Executive Output

Question: what decision should the CFO make this month?

- KPI cards: Net Revenue, Contribution Margin %, Scenario Revenue, CCC, Revenue Variance %.
- Line/column combo: actual revenue, budget revenue and selected forecast by month.
- Waterfall: revenue variance to contribution-margin variance.
- Risk card: `CM Hurdle Breach Count`, overdue AR %, inventory cover.
- Action table: owner, action, expected VND impact, due date, status.
- Subtitle must state `Synthetic VietNova operating case — public peer data shown separately`.

### 2. P&L and Variance

- Matrix by month with actual, budget, forecast, absolute variance and variance %.
- Waterfall decomposition for price, volume, mix, trade spend and cost-to-serve.
- Top-five driver table using conditional formatting and a drill-through to channel/customer.
- Tooltip page: metric definition, selected scenario, refresh timestamp and evidence class.

### 3. PVM Bridge

- Bridge visual: prior-period revenue → price → volume → mix → promotion/trade spend → current revenue.
- Slicers: month, category, brand, channel.
- Reconciliation card: bridge total minus actual revenue; acceptance tolerance VND 100m.
- Driver table must separate reported/derived labels; PVM components are calculated, not reported.

### 4. Channel and Customer Profitability

- Scatter: revenue vs Contribution Margin %, bubble size = units, color = channel.
- Bar chart: contribution margin by channel with 25% hurdle line.
- Customer drill-through: gross sales, discount, returns, trade spend, variable cost, CM %, payment terms and overdue AR.
- SKU matrix: category → brand → ProductID with cost, units and CM %.
- Flag every channel/customer below hurdle; do not hide negative or low-margin observations.

### 5. Working Capital and Liquidity

- Four KPI cards: DSO, DIO, DPO, CCC.
- Trend: monthly days and cash tied-up bridge.
- AR ageing: current, 1–30, 31–60, 61–90, >90 days; show overdue %.
- Inventory: ending value, units on hand, cover days and slow-moving flag.
- Liquidity stress: downside revenue, cash conversion, AP runway and minimum-cash threshold.
- Add a footnote that days are annualized from the selected period denominator.

### 6. Controls and Evidence

- Cards: `Model Status`, row counts by fact, PVM reconciliation, peer evidence coverage, last refresh.
- Table: peer company/year, Source_Status, Source_Layer, Revenue_Basis, Page_Anchor, Comparability_Note and Source_URL.
- Separate queue table: review status, required metrics, source document and reviewer note.
- Legend: `synthetic`, `reported_summary_verified`, `reported_statement_verified`, `calculated`, `review-required`.
- Explicit warning: review-required rows are visible for audit but excluded from benchmark trends.

## QA checklist before publishing

1. `Sales_Fact` row count and Net Revenue tie to Excel `PnL` within VND 100m.
2. Channel CM sums to total CM within VND 100m.
3. PVM bridge residual is within VND 100m.
4. No negative sales unless a documented return/credit-note rule exists.
5. All dimension keys are unique; no orphan fact keys.
6. `Peer Approved Rows` equals the approved benchmark row count; review queue is not included.
7. Every page has a refresh timestamp, metric tooltip and evidence subtitle.
8. FY2006 VNM is labelled restated comparative / first VAS 25 consolidated year.
9. FY2007 PAT > PBT is labelled as deferred-tax and minority-benefit presentation, not treated as a data error.
10. Export a PDF snapshot and retain the PBIX/PBIP only in the remote project archive.

## Five-minute recruiter walkthrough

1. Start on Executive Output and state the CFO decision.
2. Toggle Base/Upside/Downside and show the contribution-margin guardrail.
3. Trace the miss through P&L Variance and PVM Bridge.
4. Drill into the below-hurdle channel and show cash-cycle impact.
5. Finish on Controls and Evidence to demonstrate source status, tie-outs and the no-imputation policy.

## Known environment limitation

This environment can deliver the complete semantic contract, DAX, data, documentation and source-linked QA, but cannot author a native Power BI Desktop `.pbix` interactively. Create the PBIX from this guide in Power BI Desktop, then upload the resulting binary to the private Drive archive and link it from the recruiter website.

