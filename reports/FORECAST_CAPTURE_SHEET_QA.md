# Forecast Capture Sheet QA — 2026-08-30

Native spreadsheet: [VietNova Forecast Snapshot Capture & Bias WAPE Backtest](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit)

## Read-back checks

| Check | Result |
|---|---|
| Required analytical columns | PASS — Forecast version through Abs Error are present |
| Governance columns | PASS — Snapshot Status, Source Model Version, Approver, Actual Period Close Date and Exception Note are present |
| Sample row status | PASS — eligible samples are `DRAFT`; leakage sample is `EXCEPTION` |
| Leakage exception note | PASS — future-created forecast is explicitly documented and excluded |
| Status validation | PASS — strict list is `DRAFT`, `FROZEN`, `EXCEPTION` |
| Header freeze | PASS — first row is frozen |
| Conditional alerts | PASS — `FUTURE_LEAKAGE` and `NOT_ELIGIBLE` ranges are highlighted |
| Blank-row hygiene | PASS — template rows remain blank rather than producing 1900 dates or zero metrics |
| Timezone | PASS — `Asia/Bangkok` |

## Release interpretation

The Sheet is operationally ready to capture a real frozen forecast. The current rows remain synthetic unit-test fixtures and are not evidence of observed forecast performance. A real release requires an approved snapshot ID, source-model version, named approver and actual-availability timestamp before Bias/WAPE is published.
