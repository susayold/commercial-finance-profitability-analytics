# Forecast Versioning & Backtest v2

## Purpose

The module demonstrates how FP&A separates Budget, RF1, RF2, RF3, Latest Estimate and Actual without future leakage. It covers revenue, gross profit, EBITDA proxy, CFO and working capital at 1-, 2-, 3- and 6-month horizons.

## Artifacts

- `data/forecast/forecast_versioned_snapshots_v2.csv`: frozen snapshot grain with freeze/cutoff/availability timestamps.
- `data/forecast/forecast_backtest_metrics_v2.csv`: Bias, WAPE, MAE and forecast-value-add versus Budget by version, metric and horizon.
- `data/forecast/forecast_version_bridge_v2.csv`: volume, price, mix, cost, OPEX and working-capital bridge for each version transition.
- `data/forecast/forecast_override_log_v2.csv`: owner, reason, date, affected metrics and approval status for each override.
- `scripts/validate_forecast_versioning_backtest_v2.mjs`: leakage, identities, metric coverage and bridge validator.

## Governance boundary

The fixture is `SIMULATED_BACKTEST`. It proves the mechanics and documentation, not live company forecast performance. Live Bias/WAPE remains blocked until an approved internal pre-close snapshot and post-close actuals are supplied.
