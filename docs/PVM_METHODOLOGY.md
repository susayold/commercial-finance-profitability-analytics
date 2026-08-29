# Price–Volume–Mix and Margin Bridge Methodology

## Objective

Explain movement between a comparison period and the selected period in a way that reconciles exactly to the headline revenue or contribution movement.

## Revenue bridge

For each SKU-channel pair with a comparable base:

- Base quantity: Q0
- Actual quantity: Q1
- Base net price: P0
- Actual net price: P1

Use a sequential bridge:

1. Volume effect = (Q1 − Q0) × P0
2. Price effect = (P1 − P0) × Q1
3. Mix effect = residual needed to reconcile the aggregated bridge when the portfolio composition changes

For a transparent portfolio implementation, calculate the bridge at SKU-channel grain, aggregate effects, then show:

Actual Net Sales − Base Net Sales − Volume − Price − Mix = Residual

The residual must be zero or within the disclosed VND 100m deterministic rounding tolerance.

## Commercial deductions

Discounts, returns and rebates are shown separately when the source ledger supports them:

- Discount effect = Actual discounts − Base discounts
- Return effect = Actual returns − Base returns
- Rebate effect = Actual rebates − Base rebates

Do not hide these deductions inside a generic price effect when management needs to decide promotion or trade terms.

## Margin bridge

A contribution bridge follows the same order:

- Volume contribution at base contribution per unit
- Price / realization effect
- Mix effect
- Unit COGS effect
- Trade-spend / platform-fee effect
- Fulfilment and variable-cost effect
- Labeled residual

## Edge-case rules

- New SKU or new channel: base quantity is zero; classify separately as new-business effect.
- Discontinued SKU: actual quantity is zero; classify separately as lost-business effect.
- Zero-volume base rows: do not divide by zero; use explicit new/discontinued classification.
- Partial months: do not compare incomplete actual periods to complete budget periods without a caveat.
- Aggregation: calculate at the lowest reliable common grain before summing.
- Rounding: retain full precision in formulas and round only at display.

## Interpretation

The bridge is descriptive, not causal. It identifies where the financial movement sits; it does not prove that a single commercial action caused the movement without a valid counterfactual.
