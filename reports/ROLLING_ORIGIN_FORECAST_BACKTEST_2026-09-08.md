# Rolling-Origin Revenue Forecast Backtest — Simulated Historical Evidence

Date: 2026-09-08

## Executive result

A leakage-safe rolling-origin backtest was run on the 36-month simulated/derived monthly net-revenue history (2023-01 to 2025-12). The pre-specified primary model is a transparent 12-month seasonal-naive baseline; a 12-month linear trend and a 50/50 ensemble are challengers.

| Horizon | Primary model | Eligible forecasts | Bias | WAPE | MAE (VND m) |
|---:|---|---:|---:|---:|---:|
| 1M | SEASONAL_NAIVE_12 | 24 | 0.2510% | 1.1734% | 12.32 |
| 3M | SEASONAL_NAIVE_12 | 22 | 0.1558% | 1.1554% | 12.16 |
| 6M | SEASONAL_NAIVE_12 | 19 | 0.1125% | 1.1782% | 12.43 |

The primary seasonal baseline outperforms both challengers on WAPE across 1M, 3M and 6M horizons in this controlled synthetic history. That is a useful forecast-value-add result: complexity is not promoted when it does not beat a transparent benchmark.

## Model comparison

| Horizon | Model | Bias | WAPE |
|---:|---|---:|---:|
| 1M | SEASONAL_NAIVE_12 | 0.2510% | 1.1734% |
| 1M | ENSEMBLE_50_50 | 0.1059% | 3.0825% |
| 1M | LINEAR_TREND_12 | -0.0391% | 5.8437% |
| 3M | SEASONAL_NAIVE_12 | 0.1558% | 1.1554% |
| 3M | ENSEMBLE_50_50 | 0.0164% | 3.0924% |
| 3M | LINEAR_TREND_12 | -0.1231% | 5.9238% |
| 6M | SEASONAL_NAIVE_12 | 0.1125% | 1.1782% |
| 6M | ENSEMBLE_50_50 | 0.2815% | 3.3362% |
| 6M | LINEAR_TREND_12 | 0.4506% | 6.8701% |

## Leakage control

- Each forecast origin uses only observations available through that origin month.
- The seasonal-naive reference is the same target month one year earlier and is always known at the origin for the governed 1M/3M/6M horizons.
- The trend challenger is fitted only on the latest 12 observations available at the origin.
- Target actuals are attached only after forecasts are produced, solely for scoring.
- No future actual is multiplied by a preset offset to create these forecasts.

## Evidence boundary and Gate A

Evidence class: **SIMULATED_HISTORICAL_BACKTEST**.

**Approved recruiter-facing claim:** “Out-of-sample rolling-origin revenue backtest on simulated historical operating data.”

**Not permitted:** claiming these WAPE/Bias figures as live company, employer or production forecast accuracy.

Gate A therefore remains **OPEN**. It can close only with a genuine forecast snapshot frozen before close plus post-close actuals and the required approval metadata.

The unusually low WAPE of the seasonal baseline reflects the stable recurring seasonality embedded in this synthetic history. It should not be generalized to real FMCG forecast performance.

## Rebuild and validation

```bash
node scripts/build_rolling_origin_revenue_backtest.mjs
node scripts/validate_rolling_origin_revenue_backtest.mjs
```

Generated outputs:

- `data/forecast/rolling_origin_revenue_backtest.csv`
- `data/forecast/rolling_origin_revenue_backtest_metrics.csv`
- `data/forecast/rolling_origin_revenue_backtest_summary.json`
