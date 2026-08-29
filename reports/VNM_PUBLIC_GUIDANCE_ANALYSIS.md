# VNM Public Guidance Forecast Performance Analysis — FY2018–FY2025

## Purpose and evidence boundary

This pack deepens the VNM public-guidance proxy into a finance-analyst style forecast-performance review. It is based on 16 AGM/IR guidance-versus-actual observations (revenue and PBT, FY2018–FY2025). It remains an observed public-guidance proxy, not an internal forecast snapshot; Gate A eligibility is **NO**.

Metrics use error = actual − guidance:

- Bias = sum(error) / sum(actual)
- WAPE = sum(abs(error)) / sum(actual)
- MAPE = mean(abs(error / guidance))
- Within-2% rate = share of observations with absolute error <= 2% of guidance
- The 95% band is descriptive mean +/- 1.96 sample standard deviations of percentage error; it is not a calibrated probabilistic interval.

## Executive readout

| Scope | N | Bias | WAPE | MAPE | Within 2% | Underforecast | Overforecast |
|---|---:|---:|---:|---:|---:|---:|---:|
| Overall | 16 | -2.63% | 3.14% | 3.73% | 37.5% | 37.5% | 62.5% |
| Revenue | 8 | -2.69% | 2.79% | 2.69% | 50.0% | 25.0% | 75.0% |
| PBT | 8 | -2.34% | 4.89% | 4.76% | 25.0% | 50.0% | 50.0% |
| FY2018–FY2020 | 6 | -1.32% | 2.18% | 2.76% | 50.0% | 66.7% | 33.3% |
| FY2021–FY2025 | 10 | -3.38% | 3.69% | 4.31% | 30.0% | 20.0% | 80.0% |

## Analyst interpretation

1. **PBT is the less predictable line.** PBT WAPE is 4.89% versus 2.79% for revenue, and only 25% of PBT observations fall within a 2% error band. This supports a driver-based margin bridge rather than a top-line-only forecast narrative.
2. **Post-2020 guidance became more conservative.** The FY2021–FY2025 subset has -3.38% weighted bias and an 80% overforecast rate, compared with -1.32% bias in FY2018–FY2020. Treat this as a descriptive regime comparison, not causal attribution.
3. **2022 is the key stress test.** PBT attainment was 87.47% and revenue attainment 93.77%; the two-line shortfall makes 2022 the most useful interview example for downside scenario design.
4. **Revenue and PBT can diverge materially.** In 2023, PBT attainment exceeded revenue attainment by 9.08 percentage points; in 2022, PBT trailed revenue by 6.30 points. A finance analyst should therefore separate volume/top-line tracking from margin conversion.
5. **Directional language is controlled.** “Underforecast” means actual exceeded guidance; “overforecast” means actual fell below guidance. No claim is made about the direction of year-on-year growth.

## Worst misses by absolute percentage error

| Rank | FY | Metric | Guidance (VND bn) | Actual (VND bn) | Error (VND bn) | Error % of guidance |
|---:|---:|---|---:|---:|---:|---:|
| 1 | 2022 | PBT | 12,000 | 10,496 | -1,504 | -12.533% |
| 2 | 2022 | Revenue | 64,070 | 60,075 | -3,995 | -6.235% |
| 3 | 2018 | PBT | 12,800 | 12,052 | -748 | -5.844% |
| 4 | 2021 | PBT | 13,690 | 12,922 | -768 | -5.610% |
| 5 | 2018 | Revenue | 55,500 | 52,629 | -2,871 | -5.173% |

## How to use this in the portfolio

- Use the executive table as a forecast-vs-actual case study on the website.
- In an interview, explain why WAPE and Bias are shown together: Bias identifies systematic conservatism, while WAPE captures total miss magnitude.
- Link the PBT/revenue divergence to the existing PVM, margin and scenario tabs in the FP&A model.
- Keep the public-guidance label visible. Do not present these values as internal company forecast accuracy.

## Reproducibility

Run:

`node scripts/analyze_public_guidance_proxy.mjs data/vnm_public_guidance_proxy_2018_2025.csv data/vnm_public_guidance_proxy_analysis.json`

Then run:

`node scripts/validate_public_guidance_proxy_analysis.mjs data/vnm_public_guidance_proxy_analysis.json`

The generated JSON is committed beside the source CSV. The analysis is deterministic and suitable for CI regression testing.
