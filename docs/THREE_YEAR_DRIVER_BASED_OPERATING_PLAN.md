# Three-Year Driver-Based Operating Plan

## Purpose

This module extends the monthly FP&A case into a strategic operating plan without using terminal-value logic. FY2026 is monthly for forecast linkage; FY2027 and FY2028 are quarterly for management review. It is a deterministic planning rehearsal based on the current synthetic VietNova operating and statement layers, not approved company guidance.

## Driver architecture

Revenue is built from volume, price and mix effects. Gross margin, controllable OPEX, headcount, CAPEX, DSO, DIO and DPO are explicit scenario drivers. The cash bridge then calculates CFO, pre-financing FCF, debt drawdown/repayment and closing cash subject to an VND 8bn minimum-cash guardrail.

| Scenario | Revenue growth | Gross-margin delta | OPEX growth | DSO / DIO / DPO | Decision use |
|---|---:|---:|---:|---:|---|
| Base | 6.0% | +0.5pp/year | 5.0% | 38 / 45 / 35 | Fund balanced growth |
| Upside | 10.0% | +1.2pp/year | 4.5% | 32 / 38 / 40 | Scale only where CM clears hurdle |
| Downside | -2.0% | -1.0pp/year | 7.0% | 52 / 60 / 28 | Protect cash and defer discretionary spend |

## Strategic initiatives and gates

The initiative register is in `data/planning/operating_plan_initiatives.csv`. Each initiative has an owner, investment, benefit metric, risk, stage gate and kill criterion. This prevents a long-range plan from becoming a list of unowned aspirations.

## Reconciliation and controls

- `data/planning/three_year_operating_plan.csv` contains 60 rows: 12 FY2026 monthly periods and 8 quarterly periods for each of FY2027-FY2028, across three scenarios.
- `data/planning/operating_plan_reconciliation.csv` proves the FY2026 driver bridge reconciles to the rolling-plan view with zero delta in the controlled rehearsal.
- `scripts/validate_three_year_operating_plan.mjs` checks P&L identities, cash roll-forward, CCC identity, minimum cash, scenario/grain coverage and initiative gate fields.
- No DCF terminal growth or equity-value assumption is used in this operating plan.

## Evidence boundary

All rows are `SIMULATED/DERIVED`. The current synthetic FY2025 baseline starts below the minimum-cash guardrail, so the plan deliberately surfaces a funding requirement rather than hiding it in a plug. Replace the FY2025 baseline and FY2026 assumptions with an approved internal forecast snapshot before using this as a live management plan.
