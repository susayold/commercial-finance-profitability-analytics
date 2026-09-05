#!/usr/bin/env node
import fs from 'node:fs';
const root = process.cwd();
const d = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page10-dashboard.json`, 'utf8'));
const fail = (m) => { console.error(m); process.exit(1); };
if (d.base.revenue !== 82.5138 || d.base.ebitdaProxy !== 12.8956 || d.base.ccc !== 54) fail('Page 10 canonical Base mismatch');
if (!d.sources || d.sources.plan.source_page !== 'Page 8' || d.cashRoute !== '#cash') fail('Page 10 source/route contract mismatch');
if (!d.planStatus || d.planStatus.status !== 'WITHHELD_PENDING_OPENING_STATE_RECONCILIATION') fail('Page 10 cash plan status not withheld');
console.log('PASS: Page 10 synthesis contract');
