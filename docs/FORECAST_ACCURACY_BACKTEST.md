# Forecast Accuracy Backtest — Implementation Status

## Why a separate backtest input exists

The v2 workbook contains scenario and latest-estimate assumptions, but a defensible historical accuracy analysis requires frozen forecast snapshots captured before actual close. Without those snapshots, publishing Bias or WAPE would create future-period leakage or imply precision that the source does not support.

## Required input grain

One row per forecast version × target month × company × brand × channel:

- forecast_version
- forecast_created_date
- target_month
- company
- brand
- channel
- forecast_revenue_vnd
- actual_revenue_vnd
- actual_available_date

Use [data/forecast_accuracy_input_template.csv](../data/forecast_accuracy_input_template.csv) as the schema.

## Leakage-safe calculation

Run:

    node scripts/compute_forecast_accuracy.mjs input.csv output.csv 2025-12-31

The script:

1. Excludes rows whose actual_available_date is after the as-of date.
2. Excludes rows where forecast_created_date is after actual availability and labels them FUTURE_LEAKAGE.
3. Aggregates by forecast version, company, brand and channel.
4. Calculates Bias = (sum forecast − sum actual) / sum actual.
5. Calculates WAPE = sum absolute error / absolute sum actual.
6. Reports excluded-row counts and reasons.

Positive Bias means over-forecasting. Lower WAPE is better. A zero denominator remains blank.

## Release rule

Do not add a Bias/WAPE headline to the CFO page until at least one frozen forecast version has an eligible actual period and the exclusion count is reviewed. Once available, append the output CSV to the remote data archive and record the as-of date and snapshot owner in Controls & Evidence.

## Remote artifacts

- Script: [GitHub](../scripts/compute_forecast_accuracy.mjs) · [Drive](https://drive.google.com/file/d/1ej7YSTHACMCopbqgDWKcBi75DM0_pphA/view)
- Input template: [GitHub](../data/forecast_accuracy_input_template.csv) · [Drive](https://drive.google.com/file/d/1u8xMXGjoN49fmsavi4NZHiojumvaU6EU/view)
