# Finance Analyst / FP&A Interview Talk Track

## Positioning

Target roles: Junior FP&A Analyst, Finance Analyst, Business Finance Analyst and Commercial Finance Analyst.

One-line positioning:

> I built a source-controlled commercial-finance case that starts with transaction detail, reconciles to a management P&L, explains price/volume/mix and channel profitability, tests working-capital and liquidity risk, and translates the result into an owner-backed CFO action.

## 90-second opening

> This is a fictional Vietnam FMCG company, so I separate public evidence from simulated operating data. I built a 28-tab formula-driven FP&A model over 36 months and 2,160 invoice-line records. The model links actuals, budget, forecast versions, PVM, product/customer/channel profitability, promotion economics, working capital, liquidity and scenarios.  
>
> The business question is not simply whether revenue grew. It is whether growth converted into contribution profit and cash. The Base case shows VND 82.5bn revenue, a VND 12.9bn EBITDA proxy (gross profit less controllable OPEX) and a 54.0-day cash-conversion cycle; these are synthetic management outputs from one scenario source. I then use visible checks, source labels and disclosed rounding tolerances so a reviewer can trace the answer.  
>
> As an external evidence extension, I analysed Vinamilk public AGM/IR guidance from FY2018–FY2025. Revenue WAPE was 2.79% and PBT WAPE was 4.89%, which demonstrates why a finance analyst should forecast margin drivers separately from top line. This proxy is explicitly not internal forecast accuracy.

## 15-minute reviewer walkthrough

### Minute 0–2: Frame the decision

Open the website and state:

- The CFO decision is how to fund growth while protecting contribution and cash.
- The company and operating ledger are simulated.
- Public filings are used only for calibration and peer context.

Expected artifact: production website and README.

### Minute 2–5: Show the executive answer

Open Excel v2 tabs 'CFO_Output' and 'Checks'.

Point out:

- Actual vs budget vs forecast vs prior year separation.
- Revenue, contribution margin, CCC and liquidity.
- Base/Upside/Downside scenario selector.
- Nine visible finance controls and zero formula-error scan.

Do not start with the code or the data generator.

### Minute 5–8: Trace one variance to its driver

Use 'Variance_Bridge' and 'PVM_Bridge':

1. Identify the largest revenue or contribution variance.
2. Decompose it into volume, price, mix, discount, cost and residual.
3. State whether the issue is structural or timing-related.
4. Assign an owner and review date.

Expected proof: bridge reconciles to the P&L within the documented tolerance.

### Minute 8–10: Test commercial quality

Open 'Channel_Customer' and 'Promotion_Pricing':

- Compare revenue growth with contribution after rebates, fees and cost-to-serve.
- Show the 25% contribution hurdle.
- Explain why a high-revenue customer can be economically weak.
- Distinguish simulated recommendation from realized impact.

Expected answer: fund growth only when incremental contribution clears the hurdle and stop-loss rules.

### Minute 10–12: Show cash discipline

Open 'Working_Capital' and 'Debt_Liquidity':

- Explain DSO, DIO, DPO and CCC.
- Show the illustrative June escalation flag.
- Link slower collection or inventory build to revolver headroom.
- State a cash-release action with owner and timing.

Expected answer: cash risk is managed as an operating agenda, not only as a finance ratio.

### Minute 12–14: Demonstrate forecast governance

Open the frozen capture archive and public-guidance analysis:

- DEMO_FIXTURE rows are controlled synthetic evidence.
- FUTURE_LEAKAGE and NOT_ELIGIBLE rows are excluded.
- Public-guidance observations are separate and marked Gate A excluded.
- Bias identifies systematic direction; WAPE measures total miss magnitude.
- PBT WAPE of 4.89% versus revenue WAPE of 2.79% supports a driver-based margin forecast.

Expected answer: never publish internal forecast accuracy without a pre-close snapshot, cutoff, model version and approver.

### Minute 14–15: Close with controls and next step

Open the Power BI source handoff and Controls & Evidence design:

- The semantic contract has 5 dimensions, 9 facts, 15 relationships, 6 pages and 18 QA tests.
- The PBIP checklist is ready for Desktop execution.
- Native PBIX is intentionally still an external gate.
- In a real company, the next step is to load approved ERP/CRM/forecast extracts and obtain finance-owner sign-off.

## Evidence map for common questions

| Interview question | Answer structure | Evidence |
|---|---|---|
| How did you ensure the model was reliable? | Tie-outs, row counts, sign checks, formula scan, disclosed tolerance | v2 'Checks', validation report |
| Why synthetic data? | Protect confidentiality; make mechanisms reproducible; label every claim | Claim governance, hidden-truth spec |
| What drove the forecast miss? | Separate volume, price, mix, cost and timing; show bridge and exclusions | Forecast methodology, frozen archive |
| Which channel would you fund? | Compare incremental contribution after all channel costs to hurdle | Channel/customer and promotion tabs |
| How would you improve cash? | Quantify DSO/DIO/DPO levers and liquidity headroom | Working Capital, Debt/Liquidity |
| What is the strongest insight? | Revenue growth is not enough; margin and cash conversion decide quality | CFO memo, website |
| What remains incomplete? | Real pre-close snapshot and native PBIX visual QA | Definition-of-Done audit |
| How would you work with non-finance teams? | Translate driver to owner, guardrail, action and review date | Battle cards, CFO memo |

## Three STAR stories

### Story 1 — Building a controlled model

- Situation: Management needed a monthly view connecting sales detail to profit and cash.
- Task: Build a model that a reviewer could audit, not just a dashboard.
- Action: Separated assumptions, facts, calculations and outputs; added nine controls, row-count checks and tie-outs.
- Result: The v2 model reconciles its core views, has zero formula-error matches and provides a five-minute reviewer path.

### Story 2 — Protecting contribution quality

- Situation: A channel showed attractive revenue growth but rising fees, rebates and fulfillment cost.
- Task: Decide whether to continue funding growth.
- Action: Built channel/customer contribution and a 25% hurdle, then tested promotion economics and stop-loss rules.
- Result: The recommendation is based on incremental contribution and cash quality, not headline revenue.

### Story 3 — Making forecast accuracy leakage-safe

- Situation: A forecast-versus-actual metric can be overstated if actuals are visible at snapshot time.
- Task: Design a defensible accuracy control.
- Action: Required immutable snapshot ID, cutoff timestamp, model version, approver and actual-availability date; excluded future-leakage and draft rows.
- Result: Synthetic backtest mechanics are reproducible, and the public-guidance proxy is transparently kept outside the internal Gate A claim.

## Pushback answers

### “Why not use only real public-company data?”

Public filings provide annual totals and selected ratios, but not SKU, customer, promotion or internal forecast detail. I use official filings for calibration and benchmarking, then label the granular operating ledger as simulated.

### “Why is Power BI not complete?”

The portable contract, DAX, QA matrix and Desktop checklist are complete. A native PBIX must be created in Power BI Desktop because the visual model and binary cache cannot be honestly fabricated as text. I prefer an explicit open gate over claiming a placeholder.

### “Are the VNM guidance metrics forecast accuracy?”

No. They are AGM/IR public-guidance observations. They demonstrate forecast-versus-actual analysis but lack an internal model version, immutable cutoff and approver, so they are not Gate-A eligible.

### “What would you change in production?”

I would connect approved ERP/CRM extracts, lock the chart-of-accounts mapping, add refresh monitoring, obtain controller sign-off, and replace the demo snapshot with a genuine pre-close forecast archive.

## Closing sentence

> The project shows how I would operate as a finance analyst: define the decision, reconcile the number, explain the driver, quantify the trade-off, assign the action and preserve an audit trail.

## Equity-research extension (5-minute optional path)

If the interviewer asks about public-company analysis, use this sequence:

1. **Thesis:** “MCH is a durable long-run earnings franchise, but the FY2025 margin reset and cash-conversion drop make the current view watch / conditional upside.”
2. **Evidence:** Show the FY2016–FY2025 table: revenue CAGR 9.24%, PAT CAGR 10.34%, operating margin 29.17% in FY2024 versus 25.41% in FY2025, and CFO/PAT 116.50% versus 31.52%.
3. **Judgement:** Explain that profit remains positive, but cash conversion is the highest-value question; do not call it distress without debt, cash and maturity evidence.
4. **Valuation:** Show the Base/Upside/Downside FCFF/DCF frame and the VND 40,673.8bn–101,614.9bn EV range. Explain that 67.15% of Base EV is terminal value, so assumptions matter.
5. **Boundary:** State that no equity value or price target is published without net debt/net cash, diluted shares, current price and an approved forward forecast.

**One-line answer:** “I used the research pack to form a falsifiable view and a diligence list, not to manufacture a target price from incomplete evidence.”


## Customer profitability and concentration extension

I added a 24-customer profitability layer that bridges gross-to-net leakage, contribution, DSO and an illustrative working-capital cost. The top five accounts represent 28.62% of gross sales and 30.88% of after-WC contribution in the synthetic rehearsal. The important Finance Business Partner signal is C06: high revenue but 14.58% contribution margin and 88.72-day DSO, so I would review trade terms, service cost and payment terms before protecting incremental volume.
