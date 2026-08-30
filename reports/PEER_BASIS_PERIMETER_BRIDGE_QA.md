# QNS/KDC Basis & Perimeter Bridge QA

**Overall status: PASS (12/12 checks passed)**

- Input: `data/peer_basis_perimeter_bridge_2016_2025.csv`
- Validator: `scripts/validate_peer_basis_perimeter_bridge.mjs`
- GitHub Actions run: [33288974439](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33288974439)
- Validated commit: `9447932db57f27483f104ce242fd8c960b63945b`

## Checks passed

1. Expected seven segmented windows are present.
2. Required machine-readable columns are present.
3. QNS and KDC coverage is present.
4. Every segment retains source document IDs and URLs.
5. Segment intervals equal end year minus start year.
6. Every multi-year within-window CAGR recomputes from endpoints.
7. KDC 2016 is correctly represented as a single-year anchor with no CAGR.
8. QNS total-revenue and net-revenue basis break is explicit.
9. KDC Vocarimex/TAC transition perimeter break is explicit.
10. No segment is marked as a publishable full-period CAGR.
11. Every segment has a non-empty limitation caveat.
12. Basis/perimeter break caveats are explicit for the key windows.

The bridge is a segmentation and control layer, not a restatement. It does not convert QNS total revenue to net revenue or remove KDC acquired-entity revenue. Full-period QNS/KDC CAGR remains blocked until a supportable line-item/perimeter bridge exists.
