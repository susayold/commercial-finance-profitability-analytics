# QA matrix — final_v1 Power BI build

## Data QA (automated)

The generator currently reports **23/23 PASS**. Critical identity failures stop the build.

| Check | What it proves |
|---|---|
| D01 | FY2025 calendar revenue anchor = VND 80,110,481,000; full history is populated |
| D02–D03 | Budget is populated and comparable with Actual at month × SKU × channel |
| D04–D06 | Corrected Units × price, gross-to-net and non-negative operating economics |
| D07 | Allocated Sales COGS ties to authoritative month × channel COGS |
| D08–D10 | Product, customer and channel partitions reconcile to total revenue |
| D11 | Contribution profit identity (Net Revenue − COGS − fees − trade spend − fulfilment) |
| D12 | No orphan product/customer/channel keys |
| D13 | Source Sales LineID and dimension keys are unique |
| D14 | Required operating facts carry an explicit evidence class |

## Extended / governance QA

| Check | Result / boundary |
|---|---|
| X03–X04 | Monthly AR, inventory and AP are balance snapshots; LTM conventions are documented |
| X05 | PVM contains explicit `MIX_RESIDUAL`; residual is visible, not hidden |
| X06 | Scenario facts are isolated from historical Actual by contract |
| X07 | Public-company subject area is separated by CompanyKey/evidence class |
| X08 | Valuation and M&A are separate strategic subject areas |
| Geometry | 1672 × 941 canvas; coordinates exported for all 192 visuals |
| Desktop | Open/refresh/render/interaction QA is an external gate and remains OPEN until run in Power BI Desktop |

## Stop-ship rules

Do not present a release as production-ready if Units/COGS, PVM residual, scenario isolation, public separation, evidence class coverage or Desktop render fails. Do not label synthetic operating data as company actuals.
