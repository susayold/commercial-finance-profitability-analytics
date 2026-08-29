# Website Strategic Finance Release — 2026-08-30

## Release

- Sites version: 3
- Source commit: 89611ec4bb2aa56a637d743d7c0968a41080a084
- Production URL: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Deployment status: succeeded
- Access: owner-only custom policy retained

## What changed

- Added a Strategic Finance section to the recruiter quick tour.
- Added links to the native M&A accretion/dilution Sheet and GitHub methodology memo.
- Added validated headlines: Year-2 EPS accretion 17.16%, base deal NPV VND 28.39bn, 12-cell sensitivity grid and QA PASS.
- Added a CV / interview-proof card linking to the one-page Finance Analyst CV draft.
- Added a strategic boundary note: M&A case is synthetic rehearsal evidence and not a live recommendation.
- Added a Strategic Finance item to the reviewer quick tour and a navigation anchor.

## Validation

- npm run build: PASS.
- oxlint: existing shared UI-library errors remain; no new page.tsx errors after the accessibility cleanup.
- Production deploy: succeeded.
- Site source mirror was updated in the main GitHub repository under site/app/page.tsx and site/app/globals.css.

## Remote archive

- Build archive and v3 source snapshots are mirrored to the private Drive project archive.
- This release does not change the two intentionally open external gates: genuine internal forecast snapshot and native Power BI PBIX.