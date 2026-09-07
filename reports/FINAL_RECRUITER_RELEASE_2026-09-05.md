# VNFINANCE-FPA-v1.0 — Final Recruiter Release

- Release source SHA: `fa2123fd0897bd2a8073d960ec094b36fd1434f7`
- Release metadata commit: `8eb80861274be7677505265fbbfff514efa10472`
- Release tag: `fpa-portfolio-v1.0`
- GitHub Pages: https://susayold.github.io/commercial-finance-profitability-analytics/
- Private site: https://vn-finance-fpa-case.sangkenny200.chatgpt.site
- Private site version: 52 (source `ca9f4f88a5d87ee3e94ffca1d4395335f77095d3`)

## Controlled outputs

- FY2025 Base: Revenue 82.5138bn, Gross Profit 26.9150bn, EBITDA Proxy 12.8956bn, Contribution 24.2074bn, CCC 54d.
- Page 2 Actual EBITDA Proxy is derived from Actual GP minus Actual OPEX: 12.134540bn.
- Page 8 uses the canonical plan contract; long-range cash is withheld pending opening-state reconciliation.
- Page 4 customer rehearsal, Page 5 costing rehearsal, Page 6 resource planning and Page 7 stress analysis remain separate scopes.
- Page 6 CAPEX semantics separate the P-006 Energy Retrofit project budget (1.300bn) from the six-project portfolio envelope (6.550bn).
- Page 10 commercial semantics distinguish 4 negative-contribution cases, 1 positive promotion below the ROI hurdle (E07), and 3 channels below the CM hurdle.
- Release identity uses stable source/metadata roles; no committed field attempts to mirror the live repository HEAD.
- External claim inputs are kept separate from portfolio completion and do not block the recruiter-ready synthetic release.
- Evidence taxonomy includes PROXY_DERIVED and CALCULATED_PUBLIC; DIO/DPO/CCC proxy semantics are disclosed.

## QA and open boundaries

- Final recruiter release QA: PASS; owner-page parity, taxonomy, WC semantics, scope and finance-literal checks all pass.
- True link QA: PASS; 11/11 internal routes, 4/4 built-output checks and 3/3 public HTTP links.
- Page 10 builder is deterministic and reads owner contracts only (current contract SHA-256: `13277857C7A83288B785A59DBDC56746FA17C24F1704FBD7637AFBB083E09798`).
- Build: PASS.
- Finance core CI: PASS. Archived Power BI workflow is manual/path-filtered and inactive for normal website pushes.
- Gate A: OPEN / PENDING_EXTERNAL_INPUT; live forecast accuracy claims remain blocked.
- Page 6 OPEX bridge: +496.1m OPEN.
- Power BI: OUT_OF_ACTIVE_SCOPE.
