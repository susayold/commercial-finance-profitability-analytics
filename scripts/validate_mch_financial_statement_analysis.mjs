import fs from 'node:fs';

const file = process.argv[2] || 'data/mch_financial_statement_analysis_2016_2025.csv';
const text = fs.readFileSync(file, 'utf8').trim();
const lines = text.split(/\r?\n/);
const header = lines.shift().split(',');
const rows = lines.map(line => {
  const parts = line.split(',');
  const row = {};
  header.forEach((h, i) => { row[h] = parts[i] ?? ''; });
  return row;
});
const checks = [];
const pass = (name, ok, detail) => checks.push({name, ok, detail});
const near = (a, b, tol=0.02) => Math.abs(a-b) <= tol;

pass('header', header.length === 15 && header[0] === 'fiscal_year', header.join(','));
pass('row_count', rows.length === 10, String(rows.length));
const years = rows.map(r => Number(r.fiscal_year));
pass('contiguous_years', years.every((y, i) => y === 2016+i), years.join(','));
pass('numeric_fields', rows.every(r => ['net_revenue_vnd_bn','profit_after_tax_vnd_bn','total_assets_vnd_bn','owners_equity_vnd_bn','operating_cash_flow_vnd_bn','net_margin_pct','asset_turnover_x','equity_multiplier_x','dupont_roe_pct','roa_pct','roe_pct','cfo_to_revenue_pct','debt_to_equity_x'].every(k => Number.isFinite(Number(r[k])))), 'numeric parse');
pass('positive_denominators', rows.every(r => Number(r.net_revenue_vnd_bn)>0 && Number(r.total_assets_vnd_bn)>0 && Number(r.owners_equity_vnd_bn)>0), 'revenue/assets/equity > 0');
pass('margin_recompute', rows.every(r => near(Number(r.net_margin_pct), Number(r.profit_after_tax_vnd_bn)/Number(r.net_revenue_vnd_bn)*100)), 'PAT/revenue');
pass('roa_recompute', rows.every((r,i) => { const prev=rows[i-1]; const avg=prev ? (Number(prev.total_assets_vnd_bn)+Number(r.total_assets_vnd_bn))/2 : Number(r.total_assets_vnd_bn); return near(Number(r.roa_pct), Number(r.profit_after_tax_vnd_bn)/avg*100); }), 'PAT/avg assets');
pass('roe_recompute', rows.every((r,i) => { const prev=rows[i-1]; const avg=prev ? (Number(prev.owners_equity_vnd_bn)+Number(r.owners_equity_vnd_bn))/2 : Number(r.owners_equity_vnd_bn); return near(Number(r.roe_pct), Number(r.profit_after_tax_vnd_bn)/avg*100); }), 'PAT/avg equity');
pass('dupont_recompute', rows.every(r => near(Number(r.dupont_roe_pct), Number(r.net_margin_pct)/100*Number(r.asset_turnover_x)*Number(r.equity_multiplier_x)*100)), 'margin × turnover × multiplier');
pass('cash_and_leverage_recompute', rows.every(r => near(Number(r.cfo_to_revenue_pct), Number(r.operating_cash_flow_vnd_bn)/Number(r.net_revenue_vnd_bn)*100) && near(Number(r.debt_to_equity_x), (Number(r.total_assets_vnd_bn)-Number(r.owners_equity_vnd_bn))/Number(r.owners_equity_vnd_bn))), 'CFO/revenue and debt/equity');
pass('provenance_caveat', rows.some(r => r.fiscal_year === '2017' && r.evidence_note.includes('comparative/corresponding')), 'FY2017 caveat present');

const failed = checks.filter(c => !c.ok);
for (const c of checks) console.log((c.ok ? 'PASS' : 'FAIL') + ' ' + c.name + (c.detail ? ' — ' + c.detail : ''));
if (failed.length) process.exit(1);
console.log('PASS: ' + checks.length + ' controls');
