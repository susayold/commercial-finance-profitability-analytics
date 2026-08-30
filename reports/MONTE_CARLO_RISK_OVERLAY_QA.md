# Monte Carlo Risk Overlay QA

Date: 2026-08-30

**Overall status: PASS** (10/10 checks passed)

| # | Control | Result |
|---:|---|---|
| 1 | 5,000 simulation count is explicit | PASS |
| 2 | Deterministic seed is recorded | PASS |
| 3 | Revenue / EBITDA / margin / CCC percentile rows are present | PASS |
| 4 | Downside threshold probabilities are present | PASS |
| 5 | Joint downside probability is present | PASS |
| 6 | Distribution assumptions and independence limitation are disclosed | PASS |
| 7 | Risk interpretation converts probabilities into actions | PASS |
| 8 | Evidence class remains SIMULATED_DERIVED | PASS |
| 9 | Builder and validator are versioned | PASS |
| 10 | Gate A production boundary remains explicit | PASS |

The overlay is a transparent synthetic risk rehearsal, not a live probabilistic forecast.
