# Final QA & Remote Handoff — VietNova Finance Portfolio

Date: 2026-08-30  
Authoritative archives: [GitHub repository](https://github.com/susayold/commercial-finance-profitability-analytics) and [Google Drive project root](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR)

## Overall assessment

**Share with caveats.** The finance case is coherent, source-linked and recruiter-ready for a Junior FP&A / Finance Analyst portfolio. The Excel v2 model, synthetic ledger, management narrative, deck, website and peer-panel layer are complete enough to demonstrate operating-finance judgment. Two items remain intentionally open: (1) a native Power BI `.pbix` file is not available in this environment, so the semantic model and DAX are delivered as an implementation contract; and (2) genuine internal pre-close forecast snapshots are not available, so observed internal Bias/WAPE cannot be claimed. The VNM FY2006–FY2020 statement layer and QNS/KDC legacy statement rows are now archived and validator-checked; historical comparability caveats remain.

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
2. **Medium — historical comparability, not extraction completeness.** The 25-row queue in `Peer_Extraction_Queue` covers VNM FY2006–2020, QNS FY2016–2020 and KDC FY2016–2020; all rows now carry statement-level metrics, source URLs, page anchors and reviewer notes. VNM FY2006 retains a restated-comparative flag; QNS net-revenue versus total-revenue presentation and KDC perimeter changes still prevent naive cross-company long-run ranking.
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

The approved benchmark export `data/peer_benchmark_approved_2016_2025.csv` now provides the Power BI-ready 30-row peer table with evidence and revenue-basis controls.

### QNS FY2020 promotion (2026-08-30)

QNS FY2020 is now statement-verified from the official audited consolidated financial statements (report pages 6–9), including VAS net revenue, gross profit, operating profit, PBT, PAT, assets, equity and CFO. The queue is now 11 verified statement rows, 13 summary candidates and 1 remaining statement-review row. The approved benchmark row uses VAS net revenue 6,489.764 bn and preserves the 6,702 bn summary KPI difference as a comparability note.

- QNS statement CSV: [GitHub](../data/qns_statement_metrics_2020.csv) · [Drive](https://drive.google.com/file/d/1tfACwjS4LDGb6SRzY2ubJvngK-H8elMa/view)
- Official audited source PDF: https://drive.google.com/file/d/1KqGqXOUl67oLp4MHnpwL-VCpHX0narW0/view
- Native Sheet tab: `QNS_Statement_Metrics_2020`

### QNS FY2016–FY2019 promotion (2026-08-30)

QNS FY2016–FY2019 are now statement-verified in the consolidated peer layer. FY2016–FY2017 use the audited FY2017 filing (FY2016 comparative column), FY2018 uses the archived audited consolidated FY2018 PDF, and FY2019 uses the audited FY2020 consolidated filing's FY2019 comparative column. The FY2019 standalone filing is intentionally excluded. The approved benchmark now contains 15 statement-verified rows, 9 summary candidates and 1 statement-review row.

- QNS statement CSV: [GitHub](../data/qns_statement_metrics_2016_2019.csv) · [Drive](https://drive.google.com/file/d/1WrGQZgBPy-B77_Fahfbcoukraknu7lFN/view)
- Native Sheet tab: `QNS_Statement_Metrics_2016_2019`
- QNS FY2018 audited source: [Drive](https://drive.google.com/file/d/1AohYk_IrJGml5C95EC4g2xDxWTAVnp3E/view)
- QNS FY2019 comparative source: [audited FY2020 consolidated PDF in Drive](https://drive.google.com/file/d/1KqGqXOUl67oLp4MHnpwL-VCpHX0narW0/view)

This closes the QNS FY2016–FY2020 statement layer. Historical VNM FY2006–FY2015 candidates remain intentionally unapproved pending human page-level review.

### Legacy review control added (2026-08-30)

The remaining VNM FY2006–FY2015 backlog now has a field-level promotion protocol with statement identity, page-anchor, unit normalization, arithmetic tie-out and restatement gates. See [GitHub protocol](VNM_LEGACY_REVIEW_PROTOCOL.md) and [Drive copy](https://drive.google.com/file/d/1jlDU8a-hci7WuRDTi1Vy3Bjc1lEWA0GP/view). This keeps legacy candidates visible and useful without presenting them as audited verified rows.

### VNM FY2014–FY2015 promotion (2026-08-30)

VNM FY2014–FY2015 are now statement-verified from the audited VAS consolidated FY2015 filing. The FY2014 comparative column and FY2015 current column provide all eight required metrics on statement pages 116–123. Queue status is now 17 verified, 7 summary candidates and 1 statement-review row (VNM FY2006).

- [VNM FY2014–FY2015 statement CSV](../data/vnm_statement_metrics_2014_2015.csv)
- Drive CSV: https://drive.google.com/file/d/1oz7ENrbZD1yf_kkts1TsKFqKTOkprm6Z/view
- Source report: https://drive.google.com/file/d/1F2fn3TYgQMkl_C7xoasOAGPOzbCXY8R8/view

### VNM FY2012–FY2013 promotion (2026-08-30)

VNM FY2012–FY2013 are now statement-verified from the audited VAS consolidated FY2013 filing. FY2012 is the comparative column and FY2013 is the current-year statement; all eight metrics are captured on pages 145–149. Queue status is now 19 verified, 5 summary candidates and 1 statement-review row (VNM FY2006).

- [VNM FY2012–FY2013 statement CSV](../data/vnm_statement_metrics_2012_2013.csv)
- Drive CSV: https://drive.google.com/file/d/18dc8GKyLAyMwvQWdIb_vmT-et-mb-H7G/view
- Source report: https://drive.google.com/file/d/1Mnh5QV6ZRPSCQoBDCClR4Pd3CjIZDt1D/view

### VNM FY2010–FY2011 promotion (2026-08-30)

VNM FY2010–FY2011 are now statement-verified from the audited VAS consolidated FY2011 filing. FY2010 is the comparative column and FY2011 the current-year column; pages 72–76 cover the statement set and all eight required metrics. Queue status is now 21 verified, 3 summary candidates (VNM FY2007–FY2009) and 1 statement-review row (VNM FY2006).

- [VNM FY2010–FY2011 statement CSV](../data/vnm_statement_metrics_2010_2011.csv)
- Drive CSV: https://drive.google.com/file/d/1RuwQRtuuN31rEl2UXhWMKf4FY_Yai5w4/view
- Source report: https://drive.google.com/file/d/11ZPUwIM_Sl_i8FUWUATCPoetHoVlnvDs/view

The approved benchmark export remains FY2016–FY2025; FY2010–FY2015 rows are retained in the evidence-gated statement layer for future scope extension.

### VNM FY2009 promotion (2026-08-30)

VNM FY2009 is now statement-verified from the audited VAS consolidated FY2010 filing's comparative column (pages 6–11). All eight required metrics are archived in [GitHub](../data/vnm_statement_metrics_2009.csv) and [Drive](https://drive.google.com/file/d/1MOw5Sd553SYcOtR0k6zEpC4ZjGs4znLi/view). Queue status is now 22 verified, 2 summary candidates (VNM FY2007–FY2008) and 1 statement-review row (VNM FY2006). The approved benchmark remains FY2016–FY2025.

### VNM FY2008 promotion (2026-08-30)

VNM FY2008 is now statement-verified from the audited VAS consolidated FY2009 filing's comparative column (pages 5–11). All eight required metrics are archived in [GitHub](../data/vnm_statement_metrics_2008.csv) and [Drive](https://drive.google.com/file/d/1odUeiFWTGYYdmD7SfCVHUgoVoL2P3iuv/view). Queue status is now 23 verified, 1 summary candidate (VNM FY2007) and 1 statement-review row (VNM FY2006). The approved benchmark remains FY2016–FY2025.

### VNM FY2007 promotion (2026-08-30)

VNM FY2007 is now statement-verified from the audited VAS consolidated FY2008 filing's comparative column (pages 4–10). All eight required metrics are archived in [GitHub](../data/vnm_statement_metrics_2007.csv) and [Drive](https://drive.google.com/file/d/1R-gRhH3CB6_Ampk-FKmkJLSC2q3OrpMY/view). Queue status is now 24 verified and 1 statement-review row (VNM FY2006). The approved benchmark remains FY2016–FY2025.

### VNM FY2006 promotion (2026-08-30)

VNM FY2006 is now statement-verified from the audited VAS consolidated FY2007 filing's restated comparative column (pages 5–11). All eight required metrics are archived in [GitHub](../data/vnm_statement_metrics_2006.csv) and [Drive](https://drive.google.com/file/d/1hwWLegn75wdISM2y3FvpLJfz2drloKNe/view). Queue status is now 25 verified rows; the approved benchmark remains FY2016–FY2025.

### Full VNM historical closure and Power BI build guide (2026-08-30)

The VNM statement layer is now complete for FY2006–FY2020: 15 rows, eight metrics per year, official source URLs, page anchors and basis caveats. FY2006 is explicitly a restated comparative because FY2007 was the first VAS 25 consolidated-reporting year. The detailed Power BI reproducibility guide is available at [GitHub](../powerbi/POWER_BI_BUILD_GUIDE_V2.md) and [Drive](https://drive.google.com/file/d/13BM9_oOwLxyMnO9IPGkaPWcyVB991q_Y/view). Native `.pbix` creation remains Desktop-dependent; all inputs, DAX, page specs and QA gates are remote and ready.


## Power BI QA automation pack (2026-08-30)

The remote handoff now includes an 18-test [QA matrix](../powerbi/QA_TEST_MATRIX.md) and executable [DAX validation query](../powerbi/qa_validation_queries.dax). These convert the remaining native-PBIX work into a deterministic release gate: tie out the model, prove no impossible sales rows, validate scenario isolation, confirm peer evidence filters, preserve VNM historical caveats and document the five-minute reviewer path. Drive copies: [QA matrix](https://drive.google.com/file/d/1goi-4XMbHbUAeqE9dIHkISHhdZf5MGtb/view) · [DAX controls](https://drive.google.com/file/d/1l2_xVOfEdXzozbON4-7BN6hTt6zlSAog/view).


## Native PBIX execution runbook (2026-08-30)

The remaining Desktop-dependent step is documented end-to-end in [powerbi/POWER_BI_DESKTOP_RUNBOOK.md](../powerbi/POWER_BI_DESKTOP_RUNBOOK.md) with a [Drive copy](https://drive.google.com/file/d/1GdN43ajowcg9qjIf5fmwnX9Qarfd64Us/view). It covers import, data typing, relationships, measures, page construction, QA-01–QA-18 and upload/delete steps so the local copy never becomes the authoritative archive.


## Forecast snapshot template (2026-08-30)

The forecast accuracy gate now has a native [Google Sheet capture template](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit) with Instructions, input eligibility checks and Backtest_Output formulas. It was converted and read back successfully; synthetic unit-test rows are clearly labelled and must be replaced before publishing live Bias/WAPE.


## Forecast governance close control (2026-08-30)

A detailed [forecast snapshot close calendar](FORECAST_SNAPSHOT_CLOSE_CALENDAR.md) is now archived. It specifies the monthly WD-5 to month+1 operating cadence, immutable snapshot fields, freeze protocol, RACI, leakage-safe eligibility rule, exception treatment and recruiter evidence pack. The native [capture Sheet](https://docs.google.com/spreadsheets/d/1jv9rl49WDkwmRx8p41C10P0epbPY-Oq8AlihxQGJMfg/edit) remains the operational input surface; synthetic rows are unit-test fixtures only.


## Monthly Business Review operating-pack closeout (2026-08-30)

The Finance Analyst operating pack is now included in the remote QA surface. It is a synthetic management-review rehearsal with proxy KPIs, PVM/variance formulas, working-capital triggers, scenario boundaries, an owner/value-equation/guardrail/date tracker and an 8-point release checklist. GitHub validator and CI check the report and KPI CSV; Drive stores the native pack, Sheet, raw CSV, QA and validator. It does not close Gate A or Gate B.


## KPI dictionary handoff (2026-08-30)

The KPI dictionary is now part of the remote QA surface. It is designed to prevent ambiguous denominators, mixed evidence classes, basis-break ranking and unsupported forecast/credit/valuation claims. Validator and Drive mirrors are complete; Gate A/B remain external.


## Management recommendation handoff (2026-08-30)

The register is now in the remote QA surface and Drive archive. It is a decision-support rehearsal with explicit synthetic/proxy/public/governance labels; it does not claim realized savings, revenue uplift or investment returns.


## Business partnering closeout (2026-08-30)

Battle cards v2 are now included in the remote QA surface and Drive archive. The cards demonstrate conditional approval, contribution-versus-cash trade-offs and escalation discipline; they remain a synthetic rehearsal rather than realized company impact.
