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

## Interview conversion pack

A recruiter/interviewer-facing [Finance Analyst / FP&A talk track](../docs/FINANCE_ANALYST_INTERVIEW_TALK_TRACK.md) is now archived with a 90-second pitch, 15-minute walkthrough, STAR stories, evidence mapping and pushback answers. [Drive copy](https://drive.google.com/file/d/1qyKG5FJW5_EdKyu10l-xWUyOU9i5tLRy/view).

A detailed external-execution checklist is now archived: [GitHub checklist](../powerbi/PBIP_DESKTOP_EXECUTION_CHECKLIST.md) · [Drive checklist](https://drive.google.com/file/d/1DHh9LTaI0hnfd4Ebx62hChUIXuWr_IAG/view). It covers prerequisites, PBIP topology, semantic mapping, six pages, QA-01–QA-18, evidence naming and Gate-B release criteria.

The production recruiter site now has a Forecast Performance section with the public-guidance metrics and integrity boundary. [Release note](SITE_FORECAST_SECTION_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/1Cz5Hl0HH9YLLklKBHJ2FBlTdEyQWz6u9/view) · [source/build archive](https://drive.google.com/file/d/112Fy_UXh1LDXqZp6Dtv480rB03mxmZ8K/view).

- VNM public-guidance analysis report, deterministic JSON output, generator, validator and QA report are now committed and mirrored to Drive: [report](https://drive.google.com/file/d/1G7XgCuQ3MLza4NjetaCwRajPKdLsZQWN/view), [JSON](https://drive.google.com/file/d/1xF72I7FYa7T68e-NfC1aIeAnEXXRByht/view), [generator](https://drive.google.com/file/d/1bvA-P3ihQbf10BZxc1C_IBOwZYgZyjng/view), [validator](https://drive.google.com/file/d/1UU6Ln2p2lnOb_oZ-pre5v_u5TMuv4O-5/view), [QA](https://drive.google.com/file/d/1aFj7k9rL8ERfcNzEbOq5D_9g5y5P0Kck/view).
- The extension reports metric/regime splits, Bias, WAPE, MAPE, within-2% rate, descriptive error bands and ranked misses; it remains public-guidance evidence and does not close Gate A.
- CI now regenerates and validates the analysis output from the source CSV on every push and pull request.


## M&A / strategic-stretch extension

The repository now includes a fully documented synthetic acquisition screen: [methodology memo](../docs/MNA_ACCRETION_DILUTION.md), [forecast data](../data/mna_accretion_dilution_synthetic.csv), [sensitivity grid](../data/mna_accretion_dilution_sensitivity.csv), [validator](../scripts/validate_mna_accretion_dilution.mjs) and [QA report](MNA_ACCRETION_DILUTION_QA.md). The base case is Year-2 EPS accretive by 17.16% and produces deal NPV of VND 28.39bn, while Year 1 is dilutive by -0.46% after integration costs. This is SYNTHETIC / REHEARSAL evidence and is not a substitute for live internal snapshots or a native PBIX.


Drive mirror for M&A extension:
- Data: https://drive.google.com/file/d/1LK-YloDyk2iXqoW_XsFflkYrb4h6a224/view and https://drive.google.com/file/d/1kv60z5MXY4wghumtHvg3MqroCy-vJCyT/view
- Methodology: https://drive.google.com/file/d/1gwEWr1hIQ0XhNWP23GkrAzLBRqd6DcOe/view
- QA: https://drive.google.com/file/d/1cyt24IdL7Y8SlP97s8Qk_tt1FZsFEaOg/view
- Validator: https://drive.google.com/file/d/1kGdGkWhgMpSEvpmEsGAhflB4qC92hNmy/view


- Native M&A model: https://docs.google.com/spreadsheets/d/1GKGSKu1QpXJau_zCub5Sg7oi-VEugclP8Roor1GET5k/edit?usp=drivesdk (Assumptions, Forecast, Sensitivity, Checks; overall control status PASS).


## Final external-gates handoff

- [Execution handoff](docs/FINAL_EXTERNAL_GATES_HANDOFF.md) · [Drive copy](https://drive.google.com/file/d/1QGZOL27pumhK1z0UFE1WQ_cN0IjZ5bg7/view)
- [Live snapshot submission template](data/forecast_snapshot_live_submission_template.csv) · [Drive template](https://drive.google.com/file/d/1WQ_9L7JrbogUjhytealtfeJnXekRJqqu/view)
- The handoff specifies the exact evidence bundle, acceptance sequence, hard stops and release naming for Gate A (live pre-close forecast accuracy) and Gate B (native Power BI Desktop).


## One-page CV draft

- [Finance Analyst / Junior FP&A CV draft](docs/FINANCE_ANALYST_CV_ONE_PAGE.md) · [Drive copy](https://drive.google.com/file/d/1rRpc9qNKcia0MeckGhqzrVnJ_iyed7RB/view)
- Bullets are restricted to validated evidence and explicitly label synthetic/public-guidance outputs; replace bracketed personal fields before use.


## Master-plan evidence matrix

- [Machine-readable evidence matrix](data/master_plan_evidence_matrix.csv) · [Validator](scripts/validate_master_plan_evidence_matrix.mjs) · [QA report](reports/MASTER_PLAN_EVIDENCE_MATRIX_QA.md)
- [Drive matrix](https://drive.google.com/file/d/1yqiUFL1p6KT2WeXQNP2nIW1RXnO5PlyX/view) · [Drive validator](https://drive.google.com/file/d/1gz9jURxhEqkunS-z8lE_O2FNhfoxZHHI/view) · [Drive QA](https://drive.google.com/file/d/1-tQP0Dmj7n-LVSj154DF-iUP2KffBFcn/view)
- Current audit: 28 requirement rows, 20 mandatory-core rows, two external gates intentionally pending; validator PASS.


## Website strategic-finance release

- [Release note](reports/SITE_STRATEGIC_FINANCE_RELEASE_2026-08-30.md) · [Drive release note](https://drive.google.com/file/d/19mW_MT81z1CMeU9v39fBHBdiIcoLkEiQ/view)
- Production site version 3 now includes Strategic Finance / M&A and CV quick-tour cards: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Local build PASS; deployment succeeded. Shared UI-library lint warnings remain pre-existing and do not include new page-level errors.
- [Drive build archive](https://drive.google.com/file/d/1mfx-4W0cfZvGlcZv6TONO36H3rKXgqib/view) · [v3 page source](https://drive.google.com/file/d/1gJZOyXQKPoOuEHDmRLQezSn3GgULp0f-/view) · [v3 CSS source](https://drive.google.com/file/d/136FgoZ8gzarzNZAtXWmsHpMi6PYj53fb/view)


## Website runtime QA

- [Runtime/access-boundary QA](reports/SITE_RUNTIME_QA_2026-08-30.md) · [Drive copy](https://drive.google.com/file/d/1z1LGW43fG94bEkFgbPZP3QVYQvYwxZt-/view)
- Source/build/deployment checks PASS for Sites version 3. The site intentionally remains owner-only; unauthenticated requests receive the sign-in screen. Visual click-through requires the owner session.


## Archived master plan

- [Corporate Financial Analyst / FP&A master plan](docs/CORPORATE_FINANCIAL_ANALYST_FPA_MASTER_PLAN.md)
- [Drive archive](https://drive.google.com/file/d/1blpG-4CKWkjPpuwXwOFRkwI038XXMOnK/view)
- The detailed plan is now stored remotely; no local output copy is retained.
