# PBIP Source Handoff — VNFinance Commercial Finance v2

This pack is the source-controlled handoff for the Power BI Desktop gate. It is intentionally not a native .pbix and must not be represented as one.

## What is now ready remotely

- PBIP source manifest: ../powerbi/PBIP_SOURCE_MANIFEST.json
- Model contract: ../powerbi/model_contract.json
- Measures: ../powerbi/measures.dax
- Build guide: ../powerbi/POWER_BI_BUILD_GUIDE_V2.md
- Desktop runbook: ../powerbi/POWER_BI_DESKTOP_RUNBOOK.md
- QA matrix: ../powerbi/QA_TEST_MATRIX.md
- PBIX release evidence template: ../powerbi/PBIX_RELEASE_EVIDENCE_TEMPLATE.md
- Detailed Desktop execution checklist: ../powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md

## Source order

1. Connect to the remote VietNova FPA Model v2: https://docs.google.com/spreadsheets/d/1-DAMs7zqQr8a6Otimm3WgkAIsX3kazpm/edit
2. Load approved data/peer_benchmark_approved_2016_2025.csv for benchmark visuals.
3. Keep data/peer_extraction_queue.csv disconnected and controls-only.
4. Keep data/vnm_public_guidance_proxy_2018_2025.csv separate from Forecast_Snapshot_Input; it is a public-guidance demonstration, not Gate-A-eligible.
5. Paste powerbi/measures.dax and validate table names.

## Acceptance criteria

The manifest validator checks required dimensions/facts, 15 relationships, six pages, 18 QA IDs, VND 100m tolerance, approved peer statuses, explicit synthetic-data policy and native-desktop requirement. The validator is wired into CI.

## Remaining external work

Power BI Desktop is still required to create the native .pbix/.pbip, render each page, execute QA-01 through QA-18 and upload the binary to Drive. No placeholder binary is claimed.
