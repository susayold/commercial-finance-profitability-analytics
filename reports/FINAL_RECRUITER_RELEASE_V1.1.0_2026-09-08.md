# VNFINANCE-FPA-v1.1.0 — Final Recruiter Release

Date: 2026-09-08

## Release identity

- Release name: `VNFINANCE-FPA-v1.1.0`
- Release tag: `fpa-portfolio-v1.1.0`
- Release source freeze: `79e2c9029c262a740a282a86fbcb53a01cb565dc`
- Private recruiter site version: `52` (unchanged; this release updates GitHub forecast evidence)
- GitHub Pages: https://susayold.github.io/commercial-finance-profitability-analytics/
- Private recruiter site: https://vn-finance-fpa-case.sangkenny200.chatgpt.site/
- Metadata anchor: the commit that creates this report; its SHA is recorded canonically in `data/governance/release_identity_nonbi.json`.

## Why v1.1.0 exists

`v1.1.0` adds a substantive forecast-evidence layer without changing the controlled finance truth or scenario economics.

1. Adds a leakage-safe rolling-origin revenue backtest over the 36-month simulated/derived history.
2. Pre-specifies `SEASONAL_NAIVE_12` as the transparent primary benchmark and compares it with `LINEAR_TREND_12` and `ENSEMBLE_50_50` challengers.
3. Evaluates 1M, 3M and 6M forecast horizons using only information available at each historical origin.
4. Adds deterministic build + validation into the Finance core QA path.
5. Separates three evidence levels: governance fixture, simulated historical out-of-sample performance, and live Gate A evidence.
6. Keeps Gate A open for genuine frozen pre-close forecast plus post-close actuals; no live company/employer accuracy claim is promoted.
7. Preserves `fpa-portfolio-v1.0` and `fpa-portfolio-v1.0.1` as immutable historical releases.

## Rolling-origin forecast evidence

Primary model: `SEASONAL_NAIVE_12`.

| Horizon | Eligible OOS forecasts | Bias | WAPE | MAE (VND m) |
|---:|---:|---:|---:|---:|
| 1M | 24 | +0.2510% | 1.1734% | 12.32 |
| 3M | 22 | +0.1558% | 1.1554% | 12.16 |
| 6M | 19 | +0.1125% | 1.1782% | 12.43 |

The seasonal benchmark has lower WAPE than both challengers at every governed horizon. These metrics are `SIMULATED_HISTORICAL_BACKTEST` evidence. They demonstrate leakage-safe out-of-sample methodology and benchmark discipline; they are not evidence of live employer or production forecast accuracy.

Full evidence: `reports/ROLLING_ORIGIN_FORECAST_BACKTEST_2026-09-08.md`.

## Controlled finance outputs

FY2025 Base remains unchanged:

- Revenue: `82.5138` VND bn
- Gross profit: `26.9150` VND bn
- EBITDA proxy: `12.8956` VND bn
- EBITDA proxy margin: `15.6284%`
- Contribution: `24.2074` VND bn
- Cash conversion cycle: `54` days

Existing scope semantics remain unchanged:

- Page 6 separates P-006 Energy Retrofit (`1.300` VND bn; `22` months) from the six-project portfolio CAPEX envelope (`6.550` VND bn; `58.74%` utilization).
- Page 10 separates four negative-contribution cases, one positive promotion below the ROI hurdle and three channels below the contribution-margin hurdle.
- Gate A remains `OPEN / PENDING_EXTERNAL_INPUT` by design.
- Page 6 OPEX bridge remains `OPEN` by design and visibly disclosed.
- Power BI remains `OUT_OF_ACTIVE_SCOPE`.

## Source-freeze QA

The release source freeze `79e2c9029c262a740a282a86fbcb53a01cb565dc` completed successfully on GitHub Actions:

- Finance core QA: `SUCCESS`
- Rolling-origin backtest validator: included in the Finance core QA path and `PASS`

The release metadata and immutable tag are added after the tested source freeze without changing controlled finance outputs.

## Evidence boundary

- Operating finance: `SIMULATED / DERIVED` controlled case data.
- Historical forecasting: `SIMULATED_HISTORICAL_BACKTEST` rolling-origin evidence.
- Public-company analysis: `OBSERVED / CALCULATED_PUBLIC`, kept as a separate subject area.
- Valuation / M&A / Monte Carlo: `SYNTHETIC_REHEARSAL` appendices.
- Live forecast accuracy: `PENDING_EXTERNAL_INPUT`; Gate A remains open.

## Freeze rule

After the `fpa-portfolio-v1.1.0` tag is created and release-identity QA is green, the repository should again be treated as **feature-frozen for recruiter use**. New work should be limited to genuine evidence updates, factual corrections, broken links or security/dependency maintenance—not additional portfolio modules.
