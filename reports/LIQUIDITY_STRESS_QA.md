# Liquidity Stress QA

**Date:** 2026-08-30  
**Input:** `data/liquidity_stress_synthetic.csv`  
**Validator:** `scripts/validate_liquidity_stress.mjs`

- Overall: **PASS**
- Evidence class: **SYNTHETIC_REHEARSAL**
- Summary: Liquidity stress QA: 9/9 checks PASS; status=PASS; evidence=SYNTHETIC_REHEARSAL

## Checks

- PASS — row_count_24: rows=24
- PASS — base_and_downside_present: BASE,DOWNSIDE
- PASS — 12_months_per_scenario: BASE=12; DOWNSIDE=12
- PASS — cash_and_revolver_roll_forward: opening balances tie to prior closing balances
- PASS — cash_formula_tie_out: ending cash formula
- PASS — revolver_formula_tie_out: closing revolver formula
- PASS — facility_and_repayment_caps: draw and repayment bounds
- PASS — headroom_formula_tie_out: policy headroom formula
- PASS — stress_signal_visible: downside breach visible; base remains above policy

The downside breach is intentionally visible: the facility reaches its limit in October and December headroom is negative VND740m. This is synthetic rehearsal evidence, not a real-company financing conclusion.
