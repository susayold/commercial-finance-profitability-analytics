# Recruiter-first website content specification

## First screen

Headline: Commercial Finance & FP&A — from transaction detail to CFO decision.

Sub-headline: A reproducible Vietnam FMCG case connecting budget, forecast, profitability, cash conversion and risk.

Three proof cards:

- 28-tab formula-driven model with a visible PASS control gate.
- 36-month synthetic operating ledger with SKU/channel/customer detail.
- Decision outputs: PVM, promotion ROI, working capital, liquidity and scenario risk.

Primary buttons:

- Open Executive Output.
- Read the CFO memo.
- Inspect methodology and evidence policy.

## Page sections

### 1. Business problem

Explain that management needs to know not only whether revenue moved, but which driver, channel, customer and cash constraint explains the movement.

### 2. Role simulated

State the analyst responsibilities: monthly close, budget and forecast, variance bridge, commercial P&L, pricing/promotion review, working capital and CFO communication.

### 3. Data architecture

Show the flow: public annual reports and peer registry -> synthetic operating ledger -> finance model -> decision outputs.

### 4. Headline findings

Use only labelled synthetic outputs:

- FY2025 revenue: VND 80.1bn.
- FY2025 EBITDA proxy: VND 58.5bn.
- FY2025 average CCC: 54.8 days.
- Best channel contribution margin: 29.7%.
- Model status: PASS.

### 5. Decisions and actions

Show the three battle-card decisions: conditional marketing spend, customer discount tied to economics, and time-bound inventory buffer.

### 6. Interactive dashboard preview

Embed the Executive Output render and link to the Drive workbook. Explain actual versus base budget and the text-month axis.

### 7. Methodology

Document formulas, units, scenario assumptions, tolerance policy, data grain, deterministic seed and refresh rule.

### 8. Evidence policy

Use six labels: reported fact, calculated fact, synthetic fact, assumption, inference and recommendation. Explain that public filings calibrate context but do not supply private SKU/customer/promotion data.

### 9. Limitations

Call out proxy EBITDA/OCF, synthetic company, unit rounding tolerance, unapproved OCR candidates and the need for chart-of-accounts mapping in production.

### 10. Recruiter quick tour

Provide a 90-second path:

1. Open Executive Output.
2. Change scenario assumption.
3. Open Variance_Bridge and PVM.
4. Open Channel_Customer and Promotion_Pricing.
5. Open Working_Capital and Checks.
6. Read the CFO memo.

## Design and UX rules

- Answer-first copy, no dashboard gallery.
- Use VND million/billion in headline cards and full VND only in detail.
- Put evidence class and update date beside every headline metric.
- Keep a visible limitations panel.
- Make every download link remote and stable.

