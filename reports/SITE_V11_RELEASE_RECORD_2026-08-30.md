# Site V11 Release Record — 2026-08-30

## Production release

- **Project:** VN/FINANCE — Commercial Finance & FP&A
- **Production URL:** https://vn-finance-fpa-case.sangkenny200.chatgpt.site/#valuation
- **Sites project ID:** `appgprj_6a930a2f81f48191b1e015f1fa938c69`
- **Saved version:** V11 (`appgprj_6a930a2f81f48191b1e015f1fa938c69~appgver_01cb49f2e5388191befaef7996066e01`)
- **Deployment:** `appgdep_6a93fd3d27788191a3f36b57328c2e49`
- **Deployment status:** `succeeded`
- **Site source commit:** `29e802dba29337a834de520afe6dc1d38f6133e0`
- **GitHub mirror commit:** `95cc9b179b9b0c4c7c70600d9c41d1ba1b3bf4dd`
- **Build archive:** `site_v11_v11.tar.gz`
- **Archive SHA-256:** `5C2F4B6F3135B17DBF50AC4EE0895698560A6AD0E5CC76E65218F21BA5C4E48F`

## What changed in V11

V11 adds a recruiter-facing public-company valuation rehearsal to the existing FP&A / commercial-finance portfolio. The new section surfaces:

- Base DCF enterprise value of **VND 75,928.0bn**.
- Downside-to-upside scenario range of **VND 40,673.8bn–101,614.9bn**.
- A **5×5 WACC / terminal-growth sensitivity** and terminal-value share of **67.15%** in the base case.
- A visible **EV-only boundary**: no equity value or price target is presented because net debt/net cash, diluted shares, market price, and approved forward estimates are not in the sourced dataset.
- Links to the methodology, summary JSON, and reproducible QA artifacts.

## Validation evidence

- Local site build: **PASS** (`npm run build`).
- Valuation module QA: **19/19 PASS**.
- Full finance QA suite: **PASS**, including valuation rehearsal and Power BI contract-shape checks.
- Deployment: **succeeded**; owner-only access retained.

## Evidence boundary

Historical MCH rows shown in the repository remain public reported data. The forward forecast, scenario assumptions, and valuation outputs are explicitly labelled `ANALYST_ASSUMPTION_REHEARSAL`. They are portfolio training outputs, not company guidance or an investment recommendation.
