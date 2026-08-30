# Peer Financial-Quality Scorecard QA — 2026-08-30

Overall status: **PASS (11/11 controls)**

Validator: `scripts/validate_peer_financial_quality_scorecard.mjs`

Controls cover:
- 21 rows = 3 companies × 7 metrics
- unique company × metric keys
- allowed company and metric sets
- two source URLs on every row
- blank/value status control
- rankability labels
- QNS/KDC context-only guardrails
- VNM-only trend-candidate guardrail
- calculation definitions on calculated rows

The scorecard is a controlled analyst layer, not an unqualified peer league table. QNS/KDC basis/perimeter caveats and missing components remain visible.
