import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1')), '..');
const dataRoot = path.join(root, 'data/finance_model/final_v1');
const outDir = path.join(root, 'site/data/generated');
fs.mkdirSync(outDir, { recursive: true });

const readCsv = (name) => {
  const lines = fs.readFileSync(path.join(dataRoot, name), 'utf8').trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
};
const num = (value) => Number(value || 0);
const bn = (value) => Number((value / 1e9).toFixed(6));
const months = Array.from({ length: 12 }, (_, i) => `2025-${String(i + 1).padStart(2, '0')}`);
const groupBy = (rows, key) => rows.reduce((map, row) => { const k = key(row); (map[k] ??= []).push(row); return map; }, {});
const sum = (rows, field) => rows.reduce((total, row) => total + num(row[field]), 0);
const source = {
  sales: readCsv('fact_sales.csv'), budget: readCsv('fact_budget.csv'), forecast: readCsv('fact_forecast.csv'),
  pvm: readCsv('fact_pvm_bridge.csv'), opex: readCsv('fact_opex_headcount.csv'),
};
const inYear = (value) => String(value).startsWith('2025-');
const actualSales = source.sales.filter((row) => inYear(row.MonthStart));
const priorSales = source.sales.filter((row) => String(row.MonthStart).startsWith('2024-'));
const actualByMonth = groupBy(actualSales, (row) => row.MonthStart.slice(0, 7));
const priorByMonth = groupBy(priorSales, (row) => row.MonthStart.slice(0, 7));
const budgetByMonth = groupBy(source.budget.filter((row) => inYear(row.MonthStart)), (row) => row.MonthStart.slice(0, 7));
const forecastByMonth = groupBy(source.forecast.filter((row) => inYear(row.TargetMonth) && row.ScenarioKey === 'BASE'), (row) => row.TargetMonth.slice(0, 7));
const opexByMonth = groupBy(source.opex.filter((row) => row.Period.startsWith('2025-')), (row) => row.Period);

const monthly = months.map((month) => {
  const actual = actualByMonth[month] ?? [];
  const prior = priorByMonth[month.replace('2025-', '2024-')] ?? [];
  const budget = budgetByMonth[month] ?? [];
  const forecast = forecastByMonth[month] ?? [];
  const opex = opexByMonth[month] ?? [];
  const revenue = sum(actual, 'NetRevenueVND');
  const cogs = sum(actual, 'CorrectedCOGSVND');
  const gp = revenue - cogs;
  const priorRevenue = sum(prior, 'NetRevenueVND');
  const priorCogs = sum(prior, 'CorrectedCOGSVND');
  const priorGp = priorRevenue - priorCogs;
  const budgetRevenue = sum(budget, 'BudgetRevenueVND');
  const budgetCogs = sum(budget, 'BudgetCOGSVND');
  const forecastRevenue = sum(forecast, 'ForecastRevenueVND');
  const forecastCogs = sum(forecast, 'ForecastCOGSVND');
  const opexActual = sum(opex, 'OPEXActualVND');
  return {
    month, label: new Date(`${month}-01T00:00:00Z`).toLocaleString('en-US', { month: 'short' }),
    actual: { revenue: bn(revenue), cogs: bn(cogs), grossProfit: bn(gp), grossMargin: revenue ? gp / revenue * 100 : null, contribution: bn(sum(actual, 'ContributionProfitVND')), contributionMargin: revenue ? sum(actual, 'ContributionProfitVND') / revenue * 100 : null, opex: bn(opexActual), ebitdaProxy: bn(gp - opexActual), headcount: opex.reduce((n, row) => n + num(row.AverageHeadcount), 0) },
    budget: { revenue: bn(budgetRevenue), cogs: bn(budgetCogs), grossProfit: bn(budgetRevenue - budgetCogs) },
    forecast: { revenue: bn(forecastRevenue), cogs: bn(forecastCogs), grossProfit: bn(forecastRevenue - forecastCogs) },
    priorYear: { revenue: bn(priorRevenue), cogs: bn(priorCogs), grossProfit: bn(priorGp), grossMargin: priorRevenue ? priorGp / priorRevenue * 100 : null },
  };
});

// PVM rows repeat the same base/current values once per component. De-duplicate the base/current pair, then sum sourced components.
const pvmRows = source.pvm.filter((row) => inYear(row.MonthStart));
const pvmByMonth = groupBy(pvmRows, (row) => row.MonthStart.slice(0, 7));
const pvm = months.map((month) => {
  const rows = pvmByMonth[month] ?? [];
  const seen = new Set(); let baseRevenue = 0; let currentRevenue = 0;
  for (const row of rows) { const key = `${row.SKUKey}|${row.ChannelKey}`; if (!seen.has(key)) { seen.add(key); baseRevenue += num(row.BaseRevenueVND); currentRevenue += num(row.CurrentRevenueVND); } }
  const components = ['PRICE', 'VOLUME', 'MIX_RESIDUAL', 'NEW_DISCONTINUED', 'GTN_LEAKAGE'].map((component) => ({ component, amount: bn(rows.filter((row) => row.Component === component).reduce((n, row) => n + num(row.AmountVND), 0)) }));
  return { month, baseRevenue: bn(baseRevenue), currentRevenue: bn(currentRevenue), delta: bn(currentRevenue - baseRevenue), components };
});

const opexRows = source.opex.filter((row) => row.Period.startsWith('2025-'));
const opexByFunction = Object.entries(groupBy(opexRows, (row) => row.Function)).map(([name, rows]) => ({ name, actual: bn(sum(rows, 'OPEXActualVND')), headcount: rows.reduce((n, row) => n + num(row.AverageHeadcount), 0) })).sort((a, b) => b.actual - a.actual);
const opexByCostCenter = Object.entries(groupBy(opexRows, (row) => row.CostCenterKey)).map(([name, rows]) => ({ name, actual: bn(sum(rows, 'OPEXActualVND')), headcount: rows.reduce((n, row) => n + num(row.AverageHeadcount), 0) })).sort((a, b) => b.actual - a.actual);
const opexByCategory = [
  ['Salary', 'PayrollVND'], ['Bonus', 'BonusVND'], ['Benefits', 'BenefitsVND'], ['Non-People OPEX', 'NonPayrollOPEXVND'],
].map(([name, field]) => ({ name, actual: bn(sum(opexRows, field)) }));
const canonical = { revenue: 82.5138, grossProfit: 26.9150, cogs: 55.5988, opex: 14.0193, ebitdaProxy: 12.8956, contribution: 24.2074 };
const totals = { actualRevenue: bn(sum(actualSales, 'NetRevenueVND')), actualGrossProfit: bn(sum(actualSales, 'NetRevenueVND') - sum(actualSales, 'CorrectedCOGSVND')), actualContribution: bn(sum(actualSales, 'ContributionProfitVND')), budgetRevenue: bn(sum(source.budget.filter((row) => inYear(row.MonthStart)), 'BudgetRevenueVND')), forecastRevenue: bn(sum(source.forecast.filter((row) => inYear(row.TargetMonth) && row.ScenarioKey === 'BASE'), 'ForecastRevenueVND')), priorRevenue: bn(sum(priorSales, 'NetRevenueVND')), opexActual: bn(sum(opexRows, 'OPEXActualVND')), opexBudget: bn(sum(opexRows, 'OPEXBudgetVND')) };

const output = { period: 'FY2025', currency: 'VND bn', evidence: 'SIMULATED / DERIVED / PROXY_DERIVED', canonical, totals, monthly, pvm, opexByFunction, opexByCostCenter, opexByCategory, opexControls: { detailTotal: totals.opexActual, canonicalTotal: canonical.opex, reconciliationDelta: Number((totals.opexActual - canonical.opex).toFixed(6)), status: Math.abs(totals.opexActual - canonical.opex) <= 0.01 ? 'PASS' : 'OPEN' }, sourceRows: { fact_sales: actualSales.length, fact_budget: source.budget.filter((row) => inYear(row.MonthStart)).length, fact_forecast: source.forecast.filter((row) => inYear(row.TargetMonth) && row.ScenarioKey === 'BASE').length, fact_pvm_bridge: pvmRows.length, fact_opex_headcount: opexRows.length }, sourceFiles: ['fact_sales.csv', 'fact_commercial_cost.csv', 'fact_budget.csv', 'fact_forecast.csv', 'fact_pvm_bridge.csv', 'fact_opex_headcount.csv'] };
fs.writeFileSync(path.join(outDir, 'page2-performance.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${path.join(outDir, 'page2-performance.json')}`);
