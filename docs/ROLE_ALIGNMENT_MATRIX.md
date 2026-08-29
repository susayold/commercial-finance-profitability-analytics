# Finance Analyst role-alignment matrix (Vietnam market, 30 Aug 2026)

## Purpose

This matrix converts current Vietnam job-posting language into recruiter-readable evidence requirements for the portfolio. It is a **market-fit overlay**, not a claim that the project substitutes for paid experience. Each row links a recurring hiring signal to a specific artifact, an interview proof point, and the remaining gap.

## Research snapshot

The sample covers a Vietnam Finance Business Partner listing (Wall Street English), a Commercial Finance Analyst listing (Pernod Ricard Vietnam), and a Finance Business Partner listing (SPX Express). The postings converge on the same operating rhythm: annual planning, rolling forecasts, actual-vs-budget analysis, driver/root-cause explanation, profitability and cash visibility, business cases, cross-functional partnering, and clear management communication. Power BI/data structures are usually a plus rather than the core requirement for a pure finance role.

### Sources

1. [Wall Street English Finance Business Partner, CareerViet/Tuổi Trẻ, updated 20 Aug 2026](https://vieclam.tuoitre.vn/en/search-job/finance-business-partner.35C835A9.html) — end-to-end annual plan/KPI/zero-based budget, rolling forecast, cash forecast, management pack, variance investigation, profitability by channel/customer/segment, pricing and business cases, cross-functional partnering, Excel/ERP and communication.
2. [Commercial Finance Analyst, Pernod Ricard Vietnam, CV Work](https://cvwork.vn/viec-lam/viec/commercial-finance-analyst-247397) — rolling forecast, annual budget, gross-to-net/commercial investment, P&L simulations, commercial data, Power BI, pricing/trade-term/A&P control, ROI pre/post evaluation and English communication.
3. [Commercial Finance Analyst, Pernod Ricard Vietnam, Indeed mirror](https://jobs.vn.indeed.com/viewjob?jk=48c473a981b5fcb1) — confirms the accountabilities and requirements in a second listing mirror.
4. [Senior Finance Business Partner, SPX Express, LinkedIn](https://www.linkedin.com/jobs/view/4278489273/) — forecasting model, business-driver metrics, stakeholder inputs, cost trackers/dashboards, variance root causes, initiative efficiency, risk safeguards, Excel/Google Sheets modelling and bilingual communication.

## What recruiters are screening for

| Hiring signal | What “good” looks like in a junior portfolio | Evidence already built | Honest gap / next action |
|---|---|---|---|
| Planning, budgeting and rolling forecast | Driver-based assumptions, version control, monthly cadence, clear ownership | `VietNova_FPA_Model_v2.xlsx`, forecast governance, freeze archive and forecast snapshot template | Replace synthetic snapshot with a redacted real internal pre-close snapshot (Gate A) |
| Actual-vs-budget/forecast variance | Bridge with price/volume/mix, rate/volume, root cause and action | PVM/variance bridge, CFO memo, D2C and commercial modules | Add observed Bias/WAPE once Gate A is available |
| P&L ownership and profitability | Revenue-to-contribution view by product, channel, customer and segment | Channel/product/customer profitability, gross-to-net and contribution logic | Explain accounting-policy boundary in interview; do not imply audited company data |
| Business partnering | Decision memo that names stakeholder, trade-off, recommendation and owner | CFO output, management deck, interview talk track and website reviewer tour | Practice a 5-minute live challenge with Sales/Operations assumptions |
| Commercial finance | Pricing/promotion, trade terms, A&P, ROI and volume-to-value decisions | D2C unit economics, promotion/pricing, commercial profitability and M&A case | Add one real company promotion post-mortem if access is granted |
| Cash / working capital | Cash conversion, AR/AP/inventory drivers, liquidity risks and actions | Working-capital tabs, debt/liquidity, cash bridge and controls | Add a fully reconciled cash-flow statement only if source data supports it |
| Scenario modelling / business cases | Base/upside/downside, sensitivity, NPV/accretion and decision threshold | M&A accretion-dilution case, sensitivity table, Monte Carlo and forecast scenarios | Keep assumptions explicitly synthetic and show downside case first |
| Management reporting | One-page KPI pack with commentary, exceptions and action tracker | Executive output, CFO memo, website dashboard and release notes | Native Power BI QA-01–QA-18 remains Gate B |
| Excel / financial modelling | Formula-driven, auditable, checks and clean input/output separation | v1/v2 workbooks, 10,152-check synthetic QA, validators and GitHub CI | Add a 10-minute model walk-through recording when applying |
| Power BI / data structures | Star-schema contract, measures, page design, refresh and QA awareness | `powerbi/model_contract.json`, DAX pack, PBIP manifest and Desktop checklist | Build and QA the native `.pbix` (Gate B); do not claim it is complete yet |
| Data quality / controls | Reconciliation, completeness, leakage prevention, basis-break flags | Source registry, hidden-truth tests, peer evidence QA, forecast archive QA | Demonstrate one manual control failure and remediation in interview |
| Accounting and controls | Knows actuals, accruals, working-capital and policy boundaries | Accrual/AR/AP logic, internal-control notes, evidence matrix | ERP/SAP experience is not evidenced; label as “familiarity to develop” |
| Communication / English | Concise narrative: result → drivers → risk → action | English CFO memo, CV, talk track, website and source-backed citations | Replace placeholders with contact details and quantified work history |

## Role-specific positioning

### Junior FP&A / Finance Analyst (primary)

Lead with the 28-tab model, forecast governance, variance/PVM bridge, working capital, controls and CFO memo. The first 30 seconds should answer: “Can this person run the monthly planning and performance rhythm?” Keep M&A as a strategic stretch, not the headline.

Suggested CV project line: **Built a driver-based 36-month FP&A model with budget/forecast versions, PVM variance bridge, working-capital schedule and automated control checks; translated results into a CFO-ready monthly performance pack.**

### Business Finance / Commercial Finance Analyst (primary)

Lead with gross-to-net, channel/customer profitability, pricing/promotion, A&P/ROI, D2C unit economics and business partnering. Mention the Pernod Ricard pattern explicitly in interviews: volume-to-value, trade terms, investment pre/post evaluation and realistic forecasts.

Suggested CV project line: **Mapped price-volume-mix and commercial investment drivers by channel/customer, evaluated promotion ROI and produced actions to close the revenue and margin gap.**

### Finance Data Analyst (secondary)

Lead with the semantic model contract, Power BI measures, data-quality controls and reproducible validators. Do not let dashboard tooling bury the finance judgment: every chart must answer a P&L, cash or resource-allocation question.

Suggested CV project line: **Designed a finance star-schema contract and Power BI-ready measure layer with reconciliation, completeness and forecast-accuracy checks; documented refresh and QA ownership.**

## CV ordering and keyword plan

1. Summary: “Finance Analyst / FP&A with driver-based planning, profitability, variance analysis and decision-support modelling.”
2. Projects before Education if the project section is the strongest evidence.
3. First project bullets: budgeting/forecasting → variance/PVM → profitability/cash → CFO communication.
4. Skills line: Financial modelling, FP&A, budgeting, rolling forecast, variance analysis, PVM, management reporting, working capital, scenario analysis, Excel, Power BI, SQL (only if genuinely demonstrated), English.
5. Add “Synthetic operating ledger; public filings used for calibration only” directly under the project to prevent overclaiming.
6. Keep the M&A case as a fourth bullet or “Strategic stretch”; never present it as transaction experience.

## Interview proof sequence (90 seconds)

1. Start with the business question and planning cadence.
2. Show assumptions and the audit trail.
3. Explain one variance with PVM/root cause.
4. Show cash or profitability implication.
5. State recommendation, owner, timing and downside.
6. Close with controls and the evidence boundary (synthetic vs public vs pending external gates).

## Remaining evidence gates

- **Gate A:** redacted, real internal pre-close forecast snapshots sufficient to calculate observed Bias/WAPE.
- **Gate B:** native Power BI `.pbix` with Desktop QA-01–QA-18.
- These are deliberately visible in the CV evidence map and website; hiding them would weaken credibility.

