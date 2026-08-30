# DirectQuery readiness pack

This folder is the production migration path for automatic Power BI page refresh. It is deliberately separate from the working CSV Import release because a DirectQuery deployment requires a real database, credentials, capacity and an owner for source uptime.

## Included

- `VNFinance_DirectQuery_Schema.sql`: Azure SQL / SQL Server / Fabric-compatible table and index definitions.
- `VNFinance_DirectQuery_Health.sql`: one-row freshness/control query plus table-level row-count tie-out.
- `../../scripts/load_directquery_sqlserver.py`: deterministic CSV-to-SQL loader. It is dry-run by default; `--apply` is an explicit transactional replacement.
- `../../scripts/check_directquery_source.ps1`: optional `sqlcmd` wrapper for the health query; supports integrated security or `SQLCMDPASSWORD` without storing credentials.
- `../../requirements-directquery.txt`: optional `pyodbc` dependency for the controlled loader host.
- `../../reports/POWER_BI_DIRECTQUERY_LOCALDB_SMOKE_QA_2026-08-30.md`: real ephemeral SQL Server LocalDB integration evidence; production realtime remains gated.
- `../../reports/POWER_BI_DIRECTQUERY_TWO_BATCH_LOCALDB_QA_2026-08-30.md`: two-batch freshness evidence showing a changed source metric and latest control batch.
- `../../scripts/run_directquery_localdb_smoke.py`: reproducible Windows-only harness that provisions, loads, mutates, verifies and deletes an ephemeral LocalDB instance.
- `../DIRECTQUERY_READINESS.json`: machine-readable migration gates and ownership fields.
- `../docs/POWER_BI_REFRESH_ARCHITECTURE.md`: current Import contract and claim boundary.

## Migration sequence

1. Provision a controlled Azure SQL Database or Fabric Warehouse. Do not use a personal laptop database for a portfolio production claim.
2. Run the DDL once in a non-production schema, review decimal precision, and grant the Power BI service account read-only access.
3. On a controlled loader host, run `python scripts/load_directquery_sqlserver.py --input-dir powerbi/data/current` first. Review the JSON row-count/hash evidence, then rerun with `--apply --connection-string ...` (or `VNFINANCE_SQL_CONNECTION`) to replace all 14 tables in one transaction. The loader records the batch and UTC watermark in `finance.Refresh_Control`; no secret is stored in GitHub.
4. For Azure SQL/Fabric, use the same table contract through ADF/Fabric Data Factory/dbt or an approved bulk-load pipeline; the local `pyodbc` loader is a SQL Server-compatible reference implementation, not a claim that a personal laptop is production.
5. Reconcile row counts, net revenue, COGS, contribution margin and closing working-capital balances against the Import package before switching the report. Run `VNFinance_DirectQuery_Health.sql` and retain the output.
6. In Power BI Desktop, duplicate the report, connect each table using **DirectQuery**, preserve the existing table names and relationships, and replace the Import partitions. The DAX/page layer should remain unchanged.
7. Publish to a workspace with an appropriate capacity, configure the data-source credentials and gateway/private endpoint as required, then enable Automatic Page Refresh on the Executive Output page.
8. Measure p50/p95 visual query latency, source CPU, refresh failure rate and data freshness. Set the page interval from observed capacity—not from a portfolio assumption.
9. Run the native QA-01–QA-18 matrix plus a two-user concurrency test. Only then change `native_desktop_qa` and `realtime_status` from `PENDING` to an evidence-backed status.

## Freshness contract

Every load must publish a UTC watermark and batch status outside the fact tables. The Controls & Evidence page should show:

- last successful ingestion timestamp;
- batch status from `finance.Refresh_Control`;
- source row count and rejected row count;
- current batch ID;
- data-latency minutes;
- control status (`PASS`, `WARN`, `FAIL`);
- owner and incident link when stale.

The report must fail closed or show a visible warning when the watermark exceeds the agreed SLA. A fast visual query against stale data is not real-time analytics.

## Claim boundary

The current repository release remains `Import_replace_and_refresh`. This folder makes the DirectQuery migration concrete and reviewable, but it does not claim a live database, service capacity, credentials or a measured Automatic Page Refresh interval. Those are external release gates.

For a repeatable source check on a host with `sqlcmd`, use `scripts/check_directquery_source.ps1 -Server <server> -Database <database> -IntegratedSecurity` or provide `-Username` and the password through the process-level `SQLCMDPASSWORD` environment variable. The command returns a `FAIL` health row when no successful load exists; it never writes credentials to the repository.
