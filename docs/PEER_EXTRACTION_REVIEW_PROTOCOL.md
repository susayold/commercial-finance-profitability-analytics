# Peer-panel extraction and review protocol

## Objective

Create a reviewable, multi-year panel for VNM, QNS, KDC and MCH without silently mixing annual-report narratives, separate financial statements, consolidated financial statements, restated comparatives or different unit scales.

## Extraction tiers

1. Tier 1 — machine extraction: page text, candidate label, first/current and comparative number, unit text, page number, source file and extraction timestamp.
2. Tier 2 — human review: confirm statement scope, period column order, sign convention, unit scale, restatement flag and original Vietnamese/English label.
3. Tier 3 — approved panel: only rows with a unique company-year-period-scope-metric key and evidence link are used in calculations.
4. Tier 4 — derived metrics: margins, CAGR, DSO/DIO/DPO/CCC and growth are calculated from approved reported rows; never overwrite reported values.

## Required reviewer checks

For every metric row:

- confirm page is a primary statement, not a chart or management highlight;
- confirm consolidated versus separate; an ambiguous page is held out;
- confirm FY versus quarterly/half-year period;
- confirm current and comparative columns against the statement heading;
- confirm VND / VND million / VND billion / USD scale;
- preserve parentheses as negative values and dash as missing, not zero;
- record whether the value is reported, restated comparative, or calculated;
- preserve original label and page reference;
- cross-foot revenue, gross profit, operating profit and NPAT to the statement totals where possible;
- compare annual-report highlights against audited statement and resolve discrepancies with the audited statement as primary.

## Restatement and comparability rules

- Use the latest audited comparative for a prior year only when the row is explicitly marked restated.
- Do not splice a separate statement into a consolidated series.
- Do not backfill QNS 2015 or unavailable MCH annual-report media with third-party copies; keep the gap visible.
- For MCH, the audited consolidated FS 2016–2025 layer is the financial-core anchor; annual reports are used for narrative and operating context.
- If unit or scope cannot be proven, set review_status = hold and exclude from peer ranking.

## Minimum panel metrics

Revenue/net sales, gross profit, operating profit, NPAT, total assets, cash, inventory, trade receivables, trade payables, operating cash flow, total debt and capex. Derived: gross margin, operating margin, NPAT margin, asset turnover, ROA, net debt/EBITDA proxy, DSO, DIO, DPO and CCC.

## Approval evidence

Each approved row must carry:

- GitHub registry key and source URL;
- Drive raw PDF link;
- source page number;
- reviewer initials and review date;
- confidence (high, medium, low);
- a note for OCR/manual entry or any classification judgment.

## QA gates

- no null approved values;
- no duplicate approved keys;
- no ambiguous scope;
- no unexplained sign flips;
- statement equations and cash-flow roll-forward checks pass where applicable;
- ratios are recalculated from approved components;
- every chart in the website/workbook can drill to the row-level evidence link.
