#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const snapshotPath = path.join(root, 'data/governance/exported_metric_snapshot.csv');
const snapshot = fs.readFileSync(snapshotPath, 'utf8').trim().split(/\r?\n/).slice(1);
const metric = new Map();
for (const line of snapshot) {
  const [metricId, period, scenario, segment, value] = line.split(',');
  metric.set(`${metricId}|${period}|${scenario}|${segment}`, Number(value));
}
const get = (id, scenario = 'BASE', period = 'FY2025', segment = 'ALL') => metric.get(`${id}|${period}|${scenario}|${segment}`);
const one = (value) => Number(value).toFixed(1);
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const checks = [];
const expectText = (name, relative, needles) => {
  const text = read(relative);
  const missing = needles.filter((needle) => !text.includes(needle));
  checks.push({ name, status: missing.length ? 'FAIL' : 'PASS', missing });
};

expectText('Website reads canonical recruiter snapshot', 'site/app/page.tsx', [
  "import recruiterSnapshot from '../data/recruiter_metric_snapshot.json';",
  "recruiterSnapshot.scenarios[scenario][id].value",
  "revenue: metric('BASE', 'REV_NET')",
  "ebitda: metric('BASE', 'EBITDA_PROXY')",
  "ccc: metric('BASE', 'CCC')",
  "margin: metric('BASE', 'EBITDA_PROXY_MARGIN')",
]);
expectText('Website upside/downside scenarios', 'site/app/page.tsx', [
  "revenue: metric('UPSIDE', 'REV_NET')",
  "revenue: metric('DOWNSIDE', 'REV_NET')",
]);
expectText('MBR scenario table', 'reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md', [
  `| Revenue | ${one(get('REV_NET'))} | ${one(get('REV_NET', 'UPSIDE'))} | ${one(get('REV_NET', 'DOWNSIDE'))}`,
  `| EBITDA proxy | ${one(get('EBITDA_PROXY'))} | ${one(get('EBITDA_PROXY', 'UPSIDE'))} | ${one(get('EBITDA_PROXY', 'DOWNSIDE'))}`,
  `| Cash conversion cycle | ${one(get('CCC'))} | ${one(get('CCC', 'UPSIDE'))} | ${one(get('CCC', 'DOWNSIDE'))}`,
]);
expectText('CFO memo canonical headline', 'docs/CFO_MEMO_V1.md', [
  `${one(get('REV_NET'))}bn`, `${one(get('EBITDA_PROXY'))}bn`, `${one(get('EBITDA_PROXY_MARGIN'))}%`,
]);
expectText('CV evidence values', 'docs/CV_ONE_PAGE_DRAFT.md', [
  `${one(get('REV_NET'))}bn`, `${one(get('EBITDA_PROXY'))}bn`, `${one(get('CCC'))}-day`,
]);
const cv = read('docs/CV_ONE_PAGE_DRAFT.md');
const prohibited = [/production SAP/i, /realized impact/i, /forecast accuracy/i];
checks.push({ name: 'CV claim boundary', status: prohibited.some((pattern) => pattern.test(cv)) ? 'FAIL' : 'PASS', missing: [] });

const failures = checks.filter((check) => check.status === 'FAIL');
const report = {
  status: failures.length ? 'FAIL' : 'PASS',
  generated_at: new Date().toISOString(),
  checks,
  canonical_source: 'data/governance/exported_metric_snapshot.csv',
};
fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports/CROSS_ARTIFACT_FINANCE_CONSISTENCY_2026-08-31.json'), JSON.stringify(report, null, 2));
console.log(`${report.status} cross-artifact checks (${checks.length - failures.length}/${checks.length})`);
if (failures.length) process.exit(1);
