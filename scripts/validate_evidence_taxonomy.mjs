#!/usr/bin/env node
import fs from 'node:fs';
const root = process.cwd();
const rows = fs.readFileSync(`${root}/data/finance_model/final_v1/dim_evidence_class.csv`, 'utf8').trim().split(/\r?\n/).slice(1);
const classes = new Set(rows.map(r => r.split(',')[0]));
const required = ['SIMULATED','DERIVED','OBSERVED','ASSUMPTION','PROXY','PROXY_DERIVED','CALCULATED_PUBLIC','SYNTHETIC_REHEARSAL','OPEN_GATE'];
const missing = required.filter(x => !classes.has(x));
if (missing.length) { console.error(`Missing evidence classes: ${missing.join(', ')}`); process.exit(1); }
console.log('PASS: evidence taxonomy complete');
