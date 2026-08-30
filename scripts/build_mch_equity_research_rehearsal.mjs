#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'data', 'mch_finance_analyst_trend_2016_2025.csv');
const valuationPath = path.join(root, 'data', 'mch_valuation_rehearsal_summary.json');
const scorecardPath = path.join(root, 'data', 'mch_equity_research_scorecard.csv');
const summaryPath = path.join(root, 'data', 'mch_equity_research_summary.json');
const reportPath = path.join(root, 'reports', 'MCH_EQUITY_RESEARCH_REHEARSAL.md');

const parseCsv = (text) => {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
};

const csvEscape = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const writeCsv = (file, headers, rows) => {
  const body = rows.map((row) => headers.map((header) => csvEscape(row[header])).join(','));
  fs.writeFileSync(file, `${headers.join(',')}\n${body.join('\n')}\n`);
};

const n = (value) => Number(value);
const round = (value, digits = 4) => Number(Number(value).toFixed(digits));
const pct = (value, digits = 2) => `${Number(value).toFixed(digits)}%`;
const bn = (raw) => n(raw) / 1e9;
const cagr = (first, last, periods) => ((last / first) ** (1 / periods) - 1) * 100;
const historical = parseCsv(fs.readFileSync(sourcePath, 'utf8'));
const valuation = JSON.parse(fs.readFileSync(valuationPath, 'utf8'));
if (historical.length !== 10) throw new Error(`Expected ten historical rows, found ${historical.length}`);
const first = historical[0];
const previous = historical.at(-2);
const latest = historical.at(-1);
const latestYear = n(latest.fiscal_year);
const latestRevenue = bn(latest.net_revenue_vnd_bn);
const firstRevenue = bn(first.net_revenue_vnd_bn);
const latestPat = bn(latest.profit_after_tax_vnd_bn);
const firstPat = bn(first.profit_after_tax_vnd_bn);
const latestOperatingProfit = bn(latest.operating_profit_vnd_bn);
const firstOperatingProfit = bn(first.operating_profit_vnd_bn);
const peakMargin = historical.reduce((best, row) => n(row.operating_margin_pct) > n(best.operating_margin_pct) ? row : best, historical[0]);
const weakCash = historical.reduce((worst, row) => n(row.cfo_to_pat_pct) < n(worst.cfo_to_pat_pct) ? row : worst, historical[0]);

const metrics = {
  revenue_cagr_pct: round(cagr(firstRevenue, latestRevenue, 9), 2),
  pat_cagr_pct: round(cagr(firstPat, latestPat, 9), 2),
  operating_profit_cagr_pct: round(cagr(firstOperatingProfit, latestOperatingProfit, 9), 2),
  fy2025_revenue_yoy_pct: round(n(latest.revenue_yoy_pct), 2),
  fy2025_operating_profit_yoy_pct: round((latestOperatingProfit / bn(previous.operating_profit_vnd_bn) - 1) * 100, 2),
  fy2025_pat_yoy_pct: round(n(latest.pat_yoy_pct), 2),
  fy2025_operating_margin_pct: round(n(latest.operating_margin_pct), 2),
  fy2024_operating_margin_pct: round(n(previous.operating_margin_pct), 2),
  fy2025_pat_margin_pct: round(n(latest.pat_margin_pct), 2),
  fy2024_pat_margin_pct: round(n(previous.pat_margin_pct), 2),
  fy2025_cfo_to_pat_pct: round(n(latest.cfo_to_pat_pct), 2),
  fy2024_cfo_to_pat_pct: round(n(previous.cfo_to_pat_pct), 2),
  fy2025_equity_ratio_pct: round(n(latest.equity_ratio_pct), 2),
  fy2025_roa_proxy_pct: round(n(latest.roa_proxy_pct), 2),
  peak_operating_margin_fy: n(peakMargin.fiscal_year),
  peak_operating_margin_pct: round(n(peakMargin.operating_margin_pct), 2),
  weakest_cfo_conversion_fy: n(weakCash.fiscal_year),
  weakest_cfo_to_pat_pct: round(n(weakCash.cfo_to_pat_pct), 2),
};

const scorecard = [
  {
    dimension: 'Earnings durability', score_1_to_5: 4, stance: 'Positive long-run compounding',
    evidence: 'Revenue CAGR 9.24%; PAT CAGR 10.34%; ten years remain profitable.',
    monitor_or_change: 'Re-rate lower if revenue contraction persists or PAT CAGR breaks below revenue growth.',
    evidence_class: 'CALCULATED_PUBLIC_REHEARSAL',
  },
  {
    dimension: 'Margin quality', score_1_to_5: 3, stance: 'Positive but normalising',
    evidence: 'Operating margin peaked at 29.17% in FY2024 and fell to 25.41% in FY2025.',
    monitor_or_change: 'Upgrade if margin stabilises above 25%; downgrade if the FY2025 reset continues.',
    evidence_class: 'CALCULATED_PUBLIC_REHEARSAL',
  },
  {
    dimension: 'Cash conversion', score_1_to_5: 2, stance: 'Primary watch item',
    evidence: 'CFO/PAT fell from 116.50% to 31.52% year on year; cause is not isolated in this layer.',
    monitor_or_change: 'Upgrade only after AR, inventory, AP, tax and one-off cash bridge reconciles.',
    evidence_class: 'CALCULATED_PUBLIC_REHEARSAL',
  },
  {
    dimension: 'Capital resilience', score_1_to_5: 4, stance: 'Balance-sheet buffer, incomplete debt view',
    evidence: 'FY2025 equity ratio is 54.94%; gross debt, maturities and interest coverage are not sourced.',
    monitor_or_change: 'Re-score after debt schedule, cash balance and covenant headroom are verified.',
    evidence_class: 'CALCULATED_PUBLIC_REHEARSAL',
  },
  {
    dimension: 'Valuation support', score_1_to_5: 3, stance: 'Wide EV range / diligence required',
    evidence: 'DCF rehearsal spans VND 40,673.8bn–101,614.9bn; base terminal value is 67.15% of EV.',
    monitor_or_change: 'Narrow range after approved forecast, capex/WC history, net debt and shares are available.',
    evidence_class: 'ANALYST_ASSUMPTION_REHEARSAL',
  },
];
writeCsv(scorecardPath, ['dimension', 'score_1_to_5', 'stance', 'evidence', 'monitor_or_change', 'evidence_class'], scorecard);

const trendTable = historical.map((row) => `| FY${row.fiscal_year} | ${bn(row.net_revenue_vnd_bn).toFixed(1)} | ${row.revenue_yoy_pct ? pct(n(row.revenue_yoy_pct)) : '—'} | ${n(row.operating_margin_pct).toFixed(2)}% | ${n(row.pat_margin_pct).toFixed(2)}% | ${n(row.cfo_to_pat_pct).toFixed(2)}% | ${n(row.equity_ratio_pct).toFixed(2)}% | ${n(row.roa_proxy_pct).toFixed(2)}% |`).join('\n');
const scenarioTable = valuation.scenarios.map((row) => `| ${row.scenario} | ${pct(row.revenue_cagr * 100)} | ${pct(row.ebit_margin * 100)} | ${pct(row.wacc * 100)} | ${pct(row.terminal_growth * 100)} | ${Number(row.enterprise_value_vnd_bn).toFixed(1)} |`).join('\n');
const scorecardTable = scorecard.map((row) => `| ${row.dimension} | ${row.score_1_to_5}/5 | ${row.stance} | ${row.evidence} |`).join('\n');

const report = `# MCH Equity Research Rehearsal — Fundamental View

**As-of:** 2026-08-30  
**Issuer:** Masan Consumer Corporation (MCH)  
**Coverage type:** public-filing equity-research rehearsal; not a live broker report, target price or investment recommendation.  
**Evidence classes:** historical rows are calculated from page-reviewed public statements; forward valuation is \`ANALYST_ASSUMPTION_REHEARSAL\`.

## Executive Summary

**Fundamental stance: WATCH / CONDITIONAL UPSIDE.** MCH shows a durable long-run earnings franchise: revenue compounded at ${pct(metrics.revenue_cagr_pct)} and PAT at ${pct(metrics.pat_cagr_pct)} from FY2016 to FY2025. The near-term setup is less clean: FY2025 revenue declined ${pct(Math.abs(metrics.fy2025_revenue_yoy_pct))}, operating profit declined ${pct(Math.abs(metrics.fy2025_operating_profit_yoy_pct))}, operating margin reset to ${pct(metrics.fy2025_operating_margin_pct)} from ${pct(metrics.fy2024_operating_margin_pct)}, and CFO/PAT collapsed to ${pct(metrics.fy2025_cfo_to_pat_pct)} from ${pct(metrics.fy2024_cfo_to_pat_pct)}.

The research conclusion is therefore **quality franchise, execution and cash-conversion watch**. I would not publish a price target from this evidence set. The DCF rehearsal is useful for framing the assumptions that matter, but the correct next action is to reconcile the cash bridge and obtain the missing equity-value inputs.

### Investment thesis in one sentence

MCH can compound value if it stabilises its post-FY2024 margin regime and restores cash conversion; until that is evidenced, the earnings franchise deserves attention but not an unconditional re-rating.

## 1. Historical financial profile

| Fiscal year | Revenue, VND bn | Revenue YoY | Operating margin | PAT margin | CFO / PAT | Equity ratio | ROA proxy |
|---|---:|---:|---:|---:|---:|---:|---:|
${trendTable}

### What the ten-year series says

1. **Long-run growth is real but not linear.** Revenue CAGR is ${pct(metrics.revenue_cagr_pct)} and PAT CAGR is ${pct(metrics.pat_cagr_pct)}; FY2017 is a comparative/corresponding-column year and remains a medium-confidence boundary.
2. **Profitability expanded, then normalised.** Operating margin reached a series high of ${pct(metrics.peak_operating_margin_pct)} in FY${metrics.peak_operating_margin_fy} before falling to ${pct(metrics.fy2025_operating_margin_pct)} in FY2025. This is a regime change to investigate, not proof of permanent deterioration.
3. **Cash conversion is the most decision-relevant signal.** CFO/PAT was ${pct(metrics.fy2024_cfo_to_pat_pct)} in FY2024 and ${pct(metrics.fy2025_cfo_to_pat_pct)} in FY2025. The ratio is a screening metric, not a debt-service coverage ratio.
4. **Capital looks buffered but the debt picture is incomplete.** The FY2025 equity ratio is ${pct(metrics.fy2025_equity_ratio_pct)} and ROA proxy is ${pct(metrics.fy2025_roa_proxy_pct)}. Without gross debt, cash and maturities, balance-sheet comfort cannot become a full solvency conclusion.

## 2. Earnings-quality bridge

| Driver | FY2025 readout | Analyst interpretation | Evidence required next |
|---|---|---|---|
| Revenue | ${pct(metrics.fy2025_revenue_yoy_pct)} YoY | Mature-scale demand or mix pressure needs decomposition | volume / price / mix by category and channel |
| Operating profit | ${pct(metrics.fy2025_operating_profit_yoy_pct)} YoY | Profit fell faster than revenue; operating leverage or gross-to-net pressure is plausible | gross margin, trade spend, SG&A and channel bridge |
| PAT | ${pct(metrics.fy2025_pat_yoy_pct)} YoY | Earnings reset is material | tax, finance income/expense and below-EBIT items |
| Cash conversion | CFO/PAT ${pct(metrics.fy2025_cfo_to_pat_pct)} | Highest-priority quality question | AR ageing, inventory, AP, tax payments and one-offs |
| Equity base | ${pct(metrics.fy2025_equity_ratio_pct)} equity ratio | Structural buffer, but not a liquidity conclusion | cash, gross debt, covenants and maturity profile |

## 3. Research scorecard

Scores are structured analyst judgement on a 1–5 scale, not a market-consensus rating.

| Dimension | Score | Current view | Public evidence |
|---|---:|---|---|
${scorecardTable}

**Composite screen:** 16/25, with the cash-conversion score intentionally pulling the view down. The score is a communication device; it must not be mistaken for a quantitative fair-value output.

## 4. Catalysts and risks

### Catalysts to monitor

- **Cash bridge closes:** CFO/PAT recovers above a defined internal threshold after AR, inventory, AP and one-off movements are reconciled.
- **Margin stabilisation:** operating margin holds at or above the FY2025 ${pct(metrics.fy2025_operating_margin_pct)} base while revenue returns to positive growth.
- **Mix / trade-spend proof:** management disclosures show whether the FY2025 profit reset was mix, pricing, input cost or channel investment rather than a structural impairment.
- **Better forward evidence:** approved forecast, capex plan and working-capital history narrow the valuation range.

### Risks that could invalidate the thesis

- **Persistent cash leakage:** CFO/PAT remains below 60% for multiple periods without an explainable working-capital bridge.
- **Margin erosion:** price competition, input costs or trade spend keep operating margin below the FY2025 base.
- **Concentration / mix opacity:** public statements do not provide enough channel/category detail to validate the earnings drivers.
- **Valuation sensitivity:** terminal value is a large share of DCF EV, so WACC, terminal growth and reinvestment assumptions dominate the output.
- **Data boundary risk:** FY2017 comparability and missing debt/equity inputs can create false precision if ignored.

## 5. Valuation frame — EV only

The companion FCFF/DCF rehearsal uses the FY2025 public anchor and projects FY2026–FY2030. It is a scenario frame, not a price target.

| Scenario | Revenue CAGR | EBIT margin | WACC | Terminal growth | Enterprise value, VND bn |
|---|---:|---:|---:|---:|---:|
${scenarioTable}

- Base EV: **VND ${Number(valuation.scenarios.find((row) => row.scenario === 'Base').enterprise_value_vnd_bn).toFixed(1)}bn**.
- Sensitivity range across the 5×5 base grid: **VND ${Number(valuation.base_sensitivity.min_enterprise_value_vnd_bn).toFixed(1)}bn–${Number(valuation.base_sensitivity.max_enterprise_value_vnd_bn).toFixed(1)}bn**.
- Base terminal value share: **67.15% of EV**.
- **No equity value or price target:** net debt/net cash, diluted shares, current market price, approved forecast and capex/working-capital history are missing.

## 6. Decision and next diligence

**Current action:** keep the name on a watch list / conditional-upside screen; do not convert the DCF range into a buy recommendation. The highest-value work is not another decimal of valuation precision — it is closing the cash-conversion and equity-bridge evidence gaps.

| Priority | Question | Required evidence | Decision if confirmed |
|---:|---|---|---|
| 1 | What caused FY2025 CFO/PAT to fall to ${pct(metrics.fy2025_cfo_to_pat_pct)}? | Full CFO bridge, AR/inventory/AP ageing, tax and one-off notes | restore / revise cash-conversion thesis |
| 2 | Why did operating margin fall ${(metrics.fy2024_operating_margin_pct - metrics.fy2025_operating_margin_pct).toFixed(2)}pp? | gross-to-net, price-volume-mix and cost bridge | reset forward margin assumptions |
| 3 | Is capital genuinely resilient? | cash, debt, interest, maturity and covenant schedules | complete leverage / liquidity screen |
| 4 | Does EV translate to equity value? | net debt/net cash and diluted shares | calculate per-share value only then |
| 5 | Which assumptions are approved? | management plan, capex and working-capital history | replace rehearsal cases with evidence |

## 7. Interview-ready answer

> “My view is watch / conditional upside. MCH has a ten-year profitable record with roughly ${pct(metrics.revenue_cagr_pct)} revenue CAGR and ${pct(metrics.pat_cagr_pct)} PAT CAGR, but FY2025 exposed two questions: operating margin fell to ${pct(metrics.fy2025_operating_margin_pct)} and CFO/PAT fell to ${pct(metrics.fy2025_cfo_to_pat_pct)}. I would not call that a solvency event or publish a price target without the debt schedule, cash bridge, approved forecast and diluted shares. My next step is to reconcile working capital, test the margin bridge and only then narrow the EV range.”

## Limitations and evidence boundary

- Historical data is calculated from the approved MCH statement/trend layer; FY2017 uses FY2018 comparative/corresponding columns.
- Forward estimates and DCF outputs are \`ANALYST_ASSUMPTION_REHEARSAL\`, not company guidance.
- The scorecard is an analyst communication framework, not an external rating.
- No current market price, net debt/net cash, diluted shares, approved forecast, capex history or working-capital history is in the approved layer.
- This report is a portfolio training artifact, not investment advice.

## Reproducibility links

- [Historical trend CSV](../data/mch_finance_analyst_trend_2016_2025.csv)
- [DCF summary JSON](../data/mch_valuation_rehearsal_summary.json)
- [Equity-research scorecard CSV](../data/mch_equity_research_scorecard.csv)
- [Builder](../scripts/build_mch_equity_research_rehearsal.mjs)
- [Validator](../scripts/validate_mch_equity_research_rehearsal.mjs)
`;
fs.writeFileSync(reportPath, report);

const summary = {
  status: 'PASS',
  evidence_class: 'CALCULATED_PUBLIC_REHEARSAL',
  issuer: 'MCH',
  as_of_fiscal_year: latestYear,
  historical_period: 'FY2016-FY2025',
  stance: 'WATCH_CONDITIONAL_UPSIDE',
  confidence: 'MEDIUM',
  thesis: 'Durable long-run earnings franchise, but FY2025 margin normalisation and cash-conversion weakness require evidence before re-rating.',
  metrics,
  scorecard: { total_score: scorecard.reduce((sum, row) => sum + n(row.score_1_to_5), 0), max_score: scorecard.length * 5, rows: scorecard.length },
  valuation_frame: {
    base_ev_vnd_bn: valuation.scenarios.find((row) => row.scenario === 'Base').enterprise_value_vnd_bn,
    scenario_min_ev_vnd_bn: Math.min(...valuation.scenarios.map((row) => row.enterprise_value_vnd_bn)),
    scenario_max_ev_vnd_bn: Math.max(...valuation.scenarios.map((row) => row.enterprise_value_vnd_bn)),
    sensitivity_min_ev_vnd_bn: valuation.base_sensitivity.min_enterprise_value_vnd_bn,
    sensitivity_max_ev_vnd_bn: valuation.base_sensitivity.max_enterprise_value_vnd_bn,
    output_boundary: valuation.output_boundary,
  },
  catalysts: ['cash bridge closes', 'operating margin stabilises', 'mix/trade-spend bridge disclosed', 'approved forecast narrows DCF range'],
  risks: ['persistent cash leakage', 'margin erosion', 'mix opacity', 'DCF terminal-value sensitivity', 'FY2017 and missing debt/equity evidence boundaries'],
  missing_inputs: valuation.missing_inputs,
};
fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', report: path.relative(root, reportPath), scorecard_rows: scorecard.length, historical_rows: historical.length, stance: summary.stance, base_ev_vnd_bn: summary.valuation_frame.base_ev_vnd_bn }, null, 2));
