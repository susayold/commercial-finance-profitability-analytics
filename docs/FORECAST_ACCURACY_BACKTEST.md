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


## Unit-test evidence

The script was run against a four-row synthetic fixture as of 2025-03-31. It correctly retained 3 eligible rows, excluded 1 FUTURE_LEAKAGE row and returned two groups: FE-2025-01 Bias 0.0 / WAPE 10.0% and FE-2025-02 Bias 20.0% / WAPE 20.0%. The input and expected output are versioned in [data/forecast_accuracy_unit_test.csv](../data/forecast_accuracy_unit_test.csv) and [data/forecast_accuracy_unit_test_expected.csv](../data/forecast_accuracy_unit_test_expected.csv), with Drive copies [input](https://drive.google.com/file/d/10dCgHsj3lkeI42LyozagyN2uFtlOgKG1/view) and [expected output](https://drive.google.com/file/d/1I_ZmP46gFLY2cm8V0UrKI0Ivjw7W254R/view).


## Native capture workbook

A native Google Sheet template is available at [VietNova Forecast Snapshot Capture & Bias WAPE Backtest](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit). It contains Instructions, Forecast_Snapshot_Input, Backtest_Output and Close_Calendar tabs, eligibility formulas, a 250-row input capacity, sample synthetic rows and the WD-5-to-month+1 close cadence. The raw Excel backup is archived on Drive at https://docs.google.com/spreadsheets/d/1rT1lgzs9p6fuBd3dcmvKNrfiiAwkXib8/edit.


## Reproducible multi-version demo

The pipeline was run on a 29-row synthetic fixture as of 2025-12-31: 27 eligible rows, one `FUTURE_LEAKAGE` row and one `NOT_ELIGIBLE` row. Results are FE-2025-01 Bias/WAPE +5%/+5% (12 rows), FE-2025-04 −2%/2% (9 rows) and FE-2025-07 +10%/10% (6 rows). These are controlled test values, not observed company performance.

- Demo input: [GitHub](../data/forecast_accuracy_demo_input.csv) · [Drive](https://drive.google.com/file/d/1LBORkBVD02V_2HS-a70vK6SKDgGxcp7i/view)
- Demo output: [GitHub](../data/forecast_accuracy_demo_output.csv) · [Drive](https://drive.google.com/file/d/1NxiZJ-1hlS0L8pPmj-QfUi5mjPH8LPi3/view)
