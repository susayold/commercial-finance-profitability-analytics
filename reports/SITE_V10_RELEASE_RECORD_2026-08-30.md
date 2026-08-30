# Site V10 Release Record — 2026-08-30

## Release outcome

Site V10 is the deployed recruiter-facing Finance Analyst portfolio surface. It adds a dedicated **Next Execution Sprint** section that exposes the remaining evidence path instead of hiding it.

| Field | Value |
|---|---|
| Production URL | https://vn-finance-fpa-case.sangkenny200.chatgpt.site |
| Sites project | `appgprj_6a930a2f81f48191b1e015f1fa938c69` |
| Sites version | 10 |
| Sites version ID | `appgprj_6a930a2f81f48191b1e015f1fa938c69~appgver_980f5e5482088191817af575d98e213e` |
| Deployment | `appgdep_6a93f8240c9081918d64e78f6fd17e56` |
| Deployment status | `succeeded` |
| Site source commit | `a650aa44b2eaf46e5d8dc3ba417471ef05a7a59f` |
| GitHub mirror commit | `bd4c4afde8a5292f3079172e95f1c7d5621a284f` |
| Archive SHA-256 | `bc4b3d5c9d2c225525ead815a82b3455b9eccae06ec3ffee67faec0536feab30` |

## V10 changes

- Added a `Next Execution Sprint` navigation item and section.
- Added three recruiter-readable cards:
  - Gate A live forecast evidence;
  - Gate B native Power BI release;
  - CV personalization and release freeze.
- Added a status track showing Gate A/B `OPEN` and candidate personalization `READY`.
- Linked the detailed playbook, Gate A data request, Power BI Desktop checklist, CV evidence map and playbook QA.
- Kept synthetic/public evidence boundaries visible; no live impact or native PBIX claim was introduced.

## Validation

- Site build: PASS (`npm run build`).
- Next execution sprint validator: 12/12 PASS.
- Full repository QA runner: PASS, including the new sprint validator and Power BI contract-shape check.
- Sites deployment: `succeeded`.

## Evidence boundary

The site remains owner-only/private. Gate A still requires one genuine approved internal pre-close snapshot. Gate B still requires native Power BI Desktop execution, QA-01–QA-18 observed evidence and the PBIX binary. Candidate contact and experience fields remain input-gated.

