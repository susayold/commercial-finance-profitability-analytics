# Native PBIX page-capture index — 2026-08-31

These screenshots were captured from the checked-in native PBIX in Power BI
Desktop `2.157.879.0 (26.08)` after selecting each report page through the
Desktop UI. They are visual evidence for review, not a substitute for the
full QA-01–QA-18 sign-off log.

| Page | Screenshot | Directly visible observations |
|---|---|---|
| Executive Output | [PNG](evidence/POWER_BI_NATIVE_PBIX_EXECUTIVE_OUTPUT_2026-08-31.png) | Net Revenue, Contribution Margin %, Revenue vs Budget %, CCC and customer contribution table are rendered. |
| P&L and Variance | [PNG](evidence/POWER_BI_NATIVE_PBIX_PL_VARIANCE_2026-08-31.png) | Gross Profit, Gross Margin %, Revenue vs Forecast %, Trade Spend and actual/budget/forecast table are rendered. |
| PVM Bridge | [PNG](evidence/POWER_BI_NATIVE_PBIX_PVM_BRIDGE_2026-08-31.png) | Price, Volume and Mix cards plus the `Units Total` table are rendered; baseline total is 1,256,859 units. |
| Channel and Customer Profitability | [PNG](evidence/POWER_BI_NATIVE_PBIX_CHANNEL_CUSTOMER_2026-08-31.png) | Channel/segment contribution bars and customer revenue, contribution and margin table are rendered. |
| Working Capital and Liquidity | [PNG](evidence/POWER_BI_NATIVE_PBIX_WORKING_CAPITAL_2026-08-31.png) | DSO 32.3, DIO 177.1, DPO 188.6, CCC 20.8 and AR/inventory/AP/debt visuals are rendered. |
| Controls and Evidence | [PNG](evidence/POWER_BI_NATIVE_PBIX_CONTROLS_2026-08-31.png) | Sales Rows 6,480, Product Rows 36, Customer Rows 24, refresh timestamp and CTRL-01…CTRL-05 table are rendered; CTRL-05 remains OPEN for DirectQuery architecture. |

## Interpretation

The page captures demonstrate that the native PBIX renders the intended six-
page finance flow after refresh. They support the observed native workflow and
help a reviewer inspect the report quickly. They do not by themselves prove
Excel tie-outs, scenario isolation across all filters, peer evidence gating,
or production DirectQuery/APR behaviour; those controls remain explicitly
separate in `powerbi/QA_TEST_MATRIX.md` and the release record.
