# Power BI Refreshable Package QA

**Overall status:** `PASS`

This is source/package QA. Native Power BI Desktop open, credential binding, visual rendering, and refresh execution remain separate release gates.

## Package inventory

- **pbit_tables:** 15
- **pbit_measures:** 37
- **pbit_relationships:** 23
- **pbit_pages:** 6
- **pbit_visuals:** 39
- **pbip_tables:** 15
- **pbip_measures:** 37
- **pbip_relationships:** 23
- **refresh_rows:** 6480
- **refresh_columns:** 22
- **refresh_delta_vnd:** 1000000
- **refresh_referenced_csv:** 14
- **pbit_bytes:** 11625

## Checks

| Check | Result | Evidence |
|---|---:|---|
| PBIT package parts | PASS | DataModelSchema, DiagramLayout, Metadata, Report/Layout, Report/StaticResources/SharedResources/BaseThemes/CY19SU12.json, Settings, Version, [Content_Types].xml |
| PBIT semantic tables | PASS | 15 |
| PBIT DAX measures | PASS | 37 |
| PBIT relationships | PASS | 23 |
| PBIT report pages | PASS | 6 |
| PBIT visual containers | PASS | 39 |
| PBIT DataRoot parameter | PASS |  |
| PBIT Import partitions | PASS | 15 |
| No UTF-8 BOM: report.json | PASS |  |
| No UTF-8 BOM: CY19SU12.json | PASS |  |
| No UTF-8 BOM: VNFinance_Commercial_Finance.pbip | PASS |  |
| No UTF-8 BOM: definition.pbir | PASS |  |
| No UTF-8 BOM: definition.pbism | PASS |  |
| No UTF-8 BOM: .platform | PASS |  |
| No UTF-8 BOM: .platform | PASS |  |
| PBIP JSON artifacts parse | PASS | 7 |
| PBIP entry point | PASS | 1 |
| PBIR definition | PASS | 1 |
| PBIR semantic-model path resolves | PASS | ../VNFinance_Commercial_Finance.SemanticModel |
| PBIP TMDL tables | PASS | 15 |
| PBIP TMDL measures | PASS | 37 |
| PBIP TMDL relationships | PASS | 23 |
| PBIP DataRoot parameter | PASS |  |
| PBIP path length <= 256 | PASS |  |
| Data-swap schema unchanged | PASS | 22 columns |
| Data-swap row count unchanged | PASS | 6480 |
| Data-swap value delta detected | PASS | 1,000,000 VND |
| Power Query files use DataRoot | PASS | 14 |
| All referenced CSV files exist | PASS | none missing |
| Measure/column name collision gate | PASS | `COGS Total` and `Units Total` avoid same-table `COGS`/`cogs` and `Units`/`units` collisions |

## Refresh interpretation

- `REFRESH_CONTRACT_PASS`: replacing a CSV with the same filename and schema changes source values while preserving the contract. Power BI recalculates the model after **Refresh**.
- `NATIVE_DESKTOP_REFRESH_OBSERVED`: the repaired package was opened, refreshed, saved as a native PBIX and reopened on Desktop; the detailed evidence is in `reports/POWER_BI_NATIVE_PBIX_DESKTOP_QA_2026-08-31.md`. The full QA-01–QA-18 matrix remains a separate sign-off gate.
- This Import-mode package is refreshable, not true streaming real-time. True automatic page refresh requires a supported DirectQuery/LiveConnect source.
