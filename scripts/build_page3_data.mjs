import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataRoot = path.join(root, 'data');
const readCsv = (file) => {
  const text = fs.readFileSync(path.join(dataRoot, file), 'utf8').trim();
  const [header, ...rows] = text.split(/\r?\n/).map((row) => row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map((v) => v.replace(/^\"|\"$/g, '')));
  return rows.map((row) => Object.fromEntries(header.map((key, i) => [key, row[i] ?? ''])));
};
const n = (v) => Number(v || 0);
const sales = readCsv('finance_model/final_v1/fact_sales.csv').filter((r) => r.MonthStart.startsWith('2025-'));
const channels = readCsv('finance_model/final_v1/dim_channel.csv');
const channelMap = Object.fromEntries(channels.map((r) => [r.ChannelKey, r]));
const grouped = Object.values(sales.reduce((acc, row) => {
  const key = row.ChannelKey; const g = acc[key] ??= { channelKey: key, channel: channelMap[key]?.Channel ?? key, grossSales: 0, discount: 0, returns: 0, rebates: 0, voucherSupport: 0, netRevenue: 0, cogs: 0, channelFee: 0, tradeSpend: 0, variableFulfilment: 0, contribution: 0 };
  for (const [field, col] of Object.entries({ grossSales: 'GrossSalesVND', discount: 'DiscountVND', returns: 'ReturnsVND', rebates: 'RebatesVND', voucherSupport: 'VoucherSupportVND', netRevenue: 'NetRevenueVND', cogs: 'CorrectedCOGSVND', channelFee: 'AllocatedChannelFeeVND', tradeSpend: 'AllocatedTradeSpendVND', variableFulfilment: 'AllocatedVariableFulfilmentVND', contribution: 'ContributionProfitVND' })) g[field] += n(row[col]) / 1e9;
  return acc;
}, {})).map((g) => ({ ...g, gtnLeakage: g.discount + g.returns + g.rebates + g.voucherSupport, gtnRate: (g.discount + g.returns + g.rebates + g.voucherSupport) / g.grossSales * 100, cm: g.contribution / g.netRevenue * 100, feeRate: n(channelMap[g.channelKey]?.FeeRate) * 100, terms: n(channelMap[g.channelKey]?.PaymentTermsDays), hurdle: n(channelMap[g.channelKey]?.CMHurdle) * 100, reconciliationDelta: g.netRevenue - g.cogs - g.channelFee - g.tradeSpend - g.variableFulfilment - g.contribution }));
const promotions = readCsv('promotion_roi_synthetic.csv').map((r) => ({ event: r.event.split(' ')[0], name: r.event.replace(/^\S+\s*/, ''), channel: channelMap[r.channel]?.Channel ?? r.channel, spend: n(r.promotion_spend_vnd) / 1e9, incrementalRevenue: n(r.incremental_revenue_vnd) / 1e9, incrementalContribution: n(r.incremental_cm_after_spend_vnd) / 1e9, roi: n(r.roi_on_spend) * 100, decision: r.decision, evidence: r.evidence_class }));
const pricing = readCsv('finance_model/final_v1/fact_pricing_case.csv').map((r) => ({ id: r.PricingCaseKey, name: r.PricingCase, channel: channelMap[r.ChannelKey]?.Channel ?? r.ChannelKey, priceChange: n(r.PriceChangePct) * 100, volumeChange: n(r.VolumeChangePct) * 100, elasticity: n(r.Elasticity), contributionDelta: n(r.ContributionDeltaVND) / 1e9, breakEven: n(r.BreakEvenPriceChangePct) * 100 }));
const budget = readCsv('budget_reallocation_synthetic.csv').map((r) => ({ channel: r.channel, current: n(r.current_budget_vnd) / 1e9, recommended: n(r.recommended_budget_vnd) / 1e9, delta: n(r.budget_delta_vnd) / 1e9, marginalRoi: n(r.marginal_roi) * 100, incrementalContribution: n(r.incremental_contribution_vnd) / 1e9, decision: r.decision }));
const pvmRows = readCsv('finance_model/final_v1/fact_pvm_bridge.csv').filter((r) => r.MonthStart.startsWith('2025-'));
const pvm = Object.values(pvmRows.reduce((acc, r) => { const key = `${r.SKUKey}|${r.ChannelKey}|${r.MonthStart}|${r.Component}`; const g = acc[key] ??= { channel: channelMap[r.ChannelKey]?.Channel ?? r.ChannelKey, component: r.Component, amount: 0 }; g.amount += n(r.AmountVND) / 1e9; return acc; }, {}));
const pvmByComponent = Object.values(pvm.reduce((acc, r) => { const g = acc[r.component] ??= { component: r.component, amount: 0 }; g.amount += r.amount; return acc; }, {}));
const revenue = grouped.reduce((s, r) => s + r.netRevenue, 0); const contribution = grouped.reduce((s, r) => s + r.contribution, 0);
const output = { period: 'FY2025', currency: 'VND bn', channels: grouped, promotions, pricing, budget, pvm: pvmByComponent, canonical: { revenue: 82.5138, contribution: 24.2074, contributionMargin: 24.2074 / 82.5138 * 100, hurdle: 25, budgetEnvelope: 4.35 }, totals: { revenue, contribution, gtnLeakage: grouped.reduce((s, r) => s + r.gtnLeakage, 0), grossSales: grouped.reduce((s, r) => s + r.grossSales, 0) }, sourceFiles: ['fact_sales.csv', 'dim_channel.csv', 'fact_pvm_bridge.csv', 'promotion_roi_synthetic.csv', 'fact_pricing_case.csv', 'budget_reallocation_synthetic.csv'] };
fs.mkdirSync(path.join(root, 'site', 'data', 'generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'site', 'data', 'generated', 'page3-commercial.json'), JSON.stringify(output, null, 2));
console.log(`Page 3 data built: ${grouped.length} channels, ${promotions.length} promotion cases, ${pricing.length} pricing tests`);
