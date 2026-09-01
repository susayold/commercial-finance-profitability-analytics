#!/usr/bin/env node
/** Validate the recruiter-facing management pack without opening PowerPoint. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function ok(id, pass, detail) { checks.push({ id, status: pass ? 'PASS' : 'FAIL', detail }); }

const deck = path.join(root, 'output', 'pptx', 'VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx');
const script = path.join(root, 'docs', 'FINANCE_ANALYST_WALKTHROUGH_SCRIPT_5_MIN.md');
const index = path.join(root, 'reports', 'EXECUTIVE_BOARD_PACK_INDEX_2026-09-01.md');
const required = [
  'reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md',
  'docs/CFO_MEMO_V1.md',
  'reports/MANAGEMENT_RECOMMENDATION_REGISTER_2026-08-30.md',
];

ok('editable_deck_exists', fs.existsSync(deck) && fs.statSync(deck).size > 20000, fs.existsSync(deck) ? `${fs.statSync(deck).size} bytes` : 'missing');
ok('walkthrough_script_exists', fs.existsSync(script), fs.existsSync(script) ? 'present' : 'missing');
if (fs.existsSync(script)) {
  const body = fs.readFileSync(script, 'utf8');
  const timestampCount = (body.match(/\d{2}:\d{2}–\d{2}:\d{2}/g) ?? []).length;
  ok('walkthrough_has_timestamps', timestampCount === 9, `${timestampCount} timed segments`);
  ok('walkthrough_discloses_boundary', /synthetic data/i.test(body) && /Gate A/i.test(body), 'synthetic boundary and Gate A disclosed');
}
ok('board_pack_index_exists', fs.existsSync(index), fs.existsSync(index) ? 'present' : 'missing');
if (fs.existsSync(index)) {
  const body = fs.readFileSync(index, 'utf8');
  ok('board_pack_index_links_core_artifacts', /three_statement|THREE_STATEMENT|three-year|FORECAST_VERSIONING|FMCG_STANDARD_COSTING/i.test(body), 'core evidence links present');
  ok('board_pack_index_excludes_bi_acceptance', /excluded from acceptance/i.test(body) && !/Power BI.*active/i.test(body), 'Power BI is explicitly out of active acceptance');
}
for (const item of required) ok(`required_${item}`, fs.existsSync(path.join(root, item)), fs.existsSync(path.join(root, item)) ? 'present' : 'missing');

const failed = checks.filter((c) => c.status !== 'PASS');
console.log(JSON.stringify({ status: failed.length ? 'FAIL' : 'PASS', checks }, null, 2));
process.exit(failed.length ? 1 : 0);
