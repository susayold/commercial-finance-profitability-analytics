# Power BI Service refresh orchestrator dry-run — 2026-08-30

The on-demand Service refresh helper was executed without a token and without
making a network request:

```text
python scripts/trigger_powerbi_service_refresh.py \
  --workspace-id 00000000-0000-0000-0000-000000000000 \
  --dataset-id 00000000-0000-0000-0000-000000000000
```

| Control | Result |
|---|---|
| Status | `DRY_RUN_PASS` |
| Mode | `on_demand_import_refresh` |
| Side effect | None |
| Token source | Not supplied; `PBI_ACCESS_TOKEN` is read only for explicit `--apply` |
| Polling | 10 seconds, 600-second timeout by default |
| Endpoint | `POST /v1.0/myorg/groups/{workspaceId}/datasets/{datasetId}/refreshes` |
| Claim boundary | Import refresh orchestration; not DirectQuery Automatic Page Refresh |

For a real published dataset, provide the workspace and dataset IDs and run
with `PBI_ACCESS_TOKEN` in the process environment plus `--apply`. The script
POSTs `notifyOption=NoNotification`, polls refresh history and returns
`APPLY_PASS` only after a terminal `Completed` result. It never writes the
token or a tenant-specific identifier to the repository.
