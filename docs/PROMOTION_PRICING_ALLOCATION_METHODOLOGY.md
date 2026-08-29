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

The dedicated `Pricing_Simulator` tab and `data/pricing_simulator_synthetic.csv` show the full price-response chain:

```text
New price = baseline price × (1 + price change)
Volume response = elasticity × price change
New units = baseline units × (1 + volume response)
Scenario CM = new units × (new price − unit cost)
CM delta = scenario CM − baseline CM
```

For a constant unit-cost case, the non-zero break-even price change is calculated as:

```text
break-even ΔP = −(((baseline margin × elasticity) + baseline price)
                  ÷ (baseline price × elasticity))
```

The elasticity and unit-cost response are assumptions, not causal estimates. A real implementation should estimate elasticity from a valid experiment or historical counterfactual and add competitor-price, discount and capacity constraints before approval.

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

