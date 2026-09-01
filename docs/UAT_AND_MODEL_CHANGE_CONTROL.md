# UAT & Model Change Control (Non-BI)

## Release principle

Every change must be reproducible, reviewable and reversible. The release candidate is the combination of source files, build scripts, validators, generated outputs, assumptions and a signed change record.

## UAT cases

| ID | Scenario | Expected result |
|---|---|---|
| UAT-01 | Replace one month of sales input | P&L, cash flow and balance sheet change only in affected month and downstream roll-forward |
| UAT-02 | Increase commercial fee by 10% | Contribution profit falls; bridge identifies channel-fee driver |
| UAT-03 | Increase inventory days | CFO falls by the incremental working-capital investment |
| UAT-04 | Add CAPEX project | PP&E and cash decrease; depreciation starts at in-service period |
| UAT-05 | Increase debt repayment | Closing debt and cash both fall; debt roll-forward remains balanced |
| UAT-06 | Post-date macro observation | Macro cutoff validator fails the snapshot |
| UAT-07 | Break one journal line | Trial-balance validator fails the release |

## Required change record

Each release records change ID, author, date, affected files, business reason, expected metric impact, reviewer, test commands, result, rollback reference and evidence class. No “PASS” may be manually edited into a generated report.

## Approval path

1. Analyst updates source or script and writes the expected impact.
2. Analyst runs targeted validators and full non-BI QA.
3. Reviewer inspects statement bridge, variance bridge, assumptions and evidence labels.
4. Release owner approves the generated gate report.
5. Only then are website/CV claims refreshed.

## Current release commands

```text
node scripts/build_three_statement_model.mjs
node scripts/validate_three_statement_model.mjs
node scripts/build_fmcg_cost_variance.mjs
node scripts/validate_fmcg_cost_variance.mjs
node scripts/validate_macro_cutoff.mjs
python scripts/run_non_powerbi_release_gate.py
```
