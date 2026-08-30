# Portfolio Process Log — Finance Analyst Case

Date: 2026-08-30
Current release: **V13 website / CV V3 package**
Repository: `commercial-finance-profitability-analytics`

## Purpose

This log records how the portfolio was built, what evidence has been tested, and which items are intentionally held back. It is a process record, not a claim that synthetic data represents a real employer's internal results.

## Execution sequence

### 1. Role and evidence design

The target role was narrowed to Junior FP&A, Finance Analyst and Business Finance, with Finance Data Analyst and Equity Research as supporting variants. The project was designed around hiring-manager questions: what changed, why did it change, what decision follows, how does profit convert to cash, and how trustworthy is the evidence?

### 2. Source and governance foundation

- Archived 58 official public-company PDFs in the private Drive project folder.
- Built a source registry, evidence classes and limitation register.
- Separated `PUBLIC_REPORTED`, `CALCULATED`, `SIMULATED`, `DERIVED`, `ASSUMPTION` and `RECOMMENDATION` outputs.
- Preserved the MCH FY2017 indexed-only caveat and QNS/KDC basis/perimeter limitations.
- Kept raw public reports out of GitHub; GitHub contains reproducible code, redacted metadata and QA.

### 3. Operating FP&A case

VietNova is an explicitly synthetic operating company. The model contains 36 months, 2,160 invoice lines in the selected model scope, 28 finance tabs and driver-based links across revenue, gross-to-net, COGS, OPEX, working capital, liquidity, CAPEX and commercial actions.

The model was extended with:

- Actual / Budget / Forecast versions;
- PVM and variance bridges;
- SKU, channel and customer profitability;
- promotion ROI and pricing simulation;
- DIO / DSO / DPO and cash conversion cycle;
- liquidity stress and seeded 5,000-draw Monte Carlo overlay;
- OPEX/headcount and CAPEX/fixed-asset planning;
- MBR, KPI dictionary, recommendation register, battle cards and close calendar.

The model is formula-driven and exposes controls rather than hiding them. The nine core model controls and formula-error scan pass.

### 4. Public finance and strategic extensions

The MCH layer covers FY2016–FY2025 with an audited trend supplement, credit memo, financial-statement analysis and equity-research rehearsal. The current research stance is **WATCH / CONDITIONAL UPSIDE** with medium confidence. Historical calculations are kept separate from analyst assumptions.

The EV-only DCF rehearsal produces a Base EV of **VND 75,928bn** and a scenario range of **VND 40,673.8bn–101,614.9bn**. No equity value or price target is published because verified net debt/net cash, diluted shares and current market price are not part of the approved evidence set.

### 5. Validation and QA

The executable finance QA runner passes. Important release checks include:

- evidence matrix: 28 rows, 20 mandatory core rows, 2 external rows still pending;
- Gate A template and fixture: pass, explicitly `FIXTURE_PASS_NOT_LIVE`;
- Gate B source coherence: pass, explicitly `PBIP_SOURCE_SCAFFOLD`;
- equity research rehearsal: 22/22 checks;
- CV V3 package: 16/16 checks;
- CV PDF: one-page A4, 6/6 checks, visually reviewed;
- Power BI contract shape: 5 dimensions, 11 facts, 6 pages, 17 relationships.

### 6. Recruiter packaging

The website was iterated through versioned releases and is now V13. V13 points recruiters to the finance-first CV V3 PDF and the research/valuation evidence. The site is live at the production URL and is currently custom-access/owner-only.

The CV package includes one primary one-page template, four role variants, an evidence map and an interview talk track. Candidate-specific fields remain bracketed until the candidate supplies verified contact, education and experience information.

### 7. Remote release discipline

Durable code and documentation are pushed to GitHub. Durable reports, source archives, spreadsheets and the CV PDF are mirrored to the private Drive project folder. Temporary clones and build files are deleted after verification; no local working copy is part of the deliverable.

### 8. Power BI refreshability continuation

The Power BI work was continued through the environment boundary without overstating a native binary. The package now contains a real editable PBIP/PBIR/TMDL project, a compiled PBIT, 14 `DataRoot`-bound CSV partitions, a 78/78 replacement-input contract gate, a 29/29 package gate, a 30/30 DirectQuery readiness gate, and a detailed Desktop runbook/checklist. Power BI Desktop was repaired and is now installed at `D:\Po BI\bin\PBIDesktop.exe` (version `2.157.879.0`); the custom-path preflight passes 14/14 checks and the PBIP launch process is alive. A controlled source mutation is proven to preserve schema/row count and detect a +VND 1,000,000 delta; the remaining native test is to bind the model, refresh the canvas and capture visual evidence. The current Computer Use runtime did not expose a targetable Power BI window, so those actions remain pending.

The package source used for the latest Drive sync is GitHub commit `f921739` (native QA record and custom-path preflight support). CI run `33318478875` passed for the preflight enhancement; the documentation commit has its own Finance model QA run in progress. The Drive bundle was updated in place at file ID `1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX` after this documentation update and includes the PBIP/PBIT source, the same committed current synthetic CSVs, DirectQuery schema, validators, CI workflow, runbook/checklist and native execution-host QA record. The bundle is remote-authoritative; the temporary clone used for packaging is deleted after verification.

### 9. DirectQuery provisioning continuation — 2026-08-30

The realtime migration kit was made executable without pretending that a database already exists. Commit `1eca6f1` adds a deterministic `pyodbc` loader with a side-effect-free default dry-run and explicit transactional `--apply`, plus `finance.Refresh_Control` metadata, a health query and an optional dependency file. The loader validates the exact 14-file contract, parses dates/decimals/booleans, records per-file SHA-256/row counts and reports 29,843 source rows; the committed evidence is `reports/POWER_BI_DIRECTQUERY_LOADER_DRY_RUN_2026-08-30.md`.

The standalone DirectQuery readiness validator now passes 34/34 checks, the full finance QA runner passes, the PBIP/PBIT package gate remains 29/29, the artifact-coherence gate remains 15/15 and the claim-boundary gate remains 11/11. GitHub Actions run `33320227118` passed on commit `1eca6f1`. The health query and loader intentionally keep the realtime claim `PENDING`: the next external step is to apply the DDL to a controlled Azure SQL/SQL Server/Fabric source, execute a real load, and then perform native Desktop/Service DirectQuery and Automatic Page Refresh QA.

The source-health step was tightened with a credential-safe `sqlcmd` wrapper (`scripts/check_directquery_source.ps1`) and a one-row `NO_LOAD/FAIL` result for an empty `Refresh_Control`. The readiness validator is now 35/35; the wrapper itself remains syntax-checked only because this host has no `sqlcmd`, while the underlying query was connection-tested through LocalDB below. This is an environment gate, not a claim of live realtime behavior.

The loader was then connection-tested against an ephemeral SQL Server LocalDB instance through the installed 64-bit SQL Server ODBC driver and `pyodbc 5.3.0`. The checked-in DDL executed in 19 batches, `--apply` loaded all 29,843 source rows, and the health query returned `SUCCEEDED/PASS` with 14 physical tables, 36 calendar rows and zero rejects. The instance/database were deleted after the evidence report was captured. This closes the loader/database integration gate while leaving the Power BI DirectQuery model, service capacity and Automatic Page Refresh gates open.

To make the Import path operational after a controlled data swap, commit `9d75769` also adds `scripts/trigger_powerbi_service_refresh.py`. Its default dry-run prints the POST endpoint, `NoNotification` payload and polling boundary; `--apply` requires a caller-supplied `PBI_ACCESS_TOKEN`, polls refresh history and returns `APPLY_PASS` only for a terminal `Completed` result. The dry-run is included in `reports/POWER_BI_SERVICE_REFRESH_DRY_RUN_2026-08-30.md`; no tenant, dataset or token is embedded.

## Deliberate stop point

This process stops **before native Power BI Desktop execution**. The portable PBIP contract, DAX, six-page design, refreshable PBIT, runbook and QA-01–QA-18 matrix are complete, but no placeholder `.pbix` is claimed. Native PBIX creation, visual reconciliation and screenshot evidence still require Power BI Desktop on an execution host.

Gate A is also not promoted to live: it still needs one genuine approved internal pre-close forecast snapshot with immutable version, cutoff, close date, actual-availability date, approver and source evidence. The synthetic fixture remains useful for testing the pipeline but cannot support an observed Bias/WAPE claim.

## Current next actions

1. Supply candidate-specific CV fields and freeze the recruiter-facing wording.
2. If available, submit the redacted Gate A evidence packet and run the live validator.
3. Run the external Desktop checklist when Power BI Desktop is available; do not mark the native PBIX or realtime gates PASS until the evidence is archived.
