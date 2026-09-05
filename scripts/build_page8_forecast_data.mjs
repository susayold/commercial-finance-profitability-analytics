#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const snapshot = JSON.parse(fs.readFileSync(path.join(root, "data/governance/recruiter_metric_snapshot.json"), "utf8"));
const plan = fs.readFileSync(path.join(root, "data/planning/three_year_operating_plan.csv"), "utf8").trim().split(/\r?\n/);
const headers = plan.shift().split(",");
const rows = plan.map(line => Object.fromEntries(line.split(",").map((v,i)=>[headers[i],v])));
const scenario = (name) => { const s = snapshot.scenarios[name]; return { name: name[0] + name.slice(1).toLowerCase(), revenue: s.REV_NET.value, grossProfit: s.GROSS_PROFIT.value, ebitda: s.EBITDA_PROXY.value, margin: s.EBITDA_PROXY_MARGIN.value, contribution: s.CONTRIBUTION.value, ccc: s.CCC.value, evidenceClass: s.REV_NET.evidence_class }; };
const out = {
  currentLanding: { period: "FY2025", scenario: "BASE", ...scenario("BASE") },
  scenarioRange: [scenario("DOWNSIDE"), scenario("BASE"), scenario("UPSIDE")],
  sensitivity: [{label:"Revenue −10%", value:-9},{label:"Revenue +10%",value:6.8},{label:"Gross Margin −1pp",value:-4.1},{label:"Gross Margin +1pp",value:4.3},{label:"OPEX +10%",value:-3.6},{label:"OPEX −10%",value:3.6},{label:"DIO +10 days",value:-0.8},{label:"DSO +10 days",value:-0.6},{label:"DPO +10 days",value:0.4}],
  forecastVersions: [{id:"ACT-2024",type:"Actual",period:"2024",status:"Final",notes:"Historical actuals"},{id:"BUD-2025",type:"Budget",period:"2025",status:"Final",notes:"Synthetic planning baseline"},{id:"LE-2025-09",type:"Latest Est.",period:"2025",status:"Current",notes:"Updated Sep-25"},{id:"PLAN-3Y",type:"3Y Plan",period:"2026–2028",status:"Draft",notes:"Driver-based plan"}],
  longRangeDrivers: [{metric:"Revenue Growth",base:"6.0%",upside:"10.0%",downside:"−2.0%"},{metric:"Gross Margin Δ (pp/year)",base:"+0.5pp",upside:"+1.2pp",downside:"−1.0pp"},{metric:"OPEX Growth",base:"5.0%",upside:"4.5%",downside:"7.0%"},{metric:"DSO (days)",base:"38",upside:"32",downside:"52"},{metric:"DIO (days)",base:"45",upside:"38",downside:"60"},{metric:"DPO (days)",base:"35",upside:"40",downside:"28"},{metric:"Implied CCC (days)",base:"48",upside:"30",downside:"84"}],
  longRangeOutlook: rows.map(r => ({year:r.fiscal_year.replace("FY",""),scenario:r.scenario,revenue:Number(r.revenue_vnd),ebitda:Number(r.ebitda_proxy_vnd),cash:null,cashStatus:r.liquidity_status})),
  planReconciliation: "data/planning/operating_plan_reconciliation.csv",
  gateA: {status:"OPEN", label:"FORECAST ACCURACY REHEARSAL / DEMO", liveAccuracyClaimAllowed:false},
  evidence: "SIMULATED/DERIVED",
  liquidity: {status:"WITHHELD_PENDING_OPENING_STATE_RECONCILIATION", guardrail:8.0, note:"Long-range cash trajectory is withheld until opening cash and debt are linked to the governed planning baseline."}
};
const outPath = path.join(root, "site/data/generated/page8-forecast.json");
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath}`);
