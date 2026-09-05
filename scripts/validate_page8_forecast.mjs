#!/usr/bin/env node
import fs from "node:fs";
const root = process.cwd();
const data = JSON.parse(fs.readFileSync(`${root}/site/data/generated/page8-forecast.json`, "utf8"));
const fails = [];
const expect = { Base:[82.5138,12.8956,54], Upside:[85.7182,17.4496,48], Downside:[76.9061,3.4933,68] };
for (const row of data.scenarioRange) { const e = expect[row.name]; if (!e || Math.abs(row.revenue-e[0])>.001 || Math.abs(row.ebitda-e[1])>.001 || row.ccc !== e[2]) fails.push(`${row.name} scenario mismatch`); }
if (data.gateA.status !== "OPEN" || data.gateA.liveAccuracyClaimAllowed) fails.push("Gate A must remain OPEN and blocked");
if (data.liquidity.status !== "WITHHELD_PENDING_OPENING_STATE_RECONCILIATION") fails.push("long-range cash must be withheld");
const src = fs.readFileSync(`${root}/site/app/forecast-page8.tsx`, "utf8");
if (/Board approved/i.test(src)) fails.push("Board approved wording remains");
if (!/Synthetic planning baseline/i.test(src)) fails.push("synthetic baseline wording missing");
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
console.log("PASS: Page 8 contract, scenarios, Gate A and liquidity boundary");
