import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const forecastPath = path.join(root, 'data', 'mna_accretion_dilution_synthetic.csv');
const sensitivityPath = path.join(root, 'data', 'mna_accretion_dilution_sensitivity.csv');
const parseCsv = (p) => {
  const lines = fs.readFileSync(p, 'utf8').trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, Number(values[i])]));
  });
};
const f = parseCsv(forecastPath);
const s = parseCsv(sensitivityPath);
const failures = [];
const approx = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
if (f.length !== 5) failures.push('forecast must contain exactly five years');
if (s.length !== 12) failures.push('sensitivity must contain exactly 12 cells');
if (!f.every((r, i) => r.year === i + 1)) failures.push('forecast years must be 1..5');
for (const r of f) {
  const expectedEbit = r.target_ebitda_vnd_bn - r.target_da_vnd_bn;
  const expectedSynEbit = r.revenue_synergy_vnd_bn * 0.35;
  const expectedIncrementalEbit = expectedEbit + expectedSynEbit + r.cost_synergy_vnd_bn - r.integration_cost_vnd_bn;
  const expectedIncrementalNi = (expectedIncrementalEbit - r.incremental_interest_vnd_bn) * 0.8;
  const expectedCombinedNi = r.acquirer_standalone_ni_vnd_bn + expectedIncrementalNi;
  const expectedProEps = expectedCombinedNi / 120 * 1000;
  const expectedAccretion = expectedProEps / r.standalone_eps_vnd - 1;
  if (!approx(r.target_ebit_vnd_bn, expectedEbit)) failures.push(`year ${r.year}: target EBIT arithmetic`);
  if (!approx(r.revenue_synergy_ebit_vnd_bn, expectedSynEbit)) failures.push(`year ${r.year}: revenue synergy EBIT arithmetic`);
  if (!approx(r.incremental_ebit_vnd_bn, expectedIncrementalEbit)) failures.push(`year ${r.year}: incremental EBIT arithmetic`);
  if (!approx(r.incremental_ni_vnd_bn, expectedIncrementalNi)) failures.push(`year ${r.year}: incremental NI arithmetic`);
  if (!approx(r.pro_forma_ni_vnd_bn, expectedCombinedNi)) failures.push(`year ${r.year}: pro-forma NI arithmetic`);
  if (!approx(r.pro_forma_eps_vnd, expectedProEps)) failures.push(`year ${r.year}: pro-forma EPS arithmetic`);
  if (!approx(r.eps_accretion_pct, expectedAccretion)) failures.push(`year ${r.year}: EPS accretion arithmetic`);
}
if (f[0].eps_accretion_pct >= 0) failures.push('Year 1 should remain dilutive under the base integration-cost case');
if (f[1].eps_accretion_pct <= 0) failures.push('Year 2 should be accretive in the base case');
if (!approx(f[1].eps_accretion_pct, 0.17159694, 1e-5)) failures.push('Year 2 accretion does not match expected base case');
if (!approx(f[4].incremental_fcff_vnd_bn, 5.82041272, 1e-5)) failures.push('Year 5 FCFF does not match expected base case');
const pvFcf = f.reduce((sum, r) => sum + r.pv_incremental_fcff_vnd_bn, 0);
const terminalValue = f[4].incremental_fcff_vnd_bn * 1.025 / (0.105 - 0.025);
const pvTerminal = terminalValue / Math.pow(1.105, 5);
const npv = pvFcf + pvTerminal - 30.6;
if (!approx(npv, 28.38906474, 1e-5)) failures.push(`NPV expected 28.38906474, got ${npv}`);
for (const r of s) {
  if (r.entry_multiple_x < 7 || r.entry_multiple_x > 10) failures.push('sensitivity entry multiple outside declared range');
  if (r.synergy_realization_x < 0.5 || r.synergy_realization_x > 1.25) failures.push('sensitivity synergy realization outside declared range');
}
const minNpv = Math.min(...s.map(r => r.deal_npv_vnd_bn));
if (minNpv <= 0) failures.push('declared sensitivity grid should remain NPV-positive for the synthetic screen');
const result = { status: failures.length ? 'FAIL' : 'PASS', checks: 10, failures, forecast_rows: f.length, sensitivity_rows: s.length, base_year2_accretion_pct: f[1].eps_accretion_pct, base_npv_vnd_bn: Number(npv.toFixed(8)), sensitivity_min_npv_vnd_bn: minNpv };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);