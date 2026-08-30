#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readCsv = (file) => {
  const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
};
const close = (a, b, tolerance = 0.02) => Math.abs(Number(a) - Number(b)) <= tolerance;
const forecast = readCsv(path.join(root, 'data', 'mch_valuation_rehearsal_forecast.csv'));
const sensitivity = readCsv(path.join(root, 'data', 'mch_valuation_rehearsal_sensitivity.csv'));
const summary = JSON.parse(fs.readFileSync(path.join(root, 'data', 'mch_valuation_rehearsal_summary.json'), 'utf8'));
const report = fs.readFileSync(path.join(root, 'reports', 'MCH_VALUATION_REHEARSAL.md'), 'utf8');
const methodology = fs.readFileSync(path.join(root, 'docs', 'MCH_VALUATION_REHEARSAL_METHODOLOGY.md'), 'utf8');
const checks = [];
const check = (name, pass, detail) => checks.push({ name, pass, detail });

check('forecast_row_count', forecast.length === 15, `rows=${forecast.length}`);
check('scenario_coverage', new Set(forecast.map((row) => row.scenario)).size === 3, [...new Set(forecast.map((row) => row.scenario))].join(','));
check('year_coverage', new Set(forecast.map((row) => row.fiscal_year)).size === 5, [...new Set(forecast.map((row) => row.fiscal_year))].join(','));
check('unique_keys', new Set(forecast.map((row) => `${row.scenario}|${row.fiscal_year}`)).size === 15, 'scenario × year unique');
check('fcff_formula', forecast.every((row) => close(Number(row.fcff_vnd_bn), Number(row.nopat_vnd_bn) + Number(row.da_vnd_bn) - Number(row.capex_vnd_bn) - Number(row.dnwc_vnd_bn))), 'NOPAT + D&A − capex − ΔNWC');
check('discount_formula', forecast.every((row) => close(Number(row.discount_factor), 1 / ((1 + Number(row.wacc)) ** Number(row.period)), 0.00002)), 'discount factor');
check('terminal_formula', forecast.filter((row) => row.fiscal_year === '2030').every((row) => close(Number(row.terminal_value_vnd_bn), Number(row.fcff_vnd_bn) * (1 + Number(row.terminal_growth)) / (Number(row.wacc) - Number(row.terminal_growth)))), 'Gordon growth terminal value');
check('scenario_summary_tie_out', summary.scenarios.every((item) => {
  const rows = forecast.filter((row) => row.scenario === item.scenario);
  const pvExplicit = rows.reduce((sum, row) => sum + Number(row.pv_fcff_vnd_bn), 0);
  const terminal = Number(rows.find((row) => row.fiscal_year === '2030').pv_terminal_vnd_bn);
  return close(item.pv_explicit_fcff_vnd_bn, pvExplicit) && close(item.pv_terminal_vnd_bn, terminal) && close(item.enterprise_value_vnd_bn, pvExplicit + terminal);
}), 'summary EV ties to forecast rows');
check('sensitivity_row_count', sensitivity.length === 25, `rows=${sensitivity.length}`);
check('sensitivity_grid', new Set(sensitivity.map((row) => row.wacc)).size === 5 && new Set(sensitivity.map((row) => row.terminal_growth)).size === 5, '5 × 5 WACC/g grid');
check('sensitivity_monotonicity', sensitivity.every((row) => Number(row.wacc) > Number(row.terminal_growth)) && Math.min(...sensitivity.map((row) => Number(row.enterprise_value_vnd_bn))) < Math.max(...sensitivity.map((row) => Number(row.enterprise_value_vnd_bn))), 'valid denominator and spread');
check('evidence_boundary', summary.evidence_class === 'ANALYST_ASSUMPTION_REHEARSAL' && summary.output_boundary === 'EV_ONLY_NO_EQUITY_VALUE_OR_PRICE_TARGET', 'no price target claim');
check('missing_inputs_explicit', Array.isArray(summary.missing_inputs) && summary.missing_inputs.length >= 5, `missing=${summary.missing_inputs.length}`);
check('historical_anchor', summary.historical_anchor.fiscal_year === 2025 && summary.historical_anchor.revenue_vnd_bn > 0, 'FY2025 public anchor');
check('report_executive_summary', report.includes('## Executive Summary') && report.includes('## 1. Historical anchor'), 'answer-first report spine');
check('report_sensitivity', report.includes('## 3. Base-case sensitivity') && report.includes('Enterprise value, VND bn'), 'visible sensitivity table');
check('report_next_diligence', report.includes('## 5. Decision and next diligence') && report.includes('do not publish an equity value'), 'decision and follow-up');
check('report_boundaries', report.includes('not a price target') && report.includes('No current market price'), 'claim boundary visible');
check('methodology_equations', methodology.includes('FCFF_t = NOPAT_t + D&A_t − Capex_t − ΔNWC_t') && methodology.includes('Enterprise value'), 'methodology equations');

const passed = checks.filter((item) => item.pass).length;
console.log(JSON.stringify({ status: passed === checks.length ? 'PASS' : 'FAIL', checks: passed, passed, failures: checks.filter((item) => !item.pass), details: checks }, null, 2));
if (passed !== checks.length) process.exit(1);
