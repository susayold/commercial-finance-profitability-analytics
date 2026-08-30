# DirectQuery health state-machine QA — 2026-08-31

The health query was executed against a disposable SQL Server LocalDB
database after applying all 19 DDL batches. The test inserted only
`finance.Refresh_Control` control rows; no finance facts were loaded and the
LocalDB instance was deleted after the run.

| Case | Expected | Observed | Result |
|---|---|---|---|
| Empty `Refresh_Control` | `FAIL / NO_LOAD` | `FAIL / NO_LOAD` | PASS |
| Successful watermark within 60-minute SLA | `PASS / CURRENT` | `PASS / CURRENT` | PASS |
| Successful watermark 120 minutes old | `WARN / STALE_WATERMARK` | `WARN / STALE_WATERMARK` | PASS |
| Successful batch with three rejected rows | `WARN / REJECTED_ROWS` | `WARN / REJECTED_ROWS` | PASS |
| Failed batch | `FAIL / LOAD_FAILED` | `FAIL / LOAD_FAILED` | PASS |

The run returned **PASS** for all 5/5 cases and cleanup **PASS**. The query
returns both `control_status` (`PASS`, `WARN`, `FAIL`) and `control_reason`, so
the Controls & Evidence page can distinguish stale data from rejected rows,
failed loads and an empty control table. This is LocalDB integration evidence;
it is not a production DirectQuery or Automatic Page Refresh claim.
