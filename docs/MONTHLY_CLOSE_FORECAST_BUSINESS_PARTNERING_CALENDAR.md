# Monthly Close, Forecast and Business Partnering Calendar

Date: 2026-08-30  
Scope: VietNova Finance Analyst / FP&A operating rhythm.

This is a synthetic operating-process design. It defines who provides what evidence, when the KPI pack is frozen, how variances are explained and when management decisions are escalated.

## Operating principles

- Close actuals, budget and forecast versions are separate immutable inputs.
- No post-close overwrite of a frozen forecast.
- Every variance has a driver, owner, action and review date.
- Finance publishes a decision pack only after reconciliations pass.
- Commercial speed is preserved through a pre-close flash, while final numbers wait for the accounting close.
- Evidence class remains visible: SIMULATED, DERIVED, ASSUMPTION or OBSERVED.

## Ten-day cadence

| Timing | Activity | Primary owner | Input | Output | Control / SLA | Escalation |
|---|---|---|---|---|---|---|
| WD-5 | Freeze latest forecast | FP&A lead | Forecast version, assumptions, approver | FROZEN snapshot | Created before actual availability; schema PASS | Missing approver → Finance manager |
| WD-4 | Sales flash and pipeline review | Sales finance | Orders, shipment plan, returns | Revenue risk/opportunity list | Top-account and channel cut complete | >5% revenue risk → Commercial director |
| WD-3 | Promotion and pricing checkpoint | Revenue growth manager | Campaign calendar, ASP, trade spend | Stop/scale proposals | ROI and CM hurdle tested | ROI <25% → CFO exception |
| WD-2 | Inventory / supply review | Supply-chain finance | Inventory aging, demand, lead time | DIO and service actions | A/B SKU coverage; aging exceptions | DIO +7 days → COO/CFO |
| WD-1 | Pre-close bridge | FP&A analyst | Flash P&L, PVM, WC | Pre-close commentary | Revenue/GP bridge residual reviewed | Unexplained residual → controller |
| WD0 | Accounting close | Financial controller | GL, AR/AP, inventory, accruals | Closed actuals | Trial balance and subledger tie-outs | Unreconciled balance → controller |
| WD+1 | Actuals load and QA | Finance systems | Closed actuals, mappings | Validated actual dataset | CoA mapping and sign checks | Mapping gap → systems owner |
| WD+2 | Variance and PVM review | FP&A analyst | Actual, budget, FROZEN forecast, PY | Driver bridge and exceptions | PVM reconciles within tolerance | Material unexplained variance → FP&A manager |
| WD+3 | Business partner challenge | Finance BP | Bridge, customer/channel P&L | Decisions and action owners | Battle-card guardrails applied | Red threshold → CFO |
| WD+4 | CFO pack sign-off | FP&A lead / CFO | MBR pack, recommendation register | Approved management pack | Evidence class and action completeness | Missing evidence → hold release |
| WD+5 | Publish and action follow-up | FP&A analyst | Signed pack, action tracker | Distributed pack and next review dates | Version/hash archived in Drive/GitHub | Late owner response → CFO office |

## RACI

| Deliverable | FP&A analyst | FP&A lead | Controller | Sales / Marketing | Supply Chain | CFO |
|---|---|---|---|---|---|---|
| Forecast freeze | R | A | C | C | C | I |
| Revenue and PVM bridge | R | A | C | C | I | I |
| Promotion ROI decision | R | A | I | R | I | C |
| Customer profitability | R | A | I | R | I | I |
| Inventory / CCC actions | R | A | C | I | R | C |
| Actuals reconciliation | C | A | R | I | C | I |
| MBR pack | R | A | C | C | C | A |
| Recommendation register | R | A | C | C | C | A |
| Gate A evidence | R | A | C | I | I | I |
| Gate B evidence | R | A | I | I | I | I |

R = Responsible, A = Accountable, C = Consulted, I = Informed.

## Required pack contents

At WD+4, the CFO pack must contain:

1. Executive KPI table: Actual, Budget, FROZEN forecast, Prior Year and variance.
2. Commercial P&L with gross-to-net and contribution bridge.
3. PVM explanation with residual and tolerance.
4. Channel/customer/SKU exceptions.
5. Promotion and pricing decisions.
6. DSO, DIO, DPO, CCC and liquidity actions.
7. Base/Upside/Downside boundaries.
8. Recommendation register with owner, value equation, guardrail and next review.
9. Evidence and control status.
10. Open items with due date and escalation owner.

## Close-quality scorecard

| Metric | Target | Red trigger | Response |
|---|---:|---:|---|
| Forecast freeze timeliness | 100% before WD-5 deadline | Any late freeze | FP&A lead root-cause review |
| Revenue/GP reconciliation | 100% within tolerance | Unexplained residual | Hold CFO pack |
| Action-owner completeness | 100% | Any unowned red item | CFO escalation |
| Evidence coverage | ≥98% mapped lines | <95% | Release as draft only |
| Pack issue timeliness | By WD+5 | Missed SLA | CFO office escalation |
| Forecast eligibility | 100% approved frozen rows | DRAFT rows included | Reject accuracy metric |

## Handoff rules

- The pre-close flash can be directional, but must not be labelled final actuals.
- The MBR pack may be distributed only after controller tie-out and FP&A lead sign-off.
- A recommendation can be conditional and still be useful; its reversal condition must be explicit.
- A missed SLA is an operating-control exception, not a reason to silently change a metric.
- Historical snapshots remain immutable so forecast learning is reproducible.

## Interview conversion

> I would run a WD-5 to WD+5 rhythm: freeze the forecast before close, reconcile actuals after close, explain the variance with PVM and profitability, challenge the commercial owners, and release the CFO pack only when evidence, owners and guardrails are complete. That shows both modelling skill and the operating discipline required in a Finance Analyst role.
