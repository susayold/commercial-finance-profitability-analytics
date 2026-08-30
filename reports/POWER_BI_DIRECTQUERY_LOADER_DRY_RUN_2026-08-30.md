# DirectQuery loader dry-run evidence — 2026-08-30

The committed fixture was parsed with the new loader in its default,
side-effect-free mode:

```text
python scripts/load_directquery_sqlserver.py --input-dir powerbi/data/current
```

| Control | Result |
|---|---:|
| Status | `DRY_RUN_PASS` |
| Physical CSV tables | 14 |
| Source rows | 29,843 |
| Source hash (SHA-256) | `64af4a205f600c039cceb2405d6a1457cc50cd0a2878421580274161678a9ada` |
| Database side effects | None |
| Apply mode | Explicit `--apply` only |

| Table | Rows |
|---|---:|
| Product | 36 |
| Customer | 24 |
| Channel | 5 |
| Sales | 6,480 |
| Commercial_Costs | 6,480 |
| Inventory | 2,592 |
| Receivables | 864 |
| Payables | 144 |
| Debt | 72 |
| Budget | 6,480 |
| Forecast | 6,480 |
| Marketing | 180 |
| Promotions | 1 |
| Source_Control | 5 |

The loader validates the exact 14-file contract, parses dates/decimals/booleans,
records a per-file SHA-256 and row count, then exits without opening a database.
On a controlled SQL Server-compatible host, `--apply` deletes and reloads the
14 report-facing tables in one transaction, rebuilds Calendar and records the
batch/watermark in `finance.Refresh_Control`. No credentials are stored in the
repository. This is source/readiness evidence, not proof of a live DirectQuery
connection or Automatic Page Refresh.
