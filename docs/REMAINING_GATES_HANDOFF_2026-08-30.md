# Remaining Gates Handoff — 2026-08-30

Purpose: make the unfinished external gates executable without weakening evidence controls.

## Current status

| Workstream | Status | What is already complete | Closure evidence still required |
|---|---|---|---|
| MCH FY2020 standalone annual report | APPROVED | Official HNX signed PDF archived in Drive; SHA-256 recorded; statement pages 30–34 / printed 59–67 page-reviewed; eight metrics tie to FY2016–FY2025 supplement | None for source promotion; keep source lineage in downstream models |
| MCH FY2017 standalone annual report | INDEXED_ONLY | Official company URL and indexed content retained; audited FY2018 comparative/corresponding values remain approved | Official PDF bytes in Drive, hash, page anchors, and tie-out |
| Gate A — internal forecast accuracy | PENDING_EXTERNAL | Intake schema, leakage-safe fixture, live validator, and accuracy-report builder pass | One approved real internal pre-close snapshot plus observed actuals after the availability date |
| Gate B — native Power BI QA | PENDING_EXTERNAL | PBIP contract, source coherence validator, DAX, checklist, QA matrix and evidence-log contract pass | Native PBIX/Desktop execution and QA-01..18 visual evidence |
| CV personalization | PENDING_USER_INPUT | One-page Finance Analyst draft, role variants and evidence map complete | Candidate identity, education, experience, tools, links, and quantified achievements |

## Gate A submission packet

Provide one real pre-close forecast snapshot with the following fields:

- forecast_version_id; model_owner; approver; cutoff_timestamp_utc; close_period; entity; scenario; currency_unit; grain; source_uri
- forecast_value for revenue, gross profit, operating profit, EBITDA/PAT as applicable, plus driver fields used by the model
- actual_availability_timestamp_utc for each KPI; this must be later than cutoff_timestamp_utc
- observed_actual_value linked to the same grain and entity; do not overwrite the frozen forecast
- mapping for account/category, version, scenario and period; include the production CoA or a documented bridge
- approval evidence (signed email, workflow record or controlled Sheet link) and a non-synthetic source URI

Acceptance tests:

1. Re-run the live intake validator with the real source URI.
2. Confirm every actual timestamp is after forecast cutoff (no leakage).
3. Produce Bias and WAPE by KPI, entity, month and forecast version.
4. Archive the source snapshot, validator output and accuracy report in Drive; link all three from the GitHub evidence map.

## Gate B submission packet

Run the native PBIX in Power BI Desktop and archive:

- PBIX file plus model version/date
- data refresh success and source-path screenshot
- QA-01..QA-18 evidence log with pass/fail, tester, timestamp, screenshot or page reference
- screenshots for relationships, date table, measures, slicers, drill-through, variance/PVM, forecast versions, scenario controls and export/readability
- reconciliation tie-out to the PBIP source manifest and the CSV/Sheet values used by the model

Acceptance tests:

1. All 18 QA rows pass or have a documented defect with owner and due date.
2. Visual totals tie to the controlled source extract.
3. No hidden local path or untracked credential is embedded in the PBIX.
4. Drive archive contains PBIX, evidence log and reviewer walkthrough.

## FY2017 retrieval escalation

Use only the official Masan Consumer endpoint or an official exchange filing. The current official PDF endpoint returns a protocol/406/404 error in this runtime, so FY2017 remains indexed-only. If a normal browser session can download it, archive the PDF to Drive, record file ID/size/hash, review consolidated income statement, balance sheet and cash flow pages, then update the source registry and runbook. Do not replace it with an aggregator.

## CV personalization packet

Send these values before finalizing the one-page CV:

- full name, city/country, email, phone, LinkedIn, GitHub and portfolio URL
- degree, university, graduation date, GPA/classification and relevant coursework
- internships/full-time roles with dates, scope, tools and quantified outcomes
- Excel/Power BI/SQL/Python/ERP proficiency level
- target geography, work authorization and preferred title

## Remote-first storage rule

Durable artifacts belong in the private GitHub repository and Drive project folder. Local files may be used only as temporary staging for upload/review and must be deleted after verification.

## Recommended execution order

1. User supplies CV fields and, if available, Gate A internal snapshot metadata.
2. Finish FY2017 retrieval only when official bytes are obtainable.
3. Execute Gate B in Power BI Desktop and archive the native evidence bundle.
4. Run the full repository QA workflow and refresh the recruiter-facing site/index.
5. Freeze the final CV and portfolio wording with evidence classes visible.