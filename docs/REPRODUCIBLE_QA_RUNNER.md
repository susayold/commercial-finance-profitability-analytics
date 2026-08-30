# Reproducible finance QA runner

## Purpose

`node scripts/run_finance_qa.mjs` is a cross-platform smoke/regression runner for the repository's deterministic finance validators. It is designed for a reviewer to run after cloning the GitHub repository, without Excel, Google Drive or Power BI Desktop.

The runner executes the evidence matrix, role-alignment matrix, promotion ROI, fixed-budget reallocation, pricing, forecast-submission contract, Power BI evidence-log contract, PBIP manifest, M&A, D2C, public-guidance, VNM long-run, peer-evidence, MCH OCR workbench, customer profitability schedule and summary, and QNS/KDC adjustment-feasibility validators, then checks the Power BI contract shape. It also validates the approved normalized peer panel and the blocked MCH normalized intake template. It prints one JSON summary with 43 total checks (42 validator invocations across 40 unique repository-local validator files, plus the Power BI contract-shape check) and exits non-zero on any failure. The forecast-submission check is fixture mode only; it proves mechanics without claiming live company performance.

## Usage

```bash
git clone https://github.com/susayold/commercial-finance-profitability-analytics.git
cd commercial-finance-profitability-analytics
node scripts/run_finance_qa.mjs
```

PowerShell:

```powershell
node scripts/run_finance_qa.mjs | Tee-Object qa-run.json
```

The runner includes the MCH FY2017 indexed-evidence boundary, CAPEX/OPEX planning, forecast-capture and Gate A contract controls, MCH/peer evidence, monthly business review, Monte Carlo, operational driver tree, liquidity-stress, inventory-quality, customer-profitability and customer-profitability-analysis validators and writes VNM and peer markdown reports to an operating-system temp directory and removes that directory in a `finally` block. Generated reports are not left in the repository.

## Interpretation

- `PASS` means repository-local deterministic controls passed.
- It does not mean the project contains genuine internal company data.
- It does not close Gate A (real pre-close forecast snapshots and observed Bias/WAPE).
- It does not close Gate B (native `.pbix` and Power BI Desktop QA-01–QA-18).
- Synthetic, public-guidance and statement-verified public-peer evidence retain their labels and comparability caveats.

## Expected current result

The current remote main branch should report PASS for all runner checks. If the result changes, inspect the named validator directly; do not suppress the failure or replace missing values with zeros.

