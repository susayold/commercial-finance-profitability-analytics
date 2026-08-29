# Power BI QA Test Matrix — VNFinance Commercial Finance v2

This matrix is the release gate for the native Power BI file. Run the tests in Power BI Desktop after importing the remote v2 workbook and approved peer CSV. Record the observed value, reviewer initials and timestamp in the Controls & Evidence page.

## Test matrix

| ID | Test / business question | Power BI object | Expected result / tolerance | Evidence |
|---|---|---|---|---|
| QA-01 | Is the model loaded at the intended grain? | Model view + row-count cards | Calendar, Sales_Fact, Commercial_Costs, Inventory, AR, AP, Budget and Forecast_Versions row counts match the v2 workbook metadata. | Source workbook tab counts and model contract |
| QA-02 | Does revenue reconcile? | [Net Revenue] card and Excel tie-out card | Power BI Net Revenue equals Excel PnL Net Revenue within ±VND 100m after deterministic rounding. | Excel Checks and Power BI Checks page |
| QA-03 | Does gross profit reconcile? | [Gross Profit] card | Net Revenue - COGS equals the Excel P&L gross profit within ±VND 100m. | PnL tab and DAX measure |
| QA-04 | Does contribution reconcile by channel? | Channel matrix + total card | Sum of channel contribution margin equals total contribution margin; residual ≤VND 100m. | Channel_Profitability and matrix total |
| QA-05 | Are there impossible sales values? | Sales_Fact diagnostic table | Count of rows where Net Revenue < 0, Units < 0 or COGS < 0 is zero. | Diagnostic DAX table / filter |
| QA-06 | Are discounts and returns bounded? | Sales diagnostic table | Discount + Returns ≤ Gross Sales for every invoice line; violations = 0. | Sales_Fact row-level check |
| QA-07 | Is the selected scenario deterministic? | Scenario slicer | Base / Upside / Downside changes forecast and variance visuals only; actual revenue is unchanged. | Scenario selector and three screenshots |
| QA-08 | Is the budget bridge directionally correct? | Variance waterfall | Revenue variance equals Actual − Budget; waterfall components sum to the headline variance within rounding. | P&L / Variance page |
| QA-09 | Does the PVM bridge explain growth? | PVM bridge | Price + Volume + Mix + Trade-spend bridge equals period-over-period net revenue / contribution movement within ±VND 100m. | PVM_Bridge tab |
| QA-10 | Is the hurdle rule visible? | Channel scatter / table | Rows with Contribution Margin % below Channel_Master[CMHurdle] show Below Hurdle Flag = 1; no blank hurdle values for active channels. | Channel page |
| QA-11 | Are cash-cycle measures interpretable? | DSO / DIO / DPO / CCC cards | DSO, DIO, DPO use monthly denominator convention (365/12) and CCC = DSO + DIO − DPO. | Working Capital page |
| QA-12 | Are peer rows evidence-gated? | Peer benchmark table | Only reported_summary_verified and reported_statement_verified rows appear in benchmark trend visuals; review-required rows appear only in the queue. | Controls & Evidence page |
| QA-13 | Does peer evidence coverage read correctly? | [Peer Evidence Coverage] card | Coverage = approved rows / total peer rows. Current queue baseline is 25 verified rows; any change is documented before refresh. | Queue Sheet and source registry |
| QA-14 | Are peer margins mathematically consistent? | Peer table | Gross / operating / PBT / PAT margins equal the corresponding profit divided by net revenue; no divide-by-zero blanks for approved rows. | Approved peer CSV |
| QA-15 | Are units and basis labelled? | Tooltip / subtitle | Operating facts state “synthetic VND”; peer facts state “reported VND bn”; QNS revenue-basis caveat is visible. | Page subtitles and evidence legend |
| QA-16 | Does the historical VNM layer preserve caveats? | Peer evidence detail | FY2006 is labelled a restated comparative under VAS 25; FY2007 PAT > PBT is not flagged as an arithmetic error and has a reconciliation note. | VNM merged layer and protocol |
| QA-17 | Are refresh controls present? | Controls page | Last refresh timestamp, source file names, source URL / page anchor and model version are populated. | Refresh metadata table |
| QA-18 | Can a reviewer reproduce the executive answer? | Executive Output walkthrough | Starting at Executive Output, a reviewer can reach the driver, owner and action within five minutes without opening hidden calculations. | Recruiter website narrative |

## Release decision

The PBIX is PASS only when QA-01 through QA-17 pass and QA-18 is demonstrated. A failed test must remain visible on Controls & Evidence with owner, remediation and retest date. Never suppress a failed control by filtering it out of the report.

## Reviewer script

1. Open Executive Output, select Base, and note revenue, contribution margin and CCC.
2. Select Upside and Downside; confirm actuals remain stable and forecast/variance change.
3. Navigate to P&L / Variance, then PVM Bridge, and explain the largest driver.
4. Drill from Channel to Customer/SKU and identify any below-hurdle growth.
5. Open Working Capital & Liquidity and state the cash-release action.
6. Finish on Controls & Evidence; show tie-outs, evidence status, queue count and refresh timestamp.
