# MCH FY2017 Web-Indexed Evidence QA

Date: 2026-08-30  
Validator: `scripts/validate_mch_fy2017_web_evidence.mjs`

## Result

**8/8 checks PASS**

- exactly eight MCH FY2017 metric rows;
- expected metric order and company/ticker/year grain;
- official Masan Consumer URL on every row;
- PDF page anchors present;
- all values are positive numeric VND bn values;
- `INDEXED_ONLY` / `MEDIUM` boundary is retained on every row.

## Limitation

This QA validates the extracted evidence layer, not a retained PDF archive. FY2017 remains retrieval-gated for standalone source promotion until the official PDF bytes, hash and page-review record are archived in Drive.


