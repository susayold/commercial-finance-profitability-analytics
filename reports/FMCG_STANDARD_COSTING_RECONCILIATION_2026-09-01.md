# FMCG Standard Costing & Variance Reconciliation

**Status:** PASS  
**Scope:** 1296 month × SKU rows across 36 synthetic periods

## Purpose

This module adds an FMCG cost-accounting lens to the FP&A case. It separates standard cost, actual COGS, material-price variance, usage/yield variance, conversion variance and slow-moving inventory reserve. All decomposition is synthetic/derived because no plant bill-of-materials, purchase orders or physical-count evidence was supplied.

## Equations

- Standard COGS = Units × Standard Unit Cost.
- Material price variance = Units × (Actual material unit cost − Standard material unit cost).
- Usage/yield variance = Standard material unit cost × (Actual equivalent quantity − Standard equivalent quantity).
- Conversion variance = Actual COGS − Standard COGS − price variance − usage/yield variance.
- Inventory reserve = Inventory value × approved synthetic reserve rate.

## Results

- Periods: **36**
- Variance rows: **1296**
- Reconciliation failures: **0**
- Inventory reserve generated (VND): **3726469175.42**
- Inventory value covered (VND): **28811077460**

## Bridge control

| Control | Rule | Result |
|---|---|---|
| Standard-to-Actual COGS | Standard + PPV + yield + conversion = Actual COGS | PASS |
| SKU/category roll-up | Sum detail = period total | PASS |
| Reserve policy | Rate follows slow-moving/DIO bucket | PASS |
| Evidence boundary | Synthetic decomposition is labelled | PASS |

## Decision use

- Escalate repeated positive material-price variance to Procurement.
- Escalate adverse usage/yield variance to Operations/Supply Chain.
- Separate conversion variance from purchase-price inflation before setting new prices.
- Use reserve output in the balance sheet, cash and working-capital discussion only after policy approval.
