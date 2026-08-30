# Monte Carlo Risk Overlay — VietNova Finance Analyst Case

Date: 2026-08-30  
Evidence class: SIMULATED_DERIVED

## Purpose

The risk overlay quantifies uncertainty around the Base planning case. It is a decision boundary, not a replacement for an approved forecast and not evidence of realized company performance.

## Model assumptions

| Driver | Distribution | Center | Dispersion / floor |
|---|---|---:|---:|
| Revenue | Normal | VND 80.1bn | σ VND 3.0bn |
| EBITDA proxy | Normal | VND 58.5bn | σ VND 3.8bn |
| EBITDA proxy margin | Normal | 29.7% | σ 1.8pp |
| CCC | Normal, floored | 54.8 days | σ 7.0 days; floor 20 days |

- 5,000 draws are generated with a deterministic xorshift seed of 20260830.
- The variables are simulated independently for a transparent portfolio demonstration; a production model should estimate correlations from approved history.
- Downside thresholds are taken from the existing scenario lens: revenue below VND 76.9bn, EBITDA proxy below VND 53.1bn and CCC above 68.8 days.
- The 25% contribution-margin hurdle is used as the margin risk threshold.
- Percentiles use the sorted empirical sample; probabilities are breached-draw count divided by 5,000.

## Percentile output

| Metric | P05 | P25 | P50 | P75 | P95 | Breach probability |
|---|---:|---:|---:|---:|---:|---:|
| Revenue (VND bn) | 75.1453 | 78.0782 | 80.0887 | 82.1052 | 85.0906 | 14.40% below 76.9 |
| EBITDA proxy (VND bn) | 52.1091 | 55.8553 | 58.4312 | 61.1382 | 64.5729 | 7.88% below 53.1 |
| EBITDA proxy margin | 26.8035% | 28.5405% | 29.6902% | 30.8998% | 32.6302% | 0.44% below 25% |
| CCC (days) | 43.3615 | 50.2968 | 55.0043 | 59.7676 | 66.5158 | 2.32% above 68.8 |

Joint downside probability — revenue < 76.9bn, EBITDA proxy < 53.1bn and CCC > 68.8 days — is 0.04% under the independent synthetic assumptions.

## Finance interpretation

1. Revenue is the dominant modeled risk: the 14.40% breach probability is higher than EBITDA proxy (7.88%).
2. Margin breach probability is low under these assumptions, but that is not permission to relax the 25% channel hurdle; the distribution does not model correlated cost inflation.
3. CCC tail risk is visible even though the median is near Base. A cash review should act before the P95 boundary, not after a liquidity event.
4. Joint downside is rare in this independent toy distribution; a production risk model should add demand-cost-WC correlation and stress scenarios.

## Decision rules

| Signal | Action |
|---|---|
| Revenue breach probability > 15% | Freeze discretionary growth spend; refresh demand drivers |
| EBITDA breach probability > 10% | Rebuild price/volume/mix and cost bridge |
| Margin breach probability > 5% | Stop sub-hurdle promotions and require CFO exception |
| CCC breach probability > 5% | Launch weekly AR/inventory/AP cash call |
| Any joint downside breach | Use Downside playbook and protect liquidity headroom |

Current simulated probabilities are below these trigger levels, but the revenue result is close enough to warrant a demand-driver review.

## Limitations and handoff

- This overlay is synthetic and uses independent distributions; it is not a live probabilistic forecast.
- Replace centers, dispersions, correlations and thresholds with approved historical forecast errors and policy limits before production use.
- Keep the seed, input assumptions, output CSV and validator together so a reviewer can reproduce the result.
- Gate A remains open until a genuine internal FROZEN forecast history exists.

## Linked artifacts

- Existing deterministic scenario lens: site/app/page.tsx
- Scenario and sensitivity methodology: docs/ASSUMPTIONS_AND_LIMITATIONS.md
- Forecast governance: docs/FORECAST_ACCURACY_BACKTEST.md
- Output data: data/monte_carlo_risk_overlay_2026-08-30.csv
