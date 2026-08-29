# Power BI build specification — VietNova FP&A

## Audience and decisions

The report is for a Finance Manager or Commercial Director deciding where to recover revenue, margin and cash. It must answer three questions in under two minutes:

1. Are we above or below the selected budget/scenario?
2. Which channel, SKU or customer explains the gap?
3. What cash or commercial action should happen next?

## Semantic model

### Fact tables

- FactSales: date, SKU, customer, channel, units, gross sales, discount, net revenue, COGS.
- FactCommercialCost: date, channel, promotion, trade spend, channel fee, marketing allocation.
- FactBudget: month, scenario, revenue budget, COGS budget, opex budget.
- FactWorkingCapital: month, AR, inventory, AP, DSO, DIO and DPO.

### Dimensions

- DimDate: date, month, fiscal year, fiscal quarter, month number, year-month sort key.
- DimProduct: SKU, category, pack, list price, standard cost.
- DimCustomer: customer, segment, region.
- DimChannel: channel, channel group, fee rate, payment terms.
- DimScenario: Base, Upside, Downside, Latest Estimate.

## Required measures

- Net Revenue; Revenue Budget; Revenue Variance; Revenue Variance %.
- Gross Profit; Gross Margin %.
- Channel Fee; Trade Spend; Contribution Margin; Contribution Margin %.
- Opex Proxy; EBITDA Proxy; EBITDA Margin %.
- AR; Inventory; AP; DSO; DIO; DPO; CCC.
- Mix %, Price/Mix/Volume bridge components.
- Rolling 3-month revenue and rolling 12-month contribution margin.

## Report pages

1. Executive: KPI cards, actual-vs-budget line, variance waterfall and action callouts.
2. Revenue bridge: price/volume/mix decomposition with month and channel slicers.
3. Channel profitability: contribution margin matrix, scatter plot of growth vs CM %, decision quadrant.
4. Working capital: CCC trend, AR aging proxy, inventory coverage and cash-release actions.
5. Forecast and scenarios: Base/Upside/Downside with sensitivity table.
6. Audit: source status, refresh date, model checks, synthetic/public evidence labels.

## Interaction and UX rules

- Slicers: fiscal year, month, scenario, channel, category, region.
- Every visual must respond to the same page-level filters.
- Use a consistent sign convention: positive variance is favourable only where explicitly labelled.
- Show VND million on management pages and retain full-VND detail in drill-through.
- Add tooltips for metric definitions and evidence class.

## Validation gates

- Totals reconcile to the Excel model for all twelve core KPIs.
- Scenario selector changes forecast and all dependent visuals.
- No visual displays a formula error or blank due to an unhandled zero denominator.
- Drill-through from channel to SKU/customer preserves filter context.
- Audit page shows model status PASS before publication.

