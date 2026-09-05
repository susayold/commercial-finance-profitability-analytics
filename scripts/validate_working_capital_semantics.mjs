#!/usr/bin/env node
import fs from 'node:fs';
const root = process.cwd();
const registry = fs.readFileSync(`${root}/data/governance/finance_metric_registry.csv`, 'utf8');
const page7 = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page7-cash-wc.json`, 'utf8'));
if (!registry.includes('DIO_PROXY') || !registry.includes('DPO_PROXY') || !registry.includes('CCC,Cash Conversion Cycle')) process.exit(1);
if (page7.evidence_class !== 'PROXY_DERIVED' || page7.ccc !== page7.dso + page7.dioProxy - page7.dpo) process.exit(1);
console.log('PASS: working-capital proxy semantics and CCC formula');
