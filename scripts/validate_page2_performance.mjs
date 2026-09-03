import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(root, 'site', 'data', 'generated', 'page2-performance.json');
const componentPath = path.join(root, 'site', 'app', 'performance-page2.tsx');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const component = fs.readFileSync(componentPath, 'utf8');
const failures = [];
const approx = (a, b, tolerance = 0.0002) => Math.abs(a - b) <= tolerance;
const check = (condition, message) => { if (!condition) failures.push(message); };

check(approx(data.canonical.revenue, 82.5138), 'canonical revenue');
check(approx(data.canonical.grossProfit, 26.9150), 'canonical gross profit');
check(approx(data.canonical.cogs, data.canonical.revenue - data.canonical.grossProfit), 'COGS derivation');
check(approx(data.canonical.ebitdaProxy, data.canonical.grossProfit - data.canonical.opex, 0.0002), 'gross profit - OPEX = EBITDA proxy');
check(data.monthly.length === 12, '12 FY2025 monthly rows');
const pvmTotals = Object.fromEntries(data.pvm.flatMap((row) => row.components).reduce((map, component) => map.set(component.component, (map.get(component.component) ?? 0) + component.amount), new Map()));
check(['PRICE', 'VOLUME', 'MIX_RESIDUAL', 'NEW_DISCONTINUED', 'GTN_LEAKAGE'].every((key) => pvmTotals[key] !== undefined), 'PVM component coverage');
const pvmDelta = data.pvm.reduce((sum, row) => sum + row.delta, 0) - Object.values(pvmTotals).reduce((sum, value) => sum + value, 0);
check(Math.abs(pvmDelta) < 0.001, 'PVM bridge reconciliation');
check(component.includes('Actual (Simulated)'), 'controlled Actual wording');
check(component.includes('EBITDA Proxy is a management measure, not statutory EBITDA.'), 'proxy disclaimer');
check(component.includes('PENDING_EXTERNAL_INPUT'), 'Gate A boundary');
check(!/Power\s*BI/i.test(component), 'no active Power BI reference');
check(component.includes('Contribution is shown as a parallel commercial lens') || component.includes('parallel commercial lens'), 'parallel contribution lens');

console.log(`PAGE_2_DATA_QA = ${failures.length ? 'FAIL' : 'PASS'}`);
console.log(`OPEX_RECONCILIATION_GATE = ${data.opexControls.status}`);
console.log(`OPEX detail=${data.opexControls.detailTotal.toFixed(4)} vs canonical=${data.opexControls.canonicalTotal.toFixed(4)} (delta=${data.opexControls.reconciliationDelta.toFixed(4)} VND bn)`);
if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exitCode = 1;
}
