# Inventory Quality, Shrinkage & Wastage Methodology

**Status:** SYNTHETIC / REHEARSAL  
**Coverage:** 36 rows (12 months × 3 categories), January–December 2026  
**Unit:** units and VND

## Decision question

Which inventory pools are tying up cash or creating gross-margin risk through aging, write-offs and unexplained shrinkage?

## Inventory roll-forward

For each month and category:

```text
Available units
= Opening units + Purchases + Transfers in − Transfers out
```

```text
Closing units
= Available units − Sales − Write-off units − Shrinkage units
```

```text
Closing inventory value
= Closing units × Unit cost
```

The validator requires closing units and value to tie exactly to these formulas. Negative closing units are rejected.

## Aging and reserve

Closing inventory value is split into:

- 0–30 days;
- 31–60 days;
- 61–90 days;
- >90 days.

The four buckets must sum to closing inventory value. An obsolete reserve is applied only to the >90-day bucket using the category reserve rate:

- VietSpice: 40%;
- QuickBowl: 60%;
- PulseUp: 50%.

These rates are synthetic policy assumptions and are not accounting-policy guidance for a real company.

## Quality KPIs

```text
Wastage rate
= Write-off units ÷ Available units
```

```text
Shrinkage rate
= Shrinkage units ÷ Available units
```

```text
Aged inventory share
= Inventory value aged >90 days ÷ Closing inventory value
```

```text
Potential gross-margin impact
= (Write-off units + Shrinkage units) × Unit cost
```

The potential impact is a management signal; it must not be presented as an audited COGS adjustment without the company's accounting treatment.

## Management readout

- QuickBowl's >90-day aging share is deliberately higher than the other categories and increases from 15% to 18% from July onward, creating a targeted reserve and markdown review trigger.
- Write-off and shrinkage are tracked separately so controllable operational loss is not hidden inside a generic inventory variance.
- The recommended operating response is category-specific: review QuickBowl replenishment and expiry policy, investigate shrinkage by location/warehouse, and approve write-offs through a documented owner.
- The schedule is designed to feed the `15_Inventory`, working-capital and liquidity views; it does not replace invoice or warehouse-system evidence.

## Controls

1. 36 rows with 12 months per category.
2. Opening units roll to prior closing units.
3. Inventory roll-forward reconciles.
4. Closing value equals closing units × unit cost.
5. Aging buckets reconcile to closing value.
6. Reserve equals >90-day value × reserve rate.
7. Wastage and shrinkage rates recalculate from available units.
8. Evidence class remains SYNTHETIC_REHEARSAL.

## Limitations

No physical count, warehouse scan, expiry ledger, GRN, batch/lot data or accounting reserve approval is provided. A real-company conclusion requires those source records and an agreed treatment under the company's accounting policy.
