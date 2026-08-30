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
const n = (value) => Number(value);
const bn = (raw) => n(raw) / 1e9;
const cagr = (first, last, periods) => ((last / first) ** (1 / periods) - 1) * 100;
const source = readCsv(path.join(root, 'data', 'mch_finance_analyst_trend_2016_2025.csv'));
const scorecard = readCsv(path.join(root, 'data', 'mch_equity_research_scorecard.csv'));
const summary = JSON.parse(fs.readFileSync(path.join(root, 'data', 'mch_equity_research_summary.json'), 'utf8'));
const valuation = JSON.parse(fs.readFileSync(path.join(root, 'data', 'mch_valuation_rehearsal_summary.json'), 'utf8'));
const reportPath = path.join(root, 'reports', 'MCH_EQUITY_RESEARCH_REHEARSAL.md');
const report = fs.readFileSync(reportPath, 'utf8');
const methodology = fs.readFileSync(path.join(root, 'docs', 'MCH_EQUITY_RESEARCH_METHODOLOGY.md'), 'utf8');
const checks = [];
const check = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });
const latest = source.at(-1);
const previous = source.at(-2);
const peak = source.reduce((best, row) => n(row.operating_margin_pct) > n(best.operating_margin_pct) ? row : best, source[0]);
const weakCash = source.reduce((worst, row) => n(row.cfo_to_pat_pct) < n(worst.cfo_to_pat_pct) ? row : worst, source[0]);

check('historical_row_count', source.length === 10, `rows=${source.length}`);
check('historical_year_coverage', source.map((row) => row.fiscal_year).join(',') === '2016,2017,2018,2019,2020,2021,2022,2023,2024,2025', source.map((row) => row.fiscal_year).join(','));
check('latest_anchor', latest.fiscal_year === '2025' && bn(latest.net_revenue_vnd_bn) > 0, `FY${latest.fiscal_year} revenue=${bn(latest.net_revenue_vnd_bn).toFixed(1)}bn`);
check('revenue_cagr_tie_out', close(summary.metrics.revenue_cagr_pct, cagr(bn(source[0].net_revenue_vnd_bn), bn(latest.net_revenue_vnd_bn), 9), 0.01), `summary=${summary.metrics.revenue_cagr_pct}`);
check('pat_cagr_tie_out', close(summary.metrics.pat_cagr_pct, cagr(bn(source[0].profit_after_tax_vnd_bn), bn(latest.profit_after_tax_vnd_bn), 9), 0.01), `summary=${summary.metrics.pat_cagr_pct}`);
check('latest_yoy_tie_out', close(summary.metrics.fy2025_revenue_yoy_pct, n(latest.revenue_yoy_pct)) && close(summary.metrics.fy2025_pat_yoy_pct, n(latest.pat_yoy_pct)), `revenue=${latest.revenue_yoy_pct}; PAT=${latest.pat_yoy_pct}`);
check('margin_tie_out', close(summary.metrics.fy2025_operating_margin_pct, n(latest.operating_margin_pct)) && close(summary.metrics.fy2024_operating_margin_pct, n(previous.operating_margin_pct)), `FY2024=${previous.operating_margin_pct}; FY2025=${latest.operating_margin_pct}`);
check('cash_conversion_tie_out', close(summary.metrics.fy2025_cfo_to_pat_pct, n(latest.cfo_to_pat_pct)) && close(summary.metrics.fy2024_cfo_to_pat_pct, n(previous.cfo_to_pat_pct)), `FY2024=${previous.cfo_to_pat_pct}; FY2025=${latest.cfo_to_pat_pct}`);
check('peak_and_weak_cash_tie_out', summary.metrics.peak_operating_margin_fy === n(peak.fiscal_year) && close(summary.metrics.peak_operating_margin_pct, n(peak.operating_margin_pct)) && summary.metrics.weakest_cfo_conversion_fy === n(weakCash.fiscal_year), `peak=FY${peak.fiscal_year}; weak_cash=FY${weakCash.fiscal_year}`);
check('scorecard_row_count', scorecard.length === 5, `rows=${scorecard.length}`);
check('scorecard_unique_dimensions', new Set(scorecard.map((row) => row.dimension)).size === scorecard.length, 'dimension keys unique');
check('scorecard_score_range', scorecard.every((row) => n(row.score_1_to_5) >= 1 && n(row.score_1_to_5) <= 5), 'scores bounded 1–5');
check('scorecard_total_tie_out', summary.scorecard.total_score === scorecard.reduce((sum, row) => sum + n(row.score_1_to_5), 0) && summary.scorecard.max_score === 25, `total=${summary.scorecard.total_score}/25`);
check('valuation_link_tie_out', close(summary.valuation_frame.base_ev_vnd_bn, valuation.scenarios.find((row) => row.scenario === 'Base').enterprise_value_vnd_bn, 0.01) && summary.valuation_frame.output_boundary === valuation.output_boundary, `base EV=${summary.valuation_frame.base_ev_vnd_bn}`);
check('report_historical_table', report.includes('## 1. Historical financial profile') && (report.match(/\| FY20\d\d \|/g) ?? []).length === 10, 'ten fiscal-year rows present');
check('report_thesis_and_stance', report.includes('WATCH / CONDITIONAL UPSIDE') && report.includes('Investment thesis in one sentence'), 'stance and thesis visible');
check('report_scorecard', report.includes('## 3. Research scorecard') && report.includes('Composite screen'), 'scorecard and composite visible');
check('report_catalysts_risks', report.includes('### Catalysts to monitor') && report.includes('### Risks that could invalidate the thesis'), 'catalysts and risks visible');
check('report_ev_boundary', report.includes('## 5. Valuation frame — EV only') && report.includes('No equity value or price target'), 'EV-only output boundary visible');
check('report_diligence_actions', report.includes('## 6. Decision and next diligence') && report.includes('Required evidence'), 'actionable diligence table visible');
check('report_limitations', report.includes('FY2017 uses FY2018 comparative/corresponding columns') && report.includes('not investment advice'), 'limitations and evidence class visible');
check('methodology_reproducibility', methodology.includes('Revenue CAGR') && methodology.includes('Scorecard design') && methodology.includes('EV-only'), 'source lineage, formulas, scorecard and valuation boundary documented');

const passed = checks.filter((item) => item.pass).length;
const status = passed === checks.length ? 'PASS' : 'FAIL';
const qaPath = path.join(root, 'reports', 'MCH_EQUITY_RESEARCH_REHEARSAL_QA.md');
const qa = `# MCH Equity Research Rehearsal QA\n\n**Status:** ${status}  \n**Checks:** ${passed}/${checks.length} passed  \n**Scope:** historical tie-outs, scorecard integrity, valuation linkage, report completeness and claim boundary.\n\n| Check | Status | Detail |\n|---|---|---|\n${checks.map((item) => `| ${item.name} | ${item.pass ? 'PASS' : 'FAIL'} | ${String(item.detail).replaceAll('|', '\\|')} |`).join('\n')}\n\nThe validator treats the report as a portfolio research rehearsal. Historical values are calculated from the approved MCH trend layer; DCF outputs remain analyst assumptions; no price target is published.\n`;
fs.writeFileSync(qaPath, qa);
console.log(JSON.stringify({ status, checks: checks.length, passed, failures: checks.filter((item) => !item.pass), details: checks }, null, 2));
if (status !== 'PASS') process.exit(1);
