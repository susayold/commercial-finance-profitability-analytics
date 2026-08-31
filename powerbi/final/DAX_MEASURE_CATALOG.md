# DAX measure catalog

All measures live on the `Sales` measure table in the PBIP model. They are explicit measures rather than implicit visual aggregations, so a reviewer can trace every KPI and replace an input file without redesigning the report.

## Management / P&L

`Management Message`, `Gross Sales`, `Discounts`, `Returns`, `Net Revenue`, `Units Corrected`, `COGS`, `Gross Profit`, `Gross Margin %`, `Operating Profit`, `ASP`.

## Comparison / revenue bridge

`Budget Revenue`, `Latest Estimate Revenue`, `Prior Year Revenue`, `Revenue vs Budget`, `Revenue vs Budget %`, `Revenue vs LE`, `Revenue vs LE %`, `Revenue Growth %`, `Gross-to-Net %`, `Price Effect`, `Volume Effect`, `Mix Effect`, `PVM Residual`.

`Price Effect` explicitly filters `Component = "PRICE"`; `Mix Effect` explicitly filters `MIX_RESIDUAL`; the residual measure is visible on the PVM page and in Controls.

## Commercial profitability

`Channel Fees`, `Trade Spend`, `Variable Fulfilment`, `Contribution Profit`, `Contribution Margin %`, `Contribution After WC`, `Promotion Spend`, `Incremental Contribution`, `Promotion ROI`, `Budget Reallocated`, `Expected CM Uplift`, `Pricing Contribution Delta`.

## Working capital / liquidity

`AR Closing`, `Inventory Closing`, `AP Closing`, `Net Credit Sales`, `COGS Flow`, `Purchases`, `Days In Selected Period`, `DSO`, `DIO`, `DPO`, `CCC`, `Average AR LTM`, `Average Inventory LTM`, `Average AP LTM`, `DSO LTM`, `Cash Release Opportunity`, `Debt Balance`, `Liquidity Headroom`.

The balance measures use monthly closing snapshots. `DSO`, `DIO` and `DPO` use the selected-period day denominator; LTM balances use `AVERAGEX` over available month snapshots. `Contribution After WC` is an explicit receivables carrying-cost proxy and is labelled as such in the model documentation.

## Forecast / scenario

`Selected Scenario`, `Scenario Revenue`, `Scenario COGS`, `Scenario Operating Profit`, `Scenario CM %`, `Scenario CCC`, `Scenario Liquidity Headroom`, `Forecast Bias Eligible`, `WAPE Eligible`, `Forecast Governance Banner`.

Actual, Budget, Latest Estimate, Base, Upside and Downside are selected through the scenario dimension; forecast eligibility/status is carried in `Dim_Forecast_Version` and `Fact_Forecast`.

## OPEX / CAPEX

`OPEX Actual`, `OPEX Budget`, `OPEX Forecast`, `OPEX vs Budget`, `Average Headcount`, `CAPEX Actual`, `CAPEX Committed`, `CAPEX Payback`.

## Public / strategic subject areas

`Public Evidence Banner`, `Public Revenue`, `Public PAT Margin`, `Public CFO Conversion`, `Strategic Evidence Banner`, `Base EV`, `Upside EV`, `Downside EV`, `WACC`, `Terminal Growth`.

Public measures only read public facts. EV measures are sensitivity outputs in VND bn and carry the `EV_ONLY_NO_EQUITY_VALUE_OR_PRICE_TARGET` boundary.

## QA / metadata

`Data Version`, `Source File Count`, `Evidence Coverage %`, `QA Pass Rate`, `Revenue Tie`, `COGS Tie`.

The full expressions, folders and format strings are machine-readable in `VNFinance_Commercial_Finance_FINAL.SemanticModel/definition/tables/Sales.tmdl`.
