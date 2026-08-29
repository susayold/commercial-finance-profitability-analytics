# KPI Dictionary — Commercial Finance v2

All operating amounts are synthetic VND unless stated otherwise. Peer benchmark amounts are reported VND bn. Every KPI should expose the period, unit, evidence class and source on the output page.

| KPI | Definition / formula | Unit | Cadence | Valid dimensions | Owner / use | Caveat |
|---|---|---:|---|---|---|---|
| Gross Sales | Sum of invoice gross sales before deductions | VND | Monthly | Brand, SKU, customer, channel, region | Commercial Finance | Not the P&L revenue line |
| Net Sales | Gross Sales − discounts − returns − rebates | VND | Monthly | Same as above | CFO / FP&A | Sign convention is positive revenue |
| Revenue Growth | (Current Net Sales / comparison Net Sales) − 1 | % | Monthly / YTD | Company and drill-downs | FP&A | Align period completeness |
| Gross Profit | Net Sales − COGS | VND | Monthly | Company and drill-downs | Finance | COGS must use the same grain |
| Gross Margin % | Gross Profit / Net Sales | % | Monthly | Company and drill-downs | CFO | Use weighted ratio, not average of SKU margins |
| Contribution Profit | Gross Profit − trade spend − platform fees − fulfilment − variable selling costs | VND | Monthly | Brand, SKU, customer, channel | Commercial Finance | Shared fixed costs excluded |
| Contribution Margin % | Contribution Profit / Net Sales | % | Monthly | Same as above | Commercial Director | Compare with channel hurdle |
| Operating Profit | Contribution Profit − marketing − allocated commercial OPEX | VND | Monthly | Company and allocated views | CFO | Allocation policy must be disclosed |
| ASP / Price Realization | Net Sales / units (or comparable price basis) | VND / unit | Monthly | SKU, brand, channel | Pricing | Exclude zero-volume rows |
| Discount Rate | Discounts / Gross Sales | % | Monthly | Customer, channel, SKU | Trade Finance | Keep rebates separate |
| Return Rate | Returns / Gross Sales | % | Monthly | Customer, channel, SKU | Commercial Ops | Returns may be lagged |
| Trade Spend % | Trade Spend / Net Sales | % | Monthly | Brand, channel, customer | Commercial Finance | Denominator is Net Sales |
| Contribution / Unit | Contribution Profit / units | VND / unit | Monthly | SKU, channel | Pricing / portfolio | Sensitive to mix |
| Budget Variance | Actual − Budget | VND | Monthly / YTD | Company and drill-downs | FP&A | Define favorable direction by line |
| Forecast Variance | Actual − Latest Forecast | VND | Monthly | Company and drill-downs | FP&A | Compare only after actuals close |
| Forecast Bias | Sum(Forecast − Actual) / Sum(Actual) | % | Version review | Brand, channel | FP&A | Sign indicates systematic over/under-forecast |
| WAPE | Sum(abs(Forecast − Actual)) / Sum(abs(Actual)) | % | Version review | Brand, channel | FP&A | Do not use future actuals |
| DSO | Average AR / Net Sales × 365 / 12 | Days | Monthly | Customer, channel | Treasury / FP&A | Monthly denominator convention |
| DIO | Average Inventory / COGS × 365 / 12 | Days | Monthly | SKU, region | Supply Finance | COGS must be positive and comparable |
| DPO | Average AP / COGS × 365 / 12 | Days | Monthly | Supplier / company | Treasury | Payment terms may differ from DPO |
| Cash Conversion Cycle | DSO + DIO − DPO | Days | Monthly | Company / channel proxy | CFO | Proxy when detailed cash ledger is absent |
| Promotion ROI | Incremental Contribution / Trade Spend | x | Campaign | Promotion, channel, SKU | Commercial Finance | Incrementality and cannibalization are modeled |
| Peer Evidence Coverage | Approved peer rows / total peer rows | % | Refresh | Ticker, fiscal year | Reviewer | Approved statuses only |

## Calculation standards

- Ratios use aggregated numerators and denominators.
- Displayed variances retain the source sign; favorable/unfavorable labels are a separate presentation layer.
- Zero denominators return blank rather than a fabricated zero.
- Synthetic, observed, derived and assumption labels remain visible in report metadata.
