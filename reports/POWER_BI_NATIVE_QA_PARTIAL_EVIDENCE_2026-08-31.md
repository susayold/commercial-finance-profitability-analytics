# Native Power BI QA — observed coverage (2026-08-31)

This is a row-level coverage report for the native PBIX run. It is deliberately
not the formal release log: `powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv` remains OPEN
until every QA-01–QA-18 row has an observed value, evidence reference,
reviewer and sign-off.

## Observed and source-backed rows

| ID | Current status | Observed/source result | Evidence |
|---|---|---|---|
| QA-01 | OBSERVED_PARTIAL | Input contract contains Sales 6,480; Commercial Costs 6,480; Inventory 2,592; AR 864; AP 144; Budget 6,480; Forecast 6,480; Product 36; Customer 24; Channel 5; Debt 72; Marketing 180; Promotions 1; Source Control 5. Controls page visibly renders Sales 6,480, Product 36 and Customer 24. | `POWER_BI_NATIVE_PBIX_CONTROLS_2026-08-31.png`; 78/78 input contract |
| QA-02 | OBSERVED_PARTIAL | Source Net Revenue = VND 37,824,186,837; Budget = VND 40,046,591,355; Forecast = VND 39,472,414,911. P&L page renders the corresponding actual/budget/forecast table. Exact Excel v2 tie-out and OPEX grain sign-off remain open. | `POWER_BI_NATIVE_PBIX_PL_VARIANCE_2026-08-31.png`; source-contract output |
| QA-03 | OBSERVED_PARTIAL | Source Gross Profit = VND 18,158,948,070 (= Net Revenue − COGS); P&L page renders Gross Profit and Gross Margin 48.0%. Excel tie-out sign-off remains open. | `POWER_BI_NATIVE_PBIX_PL_VARIANCE_2026-08-31.png` |
| QA-04 | OBSERVED_PARTIAL | Source Contribution Margin = VND 14,722,398,874; Channel/Customer page renders channel bars and customer contribution table. Formal residual/tie-out reviewer check remains open. | `POWER_BI_NATIVE_PBIX_CHANNEL_CUSTOMER_2026-08-31.png` |
| QA-05 | STATIC_PASS + NATIVE_RENDER | Negative net-sales/units/COGS rows = 0 in the 6,480-row source; native report renders the source-backed model. | 78/78 input contract; page captures |
| QA-06 | STATIC_PASS + NATIVE_RENDER | Discount + returns bound violations = 0 in the source; row-level visual sign-off remains open. | Source calculation; page captures |
| QA-09 | OBSERVED_PARTIAL | PVM page renders Price Impact, Volume Impact, Mix Other Impact and `Units Total`; baseline units total is 1,256,859. The controlled refresh proof changed it to 1,256,860 after a one-cell CSV edit. | `POWER_BI_NATIVE_PBIX_PVM_BRIDGE_2026-08-31.png`; native Desktop QA record |
| QA-11 | OBSERVED_PARTIAL | Working Capital page visibly renders DSO 32.3, DIO 177.1, DPO 188.6 and CCC 20.8; CCC is modelled as DSO + DIO − DPO. CAPEX separation still needs reviewer sign-off. | `POWER_BI_NATIVE_PBIX_WORKING_CAPITAL_2026-08-31.png` |
| QA-17 | OBSERVED | Controls page visibly renders Sales Rows 6,480, Product Rows 36, Customer Rows 24, refresh timestamp and CTRL-01…CTRL-05. CTRL-05 is correctly OPEN for DirectQuery architecture. | `POWER_BI_NATIVE_PBIX_CONTROLS_2026-08-31.png` |

## Still pending before formal release

| ID | Why it remains pending |
|---|---|
| QA-07 | Scenario isolation requires an observed Base/Upside/Downside interaction run. |
| QA-08 | Waterfall/component tie-out and OPEX variance need a reviewer observation. |
| QA-10 | Below-hurdle flag interaction needs an observed channel drill. |
| QA-12–QA-16 | The current compact PBIP model does not include the full peer/evidence-layer tables required by these rows; do not infer them from the separate CSV QA. |
| QA-18 | The five-minute executive walkthrough needs an independent reviewer/timestamp. |

The formal release rule therefore remains **PENDING**, even though the native
artifact itself has passed open/refresh/save/reopen and all six page captures
are available.
