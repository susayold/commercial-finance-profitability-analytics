#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const p4 = read('site/data/generated/page4-profitability.json');
const p5 = read('site/data/generated/page5-costing.json');
const p7 = read('site/data/generated/page7-cash-wc.json');
const p8 = read('site/data/generated/page8-forecast.json');
const p9 = read('site/data/generated/page9-evidence.json');
if (p4.scope !== 'CUSTOMER_REHEARSAL' || p4.evidence_class !== 'SYNTHETIC_REHEARSAL') throw new Error('Page 4 customer universe is not isolated');
if (p5.scopeMarker !== 'NOT_CORE_COGS') throw new Error('Page 5 costing is not isolated from core COGS');
if (p7.scope !== 'CORE_WC' || p8.liquidity.guardrail !== 8 || p7.stress.minimumCashBn !== 1.2) throw new Error('Page 7 / Page 8 cash guardrails are mixed');
if (p9.gateA !== 'OPEN' || p9.powerBi !== 'OUT_OF_ACTIVE_SCOPE') throw new Error('Gate A or Power BI scope changed');
console.log('PASS: scope boundaries');
