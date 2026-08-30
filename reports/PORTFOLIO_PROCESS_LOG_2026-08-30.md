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

The Power BI work was continued through the environment boundary without overstating a native binary. The package now contains a real editable PBIP/PBIR/TMDL project, a compiled PBIT, 14 `DataRoot`-bound CSV partitions, a 78/78 replacement-input contract gate, a 29/29 package gate, a 30/30 DirectQuery readiness gate, and a detailed Desktop runbook/checklist. A controlled source mutation is proven to preserve schema/row count and detect a +VND 1,000,000 delta; the remaining native test is to open Desktop, refresh the canvas and capture visual evidence.

The package source used for the latest Drive sync is GitHub commit `5073ef5` (fixture parity CI and preflight). CI run `33317607840` passed. The Drive bundle was updated in place at file ID `1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX` and includes the PBIP/PBIT source, the same committed current synthetic CSVs, DirectQuery schema, validators, CI workflow and runbook/checklist. The bundle is remote-authoritative; the temporary clone used for packaging is deleted after verification.

## Deliberate stop point

This process stops **before native Power BI Desktop execution**. The portable PBIP contract, DAX, six-page design, refreshable PBIT, runbook and QA-01–QA-18 matrix are complete, but no placeholder `.pbix` is claimed. Native PBIX creation, visual reconciliation and screenshot evidence still require Power BI Desktop on an execution host.

Gate A is also not promoted to live: it still needs one genuine approved internal pre-close forecast snapshot with immutable version, cutoff, close date, actual-availability date, approver and source evidence. The synthetic fixture remains useful for testing the pipeline but cannot support an observed Bias/WAPE claim.

## Current next actions

1. Supply candidate-specific CV fields and freeze the recruiter-facing wording.
2. If available, submit the redacted Gate A evidence packet and run the live validator.
3. Run the external Desktop checklist when Power BI Desktop is available; do not mark the native PBIX or realtime gates PASS until the evidence is archived.
