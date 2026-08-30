# Normalized Peer Panel QA Report

Mode: approved
Input: work/normalized_peer_panel_approved_2016_2025.csv

**Overall status: PASS** (18/18 checks passed)

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
| Approved row count | PASS | rows=240; expected=240 |
| Eight metrics per company-year | PASS | groups=30; bad_groups=0 |
| Approved status | PASS | invalid=0 |
| No placeholder provenance | PASS | invalid=0 |
| Blank-value control | PASS | invalid=0 |
| Value tie-out | PASS | invalid=0 |
| Role mapping | PASS | invalid=0 |
| Comparability mapping | PASS | invalid=0 |
| No CAGR in row-level export | PASS | CAGR is calculated only in the summary layer after comparability review |

## Release rule

Only approved rows with explicit provenance may feed a peer benchmark. QNS/KDC comparability flags remain visible; the file does not calculate a CAGR.

