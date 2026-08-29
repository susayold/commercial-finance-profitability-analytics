# Website Forecast Section Release — 2026-08-30

## Published result

The recruiter site now includes a dedicated **Forecast Performance** section at the #forecast anchor. It surfaces public-guidance Bias/WAPE evidence, the revenue-versus-PBT predictability contrast, the FY2022 stress-test miss and direct links to the analyst report and QA evidence.

- Production URL: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Site version: 2
- Build: PASS (vinext build)
- Deployment: PASS (private production publish)
- Source commit: f2adb4faa479056521657934e7cfd25da97397be

## Evidence displayed

- Overall public-guidance proxy Bias: -2.63%
- Overall WAPE: 3.14%
- Revenue WAPE: 2.79%
- PBT WAPE: 4.89%
- Largest miss: FY2022 PBT at -12.533% of guidance

## Integrity boundary

The displayed evidence is AGM/IR public guidance, not an internal pre-close forecast. The website labels the section "Gate A excluded" and links to QA evidence. No public-guidance result is presented as company-internal forecast accuracy.

## Remote source archive

The updated source is mirrored in the main portfolio GitHub repository under site/app/page.tsx and site/app/globals.css. A version-2 source/build archive and the two edited source files are stored in the Google Drive project archive.
