# VNM Public Guidance Analysis QA

Audit date: 2026-08-30

- Analysis JSON: [vnm_public_guidance_proxy_analysis.json](../data/vnm_public_guidance_proxy_analysis.json)
- Generator: [analyze_public_guidance_proxy.mjs](../scripts/analyze_public_guidance_proxy.mjs)
- Validator: [validate_public_guidance_proxy_analysis.mjs](../scripts/validate_public_guidance_proxy_analysis.mjs)

## Results

**Overall status: PASS (10/10 checks)**

- 16 overall observations; 8 revenue observations; 8 PBT observations.
- Overall Bias = -2.634%; WAPE = 3.139%.
- Revenue WAPE = 2.786%; PBT WAPE = 4.888%.
- Gate A eligibility remains false.
- Worst ranked miss is FY2022 PBT at -12.533% of guidance.

The analysis is descriptive public-guidance evidence and does not close the internal forecast snapshot gate.
