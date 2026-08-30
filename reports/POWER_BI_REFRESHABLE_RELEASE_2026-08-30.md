# Power BI Refreshable Release — 2026-08-30

## Delivered

- Compiled Power BI Template: `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit`
- Editable Power BI Project: `powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip`
- Reproducible compiler source: `powerbi/native/VNFinance_PbixProj/`
- Project generator: `scripts/build_powerbi_refreshable_project.py`
- Package/refresh validator: `scripts/validate_powerbi_refreshable_project.py`
- Replacement-data contract validator: `scripts/validate_powerbi_input_contract.py`
- Generated PBIP/PBIT coherence validator: `scripts/validate_powerbi_artifact_coherence.py`
- Refresh architecture: `docs/POWER_BI_REFRESH_ARCHITECTURE.md`
- Desktop execution runbook/checklist: `powerbi/POWER_BI_DESKTOP_RUNBOOK.md`, `powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md`
- DirectQuery readiness: `powerbi/directquery/README.md`, `powerbi/directquery/VNFinance_DirectQuery_Schema.sql`, `powerbi/DIRECTQUERY_READINESS.json`
- Automated evidence: `reports/POWER_BI_REFRESHABLE_PACKAGE_QA.md`

## Release metrics

| Metric | Result |
|---|---:|
| Semantic tables | 15 |
| DAX measures | 37 |
| Relationships | 23 |
| Report pages | 6 |
| Visual containers | 39 |
| Referenced CSV sources | 14 |
| Baseline sales rows | 6,480 |
| Automated checks | 29/29 PASS |
| Data-swap test | +VND 1,000,000 detected with identical schema and row count |

Replacement-data input contract: **78/78 PASS** on the deterministic fixture (headers, type parsing, required-cell completeness, keys, referential integrity and finance identities). GitHub Actions runs this gate before the PBIT package gate.

GitHub Actions Finance model QA passed in run [33314651136](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33314651136) on commit `04b5400` (including the generated-data/PBIT/PBIP package validation and the 44-check regression runner). The workflow remains available at `.github/workflows/finance-qa.yml` for every push and pull request.

Latest workflow run [33314916251](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33314916251) also passed on commit `8b74198`, after adding the replacement-data input contract gate and its QA artifact upload.

Latest workflow run [33315439814](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33315439814) passed on commit `ff1e623`, after completing the Desktop runbook/checklist. The full workflow completed in 29 seconds with all QA steps green.

The final documentation-sync run [33315755439](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33315755439) also passed on commit `b36787a`.

The artifact-coherence run [33316673755](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33316673755) passed on commit `6e205ec`; it adds the direct PBIP/PBIT topology gate and uploaded QA report.

Current Drive bundle after adding the Desktop preflight, artifact-coherence gate, committed refresh fixture and committed-fixture CI parity check: 1,011,299 bytes, SHA-256 `9E11F0FC907C95544B98A2D88FC1EB2CA8B184DF0FA9720F628661435BDD4F7D`.

PBIT SHA-256: `7E7A417C7028678C44F2500B185FCA3D669193EC62B620EB7E48EA7A6EC6E095`

The next line records the preliminary bundle before the DirectQuery files were added; the current checksum is repeated in the claim-boundary section below.

Drive bundle `VNFinance_PowerBI_Refreshable_Package_2026-08-30.zip`: 916,598 bytes, SHA-256 `12285DAE5702E7F09499D1DAE74689E156F0E687B9155A87DB778FF46542814F`.

## Claim boundary

**Current Drive bundle checksum (supersedes the preliminary checksums above):** 1,011,299 bytes, SHA-256 `9E11F0FC907C95544B98A2D88FC1EB2CA8B184DF0FA9720F628661435BDD4F7D`. Drive file ID remains `1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX`; the copy embedded inside the ZIP is a packaging-time snapshot of the release record.

The `.pbit` is a compiled Power BI package with `DataModelSchema`, `Report/Layout`, metadata, settings, diagram layout, content types and theme parts. The `.pbip` is editable source using TMDL and PBIR binding.

No native `.pbix` is claimed in this release. The current host has a registered Power BI Desktop MSI but `PBIDesktop.exe` is missing; repair returns Windows Installer error 1730 because Administrator rights are required. Desktop open, data-source binding, refresh, DAX execution and visual-rendering QA therefore remain pending.

The CSV model is Import mode. It supports replacing source files and refreshing without redesigning the report. It does not claim second-level streaming real-time; that requires a supported DirectQuery/LiveConnect source and Automatic Page Refresh.

The DirectQuery extension passes 30/30 offline readiness checks. It remains gated at `READY_FOR_DATABASE_PROVISIONING` until a real database, ingestion watermark, credentials, capacity and native Desktop evidence are available.
