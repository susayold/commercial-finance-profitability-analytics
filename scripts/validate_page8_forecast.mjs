#!/usr/bin/env node
import fs from "node:fs";
const root = process.cwd();
const data = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page8-forecast.json`, "utf8"));
const backtest = JSON.parse(fs.readFileSync(`${root}/data/forecast/rolling_origin_revenue_backtest_summary.json`, "utf8"));
const fails = [];
const expect = { Base:[82.5138,12.8956,54], Upside:[85.7182,17.4496,48], Downside:[76.9061,3.4933,68] };
for (const row of data.scenarioRange) { const e = expect[row.name]; if (!e || Math.abs(row.revenue-e[0])>.001 || Math.abs(row.ebitda-e[1])>.001 || row.ccc !== e[2]) fails.push(`${row.name} scenario mismatch`); }
if (data.gateA.status !== "OPEN" || data.gateA.liveAccuracyClaimAllowed) fails.push("Gate A must remain OPEN and blocked");
if (data.liquidity.status !== "WITHHELD_PENDING_OPENING_STATE_RECONCILIATION") fails.push("long-range cash must be withheld");
for (const key of ['sensitivity','forecastVersions','accuracyRehearsal','historicalBacktest','longRangeDrivers','decisionThresholds','longRangeOutlook','planReconciliation']) if (!data[key]) fails.push(`${key} missing from contract`);
if (data.historicalBacktest.status !== 'PASS' || data.historicalBacktest.evidenceClass !== 'SIMULATED_HISTORICAL_BACKTEST' || data.historicalBacktest.liveAccuracyClaimAllowed !== false) fails.push('historical backtest evidence boundary mismatch');
if (data.historicalBacktest.primaryModel !== 'SEASONAL_NAIVE_12' || data.historicalBacktest.originTargetPairs !== 65 || data.historicalBacktest.results.length !== 3) fails.push('historical backtest primary contract mismatch');
for (const expected of [{h:1,n:24,b:0.251,w:1.1734},{h:3,n:22,b:0.1558,w:1.1554},{h:6,n:19,b:0.1125,w:1.1782}]) {
  const row = data.historicalBacktest.results.find((r) => r.horizonMonths === expected.h);
  if (!row || row.eligibleForecasts !== expected.n || Math.abs(row.biasPct-expected.b)>.0002 || Math.abs(row.wapePct-expected.w)>.0002) fails.push(`${expected.h}M OOS metrics mismatch`);
}
if (data.historicalBacktest.approvedClaim !== backtest.approved_claim || data.historicalBacktest.prohibitedClaim !== backtest.prohibited_claim) fails.push('historical backtest claim boundary mismatch');
const src = fs.readFileSync(`${root}/site/app/forecast-page8.tsx`, "utf8");
if (/Board approved/i.test(src)) fails.push("Board approved wording remains");
if (!/Synthetic planning baseline/i.test(src) && !data.forecastVersions.some((r) => /Synthetic planning baseline/i.test(r.notes))) fails.push("synthetic baseline wording missing");
if (!/SIMULATED_HISTORICAL_BACKTEST/.test(src)) fails.push('Page 8 does not surface historical evidence class');
if (!/Live Accuracy Gate/.test(src) || !/OPEN/.test(src)) fails.push('Page 8 live Gate A boundary is not visible');
if (/Lowest WAPE in demo fixture/i.test(src)) fails.push('Page 8 still presents demo fixture as primary accuracy evidence');
for (const key of ['sensitivity','vintages','drivers','decisions']) if (new RegExp(`const ${key}\\s*=\\s*\\[`,'m').test(src)) fails.push(`${key} still hard-coded in TSX`);
if (!data.longRangeOutlook.every(r => r.cash === null)) fails.push('long-range cash is not withheld');
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("PASS: Page 8 scenarios, OOS backtest, live Gate A and liquidity boundary");
