#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const read = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const d = read('site/data/generated/page10-dashboard.json');
const snapshot = read('data/governance/recruiter_metric_snapshot.json');
const p3 = read('site/data/generated/page3-commercial.json');
const p5 = read('site/data/generated/page5-costing.json');
const p6 = read('site/data/generated/page6-resources.json');
const p7 = read('site/data/generated/page7-cash-wc.json');
const p8 = read('site/data/generated/page8-forecast.json');
const p9 = read('site/data/generated/page9-evidence.json');
const qa = read('reports/RECRUITER_SITE_LINK_QA_FINAL.json');
const fail = (m) => { console.error(`FAIL: ${m}`); process.exit(1); };
const eq = (a, b, label) => { if (Math.abs(Number(a) - Number(b)) > 1e-4) fail(`${label}: ${a} != ${b}`); };
const base = snapshot.scenarios.BASE;
eq(d.base.revenue, base.REV_NET.value, 'P10-01 revenue');
eq(d.base.ebitdaProxy, base.EBITDA_PROXY.value, 'P10-01 EBITDA');
eq(d.base.ccc, base.CCC.value, 'P10-01 CCC');
for (const name of ['Downside', 'Base', 'Upside']) {
  const expected = snapshot.scenarios[name.toUpperCase()];
  const actual = d.scenarios.find((x) => x.name === name);
  if (!actual) fail(`missing ${name} scenario`);
  eq(actual.revenue, expected.REV_NET.value, `scenario ${name} revenue`);
  eq(actual.ebitda, expected.EBITDA_PROXY.value, `scenario ${name} EBITDA`);
}
eq(d.commercial.cases, p3.promotions.length, 'P10-04 commercial cases');
eq(d.commercial.budget, p3.canonical.budgetEnvelope, 'P10-04 commercial budget');
eq(d.commercial.incrementalContribution, p3.budget.reduce((s, x) => s + x.incrementalContribution, 0) * 1000, 'P10-04 contribution');
eq(d.cash.operatingWc, p7.operatingWcBn, 'P10-05 cash operating WC');
eq(d.cash.ar61Plus, p7.ar61PlusBn, 'P10-05 AR 61+');
eq(d.cash.slowInventory, p7.slowInventoryBn, 'P10-05 slow inventory');
eq(d.costResource.costVariance, p5.costVarianceM, 'P10-06 cost variance');
eq(d.costResource.materialShare, p5.materialPriceSharePct, 'P10-06 material share');
eq(d.costResource.opexBridge, p6.opexBridgeM, 'P10-07 OPEX bridge');
eq(d.costResource.capexEnvelope, p6.capexEnvelopeBn, 'P10-07 CAPEX envelope');
const expectedPlan = p8.longRangeOutlook.filter((x) => x.scenario === 'BASE');
if (JSON.stringify(d.plan.map((x) => [x.year, x.revenue, x.ebitda])) !== JSON.stringify(expectedPlan.map((x) => [x.year, x.revenue, x.ebitda]))) fail('P10-08 plan parity');
if (d.plan.some((x) => x.cash !== null) || d.planStatus.status !== 'WITHHELD_PENDING_OPENING_STATE_RECONCILIATION') fail('P10-09/P10-10 long-range cash must be withheld');
for (const key of ['base','performanceTrend','commercial','profitability','costing','resources','cash','plan','controls','actions','linkQA']) if (!d.sources?.[key]) fail(`P10-11 source map missing ${key}`);
const ids = ['REC-04','REC-05','REC-01','REC-06','REC-11'];
if (JSON.stringify(d.actions.map((x) => x.id)) !== JSON.stringify(ids)) fail('P10-12 action IDs/order mismatch');
const csv = fs.readFileSync(path.join(root, 'data/management_recommendation_register_2026-08-30.csv'), 'utf8');
for (const action of d.actions) {
  const line = csv.split(/\r?\n/).find((x) => x.startsWith(`${action.id},`));
  if (!line || !line.includes(`,${action.decision},`) || !line.includes(`,${action.owner},`) || !line.includes(`,${action.guardrail},`)) fail(`P10-13 action wording mismatch ${action.id}`);
}
if (qa.overall_status !== 'PASS' || d.controls.find((x) => x.label === 'Links')?.status === 'HISTORICAL') fail('P10-14/P10-15 link control is not fresh PASS');
if (d.cashRoute !== '#cash') fail('P10-16 cashRoute');
if (p9.gateA !== 'OPEN') fail('P10-17 Gate A must remain OPEN');
if (p9.powerBi !== 'OUT_OF_ACTIVE_SCOPE') fail('P10-18 Power BI scope changed');
console.log('PASS: Page 10 synthesis contract (18 checks)');
