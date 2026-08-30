# Customer Profitability QA

**Date:** 2026-08-30  
**Input:** `data/customer_profitability_synthetic.csv`  
**Validator:** `scripts/validate_customer_profitability.mjs`

- Overall: **PASS**
- Evidence class: **SYNTHETIC_REHEARSAL**
- Summary: Customer profitability QA: 10/10 checks PASS; status=PASS; evidence=SYNTHETIC_REHEARSAL

## Checks

- PASS — row_count_24: rows=24
- PASS — unique_customer_ids: unique=24
- PASS — channel_coverage: all five channels present
- PASS — gross_to_net_bridge: net sales bridge
- PASS — contribution_bridge: customer contribution bridge
- PASS — margin_recompute: contribution margin
- PASS — dso_recompute: DSO from AR and net sales
- PASS — working_capital_overlay: 10% carrying-cost proxy and after-WC contribution
- PASS — no_negative_economics_inputs: sales, costs and AR non-negative
- PASS — high_revenue_low_margin_signal: C06 margin=14.58%; DSO=88.72

C06 is intentionally visible as a high-revenue / low-margin / long-DSO review account; this is not a real customer conclusion.
