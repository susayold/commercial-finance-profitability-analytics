# Peer Comparability Decision Memo — 2026-08-30

## Technical summary

The approved peer universe remains VNM, QNS, KDC and MCH, but the analysis should not force one identical trend statistic across all four companies. VNM is suitable for a long-run FY2016–FY2025 benchmark on the documented VAS-summary basis. QNS and KDC are useful for bounded margin, asset-efficiency and operating-context comparisons, but their full-period revenue series contain basis or perimeter breaks. MCH is the commercial anchor, while its OCR-derived candidate rows remain outside the verified peer panel until page-level review is completed.

This is a comparability control: a blank CAGR is preferable to a precise but misleading ranking.

## Key findings and evidence

| Ticker | Historical coverage | 2025 PBT margin | 2025 PAT margin | Revenue/assets | Decision |
|---|---:|---:|---:|---:|---|
| VNM | FY2016–FY2025 | 18.30% | 14.79% | 1.19x | Use 3.43% FY2016–FY2025 CAGR within the documented VAS-summary basis |
| QNS | FY2016–FY2025 | 20.92% | 18.12% | 0.74x | Use cross-sectional/input-cost context; do not publish an unadjusted full-period CAGR |
| KDC | FY2016–FY2025 | 8.03% | 6.48% | 0.65x | Use perimeter/portfolio context; do not publish an unadjusted full-period CAGR |
| MCH | FY2016–FY2025 raw archive; OCR queue | — | — | — | Hold from verified peer ranking pending human review |

Interpretation:

- VNM provides the cleanest structural benchmark: moderate long-run growth, an 18.30% 2025 PBT margin and 1.19x revenue/assets.
- QNS provides a high-margin manufacturing/input-cost reference, but the revenue basis changes between the older and newer evidence layers.
- KDC is useful for portfolio and one-off analysis; reported growth is not automatically organic growth because consolidation and portfolio perimeter changed.
- MCH should calibrate category/channel economics, not supply unreviewed OCR numbers to a peer ranking.

## Scope, data and metric definitions

- **As-of date:** 2026-08-30.
- **Universe:** VNM (Vinamilk), QNS (Quang Ngai Sugar), KDC (KIDO Group) and MCH (Masan Consumer).
- **Revenue CAGR:** `(revenue_end / revenue_start)^(1 / number_of_year_intervals) - 1`; calculated only when the start/end values represent the same line-item basis and comparable perimeter.
- **PBT margin:** profit before tax divided by reported revenue for FY2025.
- **PAT margin:** profit after tax divided by reported revenue for FY2025.
- **Revenue/assets:** FY2025 revenue divided by FY2025 total assets; this is a turnover proxy, not ROA.
- **Evidence classes:** statement-verified values, reported-summary values, calculated ratios, synthetic model outputs and OCR candidates are kept distinct.
- **Primary data artifacts:** `data/peer_analyst_summary.csv`, `data/peer_analyst_summary_longrun.csv`, `docs/PEER_PANEL_REVIEW_STATUS.md`, the MCH OCR triage/workbench artifacts and the official-report archive in the private Drive project folder.

## Methodology and calculation spot-checks

1. Start from the approved peer summary and long-run summary, retaining the source coverage note for every row.
2. Recalculate each displayed ratio from the reported numerator and denominator rather than trusting a pre-computed percentage.
3. Test the revenue series for line-item basis consistency and corporate-perimeter continuity.
4. Apply a conservative decision rule: calculate a CAGR only for a comparable pair; otherwise preserve a null and explain the break.
5. Keep MCH OCR candidates in a review queue with page, table, row-label, reviewer, evidence-reference and approval fields.

Independent arithmetic checks reproduce the published rounded values:

- VNM CAGR: `(63,646 / 46,965)^(1/9) - 1 = 3.4347%`, rounded to 3.43%.
- VNM FY2025 PBT margin: `11,650 / 63,646 = 18.3044%`, rounded to 18.30%.
- QNS FY2025 PAT margin: `1,916 / 10,575 = 18.1182%`, rounded to 18.12%.
- KDC FY2025 revenue/assets: `9,055 / 13,907 = 0.6511x`, rounded to 0.65x.

## What can be used in the portfolio

### VNM — structural benchmark

Use the long-run revenue trend, margin regime, cash conversion, capex intensity and asset efficiency. Keep the FY2021–FY2025 reported-summary layer visibly separate from the statement-verified FY2016–FY2020 layer, and retain restatement/basis-break flags in the FY2006–FY2025 panel.

### QNS — input-cost and plant-economics context

Use 2025 margins and the statement layer for plant economics, sugar/soy input sensitivity and working-capital discussion. Label newer values as reported-summary evidence. Do not rank QNS on a full-period CAGR beside VNM until revenue is rebuilt on one basis.

### KDC — portfolio and perimeter context

Use exact audited FY2024–FY2025 statements (including page anchors 165–171), 2025 margins, asset efficiency and the statement layer for portfolio change, one-offs and perimeter risk. Present the revenue jump around Vocarimex/TAC consolidation as reported growth, not organic growth; the earlier FY2016–FY2023 perimeter break remains flagged.

### MCH — commercial anchor

Use official category/channel disclosures and the audited archive to calibrate the fictional VietNova commercial story. No OCR candidate becomes verified merely because a machine selector found it.

## Limitations, uncertainty and robustness checks

- QNS comparability is limited by the documented switch from total-revenue basis in FY2016–FY2019 to net-revenue summary in the later layer.
- KDC comparability is limited by Vocarimex/TAC consolidation and subsequent portfolio/perimeter changes.
- MCH OCR values have unresolved page-level review, including missing-candidate concentration, adjacent-year duplicate signals and low-value outlier flags.
- FY2025 cross-sectional ratios are directional benchmarks, not proof of operating superiority; accounting policy, product mix and capital structure differ.
- A normalized trend panel requires preserving original reported values alongside any adjusted values and documenting each bridge.
- No inference here establishes causality or internal forecast accuracy.

## Next steps and release controls

1. Obtain statement-level FY2021–FY2025 QNS and KDC values on the same line-item basis.
2. Rebuild 2016–2025 revenue on one documented basis and retain original versus normalized values.
3. Document perimeter changes and calculate an adjusted bridge only where supportable.
4. Complete page-level MCH review for every metric used in a peer comparison.
5. Re-run the peer validator and update the evidence matrix before changing a CV claim, website headline or ranking.
6. Keep Gate A (real internal forecast snapshot) and Gate B (native PBIX/Desktop QA) separate from this peer-comparability decision.

## Further questions for the reviewer

- Should the portfolio show a two-panel view (VNM long-run trend plus QNS/KDC bounded context) instead of a single league table?
- Which QNS/KDC line-item basis should be the canonical normalized revenue definition?
- Which MCH categories/channels are most decision-relevant for the VietNova commercial case?
- What real internal snapshot and native PBIX evidence will be added when Gate A/B owners complete the external handoff?

## Reviewer conclusion

The panel is strong enough for a finance-analyst portfolio because it demonstrates judgement about what not to compare. VNM supports long-run trend claims; QNS and KDC support bounded context and stress analysis; MCH remains a commercial anchor with explicit OCR controls. A single cross-company CAGR table that ignores revenue basis or perimeter changes would be less credible than this scoped decision.


## QNS evidence-layer update

The QNS FY2025 Annual Report provides a readable consolidated management summary for FY2021–FY2025 (report pages 27–28). Gross profit and owners' equity are now populated in the normalized panel for these years. The values are still tagged `reported_in_annual_report` and `partially_comparable` rather than audited statement-level because the supplied report does not yield accepted line-level statement extraction. Operating profit and operating cash flow remain unavailable. Use QNS for long-run context with the evidence-tier flag visible; do not imply audited statement provenance for these promoted rows. See `reports/QNS_REPORTED_SUMMARY_EVIDENCE_2021_2025.md`.