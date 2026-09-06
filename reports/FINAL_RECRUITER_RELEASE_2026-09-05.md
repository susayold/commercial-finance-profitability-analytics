# VNFINANCE-FPA-v1.0 — Final Recruiter Release

- Release source SHA: `fa2123fd0897bd2a8073d960ec094b36fd1434f7`
- Release metadata commit: `8eb80861274be7677505265fbbfff514efa10472`
- Current main SHA: `d8b9c8449164fc95ce34ae0c21fd7e6d9405003d`
- Release tag: `fpa-portfolio-v1.0`
- GitHub Pages: https://susayold.github.io/commercial-finance-profitability-analytics/
- Private site: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Private site version: 50

## Controlled outputs

- FY2025 Base: Revenue 82.5138bn, Gross Profit 26.9150bn, EBITDA Proxy 12.8956bn, Contribution 24.2074bn, CCC 54d.
- Page 2 Actual EBITDA Proxy is derived from Actual GP minus Actual OPEX: 12.134540bn.
- Page 8 uses the canonical plan contract; long-range cash is withheld pending opening-state reconciliation.
- Page 4 customer rehearsal, Page 5 costing rehearsal, Page 6 resource planning and Page 7 stress analysis remain separate scopes.
- Evidence taxonomy includes PROXY_DERIVED and CALCULATED_PUBLIC; DIO/DPO/CCC proxy semantics are disclosed.

## QA and open boundaries

- Final recruiter release QA: PASS; owner-page parity, taxonomy, WC semantics, scope and finance-literal checks all pass.
- True link QA: PASS; 11/11 internal routes, 4/4 built-output checks and 3/3 public HTTP links.
- Page 10 builder is deterministic and reads owner contracts only (repeat SHA-256: `5871217A14CFE177E6719DCB45B02F241712540D88DD87235DCECFD57E02C7A2`).
- Build: PASS.
- Finance core CI: PASS. Archived Power BI workflow is manual/path-filtered and inactive for normal website pushes.
- Gate A: OPEN / PENDING_EXTERNAL_INPUT; live forecast accuracy claims remain blocked.
- Page 6 OPEX bridge: +496.1m OPEN.
- Power BI: OUT_OF_ACTIVE_SCOPE.
