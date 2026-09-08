# Forecast Accuracy Backtest — Implementation Status

## Evidence ladder

The project now separates three different forecast-evidence levels instead of treating every Bias/WAPE calculation as equivalent:

1. **Mechanics / governance fixture** — synthetic frozen-version examples prove snapshot eligibility, Bias/WAPE calculations and future-leakage rejection.
2. **Historical out-of-sample backtest** — a rolling-origin evaluation forecasts future months using only information available at each historical origin. This is valid model-performance evidence on the project's simulated operating history.
3. **Live forecast accuracy (Gate A)** — requires a genuine forecast frozen before close plus post-close actuals and approval metadata. This remains open.

## Rolling-origin historical backtest — available

The controlled monthly net-revenue history covers 36 periods from 2023-01 through 2025-12. A pre-specified 12-month seasonal-naive model is evaluated at 1M, 3M and 6M horizons and compared with a 12-month linear-trend challenger and a 50/50 ensemble.

| Horizon | Primary model | Eligible OOS forecasts | Bias | WAPE |
|---:|---|---:|---:|---:|
| 1M | SEASONAL_NAIVE_12 | 24 | +0.2510% | 1.1734% |
| 3M | SEASONAL_NAIVE_12 | 22 | +0.1558% | 1.1554% |
| 6M | SEASONAL_NAIVE_12 | 19 | +0.1125% | 1.1782% |

The seasonal benchmark has lower WAPE than both challengers at every governed horizon. This is intentionally treated as a benchmark-selection result: a more complex model is not promoted unless it adds forecast value.

Every forecast uses history ending at the origin month. The target actual is attached only after the forecast is produced for scoring. The older versioning rehearsal that derives synthetic forecast values from actuals remains useful for governance mechanics, but it is **not** used as evidence for the rolling-origin performance claim.

Evidence class: **SIMULATED_HISTORICAL_BACKTEST**. The low WAPE reflects stable recurring seasonality in the synthetic history and must not be generalized to real-world FMCG performance.

Full report: [Rolling-Origin Revenue Forecast Backtest](../reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md).

Rebuild and validate:

```bash
node scripts/build_rolling_origin_revenue_backtest.mjs
node scripts/validate_rolling_origin_revenue_backtest.mjs
```

## Why a separate live backtest input exists

The v2 workbook contains scenario and latest-estimate assumptions, but a defensible **live** historical accuracy analysis requires frozen forecast snapshots captured before actual close. Without those snapshots, publishing Bias or WAPE as company forecast performance would create future-period leakage or imply precision that the source does not support.

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

## Live release rule — Gate A

Do not promote Bias/WAPE as **live company forecast accuracy** until at least one genuine frozen forecast version has an eligible actual period and the exclusion count is reviewed. Once available, append the output CSV to the controlled archive and record the as-of date and snapshot owner in Controls & Evidence.

The rolling-origin simulated-history result above does **not** close Gate A.

## Remote artifacts

- Script: [GitHub](../scripts/compute_forecast_accuracy.mjs) · [Drive](https://drive.google.com/file/d/1ej7YSTHACMCopbqgDWKcBi75DM0_pphA/view)
- Input template: [GitHub](../data/forecast_accuracy_input_template.csv) · [Drive](https://drive.google.com/file/d/1u8xMXGjoN49fmsavi4NZHiojumvaU6EU/view)

## Unit-test evidence

The script was run against a four-row synthetic fixture as of 2025-03-31. It correctly retained 3 eligible rows, excluded 1 FUTURE_LEAKAGE row and returned two groups: FE-2025-01 Bias 0.0 / WAPE 10.0% and FE-2025-02 Bias 20.0 / WAPE 20.0%. The input and expected output are versioned in [data/forecast_accuracy_unit_test.csv](../data/forecast_accuracy_unit_test.csv) and [data/forecast_accuracy_unit_test_expected.csv](../data/forecast_accuracy_unit_test_expected.csv), with Drive copies [input](https://drive.google.com/file/d/10dCgHsj3lkeI42LyozagyN2uFtlOgKG1/view) and [expected output](https://drive.google.com/file/d/1I_ZmP46gFLY2cm8V0UrKI0Ivjw7W254R/view).

## Native capture workbook

A native Google Sheet template is available at [VietNova Forecast Snapshot Capture & Bias WAPE Backtest](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit). It contains Instructions, Forecast_Snapshot_Input, Backtest_Output and Close_Calendar tabs, eligibility formulas, a 250-row input capacity and the WD-5-to-month+1 close cadence. The controlled 29-row demo fixture is now loaded into the capture tab with 27 FROZEN eligible rows, one FUTURE_LEAKAGE exception and one NOT_ELIGIBLE draft row. The raw Excel backup is archived on Drive at https://docs.google.com/spreadsheets/d/1rT1lgzs9p6fuBd3dcmvKNrfiiAwkXib8/edit.

## Reproducible multi-version demo

The pipeline was run on a 29-row synthetic fixture as of 2025-12-31: 27 eligible rows, one `FUTURE_LEAKAGE` row and one `NOT_ELIGIBLE` row. Results are FE-2025-01 Bias/WAPE +5%/+5% (12 rows), FE-2025-04 −2%/2% (9 rows) and FE-2025-07 +10%/10% (6 rows). These are controlled test values, not observed company performance.

- Demo input: [GitHub](../data/forecast_accuracy_demo_input.csv) · [Drive](https://drive.google.com/file/d/1LBORkBVD02V_2HS-a70vK6SKDgGxcp7i/view)
- Demo output: [GitHub](../data/forecast_accuracy_demo_output.csv) · [Drive](https://drive.google.com/file/d/1NxiZJ-1hlS0L8pPmj-QfUi5mjPH8LPi3/view)

## Capture-sheet control fields

The native capture tab now extends the analytical columns with `Snapshot_Status`, `Source_Model_Version`, `Approver`, `Actual_Period_Close_Date` and `Exception_Note`. `Snapshot_Status` has strict validation (`DRAFT`, `FROZEN`, `EXCEPTION`), the header row is frozen, and leakage statuses are conditionally highlighted. The demo fixture is explicitly labelled `DEMO_FIXTURE_v1`: 27 rows are frozen to prove the mechanics, while production/live accuracy still requires approved real snapshots before publishing company performance.

## Freeze-gate verification

The native Sheet was tested end-to-end with the complete 29-row demo fixture. Backtest_Output returns 12 eligible rows and Bias/WAPE `+5%/+5%` for FE-2025-01, 9 rows and `−2%/2%` for FE-2025-04, and 6 rows and `+10%/10%` for FE-2025-07. The FE-2025-07 release status is `REVIEW` because its version also contains a FUTURE_LEAKAGE row; FE-2025-12 remains `WAITING_FOR_FROZEN_SNAPSHOT` because actual availability is after the as-of date. This proves the release gate is active while keeping synthetic fixture results separate from live company accuracy.
