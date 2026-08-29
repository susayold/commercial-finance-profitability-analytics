# VNM Public Guidance Proxy — FY2018–FY2025

## Why this exists

The production-style forecast gate requires an internal, immutable pre-close snapshot with a model version, cutoff timestamp and approver. Those records are not public. This companion dataset therefore uses the next-best evidence: Vinamilk (VNM) AGM-approved annual guidance published before or at the start of each fiscal year, compared with reported actuals. It is a PUBLIC_GUIDANCE_PROXY, not an internal forecast, and every row is marked gate_a_eligible=NO.

## Scope and basis

- Company: Vietnam Dairy Products JSC (Vinamilk), ticker VNM.
- Period: FY2018–FY2025, two metrics per year: total consolidated revenue and consolidated profit before tax.
- Units: VND billion.
- Guidance: AGM-approved plan or contemporaneous company IR disclosure.
- Actuals: company annual report / year-end IR result; FY2025 actual is linked to the archived Drive annual report.
- Error = actual − guidance. Bias = sum(error) / sum(actual). WAPE = sum(abs(error)) / sum(actual).
- Target dates are AGM dates, not internal model cutoffs. No source-model version or internal approver exists, hence the explicit exclusion from Gate A.

## Results

The 16-row proxy has aggregate Bias -2.63% and WAPE 3.14%. The negative bias means public guidance was conservative relative to actuals in aggregate, but revenue misses in 2021–2024 and PBT misses in 2021–2022 are visible rather than hidden.

| FY | Revenue guidance | Revenue actual | Revenue attainment | PBT guidance | PBT actual | PBT attainment |
|---:|---:|---:|---:|---:|---:|---:|
| 2018 | 55,500 | 52,629 | 94.83% | 12,800 | 12,052 | 94.16% |
| 2019 | 56,300 | 56,400 | 100.18% | 12,650 | 12,796 | 101.15% |
| 2020 | 59,600 | 59,723 | 100.21% | 13,000 | 13,519 | 103.99% |
| 2021 | 62,160 | 61,012 | 98.15% | 13,690 | 12,922 | 94.39% |
| 2022 | 64,070 | 60,075 | 93.77% | 12,000 | 10,496 | 87.47% |
| 2023 | 63,380 | 60,479 | 95.42% | 10,496 | 10,968 | 104.50% |
| 2024 | 63,163 | 61,824 | 97.88% | 11,516 | 11,600 | 100.73% |
| 2025 | 64,505 | 63,724 | 98.79% | 12,102 | 11,650 | 96.27% |

## Finance interpretation

- 2022 is the clearest downside year: revenue was VND 3,995bn below plan and PBT VND 1,504bn below plan. The annual report attributes pressure to raw materials, transport, exchange rates and softer demand; this is a variance narrative, not a causal proof.
- 2023–2024 show margin / mix recovery: PBT met or exceeded plan even when revenue remained below plan in 2023 and 2024.
- 2025 revenue remained below the AGM plan while PBT also missed; this is a useful example of separating top-line and profit tracking rather than using one headline attainment number.
- The basis is deliberately total consolidated revenue, not net revenue, because the AGM plans and annual-report management commentary use total consolidated revenue. The existing VNM statement panel retains net-revenue rows separately.

## Source register

Every row carries its guidance URL, actual URL and page anchor in the CSV extract. Primary sources include the 2018 AGM plan, the 2019 AGM report, 2020 and 2021 AGM resolutions, 2022 AGM disclosure, 2023 AGM resolution, 2024 AGM plan and 2025 IR newsletter.

## Controls

Run scripts/validate_public_guidance_proxy.mjs. It checks 16 rows, year/metric coverage, error arithmetic, attainment recomputation, evidence class and Gate-A exclusion, then recomputes aggregate Bias/WAPE.

## How this connects to the real snapshot gate

Use this proxy to demonstrate forecast-versus-actual communication in the portfolio. Do not replace the native Forecast_Snapshot_Input with it. When a genuine company snapshot becomes available, load it into the native capture Sheet with source-model version, approver, cutoff and actual-availability date; only then publish observed Bias/WAPE as company performance.
