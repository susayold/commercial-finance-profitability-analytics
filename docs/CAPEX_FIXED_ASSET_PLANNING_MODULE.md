# CAPEX & Fixed-Asset Planning Module — Finance Analyst

Date: 2026-08-30  
Evidence class: SIMULATED / DERIVED unless explicitly marked otherwise.

## Purpose

A Finance Analyst should connect a capital request to budget control, cash timing, depreciation and the operating benefit required to earn back the investment. This module adds that bridge to the commercial-finance case without pretending that a synthetic project is a real approved investment.

## 1. Capex request and approval funnel

```
Idea → Business case → Approval → Committed order → Cash payment → In service → Benefit tracking
```

Every project has a stable project ID and cost-center owner. Approval status is separate from accounting status: an approved request is not automatically a paid asset.

| Stage | Required evidence | Owner | Release rule |
|---|---|---|---|
| Business case | purpose, baseline KPI, benefit owner | Function lead | No approval without baseline |
| Approval | capex committee reference and limit | CFO / controller | Approved amount is the budget ceiling |
| Commitment | purchase order or contract | Procurement | Commitment cannot exceed approval |
| Cash payment | invoice, payment date and currency | Treasury / AP | Cash forecast updated |
| In service | acceptance certificate and service date | Operations | Depreciation starts on service policy |
| Benefit tracking | incremental contribution or cost saving | FP&A | Stop/scale review at milestone |

## 2. Budget, actual and forecast bridge

```
Budget Variance = Actual Capex − Budget Capex
Forecast Variance = Actual Capex − Forecast Capex
Committed Gap = Committed Capex − Actual Capex
```

Positive budget variance is overspend. A negative actual in a period is not a saving until the project is rephased or cancelled through an approved decision log.

Required cuts:

- Project and cost center.
- Approved, in-review and cancelled status.
- Spend type: growth, maintenance, compliance or productivity.
- Budget, actual, committed and forecast.
- Payment month versus in-service month.
- Benefit owner and payback milestone.

## 3. Depreciation and asset register

```
Monthly Depreciation = Asset Cost ÷ Useful Life (months)
```

Depreciation begins only when the asset is in service under the stated accounting policy. Construction-in-progress remains cash/commitment until the service date.

Controls:

- Asset cost is not silently changed when actual spend is rephased.
- Useful life and start date require controller sign-off.
- Depreciation is separated from cash capex.
- Asset additions reconcile to the fixed-asset register and GL.

## 4. Investment economics

```
Payback Months = Asset Cost ÷ Expected Annual Contribution × 12
```

The contribution must be incremental after variable costs, not gross revenue. For a productivity project, use avoided cost only when the owner has a measurable baseline and a capacity-release plan.

| Decision metric | Guardrail | Decision |
|---|---|---|
| Payback months | ≤24 months unless strategic exception | Approve, re-scope or reject |
| Benefit realization | ≥80% of business-case run-rate by milestone | Continue or remediate |
| Budget overrun | ≤10% without reapproval | Rephase or return to committee |
| Committed cash | Within liquidity headroom | Sequence payment |
| Compliance capex | Required regardless of payback | Document non-financial rationale |

## 5. Scenario and cash timing

- **Base**: approved amount, planned payment month and service date.
- **Downside**: payment accelerates while benefit is delayed; show minimum cash impact.
- **Upside**: benefit ramps earlier but spend remains capped at the approved envelope.

A scenario must show capex cash, depreciation, contribution benefit and payback separately. Do not offset cash capex with an unverified future saving in the liquidity view.

## 6. Monthly finance cadence

| Timing | Activity | Output |
|---|---|---|
| WD-7 | Refresh project register and approval status | Capex pipeline |
| WD-5 | Update commitments and payment schedule | Cash forecast |
| WD-2 | Reconcile invoices and fixed-asset additions | Capex actual |
| WD+2 | Confirm in-service dates and depreciation | Fixed-asset bridge |
| WD+5 | Compare benefit run-rate with business case | Investment review |
| Quarterly | Re-rank pipeline under liquidity and hurdle constraints | Portfolio recommendation |

## 7. Worked synthetic readout

The warehouse automation project spends VND 1.2bn in January against a VND 1.0bn monthly budget, creating a VND 200m variance. The correct finance question is not simply “why overspent?”: the analyst must check whether the approved project envelope, commitment, service date and expected VND 800m annual contribution still support an 18-month payback.

The CRM upgrade starts depreciation in February because its in-service period is February, while January cash is still a pre-service investment. This separation prevents a cash forecast from being confused with the P&L depreciation line.

These values are synthetic demonstrations only.

## 8. Release controls

Before publishing a capex recommendation:

1. Project ID and cost center are unique at the period grain.
2. Approval status and approved amount are visible.
3. Budget, actual, committed and forecast reconcile.
4. Cash payment does not exceed commitment.
5. Depreciation follows service date and useful life.
6. Payback uses expected annual contribution, not gross revenue.
7. Liquidity scenario shows cash timing separately.
8. Evidence class and source system are visible.
9. Rephasing, cancellation and strategic exceptions are documented.
10. Fixed-asset additions reconcile to the GL register.

## Release boundary

This is a synthetic CAPEX/fixed-asset and investment-governance rehearsal. It is not evidence of VietNova's actual projects, approvals, cash payments, depreciation or realized returns. Replace the fixture with approved capex committee, procurement, AP, fixed-asset and GL extracts before production use.
