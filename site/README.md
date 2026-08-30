# VN/FINANCE Recruiter Site

Production site: https://vn-finance-fpa-case.sangkenny200.chatgpt.site

This folder documents the recruiter-facing Sites implementation for the Commercial Finance & FP&A portfolio. The deployable source is also versioned in the Sites source repository bound to project `appgprj_6a930a2f81f48191b1e015f1fa938c69`.

## Scope

- Scenario switcher for Base / Upside / Downside cases
- Executive KPI panel (revenue, EBITDA proxy, CCC, contribution margin)
- Decision cards for promotion ROI, channel margin and working capital
- 28-tab model architecture and audit-trail explanation
- Evidence policy separating reported, calculated and synthetic content
- Ten-year MCH Finance Analyst trend lens (FY2016–FY2025) with growth, margins, CFO/PAT and provenance caveats
- MCH lender-style credit memo with conditional-support view, cash-conversion triggers and stress screen
- Forecast Gate A intake contract and Power BI Gate B QA-01–QA-18 evidence links
- Direct links to the v2 workbook, dashboard render, CFO memo, MCH trend report, credit memo QA, finance-first CV V2 and GitHub repository

The page is intentionally recruiter-first: open the model, trace the checks, then read the finance recommendation. The forecast section keeps the public-guidance proxy separate from the pending internal snapshot gate. The MCH section demonstrates how a finance analyst turns audited filing history into a decision-relevant trend layer without silently mixing it into the 240-row normalized peer core. The credit memo extends the same evidence into a lender-style decision.

## Local build

```bash
npm install
npm run build
```

`@vitejs/plugin-rsc` and `tailwindcss` are declared as dev dependencies so a fresh clone can reproduce the production build.


## Current recruiter links

- Finance-first CV V2: https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/docs/FINANCE_ANALYST_CV_ONE_PAGE_V2.md
- MCH credit memo QA (15/15): https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/MCH_CREDIT_MEMO_QA.md
- QNS/KDC basis bridge QA (12/12): https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/PEER_BASIS_PERIMETER_BRIDGE_QA.md

The GitHub source mirror restores the MCH public-finance lens and points the recruiter card to the finance-first CV V2. Production Sites version 7 is the live deployment, with the source versioned in the bound Sites repository and mirrored in this project. V7 release record: https://docs.google.com/document/d/1lwV1D9OxlKi0Pt-cMHjyiOvFFLtf5bPuv4hqoc59sZQ/edit?usp=drivesdk. Drive source archive: https://drive.google.com/file/d/17OmVIr8QrEvALpB8d3D4yc23ud_qSU8r/view?usp=drivesdk
