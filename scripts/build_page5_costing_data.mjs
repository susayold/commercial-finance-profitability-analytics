#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'site', 'data', 'generated', 'page5-costing.json');
const RECON = path.join(ROOT, 'data', 'costing', 'standard_cost_reconciliation.csv');
const DETAIL = path.join(ROOT, 'data', 'costing', 'cost_variance_monthly.csv');
const INVENTORY = path.join(ROOT, 'data', 'costing', 'inventory_reserve_monthly.csv');

function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i], next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map((x) => x.trim());
  return rows.filter((r) => r.some((x) => x !== '')).map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()])));
}

const n = (v) => Number(v || 0);
const round = (v, d = 4) => Number(v.toFixed(d));
const sum = (rows, key) => rows.reduce((a, r) => a + n(r[key]), 0);

const recon = parseCsv(fs.readFileSync(RECON, 'utf8'));
const detail = parseCsv(fs.readFileSync(DETAIL, 'utf8'));
const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));

const fy25Recon = recon.filter((r) => r.period.startsWith('2025-'));
if (fy25Recon.length !== 12) throw new Error(`Expected 12 FY2025 reconciliation rows, got ${fy25Recon.length}`);
if (!fy25Recon.every((r) => r.status === 'PASS' && Math.abs(n(r.bridge_residual_vnd)) < 1)) throw new Error('Page 5 source reconciliation is not fully PASS');

const standardCogs = sum(fy25Recon, 'standard_cogs_vnd');
const material = sum(fy25Recon, 'material_price_variance_vnd');
const usage = sum(fy25Recon, 'usage_yield_variance_vnd');
const conversion = sum(fy25Recon, 'conversion_variance_vnd');
const actualCogs = sum(fy25Recon, 'actual_cogs_vnd');
const totalVariance = actualCogs - standardCogs;

const monthly = fy25Recon.map((r) => ({
  period: r.period,
  standardCogsVnd: n(r.standard_cogs_vnd),
  actualCogsVnd: n(r.actual_cogs_vnd),
  totalVarianceVnd: n(r.actual_cogs_vnd) - n(r.standard_cogs_vnd),
  totalVarianceMn: round((n(r.actual_cogs_vnd) - n(r.standard_cogs_vnd)) / 1e6, 4),
}));
const h1Variance = monthly.slice(0, 6).reduce((a, r) => a + r.totalVarianceVnd, 0);
const h2Variance = monthly.slice(6).reduce((a, r) => a + r.totalVarianceVnd, 0);

const decDetail = detail.filter((r) => r.period === '2025-12');
if (decDetail.length !== 36) throw new Error(`Expected 36 Dec-2025 costing rows, got ${decDetail.length}`);
const driver = (r) => {
  const pairs = [
    ['Material Price', Math.abs(n(r.material_price_variance_vnd))],
    ['Usage / Yield', Math.abs(n(r.usage_yield_variance_vnd))],
    ['Conversion', Math.abs(n(r.conversion_variance_vnd))],
  ];
  pairs.sort((a, b) => b[1] - a[1]);
  return pairs[0][0];
};
const decVarianceTop8 = decDetail
  .map((r) => ({
    sku: r.sku,
    category: r.category,
    standardCogsVnd: n(r.standard_cogs_vnd),
    actualCogsVnd: n(r.actual_cogs_vnd),
    varianceVnd: n(r.total_cogs_variance_vnd),
    variancePct: n(r.standard_cogs_vnd) === 0 ? 0 : n(r.total_cogs_variance_vnd) / n(r.standard_cogs_vnd) * 100,
    primaryDriver: driver(r),
  }))
  .sort((a, b) => Math.abs(b.varianceVnd) - Math.abs(a.varianceVnd))
  .slice(0, 8);

const decInventory = inventory.filter((r) => r.period === '2025-12');
if (decInventory.length !== 36) throw new Error(`Expected 36 Dec-2025 inventory rows, got ${decInventory.length}`);
const nonZeroInventory = decInventory
  .filter((r) => n(r.inventory_value_vnd) > 0)
  .map((r) => ({
    sku: r.sku,
    category: r.category,
    grossInventoryVnd: n(r.inventory_value_vnd),
    reserveVnd: n(r.reserve_vnd),
    netInventoryVnd: n(r.inventory_value_vnd) - n(r.reserve_vnd),
    sharePct: 0,
    dioProxyDays: n(r.dio_proxy_days),
    slowMoving: String(r.slow_moving_flag).toLowerCase() === 'true',
    reserveRate: n(r.reserve_rate),
    policy: r.policy,
  }))
  .sort((a, b) => b.grossInventoryVnd - a.grossInventoryVnd);

const grossInventory = nonZeroInventory.reduce((a, r) => a + r.grossInventoryVnd, 0);
const reserve = nonZeroInventory.reduce((a, r) => a + r.reserveVnd, 0);
const netInventory = grossInventory - reserve;
for (const row of nonZeroInventory) row.sharePct = grossInventory === 0 ? 0 : row.grossInventoryVnd / grossInventory * 100;
const slowMovingRows = nonZeroInventory.filter((r) => r.slowMoving);
const slowMovingInventory = slowMovingRows.reduce((a, r) => a + r.grossInventoryVnd, 0);

const inventoryTrend = ['2025-09', '2025-10', '2025-11', '2025-12'].map((period) => {
  const rows = inventory.filter((r) => r.period === period);
  const gross = sum(rows, 'inventory_value_vnd');
  const res = sum(rows, 'reserve_vnd');
  return {
    period,
    grossInventoryVnd: gross,
    reserveVnd: res,
    netInventoryVnd: gross - res,
    slowMovingCount: rows.filter((r) => String(r.slow_moving_flag).toLowerCase() === 'true' && n(r.inventory_value_vnd) > 0).length,
  };
});

const out = {
  scope: 'DETAILED_36_SKU_COSTING_REHEARSAL',
  evidenceClass: 'SIMULATED/DERIVED',
  fy2025: {
    standardCogsVnd: standardCogs,
    actualCogsVnd: actualCogs,
    materialPriceVarianceVnd: material,
    usageYieldVarianceVnd: usage,
    conversionVarianceVnd: conversion,
    totalVarianceVnd: totalVariance,
    variancePct: standardCogs === 0 ? 0 : totalVariance / standardCogs * 100,
    materialSharePct: totalVariance === 0 ? 0 : material / totalVariance * 100,
    usageSharePct: totalVariance === 0 ? 0 : usage / totalVariance * 100,
    conversionSharePct: totalVariance === 0 ? 0 : conversion / totalVariance * 100,
    monthlyBridgePass: fy25Recon.filter((r) => r.status === 'PASS').length,
    h2VsH1VariancePct: h1Variance === 0 ? null : (h2Variance / h1Variance - 1) * 100,
  },
  monthly,
  decVarianceTop8,
  inventory: {
    period: '2025-12',
    grossInventoryVnd: grossInventory,
    reserveVnd: reserve,
    netInventoryVnd: netInventory,
    reservePct: grossInventory === 0 ? 0 : reserve / grossInventory * 100,
    nonZeroSkuCount: nonZeroInventory.length,
    slowMovingCount: slowMovingRows.length,
    slowMovingInventoryVnd: slowMovingInventory,
    slowMovingSharePct: grossInventory === 0 ? 0 : slowMovingInventory / grossInventory * 100,
    largestSku: nonZeroInventory[0] ?? null,
    nonZeroRows: nonZeroInventory,
    slowMovingRows,
    trend: inventoryTrend,
  },
  sources: [
    'data/costing/standard_cost_reconciliation.csv',
    'data/costing/cost_variance_monthly.csv',
    'data/costing/inventory_reserve_monthly.csv',
  ],
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  status: 'BUILT',
  output: path.relative(ROOT, OUT),
  grossInventoryBn: round(grossInventory / 1e9, 6),
  slowMovingSkus: slowMovingRows.map((r) => r.sku),
  topVarianceSkus: decVarianceTop8.map((r) => r.sku),
}, null, 2));
