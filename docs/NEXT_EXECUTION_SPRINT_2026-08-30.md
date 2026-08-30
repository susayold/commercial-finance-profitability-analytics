# Next Execution Sprint — Finance Analyst Portfolio

**Release intent:** move the portfolio from `REVIEW_READY_SYNTHETIC` to a fully personalized, evidence-complete finance-analyst application pack without weakening the claim boundary.

**Owner:** candidate / finance analyst

**Status:** execution-ready; Gate A and Gate B still require external evidence, and CV personalization still requires candidate input.

**Primary audience:** Junior FP&A, Finance Analyst, Business Finance Analyst and Finance Data Analyst hiring managers.

---

## 1. Where the portfolio stands now

| Workstream | Current status | Evidence already available | Remaining action |
|---|---|---|---|
| Driver-based FP&A model | Complete | `VietNova_FPA_Model_v2.xlsx`, model QA and CFO output | Keep version frozen while closing gates |
| Commercial profitability | Complete | SKU/channel/customer P&L, promotion ROI, pricing simulator, customer summary | Replace assumptions only if approved source data arrives |
| Working capital and risk | Complete | DIO/DSO/DPO, CCC, liquidity stress and 5,000-draw Monte Carlo overlay | Explain assumptions in interview; do not claim realized impact |
| Public finance analyst lens | Complete with caveats | MCH FY2016–FY2025 supplement, trend report, credit memo and peer panel | Keep FY2017 `INDEXED_ONLY` boundary visible |
| Operating finance system | Complete | MBR, KPI dictionary, recommendation register, battle cards, close calendar | Use as the reviewer walkthrough |
| Website | Deployed V9 | Production Sites URL and GitHub source mirror | Add personal links after CV fields are supplied |
| Gate A — forecast accuracy | Tooling complete; evidence pending | Schema, empty handoff, leakage-safe fixture, validator and report builder | Submit one genuine internal pre-close snapshot |
| Gate B — native Power BI | Preflight complete; evidence pending | PBIP manifest, DAX, six-page spec, QA-01–QA-18 matrix and evidence-log validator | Execute in Power BI Desktop and archive native PBIX |
| CV | Finance-first draft complete | One-page V2, role variants, evidence map and talk track | Replace placeholders with candidate facts |

The synthetic operating case remains intentionally labelled `SIMULATED` or `DERIVED`. Public-company statements remain `PUBLIC_REPORTED` where source review is complete. No row in this sprint can promote itself to `LIVE_INTERNAL` or `OBSERVED` without the required external evidence.

---

## 2. Execution order

Run the sprint in this order because each step reduces a different hiring risk:

1. **Personalize the candidate layer** so the project has a real owner and a usable application link.
2. **Close Gate A** if an approved internal forecast extract is available; this is the strongest evidence of real FP&A judgement.
3. **Close Gate B** in Power BI Desktop; this turns the portable design into a native BI deliverable.
4. **Run the full QA runner** and refresh the evidence matrix.
5. **Freeze CV, website and interview language** against the final evidence classes.

Do not delay the CV and interview work while waiting for Gate A/B. The current portfolio is already interviewable if it is described honestly.

---

## 3. Workstream A — candidate personalization

### 3.1 Required candidate fields

Provide one row for each field below. If a field is not applicable, write `N/A`; do not leave a silent blank.

| Field | Example format | Why it matters |
|---|---|---|
| Full name | `First Last` | CV header and site title |
| City / country | `Ho Chi Minh City, Vietnam` | Location and work-authorization context |
| Email / phone | standard professional format | Recruiter contact |
| LinkedIn / GitHub / portfolio | public URLs | Evidence handoff |
| Degree / university | `BSc Finance, University` | Education line |
| Graduation date | `Jun 2026` | Entry-level positioning |
| GPA or classification | optional | Include only if a strength |
| Relevant coursework | 3–5 items | Supports finance analyst fit |
| Internship / work history | company, title, dates | Prevents project-only CV impression |
| Quantified achievements | baseline → result | Converts duties into evidence |
| Tool proficiency | Excel, Power BI, SQL, Python, ERP | Keep only tools actually used |
| Target geography | countries/cities | Role variants and search strategy |
| Work authorization | concise statement | Avoid recruiter ambiguity |

### 3.2 Personalization procedure

1. Replace bracketed fields in `docs/FINANCE_ANALYST_CV_ONE_PAGE_V2.md`.
2. Select one primary role version from `docs/CV_ROLE_VARIANTS.md`:
   - FP&A / Business Finance;
   - Commercial Finance / Profitability;
   - Finance Data Analyst.
3. Select exactly three evidence bullets:
   - one scale / build bullet;
   - one decision / driver bullet;
   - one control / evidence bullet.
4. Remove any tool not demonstrated in the repository or by the candidate's real experience.
5. Run the CV evidence map and role-alignment validators.
6. Update the website contact and footer links only after the public URLs are confirmed.

### 3.3 CV claim rule

Before Gate A/B close, use wording such as:

> Built a driver-based Commercial Finance model integrating Actual, Budget and Forecast views across products, customers and channels; reconciled PVM and contribution drivers, evaluated promotion and pricing economics, and translated simulated results into CFO recommendations.

Do **not** write:

- “improved forecast accuracy by X%”;
- “built a production Power BI dashboard”;
- “saved the company X”; or
- “increased profit X%”

unless the corresponding real evidence is archived and linked.

---

## 4. Workstream B — Gate A internal forecast accuracy

### 4.1 Minimum source packet

One approved pre-close snapshot is enough to start, but it must preserve the original evidence. Do not copy actuals back into the frozen forecast file.

Required objects:

1. Frozen forecast CSV or controlled spreadsheet export.
2. Forecast model version or scenario identifier.
3. Forecast cutoff timestamp in UTC.
4. Accounting close date.
5. Actual-availability timestamp in UTC.
6. Actuals extract tied to the closed P&L.
7. Mapping note for account/category, company, brand, channel and period.
8. Approval evidence: workflow record, signed email or controlled Sheet link.
9. Source URI and SHA-256 for each immutable file.

Use `data/forecast_snapshot_live_submission_template.csv` and `schemas/forecast_snapshot_live.schema.json`. The required grain is:

```text
forecast_version_id × target_month × entity × brand × channel × KPI
```

### 4.2 Leakage-safe acceptance tests

Every candidate row must satisfy all of the following:

| Test | Required rule | Failure action |
|---|---|---|
| Freeze timing | forecast cutoff < accounting close date | Reject row |
| Actual timing | forecast cutoff < actual-availability timestamp | Reject row |
| Version integrity | frozen forecast value is never overwritten | Preserve original and create a linked actual row |
| Source status | source is non-synthetic and approved | Keep as `PENDING_EXTERNAL` |
| Grain | one row per declared version × period × entity × KPI | Aggregate or correct before submission |
| Currency | unit and currency are explicit | Stop until normalized |
| Mapping | forecast and actuals use the same mapping bridge | Attach mapping note |
| Approval | approver, role and approval timestamp are present | Reject as incomplete |
| Reconciliation | actuals tie to the closed P&L within approved tolerance | Document tolerance and reviewer |
| Reproducibility | input, output and QA report are immutable | Archive all three |

### 4.3 Run sequence

```text
1. Copy the approved source to the private Drive raw-evidence folder.
2. Calculate SHA-256 and record the immutable URI.
3. Populate the live-submission template without changing the frozen forecast.
4. Run validate_live_forecast_submission.mjs with --mode=live.
5. Run compute_forecast_accuracy.mjs against the same approved rows.
6. Build the accuracy report with eligible and excluded populations.
7. Reconcile Bias and WAPE by KPI, entity, month and forecast version.
8. Obtain reviewer sign-off.
9. Commit redacted metadata and QA output to GitHub; keep sensitive raw files in Drive.
10. Refresh website/CV wording only after the validator returns LIVE_OBSERVED_READY.
```

### 4.4 Published metrics

Use these definitions consistently:

- **Bias:** `SUM(Forecast − Actual) / SUM(Actual)` for the eligible population.
- **WAPE:** `SUM(ABS(Forecast − Actual)) / SUM(ABS(Actual))`.
- **MAPE:** row-level absolute percentage error, reported only with a non-zero actual denominator.

Publish the eligible row count, excluded row count, as-of date, forecast version and source class next to every headline metric. A single percentage without its population is not interview-grade evidence.

### 4.5 Expected artifacts

```text
data/forecast_snapshot_live_<version>_<period>.csv
reports/FORECAST_ACCURACY_LIVE_<version>_<period>.md
reports/FORECAST_ACCURACY_LIVE_<version>_<period>_QA.md
```

Sensitive approval screenshots and raw extracts stay in the private Drive folder. GitHub receives only the minimum redacted metadata needed to reproduce the claim boundary.

---

## 5. Workstream C — Gate B native Power BI

### 5.1 Desktop build contract

Use the v2 workbook and the portable source contract. Build six pages in this order:

| Page | Hiring-manager question | Core visuals |
|---|---|---|
| 1. CFO Executive Summary | What changed and what decision is required? | Revenue, GP, OP/EBITDA proxy, CCC, scenario table, action register |
| 2. Revenue & Margin Drivers | Which driver explains the variance? | Actual vs Budget vs Forecast, PVM bridge, channel mix, price/volume table |
| 3. Profitability & Unit Economics | Where does growth create or destroy value? | SKU/customer/channel contribution, CM hurdle, after-WC contribution |
| 4. Promotion, Pricing & Allocation | Which commercial action should be funded? | Promotion ROI, pricing elasticity case, fixed-budget allocation |
| 5. Forecast & Risk | How reliable is the plan and what can break it? | Forecast versions, Bias/WAPE placeholder or live metric, scenario and risk bands |
| 6. Inventory, Working Capital & Liquidity | How does profit become cash? | DIO/DSO/DPO, CCC, liquidity stress, revolver headroom |

### 5.2 QA evidence requirements

Execute QA-01 through QA-18 in `powerbi/QA_TEST_MATRIX.md`. A PASS row is valid only when it contains:

- observed value or result;
- tester name;
- execution timestamp;
- screenshot, page reference or exported evidence URI;
- remediation note when the result is not clean.

At minimum, capture evidence for:

1. model refresh;
2. date-table continuity;
3. relationship cardinality and filter direction;
4. P&L tie-out;
5. PVM tie-out;
6. scenario slicer behavior;
7. forecast-version selection;
8. customer/channel/SKU totals;
9. working-capital formulas;
10. liquidity stress output;
11. drill-through and filters;
12. export/readability.

### 5.3 Native-release hard stops

- Do not create a placeholder `.pbix`.
- Do not describe a PBIP manifest as a native Power BI release.
- Do not mark an unobserved QA row as PASS.
- Do not embed a local absolute path or credential in the PBIX.
- Do not publish visuals whose totals fail the Excel tie-out.

### 5.4 Expected release bundle

```text
Commercial_Finance_Profitability_Analytics.pbix
reports/POWER_BI_NATIVE_QA_2026-08-30.md
reports/POWER_BI_NATIVE_VISUAL_EVIDENCE_2026-08-30.pdf
powerbi/QA_EVIDENCE_LOG_FILLED.csv
```

Archive the binary and visual evidence in Drive; commit only the QA summary, redacted metadata and evidence map to GitHub if the binary contains sensitive content.

---

## 6. Workstream D — final QA and release

### 6.1 Required checks

Run:

```text
node scripts/run_finance_qa.mjs
```

Then verify:

- all repository-local validators pass;
- the external-gate readiness contract still shows only Gate A/B as open;
- no synthetic row is relabelled as live;
- site links resolve to the current GitHub/Drive artifacts;
- CV bullets agree with the evidence matrix;
- the website footer and contact links are personalized.

### 6.2 Release record

Create a dated release record containing:

- Git commit SHA;
- site version and deployment URL;
- Drive archive links;
- validator summary;
- open gates;
- claim classes used on the website and CV;
- reviewer name and timestamp.

The release record is the single source a recruiter or interviewer can use to understand what is real, what is derived and what remains a rehearsal.

---

## 7. Suggested 14-day cadence

| Day | Output | Done when |
|---:|---|---|
| 1 | Candidate intake | Personal fields and role target are complete |
| 2 | CV V3 | One-page layout and evidence wording are frozen |
| 3 | Gate A source review | Forecast/actual source and approval evidence are available or explicitly blocked |
| 4 | Gate A submission | Live validator runs without leakage |
| 5 | Gate A report | Bias/WAPE report and reconciliation are signed off |
| 6 | Power BI import | Model refreshes and relationships are loaded |
| 7 | Pages 1–2 | CFO summary and driver bridge tie to Excel |
| 8 | Pages 3–4 | Profitability and commercial decision pages work |
| 9 | Pages 5–6 | Forecast/risk and cash pages work |
| 10 | QA-01–QA-18 | Evidence log is fully observed |
| 11 | Visual evidence | PDF/screenshots are readable and archived |
| 12 | Full QA runner | All repository-local checks pass |
| 13 | Website refresh | Personal links and final claim classes are visible |
| 14 | Mock interview | Candidate can explain the model in 10–15 minutes |

If Gate A or Gate B is unavailable, do not stall the entire application. Keep the current caveat, label the gate as open and complete the remaining CV/interview/site work.

---

## 8. Final Definition of Done

The portfolio can be called **application-ready** when:

- the candidate is identifiable and contactable;
- the one-page CV contains only supported claims;
- the website opens in under a minute of reviewer effort;
- the model, reports, source registry and QA artifacts are linked;
- every headline number has a source/evidence class;
- Gate A is either `LIVE_OBSERVED_READY` or explicitly `PENDING_EXTERNAL`;
- Gate B is either native `18/18 PASS` or explicitly `PENDING_EXTERNAL`;
- GitHub and Drive mirrors are current;
- the candidate can explain one decision, one control and one limitation without overstating impact.

The standard is not “a sophisticated dashboard.” The standard is a finance analyst who can connect operations to financial outcomes, challenge a decision with evidence, protect cash and communicate the boundary of what is known.

