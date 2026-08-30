# DirectQuery LocalDB integration smoke test — 2026-08-30

This is a real database execution of the DirectQuery provisioning contract on
an ephemeral SQL Server LocalDB instance. It is integration evidence for the
loader and health controls, not production capacity or Automatic Page Refresh
evidence.

| Check | Result |
|---|---|
| Instance | `VNFinanceDQ_20260830` (ephemeral LocalDB) |
| Database | `VNFinanceDQ` |
| ODBC path | Microsoft `SQL Server` 64-bit driver via `pyodbc 5.3.0` |
| DDL execution | `PASS` — 19 batches |
| Loader mode | Explicit `--apply` |
| Loader result | `APPLY_PASS` |
| Batch ID | `DQ_LOCALDB_SMOKE_20260830` |
| Physical tables loaded | 14 |
| Source rows | 29,843 |
| Loaded rows | 29,843 |
| Rejected rows | 0 |
| Calendar rows | 36 |
| Source hash | `64af4a205f600c039cceb2405d6a1457cc50cd0a2878421580274161678a9ada` |
| Health result | `SUCCEEDED / PASS` |
| Source watermark | `2026-08-30 15:55:00 UTC` |
| Health latency at test | 1 minute |

The test executed the checked-in `VNFinance_DirectQuery_Schema.sql`, then the
checked-in `scripts/load_directquery_sqlserver.py` against the LocalDB named
pipe, and finally the checked-in health query. The transaction completed and
the row-count/hash controls tied out. The instance and database were deleted
after capture; no credential or database file is part of the repository.

Remaining external gates are unchanged: migrate the same contract to a
controlled Azure SQL/SQL Server/Fabric source, connect the Power BI model using
DirectQuery, measure query/capacity behavior, enable Automatic Page Refresh,
and capture native Desktop/Service evidence before promoting the realtime claim.
