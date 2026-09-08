# VNFINANCE-FPA-v1.0.1 — Final Recruiter Release

Date: 2026-09-08

## Release identity

- Release name: `VNFINANCE-FPA-v1.0.1`
- Release tag: `fpa-portfolio-v1.0.1`
- Release source freeze: `6d83dd44417d90bc3dc7818cc865da7d5a3e6c6d`
- Private recruiter site version: `52`
- GitHub Pages: https://susayold.github.io/commercial-finance-profitability-analytics/
- Private recruiter site: https://vn-finance-fpa-case.sangkenny200.chatgpt.site/
- Metadata anchor: the commit that creates this report; its SHA is recorded canonically in `data/governance/release_identity_nonbi.json`.

## Why v1.0.1 exists

`v1.0.1` is a release-hygiene patch. It does not change the controlled finance truth or scenario economics.

The patch closes recruiter-facing reproducibility and wording issues that landed after `fpa-portfolio-v1.0`:

1. README is reduced to a current-state recruiter index and private site version is aligned to version 52.
2. README release-governance wording no longer treats the moving live `main` SHA as committed release identity.
3. Page 10 labels the 15.9% metric as **Non-payroll OPEX mix**, distinguishing it from the separate 75.6% non-payroll share of the Q4-vs-Q1 OPEX increase.
4. Release identity, project status and release-identity QA are promoted consistently to `v1.0.1`.
5. The original `fpa-portfolio-v1.0` tag remains immutable; `fpa-portfolio-v1.0.1` is a new tag.

## Controlled finance outputs

FY2025 Base remains unchanged:

- Revenue: `82.5138` VND bn
- Gross profit: `26.9150` VND bn
- EBITDA proxy: `12.8956` VND bn
- EBITDA proxy margin: `15.6284%`
- Contribution: `24.2074` VND bn
- Cash conversion cycle: `54` days

Existing scope semantics remain unchanged:

- Page 6 separates P-006 Energy Retrofit (`1.300` VND bn; `22` months) from the six-project portfolio CAPEX envelope (`6.550` VND bn; `58.74%` utilization).
- Page 10 separates four negative-contribution cases, one positive promotion below the ROI hurdle and three channels below the contribution-margin hurdle.
- Gate A remains `OPEN / PENDING_EXTERNAL_INPUT` by design.
- Page 6 OPEX bridge remains `OPEN` by design and visibly disclosed.
- Power BI remains `OUT_OF_ACTIVE_SCOPE`.

## Source-freeze QA

The release source freeze `6d83dd44417d90bc3dc7818cc865da7d5a3e6c6d` completed successfully on GitHub Actions:

- Finance core QA: `SUCCESS`
- GitHub Pages deployment: `SUCCESS`

The patch-release metadata and validators are subsequently updated without changing finance outputs.

## Evidence boundary

- Operating finance: `SIMULATED / DERIVED` controlled case data.
- Public-company analysis: `OBSERVED / CALCULATED_PUBLIC`, kept as a separate subject area.
- Valuation / M&A / Monte Carlo: `SYNTHETIC_REHEARSAL` appendices.
- Live forecast accuracy: `PENDING_EXTERNAL_INPUT`; no employer/live-performance claim is made.

## Freeze rule

After the `fpa-portfolio-v1.0.1` tag is created and release-identity QA is green, this repository should be treated as **feature-frozen for recruiter use**. New work should be limited to genuine evidence updates, factual corrections, broken links or security/dependency maintenance—not additional portfolio modules.
