# Power BI scenario-driver QA — 2026-08-31

**Overall:** `PASS`; static source-level rehearsal only.

The disconnected selector now chooses a base case and applies finance-owned revenue, COGS and OPEX multipliers. Replace the CSV and refresh the extended PBIT/PBIP to recalculate the same measures.

| Scenario | Base | Revenue multiplier | COGS multiplier | OPEX multiplier | CCC delta (days) | Scenario revenue (VND) | EBITDA proxy (VND) |
|---|---|---:|---:|---:|---:|---:|---:|
| Actual | Actual | 1.00 | 1.00 | 1.00 | +0.0 | 37,824,186,837 | 12,855,048,070 |
| Budget | Budget | 1.00 | 1.00 | 1.00 | +0.0 | 40,046,591,355 | 15,650,405,428 |
| Forecast | Forecast | 1.00 | 1.00 | 1.00 | +0.0 | 39,472,414,911 | 16,069,385,542 |
| Upside | Forecast | 1.08 | 1.03 | 0.97 | -2.0 | 42,630,208,104 | 18,845,667,854 |
| Downside | Forecast | 0.92 | 1.04 | 1.05 | +3.0 | 36,314,621,718 | 11,922,041,174 |

## Checks

| Check | Result | Detail |
|---|---|---|
| driver columns are present | PASS |  |
| five scenario rows are present | PASS | ["Actual", "Budget", "Downside", "Forecast", "Upside"] |
| base cases resolve to source totals | PASS | Actual/Budget/Forecast source totals |
| Upside and Downside are non-neutral | PASS | Forecast base multiplied by 1.08 / 0.92 |
| working-capital deltas are non-neutral | PASS | CCC adds -2.0 / +3.0 days |
| Upside EBITDA exceeds Downside | PASS | driver arithmetic direction |

Evidence boundary: Static source-data arithmetic; native Power BI Desktop visual QA remains a separate gate.
