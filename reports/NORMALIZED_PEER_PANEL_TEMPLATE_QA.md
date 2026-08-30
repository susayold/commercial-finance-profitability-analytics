# Normalized Peer Panel QA Report

Mode: template
Input: work/normalized_peer_panel_intake_template.csv

**Overall status: PASS** (14/14 checks passed)

| Check | Status | Detail |
|---|---|---|
| Required headers | PASS | missing=none |
| No duplicate headers | PASS | headers=37; unique=37 |
| Unique company-year-metric keys | PASS | duplicates=none |
| Allowed company IDs | PASS | invalid=0 |
| Annual FY period | PASS | invalid=0 |
| Valid fiscal years | PASS | invalid=0 |
| Allowed metric set | PASS | invalid=0 |
| Calendar dates align | PASS | invalid=0 |
| Unit and scale | PASS | invalid=0 |
| Template row count | PASS | rows=80; expected=80 |
| Template is MCH-only | PASS | invalid=0 |
| Template has every FY/metric | PASS | expected one row for every FY2016-FY2025 and metric |
| Template is blocked by default | PASS | invalid=0 |
| Template provenance is explicit | PASS | invalid=0 |

## Release rule

Template rows are intentionally blocked. Replace placeholders only after page-level source and reviewer evidence are captured.

