# Rolling Forecast Methodology

## Forecast architecture

The model uses a 12-month rolling horizon. Each forecast version is frozen with:

- Version ID and creation date
- Target fiscal month
- Brand / SKU / channel grain
- Volume driver
- Price realization driver
- Discount, return and rebate rates
- Unit COGS
- Variable commercial cost rates
- Marketing and OPEX assumptions
- Confidence low / high bounds
- Evidence class: ASSUMPTION

The forecast is built from drivers rather than a top-down growth plug:

Volume × Price = Gross Sales
− discounts − returns − rebates = Net Sales
− unit COGS × volume = Gross Profit
− trade spend − platform fees − fulfilment = Contribution Profit
− marketing − allocated OPEX = Operating Profit

## Version control

A frozen version cannot be overwritten. A refresh creates a new version and retains the prior version for backtesting. Actuals are loaded only for periods that have closed. Forecast accuracy is measured after the target month becomes available.

## Accuracy metrics

- Bias = Sum(Forecast − Actual) / Sum(Actual). Positive values indicate over-forecasting.
- WAPE = Sum(abs(Forecast − Actual)) / Sum(abs(Actual)).
- Report both company-level and brand/channel views.
- Do not average percentage errors across small groups without weighting.

## Scenario separation

Base forecast assumptions are separate from scenario assumptions. Base, Growth/Premium Mix, Margin Pressure and Downside cases change explicit drivers only. Actuals must remain invariant when a scenario slicer changes.

## Controls

- No future-period leakage.
- Every target month has one active latest version.
- Forecast and actual grains reconcile to the Commercial P&L.
- Confidence bands are labelled as modeled ranges, not statistical certainty.
- Forecast errors are explained by volume, price, mix, cost and commercial-spend drivers.

## Management use

The forecast is a decision instrument. A weak forecast is not hidden: its bias, WAPE and largest error drivers appear on the forecast page and in the CFO memo.
