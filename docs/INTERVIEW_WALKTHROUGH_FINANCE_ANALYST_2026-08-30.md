# Finance Analyst Interview Walkthrough — 2026-08-30

Purpose: present the portfolio as an operating-finance case in 15 minutes, with every claim tied to a durable artifact and evidence class.

## Evidence boundary

- `SYNTHETIC/DERIVED`: VietNova retail/e-commerce planning model, MBR pack, OPEX, CAPEX, pricing and promotion scenarios. These demonstrate method and controls, not company results.
- `PUBLIC_REPORTED/CALCULATED_PUBLIC`: MCH FY2016–FY2025 statement supplement and VNM/QNS/KDC peer context. These support historical analysis and benchmark context, not internal forecast accuracy.
- `FINANCE_DATA_CONTROLS`: finance data contract, 17-relationship topology, six report-ready views and QA-01..QA-18 evidence controls.
- `LIVE_INTERNAL`: not claimed until Gate A receives an approved real pre-close snapshot plus post-close actuals.

## 15-minute reviewer flow

| Minute | Screen/artifact | Message |
|---:|---|---|
| 0–2 | Recruiter site / decision layer | I built a driver-based Finance Analyst operating system, not a chart gallery. |
| 2–5 | Excel CFO output | Show Actual/Budget/Forecast, PVM, contribution and cash conversion. |
| 5–7 | MBR pack + recommendation register | Translate a variance into owner, action, guardrail and review date. |
| 7–9 | Working capital / OPEX / CAPEX | Connect P&L to cash, people cost and investment timing. |
| 9–11 | MCH public finance lens | Demonstrate source discipline, long-run trend analysis and caveats. |
| 11–13 | Finance data controls | Explain how source lineage, reconciliations and 17 relationships support controlled management reporting. |
| 13–15 | External-gates pack | State exactly what remains: real internal forecast evidence for live accuracy. |

## Core answers

### 1. Walk me through the project

“The business question is how management can explain revenue and margin movement, decide where to allocate commercial spend, and protect cash. I built a driver-based model with dimensions, sales/inventory/working-capital facts, budget and forecast versions, PVM logic, profitability, OPEX, CAPEX and risk overlays. The output is an executive pack plus an action register. Every headline is reconciled to a controlled source table, and synthetic/public evidence is labelled so I do not imply access to company-internal data.”

Open: recruiter site → Excel CFO Output → finance data contract → QA report.

### 2. Why did margin move?

“I do not explain margin with one blended percentage. I bridge revenue through price, volume, mix, discount/promotion, returns and cost of sales, then separate gross margin from operating expense and contribution. The bridge ends in a decision: which driver has an owner, what threshold triggers action, and when it will be reviewed.”

Open: PVM tab, profitability module, recommendation register.

### 3. How did you forecast?

“I freeze a forecast version before close, preserve the original value, record cutoff/model version/approver, and append actuals only after the actual-availability timestamp. Eligibility requires the same entity, period, currency and grain. Bias and WAPE are released only for eligible rows with closed actuals. The current fixture proves the control logic; it is not presented as live internal accuracy.”

Open: Gate A schema, live validator, forecast close calendar.

### 4. How did you handle data quality?

“I separate source identity from analytical calculation. I preserve original labels, record official URL, file hash, page anchor, entity scope and currency, and keep a rejection/exception ledger. For MCH, FY2020 was promoted only after the official HNX PDF was archived and statement pages tied to the approved supplement. FY2017 stays indexed-only because the official PDF bytes are not yet retrievable.”

Open: source registry, MCH runbook, FY2020 HNX archive.

### 5. What recommendation did the model produce?

“A recommendation is not just ‘increase budget’. The register specifies decision, value equation, owner, timing, hurdle/guardrail, downside and review date. Promotion ROI subtracts spend and applies the documented hurdle; fixed-budget allocation conserves the approved budget and checks capacity. Scenario outputs remain synthetic until operating data replaces the fixture.”

Open: promotion/pricing/allocation methodology and management recommendation register.

### 6. How did you connect profit to cash?

“I use DSO, DIO and DPO to explain the cash conversion cycle, then connect inventory and receivables actions to the forecast and liquidity view. The MBR pack includes a cash trigger and owner, while the CAPEX module separates approval, commitment, cash payment, depreciation and benefit timing. This prevents an accounting-profit recommendation from ignoring cash.”

Open: working-capital, liquidity, CAPEX and MBR modules.

### 7. What did you build for people cost and investment?

“The OPEX module rolls opening headcount through hires, exits, payroll, benefits, bonus and non-payroll spend, with budget/forecast variance. CAPEX tracks project approval, commitment, payment, depreciation, benefits and payback. Both modules are explicitly simulated/derived and are designed to be replaced by approved company data without changing the control contract.”

Open: OPEX/headcount and CAPEX QA reports.

### 8. What is the strongest limitation?

“The strongest limitation is evidence class, not a hidden modelling error. Forecast accuracy is fixture-only until a real approved pre-close snapshot and post-close actuals arrive. FY2017 MCH is comparative/corresponding-column evidence, not a standalone archived annual report. I make those boundaries visible rather than overclaiming.”

Open: master-plan evidence matrix and remaining-gates handoff.

### 10. What would you do in the first 30 days in the role?

“First I would map the chart of accounts and planning calendar, then lock the forecast-version and actual-availability controls. I would reconcile revenue, gross profit, OPEX and cash to the close pack, identify the top three driver variances, assign owners and establish a WD-5 to WD+5 cadence. After one closed cycle, I would replace the synthetic controls with governed internal evidence and publish a short action-oriented MBR.”

## Claims to avoid until gates close

- Do not say “I achieved X% forecast accuracy” without `LIVE_INTERNAL`, eligible count, actual-availability date and as-of date.
- Do not turn MCH FY2017 comparative evidence into a standalone annual-report claim.
- Do not describe synthetic promotion, pricing, CAC/LTV, OPEX or CAPEX outputs as realized company impact.

## Final handoff links

- [Recruiter site](https://vn-finance-fpa-case.sangkenny200.chatgpt.site)
- [Repository](https://github.com/susayold/commercial-finance-profitability-analytics)
- [External-gates execution pack](EXTERNAL_GATES_EXECUTION_PACK.md)
- [Remaining-gates handoff](REMAINING_GATES_HANDOFF_2026-08-30.md)
- [MCH source-verification runbook](MCH_SOURCE_VERIFICATION_RUNBOOK_2026-08-30.md)
