# DirectQuery two-batch LocalDB freshness QA — 2026-08-30

This evidence comes from the checked-in `scripts/run_directquery_localdb_smoke.py`
on a Windows host with SQL Server LocalDB and `pyodbc`. The harness created an
ephemeral database, applied the DirectQuery DDL, loaded the committed fixture,
changed one `Sales[units]` value in a temporary copy, loaded a second batch,
and queried the source health controls. The LocalDB instance was deleted after
the run.

| Check | Result |
|---|---|
| DDL execution | **PASS** — 19 batches |
| First batch | `DQ_LOCALDB_TWO_BATCH_BASE_20260830T161859Z` |
| Second batch | `DQ_LOCALDB_TWO_BATCH_CHANGED_20260830T161859Z` |
| Physical tables | 14 |
| Source rows, both batches | 29,843 |
| Loaded rows, both batches | 29,843 |
| Sales row count | 6,480 → 6,480 |
| Sales units | 1,256,859 → 1,256,860 (**+1**) |
| Net sales | VND 37,824,186,837 → unchanged |
| Source hash | `64af4a205f600c039cceb2405d6a1457cc50cd0a2878421580274161678a9ada` → `b4f241de988253fad9e64041bcf3168a975797fe15e1f9b51c54eadb61e09b76` |
| Latest health batch | **PASS** — second batch exposed |
| Health control status | **PASS** for both batches |
| Health query after second commit | 0.0152 seconds on LocalDB |
| Temporary instance cleanup | **PASS** |

The test proves source-side batch replacement, control-row freshness and a
metric delta. It does **not** prove Power BI Desktop visual refresh, Service
capacity, gateway behavior or Automatic Page Refresh. Production realtime still
requires a controlled Azure SQL/SQL Server/Fabric source and native Desktop /
Service evidence.
