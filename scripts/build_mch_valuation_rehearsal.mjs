#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const sourcePath = path.join(root, 'data', 'mch_finance_analyst_trend_2016_2025.csv');
const forecastPath = path.join(root, 'data', 'mch_valuation_rehearsal_forecast.csv');
const sensitivityPath = path.join(root, 'data', 'mch_valuation_rehearsal_sensitivity.csv');
const summaryPath = path.join(root, 'data', 'mch_valuation_rehearsal_summary.json');

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

const round = (value, digits = 6) => Number(value.toFixed(digits));
const historical = parseCsv(fs.readFileSync(sourcePath, 'utf8'));
const latest = historical.find((row) => row.fiscal_year === '2025');
if (!latest) throw new Error('FY2025 MCH anchor not found');

const anchorRevenue = Number(latest.net_revenue_vnd_bn) / 1e9;
const scenarios = [
  { scenario: 'Base', revenue_cagr: 0.06, ebit_margin: 0.25, tax_rate: 0.20, da_pct_revenue: 0.015, capex_pct_revenue: 0.018, dnwc_pct_revenue: 0.005, wacc: 0.12, terminal_growth: 0.03 },
  { scenario: 'Upside', revenue_cagr: 0.08, ebit_margin: 0.27, tax_rate: 0.20, da_pct_revenue: 0.015, capex_pct_revenue: 0.018, dnwc_pct_revenue: 0.003, wacc: 0.11, terminal_growth: 0.03 },
  { scenario: 'Downside', revenue_cagr: 0.02, ebit_margin: 0.22, tax_rate: 0.22, da_pct_revenue: 0.015, capex_pct_revenue: 0.022, dnwc_pct_revenue: 0.008, wacc: 0.14, terminal_growth: 0.02 },
];

const forecastRows = [];
const summaryScenarios = [];
for (const assumptions of scenarios) {
  let pvFcff = 0;
  let terminalValue = 0;
  let pvTerminal = 0;
  for (let year = 2026; year <= 2030; year += 1) {
    const period = year - 2025;
    const revenue = anchorRevenue * ((1 + assumptions.revenue_cagr) ** period);
    const ebit = revenue * assumptions.ebit_margin;
    const nopat = ebit * (1 - assumptions.tax_rate);
    const da = revenue * assumptions.da_pct_revenue;
    const capex = revenue * assumptions.capex_pct_revenue;
    const dnwc = revenue * assumptions.dnwc_pct_revenue;
    const fcff = nopat + da - capex - dnwc;
    const discountFactor = 1 / ((1 + assumptions.wacc) ** period);
    const pvFcffRow = fcff * discountFactor;
    pvFcff += pvFcffRow;
    if (year === 2030) {
      terminalValue = fcff * (1 + assumptions.terminal_growth) / (assumptions.wacc - assumptions.terminal_growth);
      pvTerminal = terminalValue * discountFactor;
    }
    forecastRows.push({
      scenario: assumptions.scenario,
      fiscal_year: year,
      period,
      revenue_vnd_bn: round(revenue),
      ebit_vnd_bn: round(ebit),
      nopat_vnd_bn: round(nopat),
      da_vnd_bn: round(da),
      capex_vnd_bn: round(capex),
      dnwc_vnd_bn: round(dnwc),
      fcff_vnd_bn: round(fcff),
      wacc: assumptions.wacc,
      terminal_growth: assumptions.terminal_growth,
      discount_factor: round(discountFactor),
      pv_fcff_vnd_bn: round(pvFcffRow),
      terminal_value_vnd_bn: year === 2030 ? round(terminalValue) : '',
      pv_terminal_vnd_bn: year === 2030 ? round(pvTerminal) : '',
      evidence_class: 'ANALYST_ASSUMPTION_REHEARSAL',
    });
  }
  summaryScenarios.push({
    scenario: assumptions.scenario,
    revenue_cagr: assumptions.revenue_cagr,
    ebit_margin: assumptions.ebit_margin,
    tax_rate: assumptions.tax_rate,
    da_pct_revenue: assumptions.da_pct_revenue,
    capex_pct_revenue: assumptions.capex_pct_revenue,
    dnwc_pct_revenue: assumptions.dnwc_pct_revenue,
    wacc: assumptions.wacc,
    terminal_growth: assumptions.terminal_growth,
    pv_explicit_fcff_vnd_bn: round(pvFcff),
    pv_terminal_vnd_bn: round(pvTerminal),
    enterprise_value_vnd_bn: round(pvFcff + pvTerminal),
  });
}

const base = scenarios[0];
const base2030 = forecastRows.find((row) => row.scenario === 'Base' && row.fiscal_year === 2030);
const sensitivityRows = [];
for (const wacc of [0.10, 0.11, 0.12, 0.13, 0.14]) {
  for (const terminalGrowth of [0.02, 0.025, 0.03, 0.035, 0.04]) {
    const explicitPv = forecastRows.filter((row) => row.scenario === 'Base').reduce((sum, row) => sum + Number(row.fcff_vnd_bn) / ((1 + wacc) ** Number(row.period)), 0);
    const terminal = Number(base2030.fcff_vnd_bn) * (1 + terminalGrowth) / (wacc - terminalGrowth);
    const pvTerminal = terminal / ((1 + wacc) ** 5);
    sensitivityRows.push({
      scenario: 'Base',
      wacc,
      terminal_growth: terminalGrowth,
      pv_explicit_fcff_vnd_bn: round(explicitPv),
      pv_terminal_vnd_bn: round(pvTerminal),
      enterprise_value_vnd_bn: round(explicitPv + pvTerminal),
      evidence_class: 'ANALYST_ASSUMPTION_REHEARSAL',
    });
  }
}

writeCsv(forecastPath, ['scenario', 'fiscal_year', 'period', 'revenue_vnd_bn', 'ebit_vnd_bn', 'nopat_vnd_bn', 'da_vnd_bn', 'capex_vnd_bn', 'dnwc_vnd_bn', 'fcff_vnd_bn', 'wacc', 'terminal_growth', 'discount_factor', 'pv_fcff_vnd_bn', 'terminal_value_vnd_bn', 'pv_terminal_vnd_bn', 'evidence_class'], forecastRows);
writeCsv(sensitivityPath, ['scenario', 'wacc', 'terminal_growth', 'pv_explicit_fcff_vnd_bn', 'pv_terminal_vnd_bn', 'enterprise_value_vnd_bn', 'evidence_class'], sensitivityRows);

const evValues = summaryScenarios.map((row) => row.enterprise_value_vnd_bn);
const sensitivityValues = sensitivityRows.map((row) => row.enterprise_value_vnd_bn);
const summary = {
  status: 'PASS',
  evidence_class: 'ANALYST_ASSUMPTION_REHEARSAL',
  historical_anchor: {
    fiscal_year: 2025,
    revenue_vnd_bn: round(anchorRevenue),
    operating_margin_pct: Number(latest.operating_margin_pct),
    pat_margin_pct: Number(latest.pat_margin_pct),
    cfo_to_pat_pct: Number(latest.cfo_to_pat_pct),
    source_note: latest.data_quality_note,
  },
  forecast_period: 'FY2026-FY2030',
  scenarios: summaryScenarios,
  base_sensitivity: {
    wacc_range: [0.10, 0.14],
    terminal_growth_range: [0.02, 0.04],
    min_enterprise_value_vnd_bn: Math.min(...sensitivityValues),
    max_enterprise_value_vnd_bn: Math.max(...sensitivityValues),
  },
  output_boundary: 'EV_ONLY_NO_EQUITY_VALUE_OR_PRICE_TARGET',
  missing_inputs: ['net debt or net cash', 'diluted shares outstanding', 'current market price', 'approved management forecast', 'capex and working-capital history'],
};
fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', forecast_rows: forecastRows.length, sensitivity_rows: sensitivityRows.length, scenarios: summaryScenarios.map((row) => ({ scenario: row.scenario, enterprise_value_vnd_bn: row.enterprise_value_vnd_bn })) }, null, 2));

