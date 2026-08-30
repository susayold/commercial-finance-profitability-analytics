# Native Power BI binary boundary

## Why the release contains PBIP and PBIT, not a fabricated PBIX

This project has a semantic model and 14 CSV Import partitions. The durable,
source-controlled artifact is the PBIP/PBIR/TMDL project; the reusable compiled
artifact is the PBIT. A native PBIX must be created by Power BI Desktop after
the `DataRoot` parameter is bound, the model is refreshed and the visual QA
checks pass.

An offline source-control compiler is not a safe shortcut here. The official
`pbi-tools` usage documentation states that its `compile` action supports PBIX
output only for report-only ("thin") projects; projects containing a data model
should use PBIT output. Its PBIT flow still requires parameters/credentials and
a refresh when opened in Power BI Desktop:

- https://github.com/pbi-tools/pbi-tools/blob/main/docs/usage.md#compile
- https://github.com/pbi-tools/pbi-tools.github.io/blob/main/docs/cli/index.md

Therefore this release deliberately rejects these claims:

- renaming a `.pbit` to `.pbix`;
- treating a ZIP of PBIP source as a native PBIX;
- calling CSV Import “real-time” without a refresh;
- marking native QA PASS without observed Desktop evidence.

## Required native sequence

1. Open the PBIP or PBIT in Power BI Desktop.
2. Set `DataRoot` to the active 14-file folder.
3. Refresh and verify row counts, finance identities and the Controls & Evidence page.
4. Execute QA-01–QA-18 and record the Desktop version, refresh timestamp and screenshots.
5. Save a dated `.pbix` only after the checks pass; keep PBIP/PBIT as the reproducible source.
