# Normalized Peer Panel Methodology

## Purpose

This document defines how the peer panel is converted from wide company-year extracts into a long-form, source-lineage-preserving financial panel. The objective is to make the panel reusable in Excel/Power BI while preventing an apparently precise CAGR or margin ranking from hiding a line-item basis or corporate-perimeter break.

The normalized layer is an evidence contract, not a license to fill missing values.

## Grain and file contract

One row represents one company × fiscal period × metric observation.

- Fiscal period is currently annual FY2016–FY2025.
- The approved export covers VNM, QNS and KDC: 30 company-year groups × 8 metrics = 240 rows.
- MCH has a separate 80-row intake template (10 years × 8 metrics) because its OCR candidates are not yet page-level approved.
- Canonical schema: schemas/normalized_peer_panel.schema.json.
- Approved export: data/normalized_peer_panel_approved_2016_2025.csv.
- KDC FY2024–FY2025 exact statement supplement: data/kdc_statement_metrics_2024_2025.csv (audited FY2025 filing; FY2024 comparative; page anchors 165–171).
- Blocked MCH intake: data/normalized_peer_panel_intake_template.csv.

The eight metrics are:

1. net_revenue_vnd_bn
2. gross_profit_vnd_bn
3. operating_profit_vnd_bn
4. profit_before_tax_vnd_bn
5. profit_after_tax_vnd_bn
6. total_assets_vnd_bn
7. owners_equity_vnd_bn
8. operating_cash_flow_vnd_bn

## Source and unit normalization

- Currency is VND and scale is VND billion (VND_bn).
- The source document, source URL and Drive file ID are retained for every approved row.
- source_page is populated only when the upstream approved panel carries a page anchor. It may be blank for summary-derived rows; this is an explicit evidence limitation, not an invented page reference. Page-level anchors are required before promoting new MCH or normalized-bridge rows.
- The panel does not silently convert VAS revenue to IFRS revenue or merge consolidated and separate statements.
- Fiscal dates use YYYY-01-01 through YYYY-12-31 for the annual panel; this is a period boundary convention, not evidence that every company closes on a different date.
- A blank metric is represented as a blank value plus value_status=not_available_in_source and a non-empty null_reason; it is never converted to zero.
- Reported values remain reported; derived ratios and CAGR stay in the summary layer.

## Comparability decision matrix

| Company | Role | Row-level status | What is allowed | What is blocked |
|---|---|---|---|---|
| VNM | Financial benchmark | comparable within documented VAS-summary basis | FY2016–FY2025 trend, margins, cash/asset efficiency and CAGR | Presenting VAS and IFRS as the same line without a note |
| QNS | Input-cost benchmark | partially_comparable | FY2025 cross-sectional margins, plant economics and bounded context | Unadjusted FY2016–FY2025 CAGR across total-revenue and net-revenue bases |
| KDC | Strategic context | partially_comparable | FY2025 margins/assets and perimeter/portfolio discussion | Calling reported post-consolidation growth organic |
| MCH | Primary commercial anchor | not_applicable in blocked template | Page-level review and later calibration of the VietNova case | Promoting machine-selected OCR rows into peer ranking |

The summary files preserve this decision explicitly:

- data/peer_analyst_summary.csv carries the recent cross-sectional layer.
- data/peer_analyst_summary_longrun.csv carries the long-run CAGR decision.
- reports/PEER_COMPARABILITY_DECISION_2026-08-30.md records the reviewer-facing rationale.

## Promotion workflow

1. Capture the original label and reported value from an official source.
2. Record the source URL, document identifier, page/table anchor and accounting basis.
3. Normalize only unit/scale; preserve original and normalized representations.
4. Set comparability_status and write a specific comparability_note.
5. Set review_status=approved only after evidence review; otherwise use unreviewed, machine_checked or human_reviewed.
6. Run the normalized-panel validator.
7. Recompute summary ratios from the normalized rows.
8. Update the evidence matrix and CV/website claims only after the validator and reviewer decision pass.

## Validation

Run:

    node scripts/validate_normalized_peer_panel.mjs data/normalized_peer_panel_approved_2016_2025.csv --mode=approved --output reports/NORMALIZED_PEER_PANEL_QA.md

    node scripts/validate_normalized_peer_panel.mjs data/normalized_peer_panel_intake_template.csv --mode=template --output reports/NORMALIZED_PEER_PANEL_TEMPLATE_QA.md

The validator checks headers, duplicate keys, company and metric domains, annual period alignment, units, complete eight-metric groups, approval/provenance controls, blank-value semantics, value tie-outs, role mapping, comparability mapping and the absence of row-level CAGR fields.

- Approved export: 18/18 checks PASS; 240 rows.
- MCH template: 14/14 checks PASS; 80 rows, intentionally blocked by default.
- The template passing means its controls are correct; it does not mean MCH has been approved.

## Reviewer rules

- Do not replace a blank with zero.
- Do not average ratios across companies without preserving denominators.
- Do not calculate a CAGR over a known revenue-basis or perimeter break.
- Do not call a summary-table value statement-level verified unless the source layer supports that claim.
- Do not describe public-guidance, synthetic or OCR-candidate values as internal forecast accuracy.
- Keep the original reported figure, normalized figure, source evidence and adjustment rationale side by side when a future restatement is supportable.

## Next extension

The next data action is not to invent missing QNS/KDC values. It is to obtain statement-level FY2021–FY2025 evidence on the same line-item basis, then create a separate normalized bridge with original and adjusted revenue/perimeter fields. MCH remains a human-review workbench task. Gate A and Gate B remain separate external controls.
