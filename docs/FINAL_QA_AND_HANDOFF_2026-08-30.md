# Final QA & Remote Handoff — VietNova Finance Portfolio

Date: 2026-08-30  
Authoritative archives: [GitHub repository](https://github.com/susayold/commercial-finance-profitability-analytics) and [Google Drive project root](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR)

## Overall assessment

**Share with caveats.** The finance case is coherent, source-linked and recruiter-ready for a Junior FP&A / Finance Analyst portfolio. The Excel v2 model, synthetic ledger, management narrative, deck, website and peer-panel layer are complete enough to demonstrate operating-finance judgment. Two items remain intentionally open: (1) a native Power BI `.pbix` file is not available in this environment, so the semantic model and DAX are delivered as an implementation contract; and (2) VNM/QNS legacy rows remain in a statement-level review queue rather than being marked approved without full metric coverage and page anchors.

## Methodology review

- **Decision question:** connect revenue growth to contribution margin, cash conversion and an explicit CFO action.
- **Operating data:** deterministic synthetic VietNova ledger; synthetic facts are labelled in the model, deck and website.
- **Public data:** official annual reports / audited statements archived in Drive; public peers are used for calibration and benchmark context, not as a substitute for private operating data.
- **Peer panel:** VNM, QNS and KDC FY2021–FY2025 from latest official report summaries, with source URL, original basis and comparability note retained.
- **Long-run comparability:** VNM FY2016–FY2025 CAGR is calculated only on a consistent VAS summary basis. QNS and KDC long-run CAGR are deliberately not calculated because of revenue-definition and consolidation-perimeter breaks.

## Calculation spot-checks

| Check | Result |
|---|---|
| Peer PBT margin | Verified as `PBT / net revenue`; no formula errors across 15 panel rows |
| Peer PAT margin | Verified as `PAT / net revenue`; blank PAT remains blank (not 0%) for unverified KDC years |
| Revenue / assets | Verified as `net revenue / total assets` |
| VNM FY2021–25 CAGR | 1.10% (rounded), matches the remote analyst summary |
| QNS FY2021–25 CAGR | 9.58% (rounded), matches the remote analyst summary |
| KDC FY2021–25 CAGR | -3.63% (rounded), matches the remote analyst summary |
| Workbook controls | v2 model status PASS; nine control checks PASS; formula-error scan zero matches |
| Website / deck | Production deployment succeeded; deck render passed overflow QA |

## Issues and caveats

1. **Medium — Power BI handoff is specification-level.** The repository contains `powerbi/model_contract.json`, `powerbi/measures.dax` and `docs/POWER_BI_IMPLEMENTATION_STATUS.md`; the native `.pbix` must be created in Power BI Desktop using the remote v2 workbook as source.
2. **Medium — historical peer extraction is not fully approved.** The 25-row queue in `Peer_Extraction_Queue` covers VNM FY2006–2020, QNS FY2016–2020 and KDC FY2016–2020. VNM/QNS legacy rows remain review-required until full metric coverage is captured; QNS FY2016–FY2020 summary metrics are separately archived with an explicit total-revenue basis note. The queue is traceable through source URL, page-anchor placeholder, reported basis and reviewer note fields.
3. **Medium — KDC statement layer now verified.** Five FY2016–FY2020 rows include gross profit, operating profit, PBT, PAT, assets, equity, CFO and page anchors; consolidation/perimeter caveats still prevent naive long-run CAGR.
4. **Medium — cross-company revenue bases differ.** QNS FY2016–2019 uses total revenue in the source summary, while FY2021–2025 uses net revenue. KDC has a 2017 Vocarimex/TAC consolidation-perimeter change and later portfolio changes. Do not rank long-run CAGR across these breaks without re-normalisation.
5. **Low — synthetic operating economics are illustrative.** VietNova SKU, customer, trade-spend, forecast and cash-cycle values are deterministic scenario data, not reported company data.

## Reviewer hand-off

1. Open the [recruiter website](https://vn-finance-fpa-case.sangkenny200.chatgpt.site) for the five-minute narrative.
2. Open the [v2 workbook](https://docs.google.com/spreadsheets/d/1-DAMs7zqQr8a6Otimm3WgkAIsX3kazpm/edit) and inspect `Checks`, `CFO_Output`, `PVM_Bridge` and `Channel_Profitability`.
3. Review the [peer panel](https://docs.google.com/spreadsheets/d/1HNViR2NV1KPu1H-ZYRADv8amwP1-kzY8QzvmcwT3csE/edit) and its source-linked rows.
4. Use the [Power BI contract](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/powerbi/model_contract.json) to build the six report pages when a Power BI Desktop environment is available.

## Remote storage confirmation

- GitHub contains the versioned data extracts, schemas, scripts, model contract, DAX, documentation and website source.
- Google Drive contains raw official reports, extracted/synthetic CSVs, model workbooks, code snapshots, peer Sheet, memo, deck, website archive and this QA record.
- Local `work/` is staging-only and must be empty after upload; no local file is an authoritative source.



## Latest extraction update (2026-08-30)

VNM FY2016–FY2020 is now statement-verified and archived in [GitHub](../data/vnm_statement_metrics_2016_2020.csv), [Drive](https://drive.google.com/file/d/18IrPvgbW2GHJItmKxZPdQIJXylcYJgZg/view) and the peer Sheet tab `VNM_Statement_Metrics_2016_2020`. The review queue now contains 10 verified statement rows, 14 summary candidates and 1 remaining statement-review row (VNM FY2006).