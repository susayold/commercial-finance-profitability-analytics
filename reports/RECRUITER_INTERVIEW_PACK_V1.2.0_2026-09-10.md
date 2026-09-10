# Recruiter Interview Pack — FP&A / Commercial Finance v1.2.0

**Project:** VietNova Consumer JSC — Commercial Finance & FP&A Portfolio  
**Target roles:** FP&A Analyst / Intern, Commercial Finance Analyst, Finance Business Partner (entry level), Financial Analyst, Management Accounting / Cost Finance  
**Evidence boundary:** portfolio project using controlled simulated / derived operating data plus separately labelled public-company evidence. No live ERP access, statutory-close ownership, employer impact, or live forecast-accuracy claim is implied.

---

## 1. Recruiter review path — 2 minutes

1. Open the public portfolio homepage and read the business question.
2. Open the **Excel FP&A Model Showcase**.
3. Scan the workbook map and four workbook snapshots.
4. Download `VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx`.
5. Review these six sheets first:
   - `01_Assumptions`
   - `03_PnL_Variance`
   - `04_Commercial`
   - `06_Scenario`
   - `07_Forecast_Accuracy`
   - `09_Controls`
6. If more depth is needed, open the Executive Dashboard, Monthly Business Review pack, three-statement reconciliation, and rolling-origin forecast report.

This order lets a recruiter validate both **finance thinking** and **Excel execution** before reading technical documentation.

---

## 2. 60-second project pitch

> I built an end-to-end FP&A and Commercial Finance case for a fictional Vietnam FMCG company to simulate how a Finance Analyst moves from operating data to management decisions. I reconciled invoice-level sales into a management P&L, analysed channel and customer profitability after COGS, fees and trade spend, modelled working-capital drivers through DSO, DIO, DPO and cash conversion cycle, and built Base, Upside and Downside scenarios. I also added a leakage-safe rolling-origin forecast backtest, where the pre-specified seasonal-naive benchmark achieved roughly 1.2% WAPE on simulated historical data, while keeping live forecast Gate A open because no genuine pre-close forecast exists. To make the work reviewable, I packaged the analysis into a 12-sheet Excel FP&A model, management reporting outputs, controls, QA checks and a recruiter website. The main thing I learned is that strong finance analysis is not only about producing numbers — the model also has to reconcile, explain the driver, support a decision, assign an owner and preserve an auditable evidence boundary.

---

## 3. 3-minute management walkthrough

### 0:00–0:30 — Business question

The project starts with one management question:

**Which growth, margin and working-capital drivers should management act on next month?**

Rather than building disconnected dashboards, every module is tied back to that question.

### 0:30–1:15 — P&L and profitability

I first reconcile operating data into a management P&L. The management bridge is:

**Gross Sales – Discounts – Returns = Net Revenue – COGS = Gross Profit – Channel Fees – Trade Spend = Contribution – Controllable OPEX = EBITDA Proxy.**

Then I analyse channel, customer, SKU and promotion economics so growth is not treated as automatically good growth. The commercial decision rule asks whether contribution margin remains above the hurdle after fees and trade spend.

### 1:15–1:50 — Working capital and scenario

I connect operating decisions to cash through DSO, DIO, DPO and CCC. The model includes action triggers such as a DSO deterioration, inventory-days increase or shortened payable period. Scenario analysis then tests Base, Upside and Downside assumptions rather than relying on one-point forecasts.

### 1:50–2:25 — Forecast governance

The project separates three evidence levels: mechanics rehearsal, historical out-of-sample backtest and genuine live forecasting. The rolling-origin backtest is leakage-safe and uses only information available at each forecast origin. The seasonal-naive benchmark outperformed the trend and ensemble challengers across 1M, 3M and 6M WAPE, so complexity is not promoted without value-add.

### 2:25–3:00 — Controls and decision output

The final output is not just a model. It includes reconciliation checks, action owners, guardrails, review dates, release identity and claim boundaries. The project is designed around the operating sequence:

**reconcile → explain → decide → assign → control → reproduce.**

---

## 4. 10-minute technical / financial walkthrough

### Minute 0–1 — Context and architecture

Explain the fictional FMCG context, the decision question, source layers and evidence taxonomy. State clearly that operating detail is simulated / derived and that the portfolio does not claim employer impact or live ERP ownership.

### Minute 1–2 — Excel model architecture

Open `00_Cover` and explain why the workbook is separated into 12 sheets instead of one large tab. Show the logic:

**Documentation → Assumptions → Actuals → Analysis → Scenario / Forecast → Controls → Skills / Change Log.**

Mention formula-driven modelling, cross-sheet references, data validation, conditional formatting and change control.

### Minute 2–3 — Management P&L and variance

Open `03_PnL_Variance`. Explain Actual vs Budget vs Forecast logic, variance amount, variance percentage, favourable / unfavourable interpretation and how the P&L bridge ties to management reporting.

### Minute 3–4 — Commercial profitability

Open `04_Commercial`. Demonstrate `SUMIFS`, the channel selector and contribution-margin hurdle. Explain why revenue growth can destroy value if fees, trade spend or variable commercial costs rise faster than net revenue.

### Minute 4–5 — Working capital

Open `05_Working_Capital`. Walk through DSO, DIO, DPO and CCC and connect movements to collections, replenishment, supplier terms and liquidity decisions.

### Minute 5–6 — Scenario planning

Open `06_Scenario`. Show the Base / Upside / Downside selector built with data validation and `INDEX` / `MATCH`. Explain that scenarios are decision ranges, not three independent forecasts.

Controlled FY2025 scenario snapshot:

| Metric | Base | Upside | Downside |
|---|---:|---:|---:|
| Revenue (VND bn) | 82.5138 | 85.7182 | 76.9061 |
| Gross Profit (VND bn) | 26.9150 | 31.1886 | 18.6342 |
| EBITDA Proxy (VND bn) | 12.8956 | 17.4496 | 3.4933 |
| EBITDA Margin | 15.6284% | 20.3570% | 4.5423% |
| Contribution (VND bn) | 24.2074 | 28.4810 | 15.8724 |
| CCC | 54 days | 48 days | 68 days |

### Minute 6–7 — Forecast accuracy and model governance

Open `07_Forecast_Accuracy`. Explain Bias and WAPE and the distinction between historical out-of-sample evidence and live forecast evidence.

Primary seasonal-naive results on **SIMULATED_HISTORICAL_BACKTEST** data:

| Horizon | Eligible forecasts | Bias | WAPE |
|---|---:|---:|---:|
| 1M | 24 | +0.2510% | 1.1734% |
| 3M | 22 | +0.1558% | 1.1554% |
| 6M | 19 | +0.1125% | 1.1782% |

State explicitly: **Gate A remains OPEN by design** until a genuine pre-close frozen forecast and later post-close actual exist.

### Minute 7–8 — Costing and three statements

Explain that detailed 36-SKU costing is a standalone rehearsal and is explicitly isolated from core COGS to avoid false reconciliation. Then explain the integrated model controls across P&L, balance sheet, cash flow, debt, PP&E, working capital and retained earnings.

### Minute 8–9 — QA and governance

Open `09_Controls`. Show PASS / OPEN logic, reconciliation checks and why model controls are part of finance quality rather than a software-only concern. Mention the change log and deterministic rebuild / validation approach.

### Minute 9–10 — Management decisions

Finish with the decision framework:

- stay Base until commercial ROI and cash-release actions are confirmed;
- move toward Upside only when contribution-margin and working-capital guardrails are satisfied;
- use Downside actions when demand, margin, collections or liquidity triggers breach;
- assign owners and review dates rather than ending with descriptive analysis.

Close with: **“I built the project to demonstrate not only that I can calculate finance metrics, but that I can turn them into controlled, reviewable management decisions.”**

---

## 5. CV-ready project bullets

Use **3–4 bullets maximum** on the CV. Do not list every module.

### Recommended 4-bullet version

- Built an end-to-end **FP&A / Commercial Finance model** linking operating drivers to management P&L, three-statement outputs, working capital and scenario planning, with reconciliation and control checks across 36 months of simulated operating history.
- Analysed **channel, customer, SKU and promotion profitability** after COGS, fees and trade spend; translated contribution-margin and working-capital signals into management guardrails, owners and review actions.
- Developed a leakage-safe **rolling-origin revenue forecast backtest** at 1M / 3M / 6M horizons; the pre-specified seasonal-naive benchmark achieved **1.17% / 1.16% / 1.18% WAPE** on controlled simulated historical data and outperformed trend / ensemble challengers.
- Packaged the case into a **12-sheet Excel FP&A workbook**, recruiter website, management review pack and deterministic QA framework covering variance analysis, scenario selectors, forecast governance, change control and evidence boundaries.

### Compact 3-bullet version

- Built a controlled FP&A model covering management P&L, profitability, working capital, scenarios and reconciled three-statement outputs across 36 months of simulated FMCG operating data.
- Converted channel/customer/SKU economics and DSO/DIO/DPO drivers into margin, liquidity and management-action guardrails; implemented Excel `SUMIFS`, `INDEX/MATCH`, validation, conditional formatting and control checks in a 12-sheet workbook.
- Backtested revenue forecasts using leakage-safe rolling origins; seasonal-naive WAPE was ~**1.2%** at 1M/3M/6M on **simulated historical OOS data**, with live accuracy Gate A intentionally left open.

---

## 6. Interview Q&A

### Q1. Why did you build this project?

I wanted a portfolio project that reflects the actual workflow of FP&A and Commercial Finance rather than only a dashboard or valuation model. The goal was to show how I would move from raw operating data to a reconciled P&L, explain drivers, test scenarios, analyse cash and profitability, and then turn the result into a management recommendation.

### Q2. What is the strongest part of the project?

The strongest part is the integration. P&L, profitability, working capital, forecasting, scenarios and controls are not separate exercises. They feed one operating question and end in management actions with owners and guardrails.

### Q3. What Excel skills does the workbook prove?

It demonstrates cross-sheet modelling, `SUM`, `IF`, `IFERROR`, `SUMIFS`, `INDEX/MATCH`, data validation, scenario and channel selectors, conditional formatting, charts, reconciliation controls, financial number formatting and structured change documentation.

### Q4. Why did you use seasonal naive as the primary forecast model?

It was pre-specified as a transparent benchmark suitable for recurring seasonality. In the rolling-origin test it produced lower WAPE than both the linear-trend and 50/50 ensemble challengers at all governed horizons. I would not choose a more complex model unless it creates measurable out-of-sample value.

### Q5. Can you say your forecast achieved 1.2% WAPE in real business use?

No. That would overstate the evidence. The result is from a leakage-safe rolling-origin backtest on simulated historical operating data. A live claim requires a genuine forecast frozen before the actual is known and then compared with the later post-close actual. That Gate A remains open.

### Q6. What is the main profitability metric you use?

Management contribution is net revenue minus COGS and commercial variable costs such as channel fees and trade spend. I use contribution margin to test whether growth remains economically attractive after commercial costs.

### Q7. How do you connect working capital to management action?

I monitor DSO, DIO, DPO and CCC and translate movements into specific actions. For example, a DSO deterioration points toward collections and customer-payment review, while rising DIO can trigger replenishment restraint on slow-moving SKUs.

### Q8. Why is detailed SKU costing not forced into the core COGS?

Because the detailed 36-SKU costing data is a separate rehearsal dataset. Forcing it into the core P&L would create false precision and false reconciliation. I label it `NOT_CORE_COGS` and keep the evidence boundary explicit.

### Q9. How do you ensure the model is correct?

I use reconciliation gates rather than relying on visual inspection: balance-sheet equality, cash-flow ties, retained-earnings roll-forward, working-capital and PP&E/debt subledger checks, forecast ordering checks, cross-page consistency, release identity and recruiter-link validation.

### Q10. What would you do differently with real company data?

I would replace simulated operating inputs with controlled ERP / GL extracts, map the chart of accounts and master-data definitions, reconcile to the statutory or management close, establish an approved budget / forecast version, document cut-off dates and owners, and only then publish live variance or forecast-accuracy claims.

### Q11. What did you learn from the project?

The biggest lesson is that finance analysis needs governance. A number is only useful when I can explain where it came from, reconcile it, identify the driver, connect it to a decision, and state what evidence is still missing.

### Q12. Which roles does this project fit best?

The strongest fit is FP&A and Commercial Finance. It also supports Financial Analyst, Finance Business Partner, Management Accounting and Cost Finance applications. It is not positioned as a dedicated M&A or Project Finance project.

---

## 7. Claim-safe language

### Safe to say

- “I built an FP&A / Commercial Finance portfolio model.”
- “The project uses simulated / derived operating data.”
- “The historical rolling-origin backtest achieved approximately 1.2% WAPE on simulated out-of-sample data.”
- “The workbook contains 12 reviewable sheets with formulas, controls and scenario logic.”
- “The integrated model reconciles under the project’s controlled assumptions.”

### Do not say

- “I improved a real company’s EBITDA / cash flow.”
- “I owned a statutory close.”
- “I worked directly with a live ERP in this project.”
- “My live forecast achieved 1.2% WAPE.”
- “The SKU costing data reconciles to the core P&L” when it is explicitly a standalone rehearsal.

---

## 8. Interview close

A strong close after the walkthrough is:

> The project is intentionally broader than a spreadsheet exercise. I wanted to demonstrate the full Finance Analyst loop: reconcile the numbers, explain the movement, quantify the decision, assign an action, control the output and make the work reproducible. The Excel workbook gives you something concrete to audit, while the website and reports show how I communicate the same analysis to management.

---

## 9. Freeze rule

This project is **feature-frozen** after recruiter packaging. Add new work only for:

- a verified numerical or formula defect;
- a broken recruiter link / site build;
- new genuine external evidence, especially a real frozen pre-close forecast plus later actual for Gate A;
- security / dependency maintenance;
- a specific target-job requirement that materially improves fit.

Do **not** add unrelated modules, Power BI scope, M&A valuation, project-finance debt sculpting or other features merely to make the repository larger.
