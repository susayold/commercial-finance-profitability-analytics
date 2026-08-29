# Commercial stretch-module QA — 2026-08-30

## Scope

This release hardens the promotion/pricing and fixed-budget allocation tabs in `VietNova_FPA_Model_v2.xlsx`. The previous model showed incremental contribution but did not subtract campaign spend or prove budget conservation. The revised workbook and standalone CSVs make both controls explicit.

## Promotion ROI

| Check | Result |
|---|---|
| Rows | 8 events |
| Formula chain | baseline units × uplift → incremental revenue → variable cost → promotion spend → CM after spend → ROI |
| Hurdle | 25.0% |
| Negative CM events | 4 |
| Decision rule | ROI ≥ hurdle = Approve with guardrail; otherwise Reject |
| Validator | PASS (5 checks) |

Aggregate incremental CM after spend is VND 347.75m. This is a simulated decision output, not observed company impact and not a causal promotion-lift estimate.

## Fixed-budget reallocation

| Check | Result |
|---|---|
| Channels | 5 |
| Current approved budget | VND 4.35bn |
| Recommended budget | VND 4.35bn |
| Conservation delta | VND 0 |
| Constraints | Capacity and maximum-increase caps pass |
| Net modeled incremental contribution | VND 55.0m |
| Validator | PASS (6 checks) |

The allocation is a reallocation, not a request for new budget. Target shares, caps and marginal ROI are explicit inputs; every row is labelled `SIMULATED_DERIVED`.

## Pricing simulator

| Check | Result |
|---|---|
| Scenarios | 6 price/elasticity cases across five channels |
| Formula chain | New price → volume response → new units → scenario contribution → CM delta |
| Break-even | Non-zero break-even price change shown for every case |
| Negative CM delta cases | 2 |
| Validator | PASS (7 checks) |

The elasticity response is an assumption. The simulator is a decision-support sensitivity, not a causal demand estimate.

## Workbook spot-check

- `Promotion_Pricing` now exposes columns A:N, including promotion spend, CM-after-spend, ROI, hurdle, decision and evidence class.
- `Budget_Allocation` now exposes target share, recommended budget, budget delta, incremental contribution and evidence class.
- `Pricing_Simulator` now exposes elasticity, new price, volume response, contribution delta and break-even price change.
- `Checks` adds a fixed-budget conservation row; `MODEL STATUS` remains PASS.
- `Executive_Output` reports promotion CM **after spend**, not pre-spend incremental CM.
- Formula/error scan remains zero-match in the base builder output; enhanced ranges were inspected after patching.

## Evidence boundary

All granular promotion, price-response and allocation inputs are synthetic assumptions. Replace them with approved campaign actuals, finance spend and a defensible counterfactual before using observed ROI language.

