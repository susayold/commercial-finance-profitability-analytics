# CORPORATE FINANCIAL ANALYST / FP&A PORTFOLIO PROJECT

## Commercial Finance & Profitability Analysis — Vietnam Omnichannel FMCG Case

**Document purpose:** Detailed execution plan for a recruiter-ready Corporate Financial Analyst / FP&A / Commercial Finance portfolio project.

**Primary career targets:**

- Junior FP&A Analyst
- Financial Analyst
- Business Finance Analyst
- Commercial Finance Analyst
- Finance Business Partner Analyst

**Project principle:** Excel and financial reasoning are the core. Power BI and Power Query support reporting. Python may be used only to create reproducible synthetic data. SQL and data-engineering infrastructure are optional and are not project priorities.

---

# 1. Project positioning

## 1.1 Project title

**Commercial Finance & Profitability Analysis**

Suggested subtitle:

> Driver-based performance analysis, forecasting and commercial decision support for a Vietnam omnichannel FMCG company.

## 1.2 Role simulation

Assume the role of a **Commercial Finance Analyst / FP&A Analyst** supporting the CFO and Commercial Director of a fictional Vietnam-based FMCG company.

The analyst is responsible for:

- Monthly management reporting.
- Actual versus Budget and Prior Year analysis.
- Revenue and margin-driver analysis.
- Product, customer and channel profitability.
- Budget preparation and rolling forecast.
- Scenario and sensitivity analysis.
- Pricing, promotion and resource-allocation recommendations.
- Communicating findings to management.

## 1.3 Primary management question

> How can the company grow revenue while protecting contribution profit, operating profit and cash quality?

## 1.4 Recruiter message

The completed project should prove:

> I can build and control a commercial P&L, explain performance drivers, assess the quality of revenue, forecast future results and translate financial analysis into quantified management actions.

## 1.5 Explicitly out of scope

The project is not intended to demonstrate:

- Data engineering.
- Production-scale data warehousing.
- Machine learning.
- Real-time analytics.
- Advanced cloud infrastructure.
- A generic sales dashboard.
- Real impact at an actual company.

---

# 2. Business case design

## 2.1 Fictional company

Create a fictional Vietnamese omnichannel consumer/FMCG company called **VietNova Consumer JSC**. The name may be changed before publication.

Suggested operating profile:

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

## 2.2 Suggested product portfolio

Choose one consumer category with observable commercial drivers. Recommended option: **packaged beverages and healthy snacks**.

Example brands:

1. **NovaActive** — premium functional beverages.
2. **NovaDaily** — mass-market drinks.
3. **NovaBite** — healthy snacks.

Each brand should contain:

- Core products.
- Premium products.
- New products.
- Slow-moving products.
- At least one strategic loss leader.

## 2.3 Sales channels

1. General Trade.
2. Modern Trade.
3. E-commerce Marketplace.
4. Direct-to-Consumer.
5. Wholesale/Distributor.

Each channel must have different economics:

| Channel | Typical commercial characteristics |
|---|---|
| General Trade | Distributor margin, broad coverage, moderate logistics cost |
| Modern Trade | Listing fees, rebates, promotions, longer payment terms |
| Marketplace | Platform fees, vouchers, advertising, returns and fulfillment costs |
| Direct-to-Consumer | Higher gross margin, higher marketing and delivery costs |
| Wholesale | High volume, low margin, concentration and credit exposure |

## 2.4 Geographic structure

Recommended regions:

- Ho Chi Minh City.
- Southeast.
- Mekong Delta.
- Hanoi.
- Northern provinces.
- Central Vietnam.

## 2.5 Embedded business events

The historical data must contain deliberate business events rather than random noise.

### Event A — Input-cost inflation

- Raw-material cost increases by 10–12%.
- The effect begins in a specified quarter.
- Premium products have stronger ability to pass cost through.

### Event B — Marketplace growth

- Marketplace volume increases by 25–35%.
- Voucher, platform and fulfillment costs also increase.
- Revenue rises faster than contribution profit.

### Event C — Promotion underperformance

- One large campaign raises volume but creates weak or negative incremental contribution.
- A smaller campaign produces better ROI.

### Event D — Customer economics problem

- One key account produces high revenue.
- Excessive rebate, commercial support and long payment terms weaken value.

### Event E — Product-mix shift

- Mass-market SKUs gain share during one period and dilute margin.
- Premium mix improves in a later period.

### Event F — Slow-moving inventory

- Selected SKUs accumulate inventory.
- Markdown or rationalization becomes necessary.

---

# 3. Evidence and claim governance

Every material data point or claim must receive one of four labels.

| Label | Meaning |
|---|---|
| OBSERVED | Public information from a traceable external source |
| SIMULATED | Fictional internal company data |
| DERIVED | Output calculated from observed or simulated data |
| ASSUMPTION | Judgment used in forecast, scenario or recommendation |

Writing standard:

- Do not claim real company impact.
- Do not imply that synthetic data belongs to an actual company.
- Describe scenario outputs as estimated or simulated impact.
- Cite external benchmarks and state their measurement period.
- State limitations where definitions are not fully comparable.

Acceptable wording:

> Scenario analysis indicates a simulated VND 2.4bn increase in annual contribution profit, assuming the modeled volume response and cost structure hold.

Unacceptable wording:

> Increased company profit by VND 2.4bn.

---

# 4. Financial model scope

## 4.1 Commercial P&L

The model must reconcile the following structure:

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
– Variable Distribution/Fulfillment
– Other Variable Selling Costs
= Contribution Profit

– Brand Marketing
– Allocated Commercial Operating Expenses
= Commercial Operating Profit
```

## 4.2 Sign convention

Use one consistent convention:

- Revenue and profit are positive.
- Costs and deductions are negative in the displayed P&L.
- Source data may use positive cost amounts, but the presentation layer must convert signs consistently.
- All variance formulas must be explicitly defined as favorable or unfavorable.

## 4.3 Required financial views

The P&L must be available by:

- Company.
- Brand.
- SKU.
- Customer.
- Channel.
- Region.
- Month and quarter.

Every lower-level view must reconcile to the company total after documented allocations.

---

# 5. KPI framework

## 5.1 Outcome KPIs

- Net Sales.
- Gross Profit.
- Gross Margin %.
- Contribution Profit.
- Contribution Margin %.
- Commercial Operating Profit.
- Commercial Operating Margin %.

## 5.2 Revenue drivers

- Sales Volume.
- Average Selling Price.
- Price Realization.
- Product Mix.
- Channel Mix.
- Discount Rate.
- Return Rate.
- Revenue Growth.

## 5.3 Cost and profitability drivers

- Unit COGS.
- COGS Inflation.
- Trade Spend as % of Net Sales.
- Fulfillment Cost per Unit.
- Marketplace Fee as % of Marketplace Revenue.
- Marketing as % of Net Sales.
- Contribution per Unit.
- Contribution per Customer.

## 5.4 Planning KPIs

- Actual vs Budget variance.
- Actual vs Latest Forecast variance.
- Actual vs Prior Year variance.
- Forecast Accuracy.
- Forecast Bias.
- WAPE.

## 5.5 Working-capital indicators

- Inventory Turnover.
- Days Inventory Outstanding.
- Slow-moving Inventory Value.
- Sell-through Rate.
- Customer Payment Terms.
- Collection-delay proxy.
- Cash tied in inventory.

## 5.6 KPI dictionary requirements

Each KPI definition must contain:

- Business name.
- Formula.
- Unit.
- Frequency.
- Valid dimensions.
- Source/input.
- Sign convention.
- Owner/audience.
- Interpretation.
- Known caveats.

---

# 6. Required analytical modules

## Module A — Monthly performance reporting

### Purpose

Create a management view of financial performance.

### Comparisons

- Actual vs Budget.
- Actual vs Prior Year.
- Actual vs Latest Forecast.
- Month-to-date, quarter-to-date and year-to-date.

### Required outputs

- Summary P&L.
- Variance table.
- Trend charts.
- Top risks and opportunities.
- Management commentary.

### Core questions

1. Are Net Sales, Gross Profit and Operating Profit on plan?
2. Is revenue growth producing proportional profit growth?
3. Which P&L lines explain the largest miss?
4. Are current trends temporary or structural?

## Module B — Price–Volume–Mix and margin bridge

### Purpose

Explain revenue and margin movement through business drivers.

### Required effects

- Volume.
- Price.
- Product mix.
- Channel mix.
- Discount.
- Returns.
- Unit cost.

### Control

```text
Sum of defined effects + labeled residual = Actual – Comparison Base
```

The residual should be zero or immaterial. Any residual must be explained.

### Methodology documentation

Document:

- Comparison base.
- Calculation order.
- Treatment of new/discontinued products.
- Treatment of zero-volume periods.
- Whether discount is included in price or shown separately.
- Aggregation level.

## Module C — Product and SKU profitability

### Outputs

- Product P&L.
- Contribution ranking.
- Growth-margin matrix.
- Margin-dilutive SKU list.
- Product-rationalization candidates.

### Classification

- Invest.
- Protect/Harvest.
- Fix Economics.
- Review/Rationalize.
- Strategic Loss Leader.

### Questions

- Which SKUs generate incremental contribution?
- Which high-revenue SKUs dilute profit?
- Which SKUs should be repriced?
- Which SKUs consume promotion or inventory without sufficient return?

## Module D — Channel profitability

### Channel P&L

```text
Net Sales
– COGS
– Channel Discounts
– Platform/Listing Fees
– Fulfillment/Distribution
– Channel Marketing
= Channel Contribution
```

### Questions

- Is e-commerce growth financially attractive?
- Which channels convert revenue into contribution most effectively?
- Which costs are increasing faster than channel revenue?
- Where should the company invest or renegotiate terms?

## Module E — Customer profitability

### Customer P&L

```text
Gross Sales
– Discounts
– Rebates
– Returns
– COGS
– Delivery and Customer Support
= Customer Contribution
```

### Supporting indicators

- Revenue concentration.
- Contribution concentration.
- Rebate intensity.
- Payment terms.
- Collection-delay proxy.

### Questions

- Which customers create the most economic value?
- Which customers have high revenue but weak contribution?
- Which contracts or rebates should be renegotiated?

## Module F — Budget and rolling forecast

### Budget structure

Build the annual budget through drivers:

```text
Volume × Price
– Discounts and Returns
= Net Sales
– Unit COGS × Volume
= Gross Profit
– Commercial Costs
= Contribution Profit
– Marketing and OPEX
= Commercial Operating Profit
```

### Rolling forecast

- Twelve-month rolling horizon.
- Monthly refresh.
- Version-controlled assumptions.
- Forecast by month, product/brand and channel.
- Forecast consolidated into the company P&L.

### Forecast evaluation

- Freeze each forecast version.
- Compare forecasts only after actuals become available.
- Calculate Bias and WAPE.
- Review errors by brand and channel.
- Avoid future-period leakage.

## Module G — Scenario and sensitivity analysis

### Required scenarios

1. Base Case.
2. Growth/Premium Mix Case.
3. Margin Pressure Case.
4. Downside Case.

### Scenario drivers

- Volume growth.
- Price increase.
- Discount rate.
- Product mix.
- Channel mix.
- Unit COGS.
- Marketplace fees.
- Marketing spend.

### Outputs

- Net Sales.
- Gross Profit.
- Gross Margin.
- Contribution Profit.
- Operating Profit.
- Inventory/cash implications where available.

## Module H — Management recommendations

Develop three to five quantified recommendations across:

- Pricing.
- Promotion reduction or redesign.
- Product rationalization.
- Channel investment.
- Customer-contract renegotiation.
- Inventory action.
- Budget reallocation.

Each recommendation must contain:

1. Evidence.
2. Proposed action.
3. Financial mechanism.
4. Estimated impact.
5. Assumptions.
6. Risks.
7. Monitoring KPI.

---

# 7. Optional stretch modules

## 7.1 Promotion ROI

Use a limited set of 10–20 promotions.

```text
Estimated Incremental Revenue
– Incremental COGS
– Discount Cost
– Campaign Cost
– Estimated Cannibalization
= Estimated Incremental Contribution
```

Label uplift and cannibalization as modeled estimates unless supported by a valid comparison design.

## 7.2 Pricing simulator

Inputs:

- Price change.
- Assumed volume response.
- Unit-cost inflation.
- Discount change.
- Competitor-price scenario.

Outputs:

- Volume.
- Revenue.
- Gross Profit.
- Gross Margin.
- Contribution Profit.
- Break-even price increase.

## 7.3 Fixed-budget reallocation

Objective:

> Maximize estimated incremental contribution profit while keeping total commercial budget unchanged.

Constraints:

- Old Budget = New Budget.
- Minimum and maximum channel spend.
- Inventory availability.
- Strategic brand support.
- Explainable allocation logic.

---

# 8. Data and input design

## 8.1 Required input tables

Use CSV or Excel input tables. A production database is not required.

### Sales transactions

- Transaction ID.
- Date.
- Customer.
- SKU.
- Channel.
- Region.
- Quantity.
- List price.
- Invoice discount.
- Returns.
- Net Sales.

### Product master

- SKU.
- Product.
- Brand.
- Category.
- Launch date.
- Active/discontinued status.
- Standard cost.

### Customer master

- Customer.
- Customer group.
- Channel.
- Region.
- Payment terms.
- Strategic-account flag.

### Commercial costs

- Period.
- Customer/channel/brand/SKU where applicable.
- Rebate.
- Trade spend.
- Platform fee.
- Fulfillment/distribution.
- Marketing.

### Budget

- Month.
- Brand/SKU.
- Channel.
- Region where needed.
- Budget volume.
- Budget price.
- Budget Net Sales.
- Budget COGS.
- Budget commercial costs.
- Budget operating profit.

### Forecast

- Forecast version.
- Forecast creation date.
- Target month.
- Brand/SKU.
- Channel.
- Forecast drivers and outputs.

### Inventory

- Month.
- SKU.
- Location/region.
- Opening inventory.
- Purchases.
- Sales.
- Write-offs/transfers.
- Closing inventory.
- Inventory value.
- Aging.

## 8.2 Hidden-truth register

Maintain a private validation file containing:

- Event name.
- Effective date.
- Affected products/channels/customers.
- True modeled mechanism.
- Expected metric impact.
- Expected analysis conclusion.

The final analysis must attempt to recover the embedded drivers without directly reading the register.

## 8.3 Data controls

Required checks:

- Unique transaction IDs.
- Complete product/customer mappings.
- Gross-to-net formula check.
- Quantity and amount range checks.
- Budget coverage by month.
- Forecast-version controls.
- Inventory roll-forward.
- Product/customer/channel P&L reconciliation.
- No double counting of discounts, rebates or trade spend.

---

# 9. Excel model specification

Excel is the principal analytical deliverable.

## 9.1 Workbook structure

| Sheet | Purpose |
|---|---|
| `00_Control` | Version, reporting period, scenario and model checks |
| `01_Assumptions` | Forecast and scenario assumptions |
| `02_Mappings` | Product, customer, channel and P&L mappings |
| `03_Actuals` | Historical summarized actuals |
| `04_Budget` | Approved budget |
| `05_Forecast` | Rolling forecast and versions |
| `06_Commercial_P&L` | Main actual/budget/forecast P&L |
| `07_Variance` | Actual vs Budget/Forecast/Prior Year |
| `08_PVM_Bridge` | Price–Volume–Mix and margin bridge |
| `09_Product_P&L` | Product and SKU profitability |
| `10_Customer_P&L` | Customer profitability |
| `11_Channel_P&L` | Channel economics |
| `12_Inventory` | Inventory and working-capital indicators |
| `13_Promotion_ROI` | Optional promotion evaluation |
| `14_Scenarios` | Base, growth, pressure and downside cases |
| `15_Recommendations` | Action cases and quantified impact |
| `16_QA` | Reconciliation and error checks |

## 9.2 Model standards

- Inputs, formulas and outputs use consistent formatting.
- No unexplained hard-coded outputs.
- Assumptions are centralized.
- Every major schedule includes a control check.
- Units and currencies are visible.
- Actual, Budget and Forecast are clearly distinguished.
- Formula logic flows left to right and top to bottom where possible.
- Model version and reporting date are displayed.
- Circular references are prohibited unless intentionally designed and documented.
- Errors must not be hidden using indiscriminate `IFERROR` formulas.

---

# 10. Power BI scope

Power BI is a management-view companion to the Excel model, not the main financial engine.

## Page 1 — CFO Executive Summary

- Net Sales.
- Gross Profit and Margin.
- Contribution Profit and Margin.
- Operating Profit.
- Actual vs Budget and Prior Year.
- Top risk.
- Top opportunity.

## Page 2 — Revenue and Margin Bridge

- Price effect.
- Volume effect.
- Product-mix effect.
- Discount/return effect.
- Cost effect.
- Channel-mix effect.

## Page 3 — Profitability

- Product/SKU profitability.
- Customer profitability.
- Channel profitability.
- Growth-margin matrix.

## Page 4 — Budget and Forecast

- Actual vs Budget vs Latest Forecast.
- Rolling 12-month view.
- Forecast risk and opportunity.
- Forecast accuracy.

## Page 5 — Scenario and Actions

- Scenario comparison.
- Recommended actions.
- Estimated financial impact.
- Monitoring KPIs.

Dashboard rules:

- One management question per page.
- Default view must be useful before filtering.
- Keep filters limited to period, brand, channel and region.
- Excel and Power BI totals must reconcile.
- Visible labels must identify simulated data.

---

# 11. Management communication deliverables

## 11.1 Management deck

Target: 8–10 slides.

1. Executive Summary.
2. Financial Performance.
3. Revenue Variance.
4. Margin Bridge.
5. Product Profitability.
6. Customer and Channel Economics.
7. Forecast and Risks.
8. Scenario Analysis.
9. Recommended Actions.
10. Expected Financial Impact and Monitoring.

Each slide follows:

> What happened → Why → So what → Recommended action

## 11.2 CFO decision memo

Target: 2–4 pages.

- Executive summary.
- Performance against plan.
- Key drivers.
- Risks and opportunities.
- Recommended actions.
- Estimated impact.
- Assumptions and limitations.
- Monitoring plan.

## 11.3 Interview walkthrough

Prepare:

- 60-second project pitch.
- 3-minute management walkthrough.
- 10-minute technical/financial walkthrough.
- Answers to methodology questions about PVM, forecast, allocations and scenario assumptions.

---

# 12. Execution roadmap

Recommended duration: **10 weeks**, approximately 12–18 hours per week.

## Week 1 — Business scope and company design

### Work

- Select exact FMCG sub-sector.
- Finalize fictional company, brands and product hierarchy.
- Define channels, customers and regions.
- Define commercial economics by channel.
- Lock 15 management questions.
- Define project claim boundaries.

### Deliverables

- Business brief.
- Company profile.
- Product and channel map.
- Management-question register.
- Claim-governance policy.

### Exit gate

**Business case locked.**

## Week 2 — P&L and KPI design

### Work

- Define Commercial P&L.
- Define allocation rules.
- Build KPI dictionary.
- Define Actual, Budget and Forecast grains.
- Define sign and variance conventions.

### Deliverables

- P&L definition.
- KPI dictionary.
- Allocation register.
- Model map.

### Exit gate

**Metrics and accounting logic locked.**

## Week 3 — Historical and budget data

### Work

- Create reproducible synthetic historical data.
- Encode business events and hidden truth.
- Create budget and master tables.
- Run mapping and gross-to-net checks.

### Deliverables

- Historical actuals.
- Budget data.
- Master data.
- Hidden-truth register.
- Initial QA report.

### Exit gate

**Input data validated.**

## Week 4 — Commercial P&L

### Work

- Build company P&L.
- Build Actual vs Budget and Prior Year.
- Build product, customer and channel schedules.
- Implement allocation logic.
- Reconcile all views.

### Deliverables

- Commercial P&L.
- Profitability schedules.
- Reconciliation controls.

### Exit gate

**P&L fully reconciled.**

## Week 5 — Variance and PVM

### Work

- Develop revenue and margin bridges.
- Document PVM methodology.
- Handle new/discontinued SKUs.
- Explain the largest variances.

### Deliverables

- PVM model.
- Margin bridge.
- Driver commentary.
- Reconciliation check.

### Exit gate

**Driver bridges reconcile.**

## Week 6 — Profitability recommendations

### Work

- Classify products by growth and margin.
- Analyze channel economics.
- Analyze customer profitability and concentration.
- Identify pricing, rebate and rationalization actions.

### Deliverables

- Product matrix.
- Channel scorecard.
- Customer scorecard.
- Initial recommendation register.

### Exit gate

**Profitability findings supported by reconciled financial evidence.**

## Week 7 — Budget and rolling forecast

### Work

- Build driver-based forecast.
- Create forecast versions.
- Forecast the Commercial P&L.
- Backtest historical forecast versions where simulated versions exist.
- Calculate Bias and WAPE.

### Deliverables

- Rolling forecast.
- Forecast-version register.
- Forecast-accuracy analysis.

### Exit gate

**Forecast is driver-based, versioned and backtested.**

## Week 8 — Scenario and decision cases

### Work

- Build Base, Growth, Margin Pressure and Downside cases.
- Quantify pricing and product/channel actions.
- Add promotion or budget-reallocation analysis if time permits.
- Document risks and sensitivities.

### Deliverables

- Scenario model.
- Sensitivity tables.
- Quantified recommendation cases.

### Exit gate

**Recommendations have assumptions, risk boundaries and measurable impact.**

## Week 9 — Power BI and management outputs

### Work

- Build five dashboard pages.
- Reconcile Power BI with Excel.
- Write management deck.
- Draft CFO memo.

### Deliverables

- Power BI dashboard.
- Management deck.
- CFO memo.
- Cross-output reconciliation report.

### Exit gate

**All management outputs agree with the financial model.**

## Week 10 — Recruiter packaging and interview preparation

### Work

- Build recruiter-first README and website case study.
- Export safe public versions of Excel and reports.
- Create screenshots and walkthrough video.
- Write CV bullets.
- Prepare interview questions and answers.
- Perform final QA.

### Deliverables

- Public repository.
- Website case study.
- Downloadable Excel model.
- Dashboard preview.
- Management deck and memo.
- CV bullets.
- Interview scripts.

### Exit gate

**Recruiter-ready.**

---

# 13. QA and validation framework

## 13.1 Financial controls

```text
Gross Sales – Discounts – Returns – Rebates = Net Sales
Net Sales – COGS = Gross Profit
Gross Profit – Commercial Variable Costs = Contribution Profit
Contribution Profit – Marketing – Allocated OPEX = Operating Profit
```

## 13.2 Cross-dimensional controls

- Product P&L totals equal company P&L.
- Customer P&L totals equal company P&L after documented unattributed amounts.
- Channel P&L totals equal company P&L.
- Region totals equal company totals.
- Excel and Power BI totals match.

## 13.3 Planning controls

- Budget covers every required month.
- Forecast version cannot change after freeze without a new version.
- Forecast accuracy uses only available actuals.
- Scenario assumptions are separated from base forecast assumptions.
- Budget reallocation does not create additional total budget.

## 13.4 Analytical controls

- PVM bridge reconciles to the headline variance.
- Rates use correct denominators.
- Partial periods are not compared with complete periods without a caveat.
- Weighted averages are used where group sizes differ.
- New and discontinued products receive explicit treatment.
- Promotion uplift is not described as causal without a valid counterfactual.

## 13.5 Presentation controls

- All charts show units and periods.
- Titles state the supported finding.
- Scenario outputs are labeled simulated.
- External benchmarks include citations and comparability caveats.
- No unsupported impact claims appear in CV, README or management materials.

---

# 14. Portfolio repository structure

```text
commercial-finance-profitability-analysis/
├── README.md
├── EXECUTIVE_SUMMARY.md
├── BUSINESS_CASE.md
├── data/
│   ├── inputs/
│   ├── public_sources/
│   ├── samples/
│   └── data_dictionary.xlsx
├── model/
│   └── Commercial_Finance_Model.xlsx
├── dashboard/
│   ├── Commercial_Finance_Dashboard.pbix
│   ├── dashboard_preview.pdf
│   └── screenshots/
├── reports/
│   ├── MANAGEMENT_DECK.pdf
│   ├── CFO_DECISION_MEMO.pdf
│   └── VALIDATION_REPORT.md
├── docs/
│   ├── p_and_l_definition.md
│   ├── kpi_dictionary.md
│   ├── pvm_methodology.md
│   ├── forecast_methodology.md
│   ├── assumptions_and_limitations.md
│   ├── claim_governance.md
│   └── source_register.md
├── generator/
│   └── generate_synthetic_data.py
└── website/
```

The public recruiter experience should begin with business findings and recommendations, not technical folders.

---

# 15. Definition of done

The project is complete only when:

- The Commercial P&L is formula-driven and reconciled.
- Actual, Budget, Forecast and Prior Year are clearly separated.
- Product, customer, channel and region views reconcile.
- PVM and margin bridges reconcile.
- Forecast assumptions are driver-based and version-controlled.
- Forecast accuracy is evaluated without future leakage.
- Scenarios have explicit assumptions and sensitivities.
- Recommendations have quantified simulated impact.
- Excel contains visible QA controls.
- Power BI matches Excel control totals.
- Management deck and CFO memo match the model.
- Synthetic and external data are clearly distinguished.
- External sources are traceable.
- Limitations are visible.
- Recruiters can understand the project in 60 seconds.
- Interviewers can inspect financial depth for 15–20 minutes.

---

# 16. CV and interview positioning

## 16.1 Draft CV bullet framework

Final numbers must be inserted only after execution and validation.

> Built a driver-based Commercial Finance model integrating historical actuals, budget and rolling forecast across products, customers and channels; decomposed revenue and margin variance through Price–Volume–Mix analysis and quantified simulated profit impact from pricing, product and budget-allocation decisions.

Supporting bullets may cover:

- Commercial P&L and cross-dimensional reconciliation.
- Forecast accuracy and scenario modeling.
- Product/customer/channel profitability.
- Management deck and CFO recommendation memo.

## 16.2 Sixty-second pitch structure

1. Business context.
2. Management problem.
3. Model and analyses built.
4. Most important finding.
5. Recommended action and simulated impact.
6. Key limitation.

## 16.3 Interview questions to prepare

- How did you define contribution profit?
- How did you allocate shared costs?
- How does your PVM method work?
- How did you treat new and discontinued products?
- What drove the largest budget variance?
- How did you build the rolling forecast?
- Why did you choose WAPE and Bias?
- Which assumptions most affect the recommendation?
- What would you verify before implementing the recommendation in a real company?
- How do you know the dashboard agrees with the model?

---

# 17. Immediate next step

Begin with **Week 1 — Business scope and company design**.

Before building data or formulas, approve:

1. Exact FMCG sub-sector.
2. Fictional company name and operating profile.
3. Three brands and 30–40 SKUs.
4. Five channels and their economics.
5. Customer and regional structure.
6. Commercial P&L definition.
7. Fifteen management questions.
8. Evidence and claim boundaries.

Only after those items are locked should historical data and the Excel model be created.


