# MCH FY2017 Web-Indexed Statement Evidence

Status: `INDEXED_ONLY` (not approved)  
Source: official Masan Consumer annual-report PDF URLs
Primary URL: https://masanconsumer.com/wp-content/uploads/2024/05/Bao-cao-thuong-nien-nam-2017.pdf
Alternate official media URL: https://masanconsumer.com/wp-content/uploads/2024/12/Bao-cao-thuong-nien-nam-2017-3.pdf
Indexed PDF metadata: 75 pages; web text indexed from the official PDF.

## Why this layer exists

The official FY2017 PDF is discoverable and readable through the web index, but direct byte retrieval from the current runtime returns a TLS handshake error on both official media URLs; the alternate URL is retained as a second official retrieval candidate. The evidence below is therefore stored as a bounded text extraction layer. It confirms the FY2017 values already carried as comparative/corresponding-column evidence in the audited FY2018 filing, but it does not promote the standalone PDF to `APPROVED`.

## Page-level evidence

| Metric | Value (VND bn) | Evidence anchor | Evidence note |
|---|---:|---|---|
| Net revenue | 13,213.6403 | PDF p.38, line 10 | Audited consolidated income statement: 13,213,640,273,416 VND |
| Gross profit | 6,032.5814 | PDF p.38, line 20 | Revenue less cost of sales; management summary rounds to 6,033bn |
| Operating profit | 2,624.3615 | PDF p.38, line 30 | “Lợi nhuận thuần từ hoạt động kinh doanh” |
| Profit before tax | 2,621.9676 | PDF p.38, line 50 | Audited consolidated income statement |
| Profit after tax | 2,245.9977 | PDF p.38, line 60 | Audited consolidated income statement |
| Total assets | 17,645.0566 | PDF p.37 / p.30 summary | Balance sheet total assets; summary rounds to 17,645bn |
| Equity | 11,331.8275 | PDF p.31 / p.38 | Total equity/resources attributable to the group presentation |
| CFO | 2,112.9503 | PDF p.39, line 20 | Net cash from operating activities |

## Derived readout (calculated, not reported)

- Gross margin: **45.66%** (6,032.5814 / 13,213.6403).
- Operating margin: **19.86%** (2,624.3615 / 13,213.6403).
- CFO / PAT: **94.08%** (2,112.9503 / 2,245.9977).
- Equity ratio: **64.22%** (11,331.8275 / 17,645.0566).
- Revenue declined approximately 4.18% versus FY2016 (13,789.7594bn), while PAT declined approximately 19.52%; this is a calculated comparison and remains subject to the same perimeter/accounting basis.

## Finance-analyst interpretation

The page-indexed statements support the existing FY2017 narrative: revenue reset during distributor inventory rebalancing, gross margin improved modestly, SG&A remained a pressure point, and cash conversion was weaker than a clean earnings read would suggest. The report itself describes a reduction of distributor inventory and a shift from “selling products” toward brand building; these are management explanations, not independently causal proof.

## Evidence boundary

- `source_status`: `INDEXED_ONLY`.
- `confidence`: `MEDIUM` for the extracted values; page anchors are visible in the indexed PDF, but the original bytes/hash are not archived.
- Do not cite this layer as a standalone archived annual-report file in the approved source registry.
- Keep FY2017 provenance in the approved supplement as FY2018 audited comparative/corresponding columns until the official PDF bytes are archived and page-reviewed from a retained copy.

## Reproduction

Use `data/mch_fy2017_web_index_evidence.csv` and run `scripts/validate_mch_fy2017_web_evidence.mjs`. The validator checks the eight-row grain, exact source URL, page anchors, non-negative values and the `INDEXED_ONLY` boundary.


