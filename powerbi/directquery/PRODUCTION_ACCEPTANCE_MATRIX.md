# DirectQuery / Automatic Page Refresh production acceptance matrix

This document is the release gate for promoting the repository's refreshable
Import model to a measured Power BI DirectQuery deployment. It is deliberately
separate from the local two-batch rehearsal: a fast local query is evidence that
the contract works, not evidence that a cloud report is realtime.

## 1. Target architecture

```text
approved source files or ERP export
        -> ingestion job (schema validation + UTC watermark)
        -> Azure SQL / SQL Server / Fabric Warehouse (`finance` schema)
        -> Power BI semantic model (DirectQuery partitions)
        -> capacity + gateway/private endpoint
        -> Automatic Page Refresh on approved report pages
```

The source contract remains the same as the Import release:

- 14 physical CSV/table inputs and the same table/column names;
- `Calendar` generated from the minimum/maximum month;
- `finance.Refresh_Control` as the operational watermark and batch ledger;
- `powerbi/directquery/VNFinance_DirectQuery_Health.sql` as the canonical health query;
- the existing 15-table, 37-measure, 23-relationship, six-page report topology.

Do not call a report realtime when the source watermark is stale, the health
status is `WARN`/`FAIL`, or the page is showing an Import cache that has not
been refreshed.

## 2. Environment matrix

| Environment | Purpose | Minimum evidence | Claim allowed |
|---|---|---|---|
| LocalDB smoke | Prove DDL, loader, mutation and health-query mechanics | `POWER_BI_DIRECTQUERY_TWO_BATCH_LOCALDB_QA_2026-08-30.md`; instance deleted after run | Contract rehearsal only |
| Staging Azure SQL/Fabric | Prove cloud ingestion, identity, query latency and failure recovery | Two successful batches, one rejected-file test, health output, p50/p95 query timings, gateway/private-endpoint test | Staging freshness only |
| Production | Support recruiter-facing realtime claim | Approved owner, capacity, source SLA, native Desktop/Service evidence, APR interval, two-user concurrency and rollback drill | Measured production freshness, with interval stated |

The repository status remains `READY_FOR_DATABASE_PROVISIONING` until staging
and production rows in this matrix have evidence links.

## 3. Gate-by-gate acceptance

| Gate | Owner | Acceptance test | Evidence to retain | Hard stop |
|---|---|---|---|---|
| G0 / scope | Finance analyst | Confirm source table names and grain match `PBIP_SOURCE_MANIFEST.json` | Signed manifest + commit SHA | Any silent grain or column rename |
| G1 / schema | Data engineer | Apply `VNFinance_DirectQuery_Schema.sql`; verify indexes and decimal types | DDL log + schema diff | Any truncation, duplicate key or missing index |
| G2 / ingestion | Data engineer | Load a complete batch, then a changed batch; publish UTC watermark and row/reject counts | Loader JSON + `Refresh_Control` rows | Partial batch marked successful |
| G3 / finance tie-out | Finance analyst | Reconcile net revenue, COGS, contribution, closing AR/AP/inventory and debt to Import baseline | Tie-out workbook/query output | Residual outside stated tolerance |
| G4 / health | Data engineer | Run the health query with both PASS and stale/FAIL fixtures | SQL output + timestamp | Stale source shown as healthy |
| G5 / Desktop | BI developer | Duplicate report, switch partitions to DirectQuery, preserve measures/relationships, refresh and render | Desktop version, model screenshot, QA-01–QA-18 | Any visual or DAX mismatch |
| G6 / Service | BI owner | Publish to approved workspace, configure identity/gateway/private endpoint and test refresh | Workspace/dataset IDs (not secrets), deployment log | Credentials in source or unapproved endpoint |
| G7 / APR | BI owner | Enable Automatic Page Refresh only on supported pages; measure interval, p50/p95 latency and capacity impact | APR setting screenshot + timings | Interval chosen without measured capacity |
| G8 / resilience | Finance + data owner | Simulate late batch, rejected file, database outage and rollback | Incident timeline + recovery evidence | Report silently presents stale data |

## 4. Source freshness contract

Every successful ingestion batch must write:

| Field | Rule |
|---|---|
| `batch_id` | Unique, immutable and traceable to the source extract |
| `watermark_utc` | UTC timestamp of the source data, not the analyst's laptop clock |
| `loaded_at_utc` | UTC timestamp when the database transaction committed |
| `source_row_count` | Sum of accepted rows across the 14 physical tables |
| `rejected_row_count` | Explicitly zero or a linked reject file; never omitted |
| `source_hash_sha256` | Hash of the validated input manifest or extract |
| `control_status` | `PASS`, `WARN` or `FAIL` based on the agreed SLA |
| `incident_owner` | Named owner and incident link when status is not `PASS` |

The report's Controls and Evidence page must expose the latest successful
watermark, batch ID, row counts, latency minutes and control status. The
visual should show a visible warning when `watermark_utc` exceeds the agreed
SLA; do not hide stale rows with a filter.

## 5. Desktop migration checklist

1. Keep the Import PBIP/PBIT as the rollback copy.
2. Duplicate the report and connect the 14 physical tables through DirectQuery;
   preserve table names, relationships, measures and page filters.
3. Run the same input-contract and finance tie-out checks used by Import.
4. Execute QA-01–QA-18, record observed values and capture the Controls and
   Evidence page before publishing.
5. Test one changed source batch and verify that the report changes after the
   DirectQuery query/APR cycle; record the measured delay.
6. Save the native `.pbix` only after all tests pass. Keep PBIP/PBIT and the
   database DDL as the reproducible source of truth.

## 6. Service, security and capacity controls

- Use a dedicated least-privilege read-only identity for the semantic model;
  ingestion writes through a separate identity.
- Keep credentials in the approved secret store or Power BI connection
  settings. Never put tokens, passwords or connection strings in GitHub,
  Drive bundles or screenshots.
- Prefer a private endpoint/gateway path approved by the workspace owner.
- Record capacity SKU, concurrent viewers, source CPU, query duration and
  failure rate during a representative two-user test.
- Choose the APR interval from observed capacity and freshness SLA. The
  interval is an operational setting, not a portfolio assumption.
- Set an alert for stale watermark, failed batch, elevated p95 latency and
  repeated query failures. The fail-safe view is a visible `STALE / INVESTIGATE`
  state, not an apparently current number.

## 7. Rollback and incident drill

1. Disable APR and record the incident time.
2. Stop or quarantine the failing ingestion batch; preserve its raw extract
   and validation output.
3. Restore the last `PASS` batch in `Refresh_Control` or switch the report back
   to the Import rollback copy.
4. Re-run the health query and finance tie-out before reopening the report.
5. Record root cause, owner, recovery time, data gap and retest evidence.

## 8. Current status

| Item | Status |
|---|---|
| Import replacement + refresh contract | PASS — 78/78 input checks |
| LocalDB two-batch freshness rehearsal | PASS — source metric changed, zero rejects |
| Cloud database and ingestion watermark | PENDING |
| Native Desktop DirectQuery migration | PENDING |
| Service capacity/gateway/APR measurement | PENDING |
| Production realtime claim | PENDING — do not promote |

Supporting implementation files are `DIRECTQUERY_READINESS.json`,
`VNFinance_DirectQuery_Schema.sql`, `VNFinance_DirectQuery_Health.sql`,
`scripts/load_directquery_sqlserver.py` and
`scripts/run_directquery_localdb_smoke.py`.
