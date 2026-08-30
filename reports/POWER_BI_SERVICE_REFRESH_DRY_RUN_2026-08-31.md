# Power BI Service refresh orchestrator dry-run — 2026-08-31

The current `main` source (`2903d9f`) was exercised with disposable workspace
and dataset identifiers. No access token was supplied and no network request
was made:

```text
python scripts/trigger_powerbi_service_refresh.py \
  --workspace-id demo-workspace \
  --dataset-id demo-dataset \
  --report <temporary-json-path>
```

| Control | Result |
|---|---|
| Status | `DRY_RUN_PASS` |
| Mode | `on_demand_import_refresh` |
| Side effect | None; the apply branch was not invoked |
| Token source | Not supplied; `PBI_ACCESS_TOKEN` is read only for explicit `--apply` |
| Polling defaults | 10 seconds, 600-second timeout |
| Endpoint contract | `POST /v1.0/myorg/groups/{workspaceId}/datasets/{datasetId}/refreshes` |
| Payload contract | `notifyOption=NoNotification` |
| Claim boundary | Import refresh orchestration; not DirectQuery Automatic Page Refresh |

The JSON result was written to a temporary path outside the repository and
deleted after inspection. A real published dataset requires the workspace and
dataset IDs plus an authorized `PBI_ACCESS_TOKEN`; only then can the operator
run `--apply` and obtain `APPLY_PASS` after a terminal `Completed` refresh.
Credentials and tenant-specific identifiers are never persisted by the helper.
