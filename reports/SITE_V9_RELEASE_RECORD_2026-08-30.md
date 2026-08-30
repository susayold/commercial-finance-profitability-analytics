# Site V9 Release Record — 2026-08-30

## Production release

- Site: **VN/FINANCE — Commercial Finance & FP&A**
- Production URL: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Sites project: `appgprj_6a930a2f81f48191b1e015f1fa938c69`
- Saved version: **9**
- Source commit: `b3484880bcd02701aabbc511eb3cbcd3125ec34b`
- Deployment status: **SUCCEEDED**
- Archive SHA-256: `d11b57279d724d7b218ac9450a00125a7cb7004d7cea9a096168ac01a36fa059`
- Drive archive: https://drive.google.com/file/d/1n6-0Uwm7scdJ_nVfN3GMp96GhNsFjDvy/view?usp=drivesdk

## Change in V9

The decision layer now surfaces a customer-economics callout with:

- 24 synthetic customer-year rows.
- Contribution after cash cost rather than revenue-only ranking.
- Top-five concentration: 28.62% of gross sales and 30.88% of after-WC contribution.
- C06 high-revenue / low-margin / long-DSO review signal.
- Direct links to the customer analysis report and summary JSON.

## Evidence boundary

This is a presentation enhancement to the recruiter site. All customer operating figures remain `SYNTHETIC_REHEARSAL`; the site does not claim real customer contracts, live forecast accuracy or native PBIX completion.

V9 build completed successfully with the existing Vinext/Sites stack. Owner-only access was preserved.
