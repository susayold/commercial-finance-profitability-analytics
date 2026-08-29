# Remote Release Status — 2026-08-30

## Storage policy

All project data, source code, QA scripts and reviewer-facing artifacts are committed to the GitHub repository and/or mirrored to the Google Drive project archive. The repository excludes raw official reports; those remain in the private Drive archive.

## Newly closed evidence in this release

| Area | GitHub evidence | Drive evidence | Status |
|---|---|---|---|
| VNM public-guidance proxy | data/vnm_public_guidance_proxy_2018_2025.csv, docs/VNM_PUBLIC_GUIDANCE_PROXY.md, scripts/validate_public_guidance_proxy.mjs, reports/VNM_PUBLIC_GUIDANCE_PROXY_QA.md | CSV, methodology, validator and QA report | PASS; 16 observations, Bias -2.63%, WAPE 3.14%; not Gate-A eligible |
| D2C unit economics | data/d2c_unit_economics_synthetic.csv, docs/D2C_UNIT_ECONOMICS.md, scripts/validate_d2c_unit_economics.mjs | Native Sheet plus CSV, methodology, validator and QA report | PASS; six native controls |
| Portable Power BI handoff | powerbi/PBIP_SOURCE_MANIFEST.json, powerbi/PBIP_SOURCE_HANDOFF.md, scripts/validate_pbip_source_manifest.mjs | Manifest, handoff and validator copies | PASS; 5 dimensions, 9 facts, 15 relationships, 6 pages, 18 QA definitions |
| Continuous QA | .github/workflows/finance-qa.yml | CI rehearsal report | PASS; CI now runs forecast leakage, frozen archive, peer, VNM, D2C, public-guidance, PBIP manifest and contract checks |

## Explicit remaining gates

1. Gate A: add at least one approved real-company forecast snapshot created before actual close, with model version, cutoff timestamp, approver and actual-availability date. Until then, the public-guidance proxy and synthetic fixture must not be described as internal forecast accuracy.
2. Gate B: open the model in Power BI Desktop, execute QA-01 through QA-18, save the native .pbix and upload the binary plus visual evidence to Drive. The PBIP manifest is a portable source scaffold, not a native PBIX.

## Reviewer path

1. Start with README.md and the production website.
2. Open the Excel v2 CFO_Output and Checks tabs.
3. Trace a KPI to the source registry and methodology.
4. Inspect the frozen forecast archive and exclusion controls.
5. Open the PBIP handoff and run the validator.
6. Treat the two gates above as intentionally open external controls.


## Added in the forecast-performance extension

## Website release

## PBIP Desktop execution checklist

A detailed external-execution checklist is now archived: [GitHub checklist](../powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md) · [Drive checklist](https://drive.google.com/file/d/1DHh9LTaI0hnfd4Ebx62hChUIXuWr_IAG/view). It covers prerequisites, PBIP topology, semantic mapping, six pages, QA-01–QA-18, evidence naming and Gate-B release criteria.

The production recruiter site now has a Forecast Performance section with the public-guidance metrics and integrity boundary. [Release note](SITE_FORECAST_SECTION_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/1Cz5Hl0HH9YLLklKBHJ2FBlTdEyQWz6u9/view) · [source/build archive](https://drive.google.com/file/d/112Fy_UXh1LDXqZp6Dtv480rB03mxmZ8K/view).

- VNM public-guidance analysis report, deterministic JSON output, generator, validator and QA report are now committed and mirrored to Drive: [report](https://drive.google.com/file/d/1G7XgCuQ3MLza4NjetaCwRajPKdLsZQWN/view), [JSON](https://drive.google.com/file/d/1xF72I7FYa7T68e-NfC1aIeAnEXXRByht/view), [generator](https://drive.google.com/file/d/1bvA-P3ihQbf10BZxc1C_IBOwZYgZyjng/view), [validator](https://drive.google.com/file/d/1UU6Ln2p2lnOb_oZ-pre5v_u5TMuv4O-5/view), [QA](https://drive.google.com/file/d/1aFj7k9rL8ERfcNzEbOq5D_9g5y5P0Kck/view).
- The extension reports metric/regime splits, Bias, WAPE, MAPE, within-2% rate, descriptive error bands and ranked misses; it remains public-guidance evidence and does not close Gate A.
- CI now regenerates and validates the analysis output from the source CSV on every push and pull request.
