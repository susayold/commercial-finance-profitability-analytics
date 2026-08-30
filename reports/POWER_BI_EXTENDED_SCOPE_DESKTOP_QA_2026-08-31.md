# Power BI extended-scope Desktop QA — 2026-08-31

## Purpose

This evidence record proves that the extended finance-analyst model (planning,
scenario and peer-evidence layers) is a real editable PBIP/PBIT package that
Power BI Desktop can open and hydrate from a replacement `DataRoot`. It is
separate from the already observed compact native PBIX so the evidence boundary
does not silently promote a different binary.

## Artifact and host

| Item | Evidence |
|---|---|
| PBIP source | `powerbi/native/VNFinance_PBIP_Extended/VNFinance_Commercial_Finance.pbip` |
| Extended PBIT | `powerbi/releases/Commercial_Finance_Profitability_Analytics_extended.pbit` |
| Desktop executable | `D:\Po BI\bin\PBIDesktop.exe` |
| Desktop version | `2.157.879.0 (26.08)` |
| DataRoot used for rehearsal | `C:\VNFinancePowerBI\data\current` (disposable local copy of the committed fixture) |
| Data classification | Operating/planning rows `SIMULATED`; peer benchmark `PUBLIC_REPORTED_APPROVED`; review queue visibly gated |

## Observed checks

| Check | Result | Observation |
|---|---|---|
| PBIT opens | PASS | Desktop displayed the `DataRoot` parameter dialog; no encrypted/corrupt-template error after UTF-16LE container preservation. |
| Parameter binding | PASS | `DataRoot` was set to the rehearsal folder and **Load** completed. |
| Extended model hydration | PASS | Data pane exposed `Scenario Selector`, `Peer_Benchmark`, `Peer_Review_Queue`, `OPEX_Headcount` and `CAPEX_Projects` alongside the 15 baseline tables. |
| Scenario interaction surface | PASS | Executive Output includes the five scenario rows (`Actual`, `Budget`, `Downside`, `Forecast`, `Upside`) and `Scenario Revenue` measure. The selected row now carries a base case plus editable revenue/COGS/OPEX multipliers. |
| Planning calculations | PASS | Executive customer table showed `Scenario Revenue` and `EBITDA Proxy`; OPEX/CAPEX measures are present in the extended model. |
| Baseline visual regression | PASS | Existing customer table continued to render values such as `CUST001` Net Revenue `1,913.9 M` and Contribution Margin `872.6 M`. |
| Key integrity | PASS | Peer and CAPEX month-grain tables intentionally do not declare repeating ticker/project IDs as single-column primary keys. |
| Realtime claim | PENDING | This remains an Import-refresh rehearsal. DirectQuery/APR still requires a provisioned production database, gateway/capacity and latency/freshness evidence. |

## Extended topology

The generated package contains **20 tables, 60 measures, 25 relationships,
6 pages and 42 visuals**. The 19-file `DataRoot` contract adds:

- `scenario_selector.csv` (disconnected selector with base-case and editable driver multipliers);
- `opex_headcount_planning_synthetic.csv` (cost-centre/headcount bridge);
- `capex_fixed_asset_planning_synthetic.csv` (approval, commitment, cash,
  depreciation, benefit and payback bridge);
- `peer_benchmark_approved_2016_2025.csv` (approved reported panel); and
- `peer_extraction_queue.csv` (candidate rows that remain review-gated).

## Claim boundary

This record does **not** claim that the extended PBIT is a native PBIX binary.
The observed native PBIX remains the compact baseline artifact documented in
`reports/POWER_BI_NATIVE_PBIX_DESKTOP_QA_2026-08-31.md`. To create an extended
native PBIX, open the extended PBIT on the review workstation, bind the intended
DataRoot, execute the full QA-01–QA-18 matrix, then use Desktop **Save** to
create a dated `.pbix` and re-open that exact file before publishing its hash.
