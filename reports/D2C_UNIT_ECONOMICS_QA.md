# D2C Unit Economics QA

Audit date: 2026-08-30

## Evidence

- Native Sheet: https://docs.google.com/spreadsheets/d/1nTEJJ9iBvxne0hCjGSDoHKaWgR_pqiMqgXYaTqGgbik/edit?usp=drivesdk
- Dataset: [d2c_unit_economics_synthetic.csv](../data/d2c_unit_economics_synthetic.csv)
- Validator: [validate_d2c_unit_economics.mjs](../scripts/validate_d2c_unit_economics.mjs)

## Control results

| Control | Result |
|---|---|
| Contribution/order arithmetic tie-out | PASS |
| LTV contribution arithmetic tie-out | PASS |
| CAC arithmetic tie-out | PASS |
| LTV/CAC hurdle linkage | PASS |
| Base/Downside/Upside scenario coverage | PASS |
| Divide-by-zero output scan | PASS |
| Overall | **PASS (6/6)** |

## Recomputed base metrics

- CAC: VND 650,000,000 / 5,000 = VND 130,000.
- Contribution/order: VND 110,000 × 55% − VND 16,000 − VND 3,300 − VND 2,200 = VND 39,000.
- LTV contribution: VND 39,000 × 2.4 = VND 93,600.
- LTV/CAC: VND 93,600 / VND 130,000 = 0.72x.
- Payback: VND 130,000 / VND 39,000 = 3.33 orders.

All values are synthetic/illustrative. No live company CAC, LTV or customer-performance claim is made.
