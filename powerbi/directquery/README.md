# DirectQuery readiness pack

This folder is the production migration path for automatic Power BI page refresh. It is deliberately separate from the working CSV Import release because a DirectQuery deployment requires a real database, credentials, capacity and an owner for source uptime.

## Included

- `VNFinance_DirectQuery_Schema.sql`: Azure SQL / SQL Server / Fabric-compatible table and index definitions.
- `../DIRECTQUERY_READINESS.json`: machine-readable migration gates and ownership fields.
- `../docs/POWER_BI_REFRESH_ARCHITECTURE.md`: current Import contract and claim boundary.

## Migration sequence

1. Provision a controlled Azure SQL Database or Fabric Warehouse. Do not use a personal laptop database for a portfolio production claim.
2. Run the DDL once in a non-production schema, review decimal precision, and grant the Power BI service account read-only access.
3. Load the 14 current CSV tables through an approved pipeline. Keep table and column names identical to the Import model. Add an ingestion batch ID and UTC source watermark in the pipeline metadata, not in the report-facing columns.
4. Reconcile row counts, net revenue, COGS, contribution margin and closing working-capital balances against the Import package before switching the report.
5. In Power BI Desktop, duplicate the report, connect each table using **DirectQuery**, preserve the existing table names and relationships, and replace the Import partitions. The DAX/page layer should remain unchanged.
6. Publish to a workspace with an appropriate capacity, configure the data-source credentials and gateway/private endpoint as required, then enable Automatic Page Refresh on the Executive Output page.
7. Measure p50/p95 visual query latency, source CPU, refresh failure rate and data freshness. Set the page interval from observed capacity—not from a portfolio assumption.
8. Run the native QA-01–QA-18 matrix plus a two-user concurrency test. Only then change `native_desktop_qa` and `realtime_status` from `PENDING` to an evidence-backed status.

## Freshness contract

Every load must publish a UTC watermark and batch status outside the fact tables. The Controls & Evidence page should show:

- last successful ingestion timestamp;
- source row count and rejected row count;
- current batch ID;
- data-latency minutes;
- control status (`PASS`, `WARN`, `FAIL`);
- owner and incident link when stale.

The report must fail closed or show a visible warning when the watermark exceeds the agreed SLA. A fast visual query against stale data is not real-time analytics.

## Claim boundary

The current repository release remains `Import_replace_and_refresh`. This folder makes the DirectQuery migration concrete and reviewable, but it does not claim a live database, service capacity, credentials or a measured Automatic Page Refresh interval. Those are external release gates.
