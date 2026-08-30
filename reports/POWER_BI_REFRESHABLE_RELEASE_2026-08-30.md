# Power BI Refreshable Release — 2026-08-30

## Delivered

- Compiled Power BI Template: `powerbi/releases/Commercial_Finance_Profitability_Analytics.pbit`
- Editable Power BI Project: `powerbi/native/VNFinance_PBIP/VNFinance_Commercial_Finance.pbip`
- Reproducible compiler source: `powerbi/native/VNFinance_PbixProj/`
- Project generator: `scripts/build_powerbi_refreshable_project.py`
- Package/refresh validator: `scripts/validate_powerbi_refreshable_project.py`
- Refresh architecture: `docs/POWER_BI_REFRESH_ARCHITECTURE.md`
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

PBIT SHA-256: `7E7A417C7028678C44F2500B185FCA3D669193EC62B620EB7E48EA7A6EC6E095`

## Claim boundary

The `.pbit` is a compiled Power BI package with `DataModelSchema`, `Report/Layout`, metadata, settings, diagram layout, content types and theme parts. The `.pbip` is editable source using TMDL and PBIR binding.

No native `.pbix` is claimed in this release. The current host has a registered Power BI Desktop MSI but `PBIDesktop.exe` is missing; repair returns Windows Installer error 1730 because Administrator rights are required. Desktop open, data-source binding, refresh, DAX execution and visual-rendering QA therefore remain pending.

The CSV model is Import mode. It supports replacing source files and refreshing without redesigning the report. It does not claim second-level streaming real-time; that requires a supported DirectQuery/LiveConnect source and Automatic Page Refresh.

