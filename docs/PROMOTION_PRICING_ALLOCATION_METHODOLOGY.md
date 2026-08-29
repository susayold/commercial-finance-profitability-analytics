# Promotion ROI, pricing and fixed-budget allocation methodology

## Why this module exists

The commercial-finance plan requires a finance decision, not a gross-sales leaderboard. Every proposed promotion must show incremental contribution **after** variable cost and campaign spend; every allocation recommendation must conserve the approved budget.

## Promotion ROI

For each event:

```text
Incremental units = baseline units × modeled uplift
Incremental revenue = incremental units × net price
Incremental CM after spend = incremental revenue − incremental variable cost − promotion spend
ROI on spend = incremental CM after spend ÷ promotion spend
```

The hurdle is 25% in the synthetic case. Events at or above the hurdle are `APPROVE_WITH_GUARDRAIL`; the rest are `REJECT`. The uplift, variable-cost ratio and spend are assumptions, so the result is simulated and not causal evidence. Two negative-CM events are deliberately retained to make the stop-loss logic visible.

## Pricing simulator

The workbook's pricing rows use net price and modeled uplift as editable decision inputs. A real implementation should add elasticity estimated from a valid experiment or historical counterfactual. Until then, label the volume response as an assumption and show the break-even price/volume combination before recommending a price change.

## Fixed-budget reallocation

For each channel:

```text
Recommended budget = min(total approved budget × target share,
                         channel capacity,
                         current budget × (1 + max increase %))
Budget delta = recommended budget − current budget
Incremental contribution = budget delta × marginal ROI
```

The target shares are chosen so the recommended budgets sum exactly to the current approved total (VND 4.35bn). This is a reallocation, not an invented funding request. Capacity and maximum-increase caps are checked explicitly. Negative deltas are not automatically “bad”: they fund higher marginal-ROI channels while protecting a minimum presence in Wholesale.

## QA and evidence boundary

- `data/promotion_roi_synthetic.csv` and `scripts/validate_promotion_roi.mjs` recalculate units, revenue, contribution, ROI and hurdle decisions.
- `data/budget_reallocation_synthetic.csv` and `scripts/validate_budget_reallocation.mjs` recalculate conservation, caps, deltas and incremental contribution.
- All rows are `SIMULATED_DERIVED`; replace them with approved campaign/finance data before presenting observed ROI.

