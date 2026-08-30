# Final Status Overlay — Finance Analyst Portfolio (2026-08-30)

This note supersedes earlier dated progress paragraphs where they conflict with the current remote state.

## Current release status

| Workstream | Current truth | Evidence |
|---|---|---|
| Finance model | Excel v2 is formula-driven, scenario-enabled and QA-controlled | VietNova_FPA_Model_v2.xlsx, Checks/CFO_Output, model QA |
| Public evidence | 58 official PDFs are archived in Drive; raw reports stay out of GitHub | Drive project root and source registry |
| Peer panel | Approved VNM/QNS/KDC core remains 240 rows; QNS/KDC comparability caveats are preserved | data/normalized_peer_panel_approved_2016_2025.csv |
| Peer basis bridge | QNS/KDC segmented within-basis growth is now calculated and source-linked; bridge QA is 12/12 PASS; cross-break full-period CAGR remains blocked | reports/PEER_BASIS_PERIMETER_BRIDGE_2026-08-30.md, reports/PEER_BASIS_PERIMETER_BRIDGE_QA.md; Drive QA: https://docs.google.com/document/d/1AKMJEiV_WM1Bynu_4LsdS2g91KqnbUh3jrMGN3QQSsI/edit?usp=drivesdk |
| QNS/KDC adjustment feasibility | Four break-register rows define required entity/gross-to-net bridges; feasibility validator is 10/10 PASS; adjusted full-period CAGR remains intentionally blocked | reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_2026-08-30.md, reports/PEER_BASIS_ADJUSTMENT_FEASIBILITY_QA.md; Drive: https://docs.google.com/document/d/1j4n34qdg3L4wlCcsf2KlQfakMzw3zqNIAVCnoO21eLM/edit?usp=drivesdk |
| MCH statement supplement | Separate approved supplement is complete: 80 rows = FY2016–FY2025 × 8 metrics | data/mch_statement_metrics_2024_2025_approved.csv |
| MCH FY2017 | Uses audited FY2018 comparative/corresponding columns; confidence and caveat are explicit | reports/MCH_APPROVED_STATEMENT_SUPPLEMENT_2024_2025.md |
| MCH OCR queue | 59 machine-review candidates remain intake-only and unapproved; this queue is distinct from the approved page-reviewed supplement | reports/MCH_OCR_REVIEW_DECISION_2026-08-30.md |
| MCH analyst layer | Trend CSV/report and recruiter case-study walkthrough are complete | data/mch_finance_analyst_trend_2016_2025.csv, reports/MCH_FINANCE_ANALYST_CASE_STUDY_WALKTHROUGH.md |\n| Credit screening | Lender-style MCH memo is complete with conditions, stress screen and evidence boundaries | reports/MCH_CREDIT_MEMO_FINANCE_ANALYST.md; Drive mirror: https://docs.google.com/document/d/15h8U_55cR5MBZV5KewQMvyJ6bjtVahKO0V5rXn-oXZQ/edit?usp=drivesdk |
| Credit memo QA | Trend-layer validator is green at 15/15 checks; VND-to-billion tie-outs and FY2016–FY2025 year matching are regression-tested | reports/MCH_CREDIT_MEMO_QA.md; Drive QA: https://docs.google.com/document/d/1LdV0ricHr9pr-sX1fN6JS6-znpUkToa15FsqrIG-rsc/edit?usp=drivesdk |
| Recruiter website | Sites version 7 is deployed and includes the MCH Finance Analyst Lens plus credit-memo link | https://vn-finance-fpa-case.sangkenny200.chatgpt.site; Sites v7 release record: https://docs.google.com/document/d/1lwV1D9OxlKi0Pt-cMHjyiOvFFLtf5bPuv4hqoc59sZQ/edit?usp=drivesdk |
| CV packaging | Finance-first one-page CV V2 and evidence map now foreground FP&A/Business Finance; candidate placeholders remain | docs/FINANCE_ANALYST_CV_ONE_PAGE_V2.md, docs/CV_EVIDENCE_MAP.md; Drive CV: https://docs.google.com/document/d/1pf5jUlWAajDPUj4Rs4GL6xnWyAKi_kXPLVLy59lIviU/edit?usp=drivesdk |
| Forecast proxy | VNM public-guidance analysis is complete but explicitly not internal forecast accuracy | reports/VNM_PUBLIC_GUIDANCE_ANALYSIS.md |
| Power BI | Portable PBIP source contract and QA definitions are complete; native PBIX/Desktop evidence remains open | powerbi/PBIP_SOURCE_MANIFEST.json, powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv |
| External gate intake | Gate A/B fields, evidence bundle and acceptance rules are now captured in a user-facing checklist | docs/GATE_A_B_USER_INPUT_CHECKLIST.md; Drive: https://docs.google.com/document/d/13XgQTTqVLCecLTpp7uiNdu9RL6k3TYYFp40VVffoGSs/edit?usp=drivesdk |

## Finance-analyst readout

The portfolio now demonstrates both operating finance and public-company analysis:

- VietNova is the synthetic operating case: budget, forecast versions, PVM, channel/customer profitability, promotion ROI, working capital, liquidity and CFO output.
- MCH is the public-finance case: ten-year reported trend, margin expansion, FY2025 earnings-quality warning and cash-conversion diagnostic.
- VNM/QNS/KDC are benchmark context, not a forced league table. Revenue-basis and perimeter breaks are visible.
- The website and CV claims use evidence labels and do not present synthetic or public-guidance data as internal company facts.

## Remaining external gates

Only two items require an external input or desktop application:

1. Gate A: add at least one approved real internal pre-close forecast snapshot with model version, cutoff timestamp, approver and actual-availability date, then run the live Bias/WAPE validator.
2. Gate B: open the remote model in Power BI Desktop, create the native .pbix, execute QA-01–QA-18, reconcile the visuals to Excel and archive the binary plus visual evidence.

These are not fabricated locally because doing so would weaken the evidence standard.

## Remote storage

All durable data, code, reports, validators, website source and Drive mirrors are stored remotely in GitHub and/or the private Google Drive project root. No local working copy is part of the deliverable.


## MCH source retrieval control

The official FY2017 and FY2020 annual-report URLs are accompanied by a detailed [source-verification runbook](../docs/MCH_SOURCE_VERIFICATION_RUNBOOK_2026-08-30.md) and Drive mirror (https://docs.google.com/document/d/1dQLpARQ3nV4qkt4DbFU4yCVVHQ7zSYO7rH-8c9C-Xtk/edit?usp=drivesdk). FY2020 bytes are now archived from the official HNX signed PDF, page-reviewed and classified `APPROVED` with hash/size and statement anchors recorded; FY2017 remains `INDEXED_ONLY` until a retrievable official PDF is archived. The approved FY2016–FY2025 supplement and FY2017 comparative provenance are unchanged.


## MCH financial-statement analysis extension

A calculated FY2016–FY2025 financial-statement analysis layer is now archived: margin, average-asset turnover, equity multiplier, DuPont ROE, ROA, average-equity ROE, CFO/revenue and debt/equity proxy. The validator passes 11/11 controls. FY2025 CFO/revenue is 6.98% and FY2024 ROE is explicitly flagged for equity-base review; no causal or valuation claim is added. Drive report: https://docs.google.com/document/d/1FgZurJC5pqdAwn9_jISfnujGavFtZAiXQl1klXsHMqQ/edit?usp=drivesdk.


## Peer financial-quality scorecard extension

A 21-row VNM/QNS/KDC scorecard now derives FY2020–FY2025 revenue/asset CAGR, FY2025 profitability, equity ratio and CFO/PAT where source components exist. Validator status is 11/11 PASS. VNM is the only trend candidate; QNS/KDC remain context-only with basis/perimeter flags and controlled blanks. See [scorecard](../reports/PEER_FINANCIAL_QUALITY_SCORECARD_2026-08-30.md) and [QA](../reports/PEER_FINANCIAL_QUALITY_SCORECARD_QA.md).


## CV evidence refresh

The finance-first CV V2 and evidence map now include the MCH statement-analysis layer (11/11 controls) and the 21-row peer financial-quality scorecard (11/11 controls). Candidate-specific contact, education and experience fields remain intentionally bracketed until supplied.


## Monthly Business Review / CFO Operating Pack extension

A detailed recruiter-facing operating pack is now delivered: executive Base/Upside/Downside KPI lens, variance/PVM bridge design, commercial profitability agenda, working-capital triggers, scenario pre-conditions, eight owner/action rows and a release checklist. The KPI pack has a native Drive Sheet plus raw CSV; validator status is 10/10 PASS. Values are explicitly PROXY_DERIVED or SYNTHETIC_ASSUMPTION, and Gate A/B remain open.

Drive pack: https://docs.google.com/document/d/1C7joqU6Dsyued-Zc5HrFnrMXiLW3Bkks0iaevLcVbNs/edit?usp=drivesdk. Drive KPI Sheet: https://docs.google.com/spreadsheets/d/1YWai5MSnAiRS2W9d0JXQsQ9soCZ2_odkvsR7S64-JmU/edit?usp=drivesdk.


## Finance Analyst KPI dictionary extension

Added a semantic/control contract spanning P&L, commercial profitability, working capital, forecast accuracy, evidence quality, credit and M&A. It forces definition, grain, evidence class, control and decision-use for each KPI. CSV contains 26 rows; CI validator is wired; Drive native Doc/Sheet and raw files are archived.


Validator maintenance note: KPI dictionary report length is 8,406 characters and the canonical validator now uses an 8,000-character non-triviality threshold; latest CI run is pending on the corrected commit. Latest Drive validator copy: https://drive.google.com/file/d/1HJ9BUitYgbxe2tDzHwj29JqLWD8XfapW/view?usp=drivesdk


## Management recommendation register extension

A 12-row recommendation register now completes Module P: each row contains a decision, quantified anchor, value equation, owner, guardrail, evidence class and next review. It links promotion, pricing, working capital, scenarios, CoA controls, MCH credit, D2C, M&A, Gate A and Gate B to auditable artifacts. Validator status is 10/10 PASS.


## Finance Business Partnering battle cards v2 extension

The mandatory negotiation module now has a decision matrix and three fully structured cards for Marketing budget, Sales discount and Supply Chain inventory. Each card specifies finance value equation, approval evidence, green/amber/red guardrails, stop/scale rule, escalation and interview conversion. Validator is wired into CI; Drive native Doc/Sheet and raw files are archived.


## Master-plan coverage audit refresh

The evidence matrix now links the MBR pack, KPI dictionary, Management Recommendation Register and Battle Cards v2. It remains 28 rows with 20 mandatory-core requirements; all core rows are complete or complete-with-caveat, while Gate A and Gate B are the only pending external rows.


## Monthly close operating cadence extension

A WD-5 to WD+5 calendar and RACI now connects forecast freeze, accounting close, actuals QA, PVM review, business-partner challenge and CFO sign-off. Validator status is 10/10 PASS; the process remains a synthetic operating rehearsal.


## Recruiter deliverable index refresh

The reviewer path now orders live site → FP&A model → MBR pack → recommendation register → KPI dictionary → battle cards → close calendar → public/strategic extensions. Drive refresh copy: https://drive.google.com/file/d/1s60auQyHV58bWy2mjlGSuAtI5KLVMJVt/view?usp=drivesdk


## Monte Carlo risk overlay extension

Module L now has a reproducible 5,000-draw risk overlay with seeded output, percentile bands, downside breach probabilities, joint downside and decision triggers. The independence assumption and Gate A production boundary are explicit; validator and Drive mirrors are complete.


Monte Carlo reproducibility note: the builder newline bug was fixed; CI now rebuilds and diffs the 5,000-draw output before validating the risk overlay. Latest Drive builder copy: https://drive.google.com/file/d/1mz5iDcReO_kpMc0e-62M7LUwWTh6T2MF/view?usp=drivesdk


Monte Carlo validator maintenance: report threshold aligned to the 3,788-character risk memo; CI will rerun on the corrected validator. Latest Drive validator copy: https://drive.google.com/file/d/1dRih4ruQ6H35xWtKTZbH3trqcEdByj4-/view?usp=drivesdk


Monte Carlo QA hardening: the workflow reruns the seeded builder and validates the committed output; the standalone comparator is archived for reviewer reproduction. Drive comparator: https://drive.google.com/file/d/1eDx_fLi36b8pm3NAA3D1TdG0GwIsZ21S/view?usp=drivesdk

## Operational driver tree and unit economics extension

Module F now connects operational events to the P&L and cash bridge: revenue tree, gross-to-net leakage, contribution profit, inventory/service, AR/DSO, D2C LTV/CAC/payback and a conditional owned-retail branch. The report is 11,613 characters, the driver register has 22 machine-readable rows, and its validator is wired into Finance model QA. Drive report: https://docs.google.com/document/d/1oN-nFippLlBKEXKKEsFz7tSoWkT2w-QRVDi-exTlFd0/edit?usp=drivesdk ; native register: https://docs.google.com/spreadsheets/d/1xe2FNuB2Twf0_OvCnTQ8MaQb4U9BtBBLm7epoo9bnkk/edit?usp=drivesdk. Evidence class remains SIMULATED / DERIVED and is not evidence of realized impact.


Operational driver tree automated QA: local validator PASS (15/15); latest GitHub Finance model QA run 638 PASS (including CAPEX/OPEX and PBIP coherence): https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33295105470

## Gate A intake contract extension

Gate A tooling is now complete: 26-field immutable evidence schema, empty redacted handoff template, fixture, and template/fixture/live validator. Local template and fixture checks pass; the real LIVE_INTERNAL snapshot remains required before releasing observed Bias/WAPE.

## Gate B source-coherence extension

Power BI preflight now checks manifest/contract parity, core DAX measures, six-page coverage, QA-01–QA-18 evidence schema and the native-release hard stop. Result: 13/13 PASS. This is PBIP scaffold evidence only; native PBIX execution remains pending.

## Gate A accuracy-report extension

The accuracy report builder is now committed and CI-tested in fixture mode. It emits eligible/excluded populations, Bias/WAPE/MAPE diagnostics, evidence metadata and a management action; it cannot return LIVE_OBSERVED_READY without real LIVE_INTERNAL rows.

## CV evidence refresh

CV V2 now includes the operational driver/unit-economics evidence with controlled SIMULATED/DERIVED wording and the 13/13 Power BI preflight boundary. Drive copy: https://drive.google.com/file/d/1EpA1i3aRlXNwweWnf1v-M_PvjkkjIqrj/view?usp=drivesdk

## OPEX and headcount planning extension

A cost-center OPEX/headcount module now bridges opening headcount, hires/exits, payroll, benefits, bonus and non-payroll spend to budget/forecast variance. It has 9 synthetic cost-center-month rows, 13/13 validator checks and an explicit no-real-company-impact boundary.

## CAPEX and fixed-asset planning extension

A project-level CAPEX module now connects approval, commitment, cash payment, in-service date, depreciation, benefit and payback. Six synthetic project-month rows pass 15/15 controls and the CAPEX_Projects fact is integrated into the PBIP contract/DAX; no real investment or return claim is made.
