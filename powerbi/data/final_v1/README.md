# Power BI `final_v1` data contract

**Dataset version:** `final_v1.0.0`  
**Generated:** `2026-08-31T00:00:00+07:00`  
**Operating source:** remote `VietNova_FPA_Model_v2.xlsx` (Drive) reconstructed deterministically from the workbook's documented formula universe.

## Why this folder exists

The v2 workbook's invoice ledger stores gross revenue and unit price at a scaled invoice level while Units and COGS remain at the pre-scale decimal. For example, `VND 186m / VND 31k = 6,000 units`, not `0.06`. `build_powerbi_final_v1.py` corrects the physical units and allocates preliminary SKU COGS to the authoritative month × channel COGS total before any Power BI visual is built.

## Fact grains

| File | Grain |
|---|---|
| `fact_sales.csv` | invoice line |
| `fact_commercial_cost.csv` | month × channel × cost type |
| `fact_budget.csv` | month × SKU × channel × budget version |
| `fact_forecast.csv` | snapshot × target month × SKU × channel × scenario |
| `fact_pvm_bridge.csv` | month × SKU × channel × bridge component |
| `fact_ar_snapshot.csv` | month × customer |
| `fact_inventory_snapshot.csv` | month × SKU |
| `fact_ap_snapshot.csv` | month × supplier |
| `fact_debt_liquidity.csv` | month × facility |
| `fact_promotion.csv` | promotion event |
| `fact_pricing_case.csv` | pricing case |
| `fact_budget_allocation.csv` | channel |
| `fact_opex_headcount.csv` | month × cost center |
| `fact_capex.csv` | month × project |
| `fact_public_financials.csv` | public company × fiscal year |
| `fact_public_cashflow.csv` | public company × fiscal year |
| `fact_valuation.csv` | company × scenario × sensitivity point |
| `fact_mna.csv` | deal × scenario × year |

## Dimensions

`dim_date`, `dim_product`, `dim_customer`, `dim_channel`, `dim_scenario`, `dim_forecast_version`, `dim_cost_center`, `dim_capex_project`, `dim_company`, and `dim_evidence_class` are the filter dimensions. `dim_commercial_view` is a disconnected field-parameter seed for Channel/Product/Customer/Category switching. Facts do not relate directly to other facts. `dim_company=VN` is the only operating company; public and strategic facts use separate company/evidence classes.

## Refresh contract

The final PBIP uses the `pDataRoot`/`DataRoot` parameter. Replacing files with the same schema and refreshing updates the model. Do not embed a personal Windows path in the released report; local Desktop users should point `pDataRoot` to this folder or a controlled copy.

## Evidence boundary

- VietNova rows: synthetic/derived management case, not statutory accounts.
- Public rows: observed/derived from approved filing evidence and never aggregated with VietNova.
- Valuation: analyst-assumption rehearsal, EV only, not a price target.
- M&A: synthetic strategic rehearsal.
- Gate A (genuine internal forecast evidence), native Desktop QA and production refresh remain explicit release gates.
