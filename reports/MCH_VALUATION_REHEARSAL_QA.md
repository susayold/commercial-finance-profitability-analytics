# MCH Valuation Rehearsal QA

**Input:** `data/mch_valuation_rehearsal_forecast.csv`, `data/mch_valuation_rehearsal_sensitivity.csv`, `data/mch_valuation_rehearsal_summary.json`  
**Builder:** `scripts/build_mch_valuation_rehearsal.mjs`  
**Validator:** `scripts/validate_mch_valuation_rehearsal.mjs`

## Result

| Check | Result |
|---|---|
| Three scenarios × five years | PASS |
| Unique scenario/year keys | PASS |
| FCFF equation | PASS |
| Discount-factor equation | PASS |
| Gordon-growth terminal value | PASS |
| Scenario EV tie-out | PASS |
| 5×5 WACC/terminal-growth grid | PASS |
| WACC > terminal-growth hard stop | PASS |
| Historical FY2025 anchor | PASS |
| EV-only output boundary | PASS |
| Missing equity-bridge inputs explicit | PASS |
| Reader-facing executive summary | PASS |
| Reader-facing sensitivity table | PASS |
| Decision and next diligence section | PASS |
| Methodology equations visible | PASS |

**Summary: 19/19 PASS.**

The validator confirms arithmetic integrity and evidence-boundary integrity. It does not validate the reasonableness of forward assumptions as management guidance; those remain analyst-assumption rehearsal inputs and require an approved forecast before production use.
