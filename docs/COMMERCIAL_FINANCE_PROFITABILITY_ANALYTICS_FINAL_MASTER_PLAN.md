# COMMERCIAL FINANCE & PROFITABILITY ANALYTICS — FINAL MASTER PLAN
## Vietnam Omnichannel Consumer / FMCG Case
### Recruiter-Ready Corporate Financial Analyst / FP&A / Commercial Finance Portfolio Project

---

# 0. Final Design Decision

## 0.1 Career targets

This project is designed primarily for:

- Junior FP&A Analyst
- Financial Analyst
- Business Finance Analyst
- Commercial Finance Analyst
- Finance Business Partner Analyst
- Corporate Financial Analyst

Secondary relevance:

- Pricing / Revenue Analyst
- Commercial Planning Analyst
- Strategic Finance Analyst
- Corporate Finance Analyst

## 0.2 Project title

**Commercial Finance & Profitability Analytics**

Recommended subtitle:

> **Driver-based performance analysis, rolling forecasting, profitability optimization and commercial decision support for a Vietnam omnichannel consumer company.**

## 0.3 Role simulation

Assume the role of a **Commercial Finance Analyst / FP&A Analyst** supporting the CFO and Commercial Director of a fictional Vietnam-based consumer/FMCG company.

The analyst is responsible for:

- Monthly management reporting.
- Actual vs Budget vs Latest Forecast vs Prior Year analysis.
- Revenue and margin-driver analysis.
- Product, customer and channel profitability.
- Commercial P&L ownership and reconciliation.
- Budget preparation and 12-month rolling forecast.
- Promotion ROI and pricing evaluation.
- Inventory and working-capital analysis.
- Liquidity stress testing.
- Scenario and probabilistic risk analysis.
- Commercial budget reallocation.
- Industry and peer benchmarking.
- Quantified management recommendations.
- Finance Business Partnering with Sales, Marketing, Operations and Supply Chain.

## 0.4 Primary management question

> **How can the company grow revenue while protecting contribution profit, operating profit, working capital and cash quality?**

## 0.5 Recruiter message

The completed project must prove:

> **I can build and control a commercial P&L, understand operational drivers behind financial performance, explain revenue and margin variance, evaluate pricing and promotion economics, forecast future results, stress-test cash and liquidity, allocate resources, and translate financial analysis into quantified management actions.**

## 0.6 Core principle

The project is a **finance project first**.

Priority order:

> **Financial reasoning → Excel model → management decision → Power BI communication → Python support**

Excel and financial logic are the core.

Power BI and Power Query support reporting.

Python may be used for:

- Reproducible synthetic data generation.
- Monte Carlo simulation.
- QA automation.
- Selected analytical calculations that are cumbersome in Excel.

SQL is optional and should be used only if it materially improves reproducibility or query logic.

## 0.7 Explicitly out of scope

The project is not intended to demonstrate:

- Production-scale data engineering.
- Cloud architecture.
- Machine learning for its own sake.
- Real-time analytics.
- Complex software engineering.
- A generic sales dashboard.
- Real impact at an actual company.
- Unsupported causal claims from synthetic or observational data.

---

# 1. Scope Discipline — What Is Core vs Conditional

The project must remain deep rather than bloated.

## 1.1 Mandatory core

The following are **required**:

1. Commercial P&L.
2. Actual vs Budget vs Forecast vs Prior Year.
3. Price–Volume–Mix and margin bridge.
4. Product/SKU profitability.
5. Customer profitability.
6. Channel profitability.
7. 12-month rolling forecast.
8. Promotion ROI.
9. Pricing Simulator.
10. Inventory and working-capital analysis.
11. Cash Conversion Cycle.
12. Liquidity / revolver stress testing.
13. Scenario and sensitivity analysis.
14. Monte Carlo risk overlay.
15. Commercial budget reallocation.
16. Industry / peer benchmark.
17. Management recommendations with quantified impact.
18. Finance Business Partnering battle cards.
19. Recruiter-first website / quick tour.
20. Hidden business truth validation.

## 1.2 Conditional operational-driver modules

Some metrics are powerful but only if the business model supports them.

### Same-Store Sales Growth (SSSG)
Use only if the final company design includes a meaningful owned retail-store network.

Definition:

> Revenue growth from comparable stores that have been operating for at least the defined comparable-store period.

Do **not** force SSSG into a pure FMCG manufacturer/distributor with no owned stores.

### Sales per Square Meter

Use only for owned physical retail locations where:

- Store floor area is available.
- Store revenue can be mapped to location.
- Comparable store definitions are stable.

### CAC and LTV

Use only for:

- Direct-to-Consumer digital channel.
- Membership / loyalty program.
- App or website customer acquisition.

Do not calculate CAC/LTV for wholesale or general-trade customers using consumer definitions.

### Inventory Shrinkage / Wastage

Use where physical inventory loss is economically relevant.

This can be retained as a core operational metric for retail, food, beverage or perishable consumer products.

## 1.3 Optional strategic stretch

The following is valuable but **must not delay the core project**:

### Buy vs Build / M&A Accretion–Dilution Case

Only begin after the entire Commercial Finance core is recruiter-ready.

Purpose:

> Demonstrate Corporate Finance / strategic capital-allocation capability without turning the project into a separate M&A portfolio.

---

# 2. Business Case Design

## 2.1 Fictional company

Create a fictional Vietnam-based omnichannel consumer company.

Working name:

**VietNova Consumer JSC**

The name may be changed before publication.

Recommended business model:

- Branded packaged beverages and healthy snacks.
- National FMCG distribution.
- General Trade and Modern Trade.
- E-commerce marketplaces.
- Direct-to-Consumer channel.
- A limited owned retail / experience-store network **only if the project chooses to activate SSSG and Sales/m²**.

## 2.2 Recommended operating profile

| Dimension | Scope |
|---|---:|
| Historical period | 36 months |
| Budget period | 12 months |
| Forecast horizon | Rolling 12 months |
| Brands | 3 |
| SKUs | 30–40 |
| Channels | 5 |
| Regions | 6 |
| Key customers/accounts | 50–100 |
| Promotions | 20–30 |
| Transaction lines | 50,000–150,000 |
| Retail locations | Optional; only if store-driver module activated |
| Forecast versions | Monthly frozen versions |
| Monte Carlo runs | Minimum 1,000; recommended 5,000 for stable percentiles |

The project should remain small enough to audit manually but rich enough to support realistic finance decisions.

## 2.3 Suggested brands

### NovaActive
Premium functional beverages.

### NovaDaily
Mass-market drinks.

### NovaBite
Healthy snacks.

Each brand should contain:

- Core SKUs.
- Premium SKUs.
- New-product launches.
- Slow-moving SKUs.
- At least one strategic loss leader.
- At least one SKU with strong revenue but weak contribution economics.
- At least one SKU with high margin but poor inventory quality.

## 2.4 Sales channels

1. General Trade.
2. Modern Trade.
3. E-commerce Marketplace.
4. Direct-to-Consumer.
5. Wholesale / Distributor.

### Channel economics

| Channel | Commercial characteristics |
|---|---|
| General Trade | Distributor margin, broad coverage, moderate logistics cost |
| Modern Trade | Listing fees, rebates, promotion support, longer payment terms |
| Marketplace | Platform fees, vouchers, advertising, returns, fulfillment costs |
| D2C | Higher gross margin potential, higher marketing / delivery cost, customer-level data |
| Wholesale | High volume, low margin, concentration and receivable exposure |

## 2.5 Regions

Recommended:

- Ho Chi Minh City.
- Southeast.
- Mekong Delta.
- Hanoi.
- Northern provinces.
- Central Vietnam.

## 2.6 Embedded business events

Synthetic historical data must contain deliberate business mechanisms.

### Event A — Input-cost inflation

- Raw-material cost increases by 10–12%.
- Shock begins in a known quarter.
- Premium products have better cost pass-through.
- Mass-market products experience more margin compression.

### Event B — Marketplace growth

- Marketplace volume grows 25–35%.
- Voucher, platform and fulfillment costs also rise.
- Revenue grows faster than contribution profit.

### Event C — Promotion underperformance

- One large campaign drives volume but weak/negative incremental contribution.
- A smaller targeted campaign produces higher ROI.

### Event D — Customer economics problem

- One key account has high revenue.
- Rebates, commercial support and long payment terms reduce economic value.

### Event E — Product-mix shift

- Mass-market mix expands in one period and dilutes margin.
- Premium mix later improves.

### Event F — Slow-moving inventory

- Selected SKUs accumulate inventory.
- Markdown, bundle, channel shift or rationalization becomes necessary.

### Event G — Working-capital shock

- One customer group extends collection timing.
- DSO increases.
- Short-term cash pressure rises.
- Revolver utilization increases.

### Event H — Marketing efficiency deterioration

- Digital CAC rises.
- Conversion rate does not improve proportionally.
- Marketing asks for additional budget despite deteriorating unit economics.

### Event I — Forecast miss

- A forecast version materially misses actual results due to one or more incorrect drivers.
- The project must identify whether the miss is caused by volume, price, mix, cost or timing assumptions.

---

# 3. Evidence, Claim Governance & Hidden Truth

## 3.1 Evidence labels

Every material data point or claim must receive one of four labels.

| Label | Meaning |
|---|---|
| OBSERVED | Traceable public external information |
| SIMULATED | Fictional internal company data |
| DERIVED | Output calculated from observed or simulated inputs |
| ASSUMPTION | Judgment used in forecast, scenario or recommendation |

## 3.2 Writing standards

Do not:

- Claim real company impact.
- Imply synthetic data belongs to an actual company.
- Describe modeled relationships as proven causal effects.
- Present scenario output as realized outcome.
- Present peer definitions as perfectly comparable when they are not.

Acceptable:

> Scenario analysis indicates a simulated VND 2.4bn annual contribution-profit uplift, assuming the modeled price response and cost structure hold.

Unacceptable:

> Increased company profit by VND 2.4bn.

## 3.3 Hidden business truth

Maintain a **private validation register** that contains:

- Event name.
- Effective date.
- Affected products.
- Affected customers.
- Affected channels.
- True modeled mechanism.
- Expected KPI impact.
- Expected financial impact.
- Expected analysis conclusion.

The analytical process must attempt to recover these drivers **without reading the hidden-truth register**.

## 3.4 Why hidden truth matters

This turns synthetic data into a controlled business simulation.

It allows validation of:

- PVM decomposition.
- Profitability diagnosis.
- Promotion analysis.
- Forecast-driver identification.
- Working-capital diagnosis.
- Management recommendation quality.

---

# 4. Commercial P&L Model

## 4.1 Required P&L

```text
Gross Sales
– Invoice Discounts
– Returns
– Customer Rebates
= Net Sales

– COGS
= Gross Profit

– Trade Spend
– Marketplace Fees
– Variable Distribution / Fulfillment
– Other Variable Selling Costs
= Contribution Profit

– Brand Marketing
– Allocated Commercial Operating Expenses
= Commercial Operating Profit
```

## 4.2 Sign convention

Use one consistent convention:

- Revenue and profit displayed as positive.
- Costs and deductions displayed as negative.
- Source inputs may store costs as positive values, but presentation signs must be consistent.
- Favorable/unfavorable variance definitions must be documented.
- No hidden sign flips.

## 4.3 Required P&L views

The P&L must be available by:

- Company.
- Brand.
- SKU.
- Customer.
- Channel.
- Region.
- Month.
- Quarter.
- YTD.

Every lower-level view must reconcile to the company total after documented allocations.

---

# 5. KPI & Operational Driver Framework

# 5.1 Financial outcome KPIs

- Net Sales.
- Gross Profit.
- Gross Margin %.
- Contribution Profit.
- Contribution Margin %.
- Commercial Operating Profit.
- Commercial Operating Margin %.
- EBITDA where defined consistently.
- Operating Cash Flow proxy where relevant.

# 5.2 Revenue drivers

- Sales Volume.
- Average Selling Price.
- Price Realization.
- Product Mix.
- Channel Mix.
- Discount Rate.
- Return Rate.
- Revenue Growth.
- Revenue per Active Customer.
- Revenue per Active Outlet where applicable.

# 5.3 Cost and profitability drivers

- Unit COGS.
- COGS Inflation.
- Trade Spend / Net Sales.
- Fulfillment Cost per Unit.
- Marketplace Fee / Marketplace Revenue.
- Marketing / Net Sales.
- Contribution per Unit.
- Contribution per Customer.
- Contribution per Channel.
- Contribution per SKU.

# 5.4 Operational drivers — mandatory where applicable

### Inventory

- Inventory Turnover.
- Days Inventory Outstanding.
- Sell-through Rate.
- Slow-moving Inventory Value.
- Aging.
- Shrinkage Rate.
- Wastage Rate.
- Markdown Exposure.
- Cash tied in inventory.

### Customer / channel

- Average Order Value.
- Orders per Customer.
- Revenue per Active Customer.
- Rebate Intensity.
- Return Rate.
- Payment Terms.
- Collection Delay.
- Contribution per Customer.

### D2C / membership

- Customer Acquisition Cost.
- Repeat Purchase Rate.
- Retention Rate.
- Contribution LTV.
- LTV / CAC.
- Payback Period.

### Owned retail stores — conditional

- Same-Store Sales Growth.
- Sales per Square Meter.
- Revenue per Store.
- Contribution per Store.
- Store maturity curve.
- New-store vs mature-store economics.

# 5.5 Planning KPIs

- Actual vs Budget variance.
- Actual vs Latest Forecast variance.
- Actual vs Prior Year variance.
- Forecast Accuracy.
- Forecast Bias.
- WAPE — Weighted Absolute Percentage Error.
- Forecast revision magnitude.
- Risk / Opportunity gap.

# 5.6 Working-capital KPIs

- DIO — Days Inventory Outstanding.
- DSO — Days Sales Outstanding.
- DPO — Days Payable Outstanding.
- CCC — Cash Conversion Cycle.
- Accounts Receivable.
- Accounts Payable.
- Inventory.
- Net Working Capital.
- Cash tied in working capital.
- Revolver utilization.
- Minimum liquidity headroom.

### CCC formula

```text
CCC = DIO + DSO – DPO
```

# 5.7 Debt / liquidity KPIs

Use metrics only if the debt structure supports them.

- Revolver Draw.
- Revolver Headroom.
- Minimum Cash.
- Net Debt / EBITDA.
- Interest Coverage.
- Debt Service.
- DSCR where a scheduled debt-service structure exists.

### Preferred DSCR definition

Do not use a universal shortcut.

Where term debt exists:

```text
CFADS
=
EBITDA
– Cash Taxes
– Maintenance CapEx
– Increase in Working Capital
± Other documented operating cash adjustments
```

```text
DSCR
=
CFADS
÷
(Interest + Scheduled Principal)
```

For ordinary corporate revolving facilities, emphasize:

- Liquidity headroom.
- Revolver utilization.
- Interest coverage.
- Net Debt / EBITDA.

rather than forcing a project-finance DSCR framework.

# 5.8 KPI dictionary

Every KPI must document:

- Business name.
- Formula.
- Unit.
- Frequency.
- Valid dimensions.
- Source.
- Sign convention.
- Owner / audience.
- Interpretation.
- Caveats.
- Applicability conditions.

---

# 6. Required Analytical Modules

# Module A — Monthly Performance Reporting

## Purpose

Create the monthly management-finance view.

## Comparisons

- Actual vs Budget.
- Actual vs Latest Forecast.
- Actual vs Prior Year.
- MTD.
- QTD.
- YTD.

## Required outputs

- Summary Commercial P&L.
- Variance table.
- Trend charts.
- Risks and opportunities.
- Management commentary.

## Questions

1. Are Net Sales, Gross Profit and Operating Profit on plan?
2. Is growth converting into profit?
3. Which P&L lines explain the miss?
4. Is the variance temporary or structural?
5. Which management actions are required now?

---

# Module B — Price–Volume–Mix & Margin Bridge

## Purpose

Explain revenue and profit movement through business drivers.

## Required effects

- Volume.
- Price.
- Product Mix.
- Channel Mix.
- Discount.
- Returns.
- Unit Cost.
- Optional new/discontinued product effect.

## Control

```text
Sum of defined effects + labeled residual
=
Actual – Comparison Base
```

Residual should be zero or immaterial.

Any material residual must be explained.

## Documentation

Define:

- Comparison base.
- Calculation order.
- New SKU treatment.
- Discontinued SKU treatment.
- Zero-volume periods.
- Discount treatment.
- Aggregation level.
- Mix methodology.

---

# Module C — Product & SKU Profitability

## Required outputs

- Product P&L.
- Contribution ranking.
- Growth-margin matrix.
- Margin-dilutive SKU list.
- Product-rationalization candidates.
- Inventory-quality overlay.

## Classification

- Invest.
- Protect / Harvest.
- Fix Economics.
- Review / Rationalize.
- Strategic Loss Leader.

## Questions

- Which SKUs create incremental contribution?
- Which high-revenue SKUs dilute profit?
- Which SKUs should be repriced?
- Which SKUs consume promotion budget without sufficient return?
- Which high-margin SKUs trap too much working capital?

---

# Module D — Channel Profitability

## Channel P&L

```text
Net Sales
– COGS
– Channel Discounts
– Platform / Listing Fees
– Fulfillment / Distribution
– Channel Marketing
= Channel Contribution
```

## Questions

- Is e-commerce growth financially attractive?
- Which channel converts revenue into contribution most efficiently?
- Which costs grow faster than channel sales?
- Which channel should receive incremental budget?
- Which terms should be renegotiated?

---

# Module E — Customer Profitability

## Customer P&L

```text
Gross Sales
– Discounts
– Rebates
– Returns
– COGS
– Delivery / Customer Support
= Customer Contribution
```

## Supporting indicators

- Revenue concentration.
- Contribution concentration.
- Rebate intensity.
- Payment terms.
- Collection-delay proxy.
- DSO by customer group.
- Contribution after working-capital cost proxy where feasible.

## Questions

- Which customers create the most economic value?
- Which customers have high revenue but weak contribution?
- Which customer contracts should be renegotiated?
- Which customers create working-capital pressure?

---

# Module F — Operational Driver & Unit Economics Layer

## Purpose

Move beyond accounting outputs and explain how operations create financial outcomes.

## Core operational tree

Example:

```text
Revenue
=
Active Customers / Outlets
× Transaction / Order Frequency
× Units per Order
× Net Price
```

```text
Contribution Profit
=
Revenue
– Product Cost
– Commercial Investment
– Fulfillment / Distribution
– Variable Selling Cost
```

## Conditional Retail Store Tree

If owned stores are activated:

```text
Store Revenue
=
Store Count
× Sales per m²
× Selling Area
```

Analyze:

- Same-Store Sales Growth.
- New-store contribution.
- Mature-store productivity.
- Sales / m².
- Contribution / m².
- Store payback.

## D2C Unit Economics

If D2C customer data exists:

```text
CAC
=
Acquisition Spend
÷
New Customers Acquired
```

Prefer **contribution LTV**, not revenue-only LTV.

Document:

- Retention assumptions.
- Gross/contribution margin.
- Repeat-purchase behavior.
- Time horizon.
- Discounting if used.

## Shrinkage / Wastage

Track:

```text
Shrinkage Rate
=
Unexplained Inventory Loss
÷
Inventory Available
```

and/or:

```text
Wastage Rate
=
Write-off / Expired Inventory
÷
Inventory Available
```

Quantify direct gross-margin impact.

---

# Module G — Promotion ROI — REQUIRED

Promotion ROI is not optional.

## Pre-evaluation

Before campaign approval estimate:

- Base volume.
- Incremental volume.
- Discount cost.
- Trade spend.
- Campaign cost.
- Cannibalization.
- Incremental contribution.
- Expected ROI.
- Break-even uplift.

## Post-evaluation

After campaign:

- Actual volume.
- Estimated incremental sales.
- Actual commercial spend.
- Estimated incremental contribution.
- Cannibalization.
- Actual vs expected ROI.

## Core formula

```text
Estimated Incremental Contribution
=
Incremental Revenue
– Incremental COGS
– Discount Cost
– Campaign Cost
– Estimated Cannibalization
```

```text
Promotion ROI
=
Estimated Incremental Contribution
÷
Promotion Investment
```

## Claim boundary

Do not call promotion uplift causal unless a credible counterfactual exists.

Use:

- Matched comparison.
- Prior-period baseline.
- Control products.
- Controlled synthetic truth.

and label methodology.

---

# Module H — Pricing Simulator — REQUIRED

## Inputs

- List-price change.
- Net-price realization.
- Volume elasticity assumption.
- Discount change.
- Unit-cost inflation.
- Competitor-price scenario.
- Channel mix.
- Product mix.

## Outputs

- Volume.
- Net Sales.
- Gross Profit.
- Gross Margin.
- Contribution Profit.
- Operating Profit.
- Break-even price increase.
- Required price to protect target margin.

## Questions

- Which SKUs have pricing power?
- Which SKUs are highly elastic?
- What price increase is required to offset raw-material inflation?
- Can discount reduction protect profit without excessive volume loss?
- Where is price realization leaking?

---

# Module I — Budget & 12-Month Rolling Forecast — REQUIRED

## Annual budget

Build from operating drivers.

```text
Volume × Price
– Discounts / Returns
= Net Sales
– Unit COGS × Volume
= Gross Profit
– Commercial Costs
= Contribution Profit
– Marketing / OPEX
= Commercial Operating Profit
```

## Rolling forecast mechanism

The model must always display the next twelve forecast months.

Example:

At January close:

- January Forecast is replaced by January Actual.
- February–December remain forecast.
- January of the following year is added.
- The visible forecast horizon remains twelve months.

## Forecast versioning

Every month:

- Freeze the prior forecast.
- Create a new forecast version.
- Store creation date.
- Store driver assumptions.
- Compare frozen forecast against later actuals.

## Forecast evaluation

- Bias.
- WAPE.
- Absolute error.
- Error by brand.
- Error by channel.
- Forecast revision magnitude.

No future-data leakage.

---

# Module J — Working Capital & Cash Conversion Cycle — REQUIRED

## Model

```text
CCC = DIO + DSO – DPO
```

Analyze:

- Inventory.
- Accounts Receivable.
- Accounts Payable.
- Net Working Capital.
- Cash tied in operations.
- Working-capital movement vs Budget / Forecast.

## Driver questions

- Is revenue growth consuming excessive cash?
- Which channels lengthen DSO?
- Which SKUs inflate DIO?
- Are supplier terms improving or deteriorating?
- How much cash can be released from working-capital action?

## Working-capital bridge

Build a bridge:

```text
Opening NWC
+ Inventory Movement
+ Receivable Movement
– Payable Movement
± Other
=
Closing NWC
```

Translate the change into cash impact.

---

# Module K — Liquidity & Revolver Stress Test — REQUIRED

## Purpose

Show that strong P&L performance can still create liquidity risk.

## Stress cases

At minimum:

### DSO Stress
DSO +10 days.

### Inventory Stress
DIO +15 days.

### Supplier Pressure
DPO –10 days.

### Combined Downside
- DSO increases.
- DIO increases.
- Gross margin falls.
- Volume slows.

## Outputs

- Incremental working-capital requirement.
- Minimum cash.
- Revolver draw.
- Revolver headroom.
- Interest expense.
- Net Debt / EBITDA.
- Interest Coverage.
- DSCR only if scheduled term debt is modeled.
- Covenant / policy breach flags.

## Management question

> If customers pay later or inventory builds unexpectedly, how much short-term funding is required and when does liquidity become constrained?

---

# Module L — Monte Carlo Probability Simulation — REQUIRED RISK OVERLAY

## Purpose

Move beyond static Base / Bull / Bear cases.

Monte Carlo is a **risk overlay**, not a replacement for the driver-based forecast.

## Driver candidates

Use a limited number of material uncertain drivers:

- Volume growth.
- Price realization.
- Raw-material inflation.
- Discount rate.
- DSO.
- Marketplace fee.
- Product mix.

## Modeling standards

Do not blindly use independent normal distributions.

Document:

- Distribution choice.
- Bounds.
- Mean / median.
- Volatility.
- Correlation assumptions.
- Why the driver distribution is reasonable.

Use correlated drivers where relevant.

Examples:

- Input inflation and gross margin.
- Price increase and volume.
- Revenue growth and working capital.

## Simulations

Minimum:

- 1,000 runs.

Recommended:

- 5,000 runs for more stable percentile estimates.

## Outputs

- P5 / P25 / P50 / P75 / P95 Operating Profit or EBITDA.
- Probability of missing Budget.
- Probability of negative Free Cash Flow / minimum-cash breach.
- Probability of revolver utilization above threshold.
- Probability of covenant/policy breach where applicable.
- Key driver sensitivity.

## Example management statement

> Under the modeled probability distributions and correlations, 80% of simulated annual operating-profit outcomes fall between VND Xbn and VND Ybn. Approximately Z% of simulations require revolver utilization above the internal liquidity threshold.

Do not write probabilistic statements without explicit model assumptions.

---

# Module M — Scenario & Sensitivity Analysis

Monte Carlo does not remove the need for interpretable scenarios.

## Required scenarios

1. Base Case.
2. Growth / Premium Mix.
3. Margin Pressure.
4. Competitive Shock.
5. Downside / Liquidity Pressure.

## Drivers

- Volume.
- Price.
- Discount.
- Product mix.
- Channel mix.
- Unit COGS.
- Marketing.
- Marketplace fees.
- DSO.
- DIO.
- DPO.

## Outputs

- Revenue.
- Gross Profit.
- Gross Margin.
- Contribution Profit.
- Operating Profit.
- Working Capital.
- Minimum Cash.
- Revolver Draw.

---

# Module N — Budget Reallocation — HIGH PRIORITY

## Business question

> Given a fixed commercial budget, where should the company allocate the next VND 1 of spend?

## Inputs

- Promotion ROI.
- Product margin.
- Customer economics.
- Channel economics.
- Inventory availability.
- Expected incremental volume.
- Strategic brand priorities.
- Minimum/maximum spend rules.

## Objective

```text
Maximize Estimated Incremental Contribution Profit
```

subject to:

```text
Old Total Budget = New Total Budget
```

and:

- Minimum channel investment.
- Maximum campaign concentration.
- Inventory capacity.
- Brand commitments.
- Explainability.

## Output

Example:

```text
Marketplace         -2.0bn
Modern Trade        -1.2bn
General Trade       +1.5bn
D2C                 +0.7bn
Premium Brand       +1.0bn
```

Then quantify:

- Revenue impact.
- Contribution-profit impact.
- Cash impact.
- Key risks.

---

# Module O — Industry & Peer Benchmark — REQUIRED

Industry analysis should remain a supporting layer, not become an equity-research project.

## Purpose

Answer:

> Is internal performance strong or weak relative to the external environment?

## Benchmark dimensions

Where publicly comparable:

- Revenue growth.
- Gross Margin.
- Operating Margin.
- SG&A / Revenue.
- Inventory Days.
- Working-capital trend.
- Category growth.
- Input-cost inflation.
- Price movements.
- Distribution / channel trends.
- Market share if verifiable.

## Peer selection

Use 2–4 relevant peers.

For each peer metric document:

- Source.
- Period.
- Accounting basis.
- Currency.
- Scope.
- Comparability caveat.

## Do not

- Force customer-level comparison from public data.
- Compare definitions that are materially different without caveats.
- Turn the section into stock-picking.

---

# Module P — Management Recommendations — REQUIRED

Develop three to five final recommendations.

Possible themes:

- Pricing.
- Promotion redesign.
- Product rationalization.
- Channel investment.
- Customer-contract renegotiation.
- Inventory action.
- Working-capital action.
- Budget reallocation.
- Marketing performance conditions.

Every recommendation must contain:

1. Evidence.
2. Proposed action.
3. Financial mechanism.
4. Estimated impact.
5. Assumptions.
6. Risks.
7. Monitoring KPI.
8. Decision owner.
9. Review date.

---

# 7. Strategic Stretch — Buy vs Build / M&A Accretion–Dilution

This module is **not part of the core Definition of Done**.

Only begin after the Commercial Finance case is complete.

## 7.1 Business question

> To expand by ten retail locations, should the company build organically or acquire a small operating chain?

Activate this module only if the final company design includes an owned retail network.

## 7.2 Organic Build case

Model:

- Lease deposits.
- Fit-out CapEx.
- Initial inventory.
- Store ramp-up.
- Staffing.
- Marketing.
- Sales / m².
- Mature-store margin.
- Working capital.
- Payback.
- NPV.
- IRR.

## 7.3 Acquisition case

Model:

- Purchase price.
- Target EBITDA.
- Synergies.
- Integration cost.
- Financing.
- Working-capital requirements.
- One-off costs.
- Post-deal EBITDA.

## 7.4 Decision metrics

- NPV.
- IRR.
- Payback.
- ROIC.
- EBITDA impact.
- Net Debt / EBITDA.
- EPS Accretion / Dilution where a defensible share-count and financing structure is modeled.

## 7.5 Important boundary

Do not force EPS accretion/dilution into a private-company simulation unless:

- Share count is defined.
- Financing mix is defined.
- Interest expense is modeled.
- Tax is modeled.
- Purchase accounting assumptions are documented.

Otherwise use:

- EBITDA accretion.
- ROIC.
- Cash-on-cash return.
- Leverage impact.

---

# 8. Data & Input Design

## 8.1 Sales transactions

Fields:

- Transaction ID.
- Date.
- Customer.
- SKU.
- Channel.
- Region.
- Quantity.
- List Price.
- Invoice Discount.
- Returns.
- Net Sales.

## 8.2 Product master

- SKU.
- Product.
- Brand.
- Category.
- Launch Date.
- Active / Discontinued status.
- Standard Cost.
- Premium / Core / Strategic flag.

## 8.3 Customer master

- Customer.
- Customer Group.
- Channel.
- Region.
- Payment Terms.
- Strategic Account flag.
- D2C acquisition cohort where applicable.

## 8.4 Commercial costs

- Period.
- Customer / Channel / Brand / SKU.
- Rebate.
- Trade Spend.
- Platform Fee.
- Fulfillment.
- Distribution.
- Marketing.
- Campaign spend.

## 8.5 Budget

- Month.
- Brand / SKU.
- Channel.
- Region.
- Budget Volume.
- Budget Price.
- Budget Net Sales.
- Budget COGS.
- Budget Commercial Costs.
- Budget Operating Profit.

## 8.6 Forecast

- Forecast Version.
- Forecast Creation Date.
- Target Month.
- Brand / SKU.
- Channel.
- Forecast drivers.
- Forecast outputs.

## 8.7 Inventory

- Month.
- SKU.
- Region / location.
- Opening Inventory.
- Purchases.
- Sales.
- Transfers.
- Write-offs.
- Shrinkage.
- Wastage.
- Closing Inventory.
- Inventory Value.
- Aging bucket.

## 8.8 Accounts receivable / payable

### AR
- Customer.
- Invoice Date.
- Due Date.
- Payment Date.
- Invoice Amount.
- Open Balance.

### AP
- Supplier.
- Invoice Date.
- Due Date.
- Payment Date.
- Invoice Amount.
- Open Balance.

## 8.9 Debt / liquidity

- Opening Cash.
- Minimum Cash Policy.
- Revolver Limit.
- Revolver Draw.
- Revolver Rate.
- Term Debt if modeled.
- Scheduled Principal.
- Interest Rate.
- Covenant / internal-policy thresholds.

## 8.10 Marketing / D2C customer data

Where CAC/LTV is activated:

- Campaign.
- Spend.
- New Customers.
- Orders.
- Repeat Orders.
- Customer Cohort.
- Contribution Margin.
- Retention.

## 8.11 Store data — conditional

Where retail module is activated:

- Store ID.
- Opening Date.
- Location.
- Selling Area.
- Monthly Revenue.
- Store Contribution.
- Footfall if simulated.
- Transactions.
- Rent.
- Staff Cost.

---

# 9. Excel Model Specification

Excel is the principal finance deliverable.

## 9.1 Workbook structure

| Sheet | Purpose |
|---|---|
| `00_Control` | Version, period, selected scenario, QA summary |
| `01_Assumptions` | Forecast, pricing, liquidity and scenario assumptions |
| `02_Mappings` | Product, customer, channel and P&L mappings |
| `03_Actuals` | Historical summarized actuals |
| `04_Budget` | Approved budget |
| `05_Forecast` | Rolling 12-month forecast and frozen versions |
| `06_Commercial_P&L` | Actual / Budget / Forecast / PY P&L |
| `07_Variance` | Headline variances and commentary |
| `08_PVM_Bridge` | Price–Volume–Mix and margin bridge |
| `09_Product_P&L` | Product / SKU profitability |
| `10_Customer_P&L` | Customer economics |
| `11_Channel_P&L` | Channel economics |
| `12_Operational_Drivers` | Unit economics and operating KPIs |
| `13_Promotion_ROI` | Pre/post campaign economics |
| `14_Pricing_Simulator` | Price / elasticity / cost scenarios |
| `15_Inventory` | Inventory, aging, shrinkage, wastage |
| `16_Working_Capital` | DIO, DSO, DPO, CCC, NWC bridge |
| `17_Liquidity_Stress` | Cash, revolver, covenant / policy stress |
| `18_Scenarios` | Deterministic scenarios |
| `19_Monte_Carlo` | Probability outputs imported/calculated from Python |
| `20_Budget_Reallocation` | Fixed-budget optimization |
| `21_Recommendations` | Management actions and quantified impact |
| `22_Peer_Benchmark` | External benchmark |
| `23_QA` | Reconciliation and error checks |
| `24_Strategic_Investment` | Optional Buy vs Build / M&A module |

## 9.2 Model standards

- Inputs, formulas and outputs use consistent formatting.
- No unexplained hard-coded outputs.
- Assumptions centralized.
- Every major schedule has a control.
- Units and currency visible.
- Actual / Budget / Forecast clearly distinguished.
- Formula logic flows cleanly.
- Model version and reporting date visible.
- No hidden circular references.
- No indiscriminate `IFERROR`.
- No result pasted from Python without traceable source and reconciliation.
- Python-generated Monte Carlo outputs must reconcile to the same core forecast assumptions.

---

# 10. Power BI Scope

Power BI is the management-view companion to Excel.

Recommended: **6 pages**.

## Page 1 — CFO Executive Summary

- Net Sales.
- Gross Profit / Margin.
- Contribution Profit / Margin.
- Operating Profit.
- Actual vs Budget / Forecast / PY.
- Cash / working-capital headline.
- Top Risk.
- Top Opportunity.
- Key recommended action.

## Page 2 — Revenue & Margin Drivers

- Price.
- Volume.
- Product Mix.
- Channel Mix.
- Discount.
- Returns.
- Cost.

## Page 3 — Profitability & Unit Economics

- Product/SKU profitability.
- Customer profitability.
- Channel profitability.
- Growth-margin matrix.
- Unit economics.
- SSSG / Sales per m² only if activated.

## Page 4 — Promotion, Pricing & Allocation

- Promotion ROI.
- Promotion winners / losers.
- Pricing scenarios.
- Trade-spend efficiency.
- Budget reallocation.

## Page 5 — Forecast & Risk

- Rolling 12-month forecast.
- Actual vs Budget vs Forecast.
- Forecast accuracy.
- Deterministic scenarios.
- Monte Carlo probability ranges.

## Page 6 — Inventory, Working Capital & Liquidity

- DIO.
- DSO.
- DPO.
- CCC.
- Inventory aging.
- Shrinkage / wastage.
- Minimum cash.
- Revolver headroom.
- Stress-test output.

## Dashboard rules

- One management question per page.
- Default view useful before filtering.
- Limited filters.
- Excel and Power BI reconcile.
- Simulated data visibly labeled.
- Chart titles should state the supported finding, not merely the metric name.

---

# 11. Finance Business Partnering & Management Communication

# 11.1 Management deck

Target: **8–10 slides**.

Recommended flow:

1. Executive Summary.
2. Financial Performance.
3. Revenue & Margin Drivers.
4. Product / Channel / Customer Profitability.
5. Promotion & Pricing.
6. Operational Drivers / Unit Economics.
7. Forecast & Risk Distribution.
8. Working Capital / Liquidity.
9. Recommended Actions.
10. Expected Financial Impact & Monitoring.

Every slide follows:

> **What happened → Why → So what → What should management do?**

# 11.2 CFO decision memo

Target: **2–4 pages**.

Sections:

- Executive Summary.
- Performance Against Plan.
- Key Financial and Operational Drivers.
- Risks & Opportunities.
- Working-Capital / Liquidity Position.
- Recommended Actions.
- Estimated Financial Impact.
- Assumptions & Limitations.
- Monitoring Plan.

# 11.3 Departmental Negotiation Battle Cards — REQUIRED

This is a distinct deliverable.

Purpose:

> Demonstrate Finance Business Partnering rather than passive reporting.

Create at least **3 battle cards**.

## Battle Card A — Marketing asks for +15% budget

Evidence:

- Digital CAC +30%.
- Conversion flat.
- Promotion ROI below hurdle.

FP&A position:

> Do not approve unconditional fixed-budget increase.

Alternative:

> Release incremental budget only under a performance-based structure if incremental contribution ROI exceeds the approved hurdle.

Include:

- Finance evidence.
- Business partner likely argument.
- Finance response.
- Compromise option.
- Decision threshold.
- KPI to monitor.
- Escalation trigger.

## Battle Card B — Sales requests deeper customer discount

Analyze:

- Volume upside.
- Net price.
- Rebate.
- Customer contribution.
- Working-capital effect.

Finance recommendation:

- Approve / reject / conditionally approve.
- Define minimum contribution margin or payback requirement.

## Battle Card C — Supply Chain wants higher inventory buffer

Analyze:

- Service-level benefit.
- Inventory carrying cost.
- DIO.
- Obsolescence.
- Liquidity.

Finance recommendation:

- Quantify acceptable buffer.
- Define inventory ceiling and review trigger.

---

# 12. Industry / Peer Benchmark Design

The benchmark should be concise but defensible.

## 12.1 Peer framework

Select 2–4 peers that are sufficiently comparable.

Document:

- Business model.
- Product scope.
- Geography.
- Reporting basis.
- Comparison limitations.

## 12.2 External metrics

Potential metrics:

- Revenue Growth.
- Gross Margin.
- Operating Margin.
- SG&A / Revenue.
- Inventory Days.
- Working-Capital Trend.
- Category Growth.
- Input-Cost Index.
- Public Pricing.
- Market Share where verified.

## 12.3 Benchmark output

Create:

1. Peer table.
2. Trend chart.
3. Internal-vs-market diagnostic.
4. Three external implications for internal decisions.

Do not create an investment recommendation.

---

# 13. Recruiter-First Website / Quick Tour

This is required.

The first screen should answer within 30–60 seconds:

## Business Problem

> How can VietNova grow revenue without sacrificing contribution profit and liquidity?

## Headline Findings

Show 3–5 validated findings.

Examples:

- Revenue growth concentrated in a low-contribution channel.
- Margin miss driven by mix and trade discounting.
- One high-revenue customer destroys value after rebates and working-capital cost.
- Two promotions have negative incremental contribution.
- Working-capital stress could require incremental revolver draw under downside conditions.

## Recommended Actions

Show 3–5 actions.

## Quantified Simulated Impact

Show:

- Contribution-profit impact.
- Cash / working-capital impact.
- Forecast impact.
- Risk range.

## Recruiter Quick Tour

Buttons/links:

1. **Executive Summary**
2. **Excel Model**
3. **Power BI Preview**
4. **Management Deck**
5. **CFO Memo**
6. **Validation & Methodology**

Technical folders should come later.

---

# 14. QA & Validation Framework

# 14.1 Financial controls

```text
Gross Sales – Discounts – Returns – Rebates = Net Sales
```

```text
Net Sales – COGS = Gross Profit
```

```text
Gross Profit – Commercial Variable Costs = Contribution Profit
```

```text
Contribution Profit – Marketing – Allocated OPEX = Operating Profit
```

# 14.2 Cross-dimensional controls

- Product totals = company total.
- Customer totals = company total after documented unattributed amounts.
- Channel totals = company total.
- Region totals = company total.
- Excel totals = Power BI totals.

# 14.3 PVM control

```text
Price
+ Volume
+ Product Mix
+ Channel Mix
+ Discount
+ Return
+ Cost
+ Labeled Residual
=
Headline Variance
```

# 14.4 Inventory controls

```text
Opening Inventory
+ Purchases
+ Transfers In
– Sales / COGS Usage
– Transfers Out
– Write-offs
– Shrinkage
=
Closing Inventory
```

# 14.5 Working-capital controls

- AR aging reconciles to receivables.
- AP aging reconciles to payables.
- Inventory reconciles to inventory schedule.
- CCC components use consistent period and denominator treatment.

# 14.6 Forecast controls

- Frozen versions are immutable.
- No future leakage.
- Forecast accuracy only evaluated after actuals exist.
- Scenario assumptions separate from Base forecast.
- Budget vs Forecast versions clearly distinguished.

# 14.7 Monte Carlo controls

- Base-case expected values reconcile with deterministic assumptions where designed.
- Distribution inputs documented.
- Correlations documented.
- Random seed controlled for reproducibility.
- Percentiles calculated correctly.
- No probability claim without modeled assumptions.

# 14.8 Promotion controls

- Promotion spend reconciles to ledger.
- Incremental contribution formula transparent.
- Cannibalization method documented.
- No causal claim without valid design.

# 14.9 Budget reallocation controls

```text
Old Total Budget = New Total Budget
```

All constraints must be visible.

# 14.10 Claim controls

Every public headline must be:

- Traceable.
- Reconciled.
- Correctly labeled.
- Supported by the model.
- Free from real-company-impact implication.

---

# 15. Recommended Execution Roadmap

Given the expanded scope, use a **12-week core roadmap** rather than forcing the project into ten weeks.

Recommended effort:

> **12–18 focused hours per week**

Do not advance to the next phase until the exit gate is met.

---

## Week 1 — Business Scope & Company Design

### Work

- Select exact consumer/FMCG sub-sector.
- Confirm whether owned retail stores exist.
- Decide whether SSSG / Sales per m² are applicable.
- Finalize company, brands and products.
- Define channels, customers and regions.
- Lock management questions.
- Lock claim boundaries.

### Exit gate

**Business case locked.**

---

## Week 2 — P&L, KPI & Operational Driver Design

### Work

- Define Commercial P&L.
- Define sign conventions.
- Define allocations.
- Build KPI dictionary.
- Build operational-driver tree.
- Define working-capital formulas.
- Define debt/liquidity assumptions.

### Exit gate

**Finance and KPI logic locked.**

---

## Week 3 — Historical, Budget & Hidden-Truth Data

### Work

- Generate deterministic synthetic history.
- Encode business events.
- Create budget.
- Create customer / product / channel masters.
- Create AR/AP/inventory.
- Build hidden-truth register.
- Run initial QA.

### Exit gate

**Input data validated.**

---

## Week 4 — Commercial P&L & Monthly Reporting

### Work

- Build company P&L.
- Build Actual vs Budget / Forecast / PY.
- Build product/customer/channel schedules.
- Reconcile allocations.

### Exit gate

**P&L fully reconciled.**

---

## Week 5 — PVM, Profitability & Operational Drivers

### Work

- Build PVM.
- Build margin bridge.
- Product profitability.
- Customer profitability.
- Channel profitability.
- Unit economics.
- SSSG / Sales per m² only if applicable.

### Exit gate

**Driver analysis reconciles and explains hidden events.**

---

## Week 6 — Promotion ROI & Pricing

### Work

- Promotion pre-evaluation.
- Promotion post-evaluation.
- Cannibalization framework.
- Pricing Simulator.
- Break-even price analysis.
- Cost pass-through.

### Exit gate

**Promotion and pricing decisions are financially defensible.**

---

## Week 7 — 12-Month Rolling Forecast

### Work

- Driver-based forecast.
- Monthly roll mechanism.
- Freeze forecast versions.
- Backtest.
- Bias / WAPE.
- Forecast commentary.

### Exit gate

**Forecast is driver-based, versioned and backtested.**

---

## Week 8 — Inventory, Working Capital & Liquidity

### Work

- Inventory aging.
- Shrinkage / wastage.
- DIO / DSO / DPO.
- CCC.
- NWC bridge.
- Revolver model.
- Liquidity stress.

### Exit gate

**Cash and liquidity implications reconcile to operating assumptions.**

---

## Week 9 — Scenario & Monte Carlo Risk Overlay

### Work

- Deterministic scenarios.
- Distribution assumptions.
- Correlation assumptions.
- Python Monte Carlo.
- Percentile outputs.
- Budget-miss and liquidity-risk probabilities.

### Exit gate

**Risk outputs are reproducible and assumption-bounded.**

---

## Week 10 — Budget Reallocation & Peer Benchmark

### Work

- Commercial budget optimization.
- Constraint testing.
- Peer selection.
- External benchmarking.
- Integrate market context into recommendations.

### Exit gate

**Resource-allocation recommendation is quantified and externally contextualized.**

---

## Week 11 — Management Outputs & Business Partnering

### Work

- Power BI.
- Management deck.
- CFO memo.
- 3 negotiation battle cards.
- Cross-output reconciliation.

### Exit gate

**All management outputs agree with Excel and model logic.**

---

## Week 12 — Recruiter Packaging & Interview Preparation

### Work

- Recruiter-first README.
- Website quick tour.
- Public-safe Excel.
- Dashboard preview.
- Final QA.
- CV bullets.
- 60-second pitch.
- 3-minute management walkthrough.
- 10-minute technical/financial walkthrough.
- Interview Q&A.

### Exit gate

**Recruiter-ready.**

---

# 16. Optional Post-Core Strategic Sprint

Only after Week 12 is complete:

## Buy vs Build / M&A module

Build only if it enhances the targeted job family.

Do not reopen the core model unless required.

This strategic module should appear as:

> **Optional Strategic Capital Allocation Case**

not as another full project inside the same repository.

---

# 17. Final Repository Structure

```text
commercial-finance-profitability-analytics/
│
├── README.md
├── EXECUTIVE_SUMMARY.md
├── BUSINESS_CASE.md
│
├── data/
│   ├── inputs/
│   ├── public_sources/
│   ├── samples/
│   └── data_dictionary.xlsx
│
├── model/
│   └── Commercial_Finance_Model.xlsx
│
├── dashboard/
│   ├── Commercial_Finance_Dashboard.pbix
│   ├── dashboard_preview.pdf
│   └── screenshots/
│
├── reports/
│   ├── MANAGEMENT_DECK.pdf
│   ├── CFO_DECISION_MEMO.pdf
│   ├── NEGOTIATION_BATTLE_CARDS.pdf
│   └── VALIDATION_REPORT.md
│
├── docs/
│   ├── p_and_l_definition.md
│   ├── kpi_dictionary.md
│   ├── operational_driver_tree.md
│   ├── pvm_methodology.md
│   ├── promotion_roi_methodology.md
│   ├── pricing_methodology.md
│   ├── forecast_methodology.md
│   ├── working_capital_methodology.md
│   ├── monte_carlo_methodology.md
│   ├── peer_benchmark_methodology.md
│   ├── assumptions_and_limitations.md
│   ├── claim_governance.md
│   └── source_register.md
│
├── generator/
│   └── generate_synthetic_data.py
│
├── analytics/
│   ├── monte_carlo.py
│   └── qa_checks.py
│
├── website/
│
└── optional_strategic_case/
    └── buy_vs_build_ma.md
```

---

# 18. Definition of Done

The core project is complete only when:

## Finance

- Commercial P&L is formula-driven and reconciled.
- Actual / Budget / Forecast / Prior Year are distinct.
- Product / customer / channel / region totals reconcile.
- PVM bridge reconciles.
- Promotion ROI is implemented.
- Pricing Simulator is implemented.
- Rolling forecast works as a genuine 12-month rolling process.
- Frozen forecast versions are backtested.
- Working capital and CCC reconcile.
- Liquidity stress produces traceable cash / revolver impact.
- Monte Carlo outputs are reproducible and assumption-bounded.
- Budget reallocation respects a fixed total budget.
- Peer benchmark is traceable and caveated.

## Operational understanding

- At least one operational-driver tree explains a financial outcome.
- Shrinkage / wastage is modeled where relevant.
- D2C CAC/LTV is included only if applicable.
- SSSG / Sales per m² are included only if the company truly has an owned-store model.

## Decision making

- At least 3–5 management recommendations are quantified.
- Every recommendation includes mechanism, assumptions, risks and monitoring KPI.
- At least 3 Finance Business Partnering negotiation battle cards exist.

## Communication

- Excel is recruiter-safe.
- Power BI reconciles to Excel.
- Management deck matches the model.
- CFO memo matches the model.
- Website gives a 30–60 second quick tour.
- Technical detail is available but does not dominate recruiter experience.

## Governance

- Synthetic data clearly labeled.
- External sources traceable.
- Hidden business truth remains separate from public analysis.
- No unsupported real-impact claim.
- No unsupported causal claim.
- Limitations are visible.

---

# 19. CV Positioning

Do not finalize numerical bullets until execution and QA are complete.

## Draft primary bullet

> Built a driver-based Commercial Finance model integrating Actuals, Budget and a 12-month rolling forecast across products, customers and channels; reconciled Price–Volume–Mix and profitability drivers, evaluated promotion and pricing economics, and quantified simulated profit and liquidity impact from commercial decisions.

## Possible supporting bullet

> Modeled inventory, working capital and liquidity through DIO/DSO/DPO, Cash Conversion Cycle and revolver stress scenarios, with a Monte Carlo risk overlay to quantify the probability of budget misses and liquidity-pressure outcomes.

## Possible decision-making bullet

> Developed customer/channel profitability, promotion ROI and fixed-budget reallocation cases, translating analysis into CFO recommendations and Finance Business Partnering negotiation scenarios for Sales, Marketing and Supply Chain.

Final wording must use only validated results.

---

# 20. Interview Preparation

Prepare answers to:

1. How did you define contribution profit?
2. How did you allocate shared operating costs?
3. How does your PVM methodology work?
4. How do you treat new/discontinued SKUs?
5. What drove the largest Budget miss?
6. How is the rolling forecast updated each month?
7. Why use Bias and WAPE?
8. Why is Monte Carlo useful if deterministic scenarios already exist?
9. How did you choose probability distributions?
10. Which Monte Carlo correlations matter most?
11. How did you calculate promotion ROI?
12. How did you avoid calling promotion uplift causal?
13. How does the pricing simulator model volume response?
14. What drives DIO, DSO and DPO?
15. Why can profitable growth create a cash problem?
16. How does the revolver stress model work?
17. Why is DSCR not always the right corporate liquidity metric?
18. How did you allocate fixed commercial budget?
19. Which peer metrics are actually comparable?
20. What would you verify before implementing the recommendation in a real company?
21. How would you push back when Marketing requests more budget?
22. How do you know Power BI agrees with Excel?
23. What is simulated, observed, derived and assumed?
24. What did the hidden-truth validation reveal?
25. What is the biggest limitation of the project?

---

# 21. Immediate Next Step — BLOCK A

Do **not** start coding.

Before building data or Excel formulas, approve the following:

1. Exact FMCG / consumer sub-sector.
2. Whether the company has owned physical stores.
3. Whether SSSG and Sales/m² are applicable.
4. Company name and operating profile.
5. Three brands.
6. 30–40 SKUs.
7. Five channels and economics.
8. Customer structure.
9. Regional structure.
10. Commercial P&L definition.
11. Operational-driver tree.
12. Working-capital structure.
13. Debt / revolver assumptions.
14. 15–20 core management questions.
15. Peer group.
16. External data sources.
17. Claim-governance rules.
18. Hidden business truth events.
19. Promotion hurdle / evaluation framework.
20. Pricing decision framework.

Only after these items are locked should synthetic historical data be generated.

---

# 22. Final Project Standard

The final project should not communicate:

> “I can make a sophisticated dashboard.”

It should communicate:

> **“I understand how commercial operations create financial outcomes. I can explain performance, forecast the business, protect margin and liquidity, evaluate pricing and promotions, challenge business functions with evidence, allocate scarce resources, and communicate a financially defensible recommendation to management.”**

That is the standard for this project.


