# OPEX & Headcount Planning Module — Finance Analyst

Date: 2026-08-30  
Evidence class: SIMULATED / DERIVED unless explicitly marked otherwise.

## Purpose

A corporate Finance Analyst is expected to explain whether an OPEX variance is caused by people, pay, timing, discretionary spend or forecast error. This module provides the cost-center grain and a repeatable bridge from headcount to the management P&L.

## 1. Headcount bridge

```
Headcount Close
= Headcount Open + Hires − Exits
```

The bridge is kept by period, cost center and function. Do not overwrite the opening headcount after the month is closed; a correction becomes a new version.

| Driver | Definition | Owner | Guardrail | Decision |
|---|---|---|---|---|
| Opening headcount | Prior month approved close | HR finance | Must equal prior close | Freeze baseline |
| Hires | Start dates in the period | HRBP / FP&A | Approved requisition | Release vacancy budget |
| Exits | Termination date in period | HRBP | Exit reason captured | Reforecast capacity |
| Average headcount | (Open + Close) / 2 for monthly illustration | FP&A | Reconcile to payroll roster | Workforce cost |
| Closing headcount | Bridge output | Finance controller | No unexplained movement | Capacity and hiring plan |

## 2. Payroll and people-cost tree

```
Payroll = Average Headcount × Average Salary
Benefits = Payroll × Benefits Rate
People Cost = Payroll + Benefits + Bonus
```

The synthetic case uses a 15% benefits rate as an explicit assumption. Bonus is a separate line so a one-off accrual cannot be mistaken for structural salary inflation.

Required cuts:

- Cost center and function.
- Permanent versus contractor (when available).
- New hires versus replacement hires.
- Salary rate, benefits rate and bonus accrual.
- Cost per average FTE.
- Revenue or contribution per sales FTE for commercial teams.

## 3. Total OPEX and variance bridge

```
Total OPEX = People Cost + Non-payroll OPEX
Budget Variance = Actual OPEX − OPEX Budget
Forecast Variance = Actual OPEX − OPEX Forecast
```

Positive variance means overspend. The bridge should separate:

1. Headcount effect.
2. Salary-rate effect.
3. Benefits/bonus effect.
4. Non-payroll discretionary spend.
5. Timing or accrual effect.
6. Forecast model error.

Do not label a gross OPEX variance as “headcount-driven” until the payroll and roster controls agree.

## 4. Cost-center decision rules

| Signal | Trigger | Finance action | Escalation |
|---|---|---|---|
| Unapproved hiring | Hire with no approved requisition | Hold or rephase start date | Function lead + CFO |
| Vacancy underspend | Open role remains unfilled beyond plan | Rephase budget, do not bank permanent savings | FP&A lead |
| Salary inflation | Average salary > plan by 5% | Review grade mix and offer approvals | HR + Finance |
| Bonus spike | Bonus / payroll above plan by 10% | Split one-off accrual from run-rate | Controller |
| Discretionary OPEX | Non-payroll overspend >10% | Require ROI or stop/scale decision | Budget owner |
| Productivity gap | Revenue/FTE below plan for two periods | Revisit capacity, mix and route-to-market | Commercial director |

## 5. Scenario design

Use three controlled scenarios:

- **Base**: approved opening roster, hires and exits.
- **Downside**: delayed hires, lower revenue and no automatic cost cuts unless an owner action is approved.
- **Upside**: incremental commercial hiring only when contribution payback exceeds the hurdle.

A hiring scenario must show:

- Start month and ramp period.
- Fully loaded cost per FTE.
- Contribution or revenue capacity.
- Cash timing.
- Break-even month.
- Reversal plan if the demand signal fails.

The model should never treat an unfilled vacancy as a realized saving without a decision log.

## 6. Monthly operating cadence

| Timing | Finance activity | Output |
|---|---|---|
| WD-5 | HR roster and approved requisition extract | Opening roster |
| WD-3 | Validate hires, exits and salary changes | Headcount bridge |
| WD-1 | Accrue payroll, benefits and bonus | People-cost estimate |
| WD+2 | Tie payroll and OPEX to GL/cost centers | Closed actual |
| WD+4 | Explain budget/forecast variance | OPEX bridge |
| WD+5 | Agree hiring, rephase or spend actions | Recommendation register |

## 7. Worked synthetic readout

Across the three-month illustration, Sales closes March at 22 FTE after two hires and records VND 889.5m OPEX versus VND 880.0m budget. The VND 9.5m overspend is not automatically a hiring failure: the bridge must distinguish the incremental two hires, bonus timing and non-payroll spend. Marketing is VND 3.3m under budget in March despite a replacement hire, showing why the headcount bridge and the OPEX bridge must be read together.

These values are synthetic and demonstrate mechanics only.

## 8. Controls and evidence

Minimum controls before publishing:

1. Opening headcount equals prior approved closing headcount.
2. Hires and exits have dates and approval references.
3. Payroll arithmetic equals average headcount × salary within rounding tolerance.
4. Benefits and bonus are separated from salary.
5. Actual OPEX equals people cost plus non-payroll OPEX.
6. Budget and forecast variances recompute from source columns.
7. Cost center totals reconcile to the GL OPEX control account.
8. Evidence class and period status are visible.
9. Closed periods are immutable; revisions receive a new version.
10. Recommendation owners and review dates are recorded.

## Release boundary

This is a synthetic FP&A workforce and OPEX rehearsal. It is not evidence of VietNova's actual employees, salaries, cost-center spend or realized savings. Replace the fixture with approved HRIS, payroll, procurement and GL extracts before production use.
