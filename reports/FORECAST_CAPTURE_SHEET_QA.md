# Forecast Capture Sheet QA — 2026-08-30

Native spreadsheet: [VietNova Forecast Snapshot Capture & Bias WAPE Backtest](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit)

## Read-back checks

| Check | Result |
|---|---|
| Required analytical columns | PASS — Forecast version through Abs Error are present |
| Governance columns | PASS — Snapshot Status, Source Model Version, Approver, Actual Period Close Date and Exception Note are present |
| Demo fixture status | PASS — 27 eligible rows are `FROZEN`; one future-leakage row is `EXCEPTION`; one late-actual row is `DRAFT` |
| Leakage exception note | PASS — future-created forecast is explicitly documented and excluded |
| Status validation | PASS — strict list is `DRAFT`, `FROZEN`, `EXCEPTION` |
| Header freeze | PASS — first row is frozen |
| Conditional alerts | PASS — `FUTURE_LEAKAGE` and `NOT_ELIGIBLE` ranges are highlighted |
| Blank-row hygiene | PASS — template rows remain blank rather than producing 1900 dates or zero metrics |
| Timezone | PASS — `Asia/Bangkok` |
| Freeze gate behavior | PASS — 27 synthetic eligible rows produce metrics; late-actual DRAFT remains excluded; future-leakage EXCEPTION remains flagged |


## Demo fixture read-back

The controlled 29-row demo has been loaded with `As_Of_Date = 2025-12-31`: 27 rows are FROZEN and eligible, one row is FUTURE_LEAKAGE/EXCEPTION and one row is NOT_ELIGIBLE/DRAFT because actual availability is 2026-01-15. Backtest Output now returns FE-2025-01 Bias/WAPE +5%/+5% (12 rows), FE-2025-04 −2%/2% (9 rows) and FE-2025-07 +10%/10% (6 rows); the FE-2025-07 release status remains REVIEW because the version contains a leakage exception.

## Release interpretation

The Sheet is operationally ready to demonstrate a frozen-snapshot workflow. These rows are controlled synthetic fixture evidence, not live VietNova forecast performance. A production-style release still requires an approved real snapshot ID, source-model version, named approver and actual-availability timestamp before company accuracy is published.
