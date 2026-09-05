#!/usr/bin/env node
import fs from 'node:fs';
const root = process.cwd();
const snap = JSON.parse(fs.readFileSync(`${root}/data/governance/recruiter_metric_snapshot.json`, 'utf8'));
const p10 = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page10-dashboard.json`, 'utf8'));
const p8 = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page8-forecast.json`, 'utf8'));
const failures = [];
if (p10.base.revenue !== snap.scenarios.BASE.REV_NET.value || p10.base.ebitdaProxy !== snap.scenarios.BASE.EBITDA_PROXY.value) failures.push('canonical Base mismatch');
if (p8.gateA.status !== 'OPEN' || p8.gateA.liveAccuracyClaimAllowed) failures.push('Gate A status');
if (p8.liquidity.status !== 'WITHHELD_PENDING_OPENING_STATE_RECONCILIATION') failures.push('cash contradiction');
if (failures.length) { console.error(failures.join('\n')); process.exit(1); }
console.log('PASS: recruiter-site finance cross-page gate');
