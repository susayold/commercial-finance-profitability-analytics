#!/usr/bin/env node
import fs from 'node:fs';
const root = process.cwd();
const data = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page5-costing.json`, 'utf8'));
const src = fs.readFileSync(`${root}/site/app/costing-page5.tsx`, 'utf8');
const fails = [];
const need = (cond, msg) => { if (!cond) fails.push(msg); };
const approx = (a, b, tol = 0.001) => Math.abs(Number(a) - Number(b)) <= tol;

need(data.scope === 'DETAILED_36_SKU_COSTING_REHEARSAL', 'Page 5 scope mismatch');
need(data.evidenceClass === 'SIMULATED/DERIVED', 'Page 5 evidence class mismatch');
need(data.fy2025.monthlyBridgePass === 12, 'FY2025 monthly bridge must be 12/12 PASS');
need(approx(data.fy2025.standardCogsVnd / 1e9, 6.3582, 0.001), 'FY2025 standard COGS mismatch');
need(approx(data.fy2025.actualCogsVnd / 1e9, 6.6076, 0.001), 'FY2025 actual COGS mismatch');
need(approx(data.fy2025.totalVarianceVnd / 1e6, 249.4, 0.2), 'FY2025 total variance mismatch');
need(data.decVarianceTop8.length === 8 && new Set(data.decVarianceTop8.map((r) => r.sku)).size === 8, 'Dec variance Top 8 must contain 8 unique SKUs');
need(approx(data.inventory.grossInventoryVnd / 1e9, 3.266386, 0.00001), 'Dec gross inventory mismatch');
need(approx(data.inventory.reserveVnd / 1e9, 0.489958, 0.00001), 'Dec reserve mismatch');
need(approx(data.inventory.netInventoryVnd / 1e9, 2.776428, 0.00001), 'Dec net inventory mismatch');
need(data.inventory.nonZeroSkuCount === 3, 'Dec non-zero inventory SKU count must be 3');
need(data.inventory.slowMovingCount === 3, 'Dec slow-moving SKU count must be 3');
need(JSON.stringify(data.inventory.slowMovingRows.map((r) => r.sku).sort()) === JSON.stringify(['SKU018','SKU034','SKU035']), 'Slow-moving SKU set mismatch');
need(data.inventory.nonZeroRows.length === 3 && new Set(data.inventory.nonZeroRows.map((r) => r.sku)).size === 3, 'Inventory table must contain unique non-zero balances');
need(data.inventory.largestSku?.sku === 'SKU034' && approx(data.inventory.largestSku?.sharePct, 91.76, 0.1), 'Largest inventory SKU/share mismatch');
need(approx(data.inventory.slowMovingSharePct, 100, 0.001), 'All Dec non-zero inventory should be slow-moving in this source snapshot');
need(data.inventory.trend.length === 4 && data.inventory.trend.at(-1)?.period === '2025-12', 'Inventory Sep-Dec trend missing');
need(/page5-costing\.json/.test(src), 'Page 5 must consume generated costing contract');
need(/SKU018/.test(src) === false && /SKU035/.test(src) === false, 'Page 5 should not hard-code source-specific slow-moving SKU rows');
need(!/DIO Proxy \(Avg\).*72\.8/s.test(src), 'Stale 72.8-day inventory KPI remains');
need(!/SKU033.*SKU033/s.test(src), 'Duplicate SKU033 hard-code remains');
need(/no plant BOM, purchase-order or production-hour evidence is claimed/.test(src), 'Plant evidence boundary missing');

if (fails.length) { console.error(fails.join('\n')); process.exit(1); }
console.log(`PASS: Page 5 costing/inventory contract (${data.inventory.slowMovingRows.map((r) => r.sku).join(', ')})`);
