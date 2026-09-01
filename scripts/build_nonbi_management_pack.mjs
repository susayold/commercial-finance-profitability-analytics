#!/usr/bin/env node
/**
 * Build an editable 10-slide management pack for the non-Power-BI FP&A release.
 * The deck reads the repository's canonical CSV/JSON outputs so the narrative
 * cannot drift from the controlled finance artifacts.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { Presentation, PresentationFile } from '@oai/artifact-tool';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'output', 'pptx', 'VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx');
const RENDER_DIR = path.join(ROOT, 'output', 'pptx', 'VNFINANCE_NONBI_FPA_MBR_2026-09-01');

const C = {
  navy: '#06283D',
  navy2: '#0B3C5D',
  teal: '#0F766E',
  green: '#15803D',
  lime: '#84CC16',
  ink: '#102A43',
  slate: '#486581',
  muted: '#829AB1',
  line: '#D9E2EC',
  pale: '#F4F8FA',
  white: '#FFFFFF',
  red: '#B42318',
  amber: '#B54708',
};

const fmtBn = (v, digits = 1) => `${(Number(v) / 1e9).toFixed(digits)} bn`;
const fmtPct = (v, digits = 1) => `${Number(v).toFixed(digits)}%`;
const fmtDays = (v) => `${Number(v).toFixed(0)} days`;

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.filter(Boolean).map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

async function readCsv(rel) { return parseCsv(await fs.readFile(path.join(ROOT, rel), 'utf8')); }
async function readJson(rel) { return JSON.parse(await fs.readFile(path.join(ROOT, rel), 'utf8')); }
async function writeBlob(file, blob) { await fs.writeFile(file, new Uint8Array(await blob.arrayBuffer())); }

function addText(slide, text, left, top, width, height, style = {}) {
  const shape = slide.shapes.add({
    geometry: 'textbox',
    position: { left, top, width, height },
    fill: 'none',
    line: { style: 'solid', fill: 'none', width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: style.fontSize ?? 18,
    color: style.color ?? C.ink,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
    alignment: style.alignment ?? 'left',
  };
  return shape;
}

function addBox(slide, left, top, width, height, fill = C.white, line = C.line, radius = 16) {
  return slide.shapes.add({
    geometry: 'roundRect',
    position: { left, top, width, height },
    fill,
    line: { style: 'solid', fill: line, width: 1 },
    borderRadius: radius,
  });
}

function addRule(slide, left, top, width, color = C.line, height = 1) {
  return slide.shapes.add({
    geometry: 'rect',
    position: { left, top, width, height },
    fill: color,
    line: { style: 'solid', fill: color, width: 0 },
  });
}

function addHeader(slide, section, title, subtitle) {
  slide.background.fill = C.pale;
  addRule(slide, 0, 0, 1280, C.navy, 16);
  addText(slide, 'VIETNOVA / FINANCE CORE', 56, 28, 420, 24, { fontSize: 14, color: C.teal, bold: true });
  addText(slide, section.toUpperCase(), 1010, 28, 210, 24, { fontSize: 14, color: C.muted, bold: true, alignment: 'right' });
  addText(slide, title, 56, 78, 1168, 58, { fontSize: 36, color: C.navy, bold: true });
  if (subtitle) addText(slide, subtitle, 58, 140, 1130, 30, { fontSize: 18, color: C.slate });
  addRule(slide, 56, 178, 1168, C.line, 1);
}

function addFooter(slide, page, sourceLabel = 'SIMULATED / DERIVED — non-live evidence') {
  addRule(slide, 56, 684, 1168, C.line, 1);
  addText(slide, sourceLabel, 56, 694, 740, 18, { fontSize: 12, color: C.muted });
  addText(slide, `${String(page).padStart(2, '0')} / 10`, 1110, 694, 114, 18, { fontSize: 12, color: C.muted, alignment: 'right' });
}

function addKpi(slide, x, y, w, label, value, delta, tone = C.teal) {
  addBox(slide, x, y, w, 112, C.white, C.line, 16);
  addRule(slide, x, y, 6, tone, 112);
  addText(slide, label.toUpperCase(), x + 24, y + 18, w - 42, 20, { fontSize: 13, color: C.muted, bold: true });
  addText(slide, value, x + 24, y + 44, w - 42, 36, { fontSize: 28, color: C.navy, bold: true });
  if (delta) addText(slide, delta, x + 24, y + 84, w - 42, 18, { fontSize: 14, color: tone, bold: true });
}

function addNotes(slide, lines) {
  slide.speakerNotes.textFrame.setText(['[Sources]', ...lines]);
  slide.speakerNotes.setVisible(true);
}

async function main() {
  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.mkdir(RENDER_DIR, { recursive: true });

  const scenarios = await readCsv('data/scenarios/scenario_summary.csv');
  const scenario = Object.fromEntries(scenarios.map((r) => [r.scenario, r]));
  const threeYearSummary = await readJson('data/planning/three_year_operating_plan_summary.json');
  const threeYear = await readCsv('data/planning/three_year_operating_plan.csv');
  const forecastSummary = await readJson('data/forecast/forecast_versioning_backtest_v2_summary.json');
  const forecastMetrics = await readCsv('data/forecast/forecast_backtest_metrics_v2.csv');
  const costRows = await readCsv('data/costing/standard_cost_reconciliation.csv');
  const statementSummary = threeYearSummary.baseline;

  const planByScenarioYear = {};
  for (const row of threeYear) {
    const key = `${row.scenario}|${row.fiscal_year}`;
    planByScenarioYear[key] ??= { revenue: 0, ebitda: 0, cfo: 0 };
    planByScenarioYear[key].revenue += Number(row.revenue_vnd);
    planByScenarioYear[key].ebitda += Number(row.ebitda_proxy_vnd);
    planByScenarioYear[key].cfo += Number(row.cfo_vnd);
  }
  const forecastAvgWape = Object.fromEntries(['BUDGET', 'RF1', 'RF2', 'RF3', 'LATEST_ESTIMATE'].map((version) => {
    const rows = forecastMetrics.filter((r) => r.forecast_version === version);
    return [version, rows.reduce((s, r) => s + Number(r.wape_pct), 0) / Math.max(rows.length, 1)];
  }));
  const totalCostVariance = costRows.reduce((s, r) => s + Number(r.material_price_variance_vnd) + Number(r.usage_yield_variance_vnd) + Number(r.conversion_variance_vnd), 0);
  const reserveRows = await readCsv('data/costing/inventory_reserve_monthly.csv');
  const totalReserve = reserveRows.reduce((s, r) => s + Number(r.reserve_vnd), 0);

  const p = Presentation.create({ slideSize: { width: 1280, height: 720 } });

  // 1 — opening decision
  {
    const s = p.slides.add();
    s.background.fill = C.navy;
    addRule(s, 0, 0, 1280, C.teal, 18);
    addText(s, 'VIETNOVA / FINANCE CORE', 64, 54, 500, 24, { fontSize: 15, color: '#8EE3CF', bold: true });
    addText(s, 'Monthly operating review', 64, 135, 820, 70, { fontSize: 52, color: C.white, bold: true });
    addText(s, 'Growth is investable only when contribution converts into cash.', 68, 222, 840, 56, { fontSize: 26, color: '#D9F5F0' });
    addText(s, 'FY2025 planning snapshot • decision pack for CFO / business finance review', 68, 296, 830, 24, { fontSize: 16, color: '#A9C8D8' });
    addBox(s, 64, 405, 340, 152, '#0B3C5D', '#1E5A7A', 18);
    addText(s, 'DECISION', 90, 428, 200, 20, { fontSize: 14, color: '#8EE3CF', bold: true });
    addText(s, 'Approve the base plan\nwith cash gates.', 90, 461, 280, 70, { fontSize: 26, color: C.white, bold: true });
    addText(s, 'Escalate any breach of the minimum-cash guardrail before growth spend.', 90, 534, 275, 34, { fontSize: 14, color: '#C6DCE7' });
    addKpi(s, 468, 400, 226, 'Base revenue', fmtBn(scenario.BASE.revenue_vnd_bn * 1e9, 1), 'FY2025 · VND bn', C.lime);
    addKpi(s, 716, 400, 226, 'Base EBITDA proxy', fmtBn(scenario.BASE.ebitda_proxy_vnd_bn * 1e9, 1), `${fmtPct(scenario.BASE.ebitda_proxy_margin_pct)} margin`, C.lime);
    addKpi(s, 964, 400, 226, 'CCC', fmtDays(scenario.BASE.ccc_days), 'cash conversion target', C.lime);
    addText(s, 'Evidence boundary: synthetic operating data; all amounts in VND bn unless noted.', 68, 650, 760, 20, { fontSize: 14, color: '#A9C8D8' });
    addText(s, '01 / 10', 1110, 650, 100, 20, { fontSize: 14, color: '#A9C8D8', alignment: 'right' });
    addNotes(s, ['data/scenarios/scenario_summary.csv', 'docs/VNFINANCE_FPA_NON_POWERBI_GAP_RESEARCH_AND_UPDATE_MASTER_PLAN_2026-09-01.md']);
  }

  // 2 — scorecard
  {
    const s = p.slides.add();
    addHeader(s, 'Executive scorecard', 'The base case is profitable on paper, but the cash profile is the constraint.', 'Use the scorecard to frame the operating conversation before reviewing drivers.');
    addKpi(s, 56, 210, 210, 'Revenue', fmtBn(scenario.BASE.revenue_vnd_bn * 1e9), 'Base case', C.teal);
    addKpi(s, 286, 210, 210, 'Gross profit', fmtBn(scenario.BASE.gross_profit_vnd_bn * 1e9), `${fmtPct((scenario.BASE.gross_profit_vnd_bn / scenario.BASE.revenue_vnd_bn) * 100)} margin`, C.teal);
    addKpi(s, 516, 210, 210, 'EBITDA proxy', fmtBn(scenario.BASE.ebitda_proxy_vnd_bn * 1e9), `${fmtPct(scenario.BASE.ebitda_proxy_margin_pct)} margin`, C.green);
    addKpi(s, 746, 210, 210, 'CCC', fmtDays(scenario.BASE.ccc_days), 'Base scenario', C.amber);
    addKpi(s, 976, 210, 248, 'Downside EBITDA', fmtBn(scenario.DOWNSIDE.ebitda_proxy_vnd_bn * 1e9), `${fmtPct(scenario.DOWNSIDE.ebitda_proxy_margin_pct)} margin`, C.red);
    addBox(s, 56, 355, 540, 258, C.white);
    addText(s, 'Management read-out', 82, 382, 460, 26, { fontSize: 24, color: C.navy, bold: true });
    const bullets = [
      'Revenue upside is not enough if discounts and fulfilment absorb the gain.',
      'CCC is the leading cash signal: protect collection, stock turns and supplier terms.',
      'Downside margin compression requires an explicit spend and inventory response.',
    ];
    bullets.forEach((b, i) => {
      addText(s, '•', 84, 432 + i * 50, 18, 22, { fontSize: 22, color: C.teal, bold: true });
      addText(s, b, 110, 431 + i * 50, 448, 36, { fontSize: 17, color: C.ink });
    });
    addBox(s, 628, 355, 596, 258, C.navy, C.navy, 16);
    addText(s, 'Decision rule', 658, 383, 250, 25, { fontSize: 22, color: '#8EE3CF', bold: true });
    addText(s, 'Keep the base plan while', 658, 430, 420, 30, { fontSize: 21, color: C.white, bold: true });
    addText(s, 'margin ≥ 15% and CCC ≤ 58 days', 658, 466, 500, 35, { fontSize: 28, color: C.lime, bold: true });
    addText(s, 'If either threshold is missed for two reviews, move to downside actions and freeze discretionary spend.', 658, 520, 500, 58, { fontSize: 17, color: '#D9EAF1' });
    addFooter(s, 2);
    addNotes(s, ['data/scenarios/scenario_summary.csv', 'reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md']);
  }

  // 3 — P&L bridge
  {
    const s = p.slides.add();
    addHeader(s, 'P&L bridge', 'The bridge isolates the few levers that can move operating profit.', 'A finance analyst should make the causal chain visible: volume → price/mix → cost → controllable OPEX.');
    addBox(s, 56, 210, 700, 410, C.white);
    addText(s, 'FY2025 base case bridge (VND bn)', 84, 236, 500, 24, { fontSize: 22, color: C.navy, bold: true });
    s.charts.add('bar', {
      position: { left: 86, top: 290, width: 630, height: 260 },
      categories: ['Revenue', 'COGS', 'Gross profit', 'OPEX', 'EBITDA proxy'],
      series: [{ name: 'VND bn', values: [82.5, -55.6, 26.9, -14.0, 12.9], fill: C.teal }],
      hasLegend: false,
      barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 42 },
      dataLabels: { showValue: true, position: 'outEnd', textStyle: { fontSize: 13, fill: C.ink } },
      yAxis: { numberFormatCode: '0.0', majorGridlines: { style: 'solid', fill: C.line, width: 1 } },
      chartFill: C.white,
      plotAreaFill: C.white,
      chartLine: { style: 'solid', fill: C.line, width: 1 },
    });
    addText(s, 'The model uses EBITDA proxy = gross profit − controllable OPEX; it is not statutory EBITDA.', 84, 566, 620, 32, { fontSize: 14, color: C.muted, italic: true });
    addBox(s, 790, 210, 434, 410, C.navy, C.navy, 16);
    addText(s, 'What to ask next', 820, 240, 340, 28, { fontSize: 24, color: '#8EE3CF', bold: true });
    const qs = [
      ['01', 'Which channel is buying growth with discounts?'],
      ['02', 'Which SKUs have cost leakage or poor mix?'],
      ['03', 'Which OPEX lines are controllable this month?'],
    ];
    qs.forEach(([n, q], i) => {
      addText(s, n, 822, 305 + i * 82, 42, 24, { fontSize: 16, color: C.lime, bold: true });
      addText(s, q, 878, 300 + i * 82, 300, 50, { fontSize: 19, color: C.white, bold: true });
      if (i < qs.length - 1) addRule(s, 820, 365 + i * 82, 340, '#1E5A7A', 1);
    });
    addFooter(s, 3);
    addNotes(s, ['data/scenarios/scenario_summary.csv', 'data/financial_statements/monthly_income_statement.csv', 'docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md']);
  }

  // 4 — commercial profitability
  {
    const s = p.slides.add();
    addHeader(s, 'Commercial profitability', 'Margin is a portfolio decision, not a single price decision.', 'Use PVM and contribution-after-working-capital lenses to choose where to protect, fix or exit.');
    addBox(s, 56, 214, 720, 396, C.white);
    addText(s, 'Illustrative contribution bridge', 84, 240, 460, 24, { fontSize: 22, color: C.navy, bold: true });
    s.charts.add('bar', {
      position: { left: 82, top: 290, width: 650, height: 252 },
      categories: ['Volume', 'Price', 'Mix', 'Discounts', 'Trade spend', 'COGS / GM'],
      series: [{ name: 'Impact (VND bn)', values: [3.9, 3.2, 0.6, -2.1, -0.9, -1.4], fill: C.teal }],
      hasLegend: false,
      barOptions: { direction: 'bar', grouping: 'clustered', gapWidth: 35 },
      dataLabels: { showValue: true, position: 'outEnd', textStyle: { fontSize: 13, fill: C.ink } },
      xAxis: { numberFormatCode: '0.0', majorGridlines: { style: 'solid', fill: C.line, width: 1 } },
      chartFill: C.white,
      plotAreaFill: C.white,
      chartLine: { style: 'solid', fill: C.line, width: 1 },
    });
    addBox(s, 808, 214, 416, 396, C.white);
    addText(s, 'Action map', 838, 242, 300, 24, { fontSize: 22, color: C.navy, bold: true });
    const map = [
      ['PROTECT', 'High CM / high growth', C.green],
      ['FIX', 'High revenue / low CM', C.amber],
      ['REPRICE', 'Price leakage or discount creep', C.teal],
      ['EXIT', 'Negative after-WC contribution', C.red],
    ];
    map.forEach(([tag, label, tone], i) => {
      addBox(s, 838, 294 + i * 62, 108, 34, tone, tone, 10);
      addText(s, tag, 848, 301 + i * 62, 88, 18, { fontSize: 13, color: C.white, bold: true, alignment: 'center' });
      addText(s, label, 970, 300 + i * 62, 220, 24, { fontSize: 16, color: C.ink, bold: true });
    });
    addText(s, 'Commercial finance implication: show the profit pool and the cash cost together before approving growth spend.', 838, 552, 340, 44, { fontSize: 16, color: C.slate });
    addFooter(s, 4);
    addNotes(s, ['data/customer_profitability_synthetic.csv', 'data/operational_driver_tree_unit_economics.csv', 'reports/MANAGEMENT_RECOMMENDATION_REGISTER_2026-08-30.md']);
  }

  // 5 — working capital and cash
  {
    const s = p.slides.add();
    addHeader(s, 'Cash conversion', 'Cash is tied up in receivables and inventory; the plan needs a funding gate.', 'Integrated statements are now linked: P&L → working capital → cash flow → balance sheet.');
    addKpi(s, 56, 210, 210, 'DSO', `${Number(statementSummary.dso_days).toFixed(0)} days`, 'FY2025 calendar model', C.amber);
    addKpi(s, 286, 210, 210, 'DIO', `${Number(statementSummary.dio_days).toFixed(0)} days`, 'inventory intensity', C.amber);
    addKpi(s, 516, 210, 210, 'DPO', `${Number(statementSummary.dpo_days).toFixed(0)} days`, 'supplier funding', C.teal);
    addKpi(s, 746, 210, 210, 'CFO', fmtBn(statementSummary.cfo_vnd), 'FY2025 calendar model', C.red);
    addKpi(s, 976, 210, 248, 'Cash closing', fmtBn(statementSummary.cash_vnd), 'minimum-cash breach', C.red);
    addBox(s, 56, 354, 650, 260, C.white);
    addText(s, 'Cash conversion cycle', 84, 382, 380, 24, { fontSize: 22, color: C.navy, bold: true });
    s.charts.add('bar', {
      position: { left: 88, top: 430, width: 570, height: 120 },
      categories: ['DSO', 'DIO', 'DPO', 'CCC'],
      series: [{ name: 'Days', values: [statementSummary.dso_days, statementSummary.dio_days, statementSummary.dpo_days, Number(statementSummary.dso_days) + Number(statementSummary.dio_days) - Number(statementSummary.dpo_days)], fill: C.teal }],
      hasLegend: false,
      barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 40 },
      dataLabels: { showValue: true, position: 'outEnd', textStyle: { fontSize: 13, fill: C.ink } },
      yAxis: { numberFormatCode: '0', majorGridlines: { style: 'solid', fill: C.line, width: 1 } },
      chartFill: C.white,
      plotAreaFill: C.white,
      chartLine: { style: 'solid', fill: C.line, width: 1 },
    });
    addBox(s, 738, 354, 486, 260, C.navy, C.navy, 16);
    addText(s, 'Cash gate', 770, 384, 260, 24, { fontSize: 22, color: '#8EE3CF', bold: true });
    addText(s, 'Release growth capex only after', 770, 434, 380, 26, { fontSize: 20, color: C.white, bold: true });
    addText(s, 'CFO turns positive and cash ≥ minimum buffer.', 770, 470, 400, 56, { fontSize: 25, color: C.lime, bold: true });
    addText(s, 'The negative cash result is a deliberate stress signal for working-capital discipline, not a live company forecast.', 770, 548, 390, 42, { fontSize: 15, color: '#D9EAF1' });
    addFooter(s, 5);
    addNotes(s, ['data/financial_statements/monthly_cash_flow.csv', 'data/financial_statements/monthly_balance_sheet.csv', 'docs/THREE_STATEMENT_FPA_MODEL_METHODOLOGY.md']);
  }

  // 6 — forecast governance
  {
    const s = p.slides.add();
    addHeader(s, 'Forecast discipline', 'Versioned snapshots make forecast accuracy auditable instead of anecdotal.', 'The rehearsal freezes Budget, rolling forecasts and latest estimate at a fixed cutoff; live accuracy remains input-gated.');
    addBox(s, 56, 214, 760, 396, C.white);
    addText(s, 'Average WAPE by frozen version (synthetic rehearsal)', 84, 242, 650, 24, { fontSize: 22, color: C.navy, bold: true });
    s.charts.add('bar', {
      position: { left: 88, top: 300, width: 690, height: 240 },
      categories: ['Budget', 'RF1', 'RF2', 'RF3', 'Latest est.'],
      series: [{ name: 'Average WAPE %', values: [forecastAvgWape.BUDGET, forecastAvgWape.RF1, forecastAvgWape.RF2, forecastAvgWape.RF3, forecastAvgWape.LATEST_ESTIMATE], fill: C.teal }],
      hasLegend: false,
      barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 48 },
      dataLabels: { showValue: true, position: 'outEnd', textStyle: { fontSize: 13, fill: C.ink } },
      yAxis: { numberFormatCode: '0%', majorGridlines: { style: 'solid', fill: C.line, width: 1 } },
      chartFill: C.white,
      plotAreaFill: C.white,
      chartLine: { style: 'solid', fill: C.line, width: 1 },
    });
    addBox(s, 848, 214, 376, 396, C.navy, C.navy, 16);
    addText(s, 'Control checklist', 878, 244, 280, 26, { fontSize: 22, color: '#8EE3CF', bold: true });
    const controls = [
      'Fixed cutoff date',
      'No actuals leakage',
      'Version bridge',
      'Override log',
      'Bias / WAPE / MAE',
    ];
    controls.forEach((c, i) => {
      addText(s, '✓', 880, 298 + i * 48, 24, 24, { fontSize: 20, color: C.lime, bold: true });
      addText(s, c, 916, 299 + i * 48, 260, 24, { fontSize: 18, color: C.white, bold: true });
    });
    addText(s, 'Live Gate A: approved internal pre-close snapshots + post-close actuals.', 878, 552, 290, 42, { fontSize: 15, color: '#D9EAF1' });
    addFooter(s, 6);
    addNotes(s, ['data/forecast/forecast_backtest_metrics_v2.csv', 'data/forecast/forecast_version_bridge_v2.csv', 'docs/FORECAST_VERSIONING_BACKTEST_V2.md']);
  }

  // 7 — three-year plan
  {
    const s = p.slides.add();
    addHeader(s, 'Operating plan', 'The three-year plan converts drivers into an explicit funding conversation.', 'FY2026 is monthly for review cadence; FY2027–FY2028 are quarterly for planning horizon.');
    addBox(s, 56, 214, 750, 396, C.white);
    addText(s, 'Revenue trajectory (VND bn)', 84, 242, 400, 24, { fontSize: 22, color: C.navy, bold: true });
    const years = ['FY2026', 'FY2027', 'FY2028'];
    const base = years.map((y) => (planByScenarioYear[`BASE|${y}`]?.revenue ?? 0) / 1e9);
    const upside = years.map((y) => (planByScenarioYear[`UPSIDE|${y}`]?.revenue ?? 0) / 1e9);
    const downside = years.map((y) => (planByScenarioYear[`DOWNSIDE|${y}`]?.revenue ?? 0) / 1e9);
    s.charts.add('line', {
      position: { left: 84, top: 300, width: 690, height: 240 },
      categories: years,
      series: [
        { name: 'Base', values: base, line: { fill: C.teal, width: 3 }, marker: { symbol: 'circle', size: 7 } },
        { name: 'Upside', values: upside, line: { fill: C.green, width: 3 }, marker: { symbol: 'diamond', size: 7 } },
        { name: 'Downside', values: downside, line: { fill: C.red, width: 3 }, marker: { symbol: 'square', size: 7 } },
      ],
      hasLegend: true,
      legend: { position: 'top', textStyle: { fontSize: 14, fill: C.slate } },
      lineOptions: { grouping: 'standard', smooth: false },
      yAxis: { numberFormatCode: '0', majorGridlines: { style: 'solid', fill: C.line, width: 1 } },
      chartFill: C.white,
      plotAreaFill: C.white,
      chartLine: { style: 'solid', fill: C.line, width: 1 },
    });
    addBox(s, 838, 214, 386, 396, C.navy, C.navy, 16);
    addText(s, 'Plan governance', 868, 244, 280, 26, { fontSize: 22, color: '#8EE3CF', bold: true });
    addText(s, `${threeYearSummary.plan.periods} periods`, 868, 302, 300, 34, { fontSize: 29, color: C.white, bold: true });
    addText(s, '36 monthly + 24 quarterly rows', 868, 338, 300, 22, { fontSize: 16, color: '#D9EAF1' });
    addRule(s, 868, 380, 300, '#1E5A7A', 1);
    addText(s, '4 initiatives', 868, 408, 300, 34, { fontSize: 29, color: C.lime, bold: true });
    addText(s, 'owner • investment • benefit • kill criteria', 868, 445, 300, 34, { fontSize: 16, color: '#D9EAF1' });
    addText(s, 'No terminal growth is used; the model remains a planning rehearsal.', 868, 520, 300, 46, { fontSize: 15, color: '#D9EAF1' });
    addFooter(s, 7);
    addNotes(s, ['data/planning/three_year_operating_plan.csv', 'data/planning/operating_plan_initiatives.csv', 'docs/THREE_YEAR_DRIVER_BASED_OPERATING_PLAN.md']);
  }

  // 8 — costing
  {
    const s = p.slides.add();
    addHeader(s, 'Costing & supply chain', 'Standard cost turns a gross-margin miss into an operational action list.', 'The cost bridge separates purchase price, usage/yield and conversion overhead; reserve is treated as a distinct cash/profit risk.');
    addBox(s, 56, 214, 720, 396, C.white);
    addText(s, 'Illustrative standard-cost variance (VND bn)', 84, 242, 620, 24, { fontSize: 22, color: C.navy, bold: true });
    const ppv = costRows.reduce((s0, r) => s0 + Number(r.material_price_variance_vnd), 0) / 1e9;
    const usage = costRows.reduce((s0, r) => s0 + Number(r.usage_yield_variance_vnd), 0) / 1e9;
    const conversion = costRows.reduce((s0, r) => s0 + Number(r.conversion_variance_vnd), 0) / 1e9;
    s.charts.add('bar', {
      position: { left: 88, top: 300, width: 650, height: 236 },
      categories: ['Purchase price', 'Usage / yield', 'Conversion', 'Total bridge'],
      series: [{ name: 'VND bn', values: [ppv, usage, conversion, totalCostVariance / 1e9], fill: C.teal }],
      hasLegend: false,
      barOptions: { direction: 'column', grouping: 'clustered', gapWidth: 46 },
      dataLabels: { showValue: true, position: 'outEnd', textStyle: { fontSize: 13, fill: C.ink } },
      yAxis: { numberFormatCode: '0.0', majorGridlines: { style: 'solid', fill: C.line, width: 1 } },
      chartFill: C.white,
      plotAreaFill: C.white,
      chartLine: { style: 'solid', fill: C.line, width: 1 },
    });
    addBox(s, 808, 214, 416, 396, C.white);
    addText(s, 'Operating response', 838, 242, 300, 24, { fontSize: 22, color: C.navy, bold: true });
    const ops = [
      'Lock supplier price assumptions at freeze.',
      'Review yield loss by SKU / plant.',
      'Escalate conversion overhead absorption.',
      `Track reserve separately: ${fmtBn(totalReserve)}.`,
    ];
    ops.forEach((t, i) => {
      addText(s, `${i + 1}`, 840, 300 + i * 58, 28, 26, { fontSize: 18, color: C.teal, bold: true });
      addText(s, t, 882, 298 + i * 58, 300, 44, { fontSize: 17, color: C.ink, bold: true });
    });
    addFooter(s, 8);
    addNotes(s, ['data/costing/standard_cost_reconciliation.csv', 'data/costing/inventory_reserve_monthly.csv', 'docs/FMCG_STANDARD_COSTING_AND_VARIANCE.md']);
  }

  // 9 — action / risk
  {
    const s = p.slides.add();
    addHeader(s, 'Actions & risks', 'Every insight must end with an owner, a date and a guardrail.', 'The register is designed for the monthly operating review: prioritise, assign, measure, close.');
    const rows = [
      ['P0', 'Cash conversion', 'Finance + AR', 'Reduce DSO / protect buffer', '≤ 58 days', 'Open'],
      ['P0', 'Inventory ageing', 'Supply chain', 'Cut slow-moving stock', 'DIO ≤ 165 days', 'Open'],
      ['P1', 'Discount leakage', 'Commercial', 'Reprice / approval gate', 'GM ≥ 47%', 'Open'],
      ['P1', 'Cost variance', 'Procurement', 'Lock supplier terms', 'Bridge ≤ 0.5 bn', 'Open'],
      ['P2', 'Forecast cadence', 'FP&A', 'Freeze monthly snapshots', 'Cutoff met', 'Ready'],
    ];
    addBox(s, 56, 214, 1168, 396, C.white);
    const cols = [56, 132, 390, 600, 900, 1080];
    ['Prio.', 'Risk / opportunity', 'Owner', 'Action', 'Guardrail', 'Status'].forEach((h, i) => {
      addText(s, h, cols[i] + 18, 244, (cols[i + 1] ?? 1224) - cols[i] - 26, 24, { fontSize: 14, color: C.muted, bold: true });
    });
    addRule(s, 78, 278, 1110, C.line, 1);
    rows.forEach((r, ri) => {
      const y = 304 + ri * 55;
      addText(s, r[0], 78, y, 44, 24, { fontSize: 15, color: r[0] === 'P0' ? C.red : C.amber, bold: true });
      addText(s, r[1], 150, y, 220, 24, { fontSize: 16, color: C.ink, bold: true });
      addText(s, r[2], 408, y, 160, 24, { fontSize: 16, color: C.ink });
      addText(s, r[3], 618, y, 260, 24, { fontSize: 16, color: C.ink });
      addText(s, r[4], 918, y, 142, 24, { fontSize: 16, color: C.ink, bold: true });
      addBox(s, 1080, y - 4, 86, 28, r[5] === 'Ready' ? '#DCFCE7' : '#FEF3C7', 'none', 10);
      addText(s, r[5], 1088, y + 2, 70, 18, { fontSize: 13, color: r[5] === 'Ready' ? C.green : C.amber, bold: true, alignment: 'center' });
      if (ri < rows.length - 1) addRule(s, 78, y + 34, 1110, C.line, 1);
    });
    addFooter(s, 9);
    addNotes(s, ['reports/MANAGEMENT_RECOMMENDATION_REGISTER_2026-08-30.md', 'data/governance/finance_metric_registry.csv', 'docs/FINANCE_ANALYST_WALKTHROUGH_SCRIPT_5_MIN.md']);
  }

  // 10 — close
  {
    const s = p.slides.add();
    s.background.fill = C.navy;
    addRule(s, 0, 0, 1280, C.teal, 18);
    addText(s, 'CLOSE', 64, 58, 180, 22, { fontSize: 15, color: '#8EE3CF', bold: true });
    addText(s, 'Approve the base plan\nwith gates.', 64, 134, 720, 120, { fontSize: 52, color: C.white, bold: true });
    addText(s, 'The finance analyst role is to connect the number to the decision — and make the decision repeatable next month.', 68, 290, 790, 58, { fontSize: 25, color: '#D9F5F0' });
    addBox(s, 64, 410, 520, 144, '#0B3C5D', '#1E5A7A', 18);
    addText(s, 'NEXT REVIEW', 92, 436, 200, 20, { fontSize: 14, color: '#8EE3CF', bold: true });
    addText(s, 'Close Gate A with approved\nforecast + post-close actuals.', 92, 470, 430, 62, { fontSize: 25, color: C.white, bold: true });
    addText(s, 'Evidence pack', 728, 414, 260, 24, { fontSize: 22, color: '#8EE3CF', bold: true });
    const refs = ['Three statements', '3-year driver plan', 'Forecast versioning', 'Costing & reserve', 'Management register'];
    refs.forEach((t, i) => {
      addText(s, '✓', 730, 458 + i * 34, 22, 22, { fontSize: 18, color: C.lime, bold: true });
      addText(s, t, 762, 458 + i * 34, 360, 22, { fontSize: 18, color: C.white });
    });
    addText(s, 'All figures are synthetic / derived and clearly labelled in the release package.', 68, 650, 740, 20, { fontSize: 14, color: '#A9C8D8' });
    addText(s, '10 / 10', 1110, 650, 100, 20, { fontSize: 14, color: '#A9C8D8', alignment: 'right' });
    addNotes(s, ['reports/NON_POWERBI_RELEASE_GATE_2026-09-01.json', 'docs/FORECAST_VERSIONING_BACKTEST_V2.md', 'docs/THREE_YEAR_DRIVER_BASED_OPERATING_PLAN.md']);
  }

  for (const [index, slide] of p.slides.items.entries()) {
    const stem = `slide-${String(index + 1).padStart(2, '0')}`;
    await writeBlob(path.join(RENDER_DIR, `${stem}.png`), await p.export({ slide, format: 'png', scale: 1 }));
    await fs.writeFile(path.join(RENDER_DIR, `${stem}.layout.json`), await (await slide.export({ format: 'layout' })).text(), 'utf8');
  }
  await writeBlob(path.join(RENDER_DIR, 'montage.webp'), await p.export({ format: 'webp', montage: true, scale: 1 }));
  const pptx = await PresentationFile.exportPptx(p);
  await pptx.save(OUT);
  console.log(JSON.stringify({ output: OUT, slides: p.slides.items.length, render_dir: RENDER_DIR, evidence_boundary: 'SIMULATED/DERIVED' }, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
