#!/usr/bin/env node
import fs from 'node:fs';
const root = process.cwd();
const d = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page2-performance.json`, 'utf8'));
const actual = d.totals;
const ebitda = Number(actual.actualGrossProfit) - Number(actual.opexActual);
if (Math.abs(ebitda - 12.13454) > .00001) { console.error(`Actual EBITDA Proxy mismatch: ${ebitda}`); process.exit(1); }
const source = fs.readFileSync(`${root}/site/app/performance-page2.tsx`, 'utf8');
if (!source.includes('actual: annualActual.ebitdaProxy') || !source.includes('annualActual.ebitdaProxy / annualActual.revenue')) { console.error('Page 2 comparator is not Actual-derived'); process.exit(1); }
console.log('PASS: Page 2 Actual EBITDA Proxy semantics');
