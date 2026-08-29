# VNM Public Guidance Proxy QA

Audit date: 2026-08-30

- Dataset: [vnm_public_guidance_proxy_2018_2025.csv](../data/vnm_public_guidance_proxy_2018_2025.csv)
- Validator: [validate_public_guidance_proxy.mjs](../scripts/validate_public_guidance_proxy.mjs)
- Drive dataset: https://drive.google.com/file/d/1BW6zGnxS-m67lLPLKfZuJn-5M-d4elw-/view

## Results

**Overall status: PASS (10/10 checks)**

| Check | Result |
|---|---|
| 16-row count | PASS |
| FY2018–FY2025 coverage | PASS |
| Revenue/PBT pair per year | PASS |
| Error arithmetic | PASS |
| Absolute error arithmetic | PASS |
| Attainment recomputation | PASS |
| PUBLIC_GUIDANCE_PROXY classification | PASS |
| OBSERVED evidence class | PASS |
| Gate A exclusion | PASS |
| Aggregate Bias/WAPE | PASS |

Aggregate Bias = -2.634%; aggregate WAPE = 3.139%.

This is public AGM/IR guidance, not an internal forecast snapshot. It cannot close Gate A.
