# Inventory Quality QA

**Date:** 2026-08-30  
**Input:** `data/inventory_quality_synthetic.csv`  
**Validator:** `scripts/validate_inventory_quality.mjs`

- Overall: **PASS**
- Evidence class: **SYNTHETIC_REHEARSAL**
- Summary: Inventory quality QA: 9/9 checks PASS; status=PASS; evidence=SYNTHETIC_REHEARSAL

## Checks

- PASS — row_count_36: rows=36
- PASS — category_month_coverage: VietSpice=12; QuickBowl=12; PulseUp=12
- PASS — opening_roll_forward: opening units tie to prior closing units
- PASS — inventory_roll_forward: closing units formula and non-negative stock
- PASS — inventory_value_tie_out: closing value = closing units × unit cost
- PASS — aging_bucket_tie_out: four aging buckets sum to closing value
- PASS — reserve_tie_out: >90-day reserve rate by category
- PASS — quality_rates_tie_out: write-off and shrinkage rates recalculate from available units
- PASS — quickbowl_aged_risk_visible: QuickBowl >90-day share is 18% from July onward

This is synthetic rehearsal evidence; physical-count, expiry and accounting-reserve conclusions require controlled source records.
