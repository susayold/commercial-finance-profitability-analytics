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
- Forecast Gate A intake contract and Power BI Gate B QA-01–QA-18 evidence links
- Direct links to the v2 workbook, dashboard render, CFO memo, MCH trend report and GitHub repository

The page is intentionally recruiter-first: open the model, trace the checks, then read the finance recommendation. The forecast section keeps the public-guidance proxy separate from the pending internal snapshot gate. The MCH section demonstrates how a finance analyst turns audited filing history into a decision-relevant trend layer without silently mixing it into the 240-row normalized peer core.

## Local build

```bash
npm install
npm run build
```

`@vitejs/plugin-rsc` and `tailwindcss` are declared as dev dependencies so a fresh clone can reproduce the production build.
