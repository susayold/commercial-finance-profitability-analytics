# Site V12 Release Record — 2026-08-30

## Production release

- **Project:** VN/FINANCE — Commercial Finance & FP&A
- **Production URL:** https://vn-finance-fpa-case.sangkenny200.chatgpt.site/#equity-research
- **Sites project ID:** `appgprj_6a930a2f81f48191b1e015f1fa938c69`
- **Saved version:** V12 (`appgprj_6a930a2f81f48191b1e015f1fa938c69~appgver_87db6f12dbfc8191bf8fbdd9e5dc7a6c`)
- **Deployment:** `appgdep_6a9400b0c69881919f26a82c43640db2`
- **Deployment status:** `succeeded`
- **Site source commit:** `ac6e77cff7528412784c9ad574dcd269fc3d2bd8`
- **Build archive:** `site_v12_equity.tar.gz`
- **Local archive SHA-256:** `E0D95EA9B7D42AC598DE5552E19F5313B8B23FF73B33F66E3DD8D260CA0001F4`
- **Sites archive content hash:** `sha256:d98ea935de1a0aeb6250ac2bc6213a4c6a116754f79c332e1bb9587bf5a029b8`

## What changed in V12

V12 adds an explicit **Equity Research Rehearsal** layer to the recruiter-facing site. It presents:

- A fundamental stance of **WATCH / CONDITIONAL UPSIDE** with medium confidence.
- Ten-year public-filing evidence: revenue CAGR **9.24%**, PAT CAGR **10.34%**, FY2025 operating margin **25.41%** and CFO/PAT **31.52%**.
- A five-dimension analyst scorecard at **16/25**, clearly labelled as a communication framework rather than a market rating.
- Catalyst, risk and diligence cards tied to cash conversion, margin normalisation, debt/equity evidence and approved forecasts.
- A visible boundary: no equity value or price target is published without net debt/net cash, diluted shares, current price and approved forward evidence.

## Validation evidence

- Research builder: **PASS**.
- Equity research validator: **22/22 PASS**.
- Full finance QA suite: **PASS**, including valuation, equity research and Power BI contract-shape checks.
- Site build: **PASS** (`npm run build`).
- Deployment: **succeeded**; owner-only access retained.

## Evidence boundary

Historical MCH rows remain calculated from the approved public statement/trend layer. The scorecard is analyst judgement, and DCF outputs remain `ANALYST_ASSUMPTION_REHEARSAL`. The report is a portfolio training artifact, not a live broker report or investment advice.
