#!/usr/bin/env node
/** Validate standard-cost bridge, inventory reserve policy and evidence labels. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const readCsv = file => { const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/); const headers = lines.shift().split(','); return lines.filter(Boolean).map(line => { const values = line.split(','); return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])); }); };
const n = value => Number(value || 0);
const ok = value => Math.abs(n(value)) <= 1;
const out = path.join(ROOT, 'data', 'costing');
const master = readCsv(path.join(out, 'standard_cost_master.csv'));
const vars = readCsv(path.join(out, 'cost_variance_monthly.csv'));
const reserve = readCsv(path.join(out, 'inventory_reserve_monthly.csv'));
const recon = readCsv(path.join(out, 'standard_cost_reconciliation.csv'));
const checks = [];
const add = (name, pass, detail) => checks.push({ name, pass: Boolean(pass), detail });
add('master_has_products', master.length === 36, `rows=${master.length}`);
add('variance_has_month_sku_grain', vars.length === 1296 && new Set(vars.map(row => `${row.period}|${row.sku}`)).size === vars.length, `rows=${vars.length}`);
add('variance_bridge_identity', vars.every(row => ok(n(row.standard_cogs_vnd) + n(row.total_cogs_variance_vnd) - n(row.actual_cogs_vnd))), 'actual = standard + total variance');
add('component_bridge_identity', vars.every(row => ok(n(row.material_price_variance_vnd) + n(row.usage_yield_variance_vnd) + n(row.conversion_variance_vnd) - n(row.total_cogs_variance_vnd))), 'components = total variance');
add('period_reconciliation', recon.length === 36 && recon.every(row => row.status === 'PASS' && ok(row.bridge_residual_vnd)), `periods=${recon.length}`);
add('reserve_grain', reserve.length === 1296 && new Set(reserve.map(row => `${row.period}|${row.sku}`)).size === reserve.length, `rows=${reserve.length}`);
add('reserve_policy', reserve.every(row => (String(row.slow_moving_flag).toLowerCase() === 'true' && n(row.reserve_rate) === 0.15) || (String(row.slow_moving_flag).toLowerCase() !== 'true' && (n(row.dio_proxy_days) > 90 ? n(row.reserve_rate) === 0.08 : n(row.reserve_rate) === 0.01))), 'slow-moving and DIO buckets');
add('evidence_labels', vars.every(row => row.evidence_class === 'SIMULATED/DERIVED') && reserve.every(row => row.evidence_class === 'SIMULATED/DERIVED'), 'synthetic/derived labels');
add('no_negative_costs', master.every(row => n(row.standard_unit_cost_vnd) >= 0) && vars.every(row => n(row.standard_cogs_vnd) >= 0 && n(row.actual_cogs_vnd) >= 0) && reserve.every(row => n(row.inventory_value_vnd) >= 0), 'non-negative source costs');
const failures = checks.filter(row => !row.pass);
for (const row of checks) console.log(`${row.pass ? 'PASS' : 'FAIL'} ${row.name} — ${row.detail}`);
console.log(`Overall status: ${failures.length ? 'FAIL' : 'PASS'} (${checks.length - failures.length}/${checks.length} checks passed)`);
if (failures.length) process.exit(1);
