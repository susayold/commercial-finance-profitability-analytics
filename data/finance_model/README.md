# Non-Power-BI finance model contract

This folder is the active FP&A model-input contract for the recruiter release.
It contains the deterministic, checked-in finance schedules used by the
integrated statements, scenarios, management pack, case-summary PDF and
website. The contract is intentionally independent of the archived Power BI
directory.

## Evidence boundary

- Operating schedules are `SIMULATED` or `DERIVED` and are not statutory
  accounts or employer-impact evidence.
- Public-company schedules remain a separate observed subject area.
- Forecast accuracy remains external-gate evidence and is not inferred from
  this contract.

## Refresh rule

Re-run the checked-in builders, then run `node scripts/run_finance_qa.mjs
--nonbi` and `python scripts/run_non_powerbi_release_gate.py`. Any source or
schema change must update the release manifest and the QA reports.

## Contents

`final_v1/` is the reconciled monthly finance schedule contract: sales,
commercial costs, forecast versions, working capital, OPEX/headcount, CAPEX,
public metrics, valuation and M&A rehearsal tables. Its `source_manifest.csv`
records row counts and hashes for reproducibility.
