# Power BI final_v1 Data QA

**Status:** `PASS`
**Dataset:** `final_v1.0.0`

| ID | Check | Result | Evidence |
|---|---|---|---|
| QA-D04 | Gross sales = corrected units × unit price | **PASS** | bad_rows=0 |
| QA-D06 | Gross-to-net identity | **PASS** | bad_rows=0 |
| QA-D05 | No negative operating economics | **PASS** | all checked |
| QA-D02 | Budget fact populated and positive | **PASS** | rows=2160 |
| QA-D03 | Actual vs budget comparable at common grain | **PASS** | month × SKU × channel |
| QA-D12 | No orphan ProductKey | **PASS** | sales→dim_product |
| QA-D12b | No orphan CustomerKey | **PASS** | sales→dim_customer |
| QA-D12c | No orphan ChannelKey | **PASS** | sales→dim_channel |
| QA-D07 | Channel-month corrected COGS ties to authority | **PASS** | max_delta_vnd=0.00 |
| QA-D01 | FY2025 calendar revenue anchor populated | **PASS** | fy2025_calendar_vnd=80110481000.00; all_period_vnd=212542361000.00 |
| QA-D08 | Product revenue partition ties to total | **PASS** | delta_vnd=0.00 |
| QA-D09 | Customer revenue partition ties to total | **PASS** | delta_vnd=0.00 |
| QA-D10 | Channel revenue partition ties to total | **PASS** | delta_vnd=0.00 |
| QA-D11 | Contribution profit identity | **PASS** | bad_rows=0 |
| QA-D13 | Source sales LineID unique | **PASS** | rows=2160 |
| QA-D13b | Dimension keys unique | **PASS** | product/customer/channel |
| QA-X03 | WC source grain is portfolio balance | **PASS** | monthly AR/Inventory/AP snapshots; no average entity balance |
| QA-X04 | Multi-period WC convention documented | **PASS** | monthly balance rows available for monthly/LTM averaging |
| QA-X05 | PVM residual contract | **PASS** | fact_pvm_bridge includes explicit MIX_RESIDUAL; see PVM QA |
| QA-X06 | Scenario isolation | **PASS** | scenario facts are disconnected from historical Actual by contract |
| QA-X07 | Public-company separation | **PASS** | public facts have separate CompanyKey/evidence class |
| QA-X08 | Strategic separation | **PASS** | valuation/M&A facts are separate subject areas |
| QA-D14 | Evidence class coverage | **PASS** | facts_checked=14 |

## Boundary

Operating facts are synthetic and rebuilt from the deterministic v2 formula universe. Public-company facts remain separate observed evidence. Native Power BI Desktop rendering/QA and Gate A genuine internal forecast evidence are external release gates.
