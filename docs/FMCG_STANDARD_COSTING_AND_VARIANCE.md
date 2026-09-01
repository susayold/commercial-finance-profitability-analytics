# FMCG Standard Costing & Variance Methodology

## Scope

The costing layer adds a manufacturing-style lens to the FP&A case while keeping the evidence boundary honest. It uses the current 36-SKU sales, product-master and warehouse-inventory fixtures; no plant BOM, purchase order or physical-count evidence is implied.

## Standard-cost master

`data/costing/standard_cost_master.csv` is sourced from `powerbi/data/current/product_master.csv` and preserves SKU, category, brand, lifecycle, list price and standard COGS. The master is the versioned baseline for unit-cost planning.

## Variance equations

- Standard COGS = Units × standard unit cost.
- Material price variance = Units × (actual material unit cost − standard material unit cost).
- Usage/yield variance = standard material unit cost × (actual equivalent quantity − standard equivalent quantity).
- Conversion variance = Actual COGS − Standard COGS − material price variance − usage/yield variance.
- Total COGS variance = Actual COGS − Standard COGS.

The decomposition is designed to reconcile exactly at month level. It is a synthetic allocation because the source does not contain purchase prices or production conversion hours.

## Inventory reserve policy

Warehouse rows are aggregated to month × SKU. Reserve rates are intentionally simple and reviewable:

| Trigger | Synthetic rate |
|---|---:|
| Slow-moving flag or days on hand > 120 | 15% |
| Days on hand > 90 | 8% |
| Otherwise | 1% |

Reserve = aggregated inventory value × policy rate. The output is a planning estimate, not an accounting provision recommendation.

## Decision use

- Repeated adverse material-price variance → Procurement action.
- Adverse usage/yield variance → Operations/Supply Chain action.
- Conversion variance → labour/overhead productivity review.
- Reserve increase → working-capital and cash-risk escalation.

## Rebuild and validation

```text
node scripts/build_fmcg_cost_variance.mjs
node scripts/validate_fmcg_cost_variance.mjs
```

Acceptance is 36 periods × 36 SKUs (1,296 detail rows), exact standard-to-actual bridges, valid reserve buckets and explicit synthetic/derived labels.
