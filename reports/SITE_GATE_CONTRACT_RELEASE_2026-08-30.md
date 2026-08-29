# Site Gate-Contract Release — 2026-08-30

## Release outcome

The recruiter-facing VN/FINANCE site now exposes the two executable evidence contracts directly from the Forecast Performance section:

- Gate A intake validator: `scripts/validate_live_forecast_submission.mjs`.
- Gate B QA evidence log: `powerbi/QA_EVIDENCE_LOG_TEMPLATE.csv`.

The page continues to label the VNM public-guidance analysis as `Gate A excluded`; adding the links does not turn public guidance or synthetic fixtures into internal forecast evidence.

## Reproducibility evidence

| Control | Result |
|---|---|
| Fresh dependency install | `npm ci` PASS |
| Production build | `npm run build` PASS |
| Site source commit | `512f4f8fdf685e0d775660db352e0de90e08159a` |
| Sites saved version | Version 4 |
| Production deployment | Succeeded |
| Production URL | https://vn-finance-fpa-case.sangkenny200.chatgpt.site |

The site package declares `@vitejs/plugin-rsc` and `tailwindcss` as development dependencies so a fresh clone can reproduce the build. Generated `node_modules`, `dist`, `.vinext`, `.next` and `next-env.d.ts` files are not committed.

`npm ci` also surfaced three high-severity dependency advisories in the generated audit summary. They did not block the deterministic production build or Sites deployment, but remain a dependency-hygiene follow-up before any public release.

## Evidence boundary

- Site content is a recruiter-facing presentation layer; the GitHub repository and Drive archive remain the source of truth for calculations and QA.
- Gate A remains pending until a genuine approved internal pre-close snapshot and closed-period actual evidence are supplied.
- Gate B remains pending until a native Power BI `.pbix` is created and QA-01–QA-18 are executed in Power BI Desktop.

