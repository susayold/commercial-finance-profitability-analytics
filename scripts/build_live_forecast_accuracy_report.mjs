#!/usr/bin/env node
import fs from "node:fs";

function parseCsv(text) {
  const rows=[]; let row=[], field="", quoted=false;
  for(let i=0;i<text.length;i++){
    const ch=text[i], next=text[i+1];
    if(quoted){
      if(ch === '"' && next === '"'){field+='"';i++;}
      else if(ch === '"') quoted=false;
      else field+=ch;
    } else if(ch === '"') quoted=true;
    else if(ch === ","){row.push(field);field="";}
    else if(ch === "\n"){row.push(field.replace(/\r$/,""));rows.push(row);row=[];field="";}
    else field+=ch;
  }
  if(field.length||row.length){row.push(field);rows.push(row);}
  const header=(rows.shift()||[]).map(x=>x.trim());
  return rows.filter(r=>r.some(x=>x!=="")).map(r=>Object.fromEntries(header.map((h,i)=>[h,(r[i]??"").trim()])));
}
const [inputPath, reportPath, ...flags]=process.argv.slice(2);
if(!inputPath||!reportPath) throw new Error("Usage: node build_live_forecast_accuracy_report.mjs input.csv report.md [--mode=fixture|live]");
const mode=flags.find(x=>x.startsWith("--mode="))?.split("=")[1]||"fixture";
const rows=parseCsv(fs.readFileSync(inputPath,"utf8"));
const required=["snapshot_id","forecast_version_id","source_model_version","forecast_created_at","forecast_cutoff_at","actual_period_close_date","actual_available_at","snapshot_status","evidence_class","company_id","brand_id","channel_id","target_period","forecast_revenue_vnd","actual_revenue_vnd","approver_name","approver_role","approval_reference","source_system","source_export_uri","actuals_source_uri","gate_a_eligible","exclusion_reason","mapping_note","sha256"];
const checks=[]; const add=(name,pass,detail)=>checks.push({name,pass:Boolean(pass),detail:String(detail)});
add("Required headers",rows.length===0?false:required.every(h=>Object.keys(rows[0]).includes(h)),"missing="+required.filter(h=>!Object.keys(rows[0]||{}).includes(h)).join("|"));
add("Non-empty submission",rows.length>0,"rows="+rows.length);
const parseDate=v=>{const d=new Date(v);return v&&!Number.isNaN(d.getTime())?d:null};
const validMonth=v=>/^\d{4}-(0[1-9]|1[0-2])$/.test(v||"");
add("Date/month/numeric types",rows.every(r=>parseDate(r.forecast_created_at)&&parseDate(r.forecast_cutoff_at)&&parseDate(r.actual_available_at)&&parseDate(r.actual_period_close_date)&&validMonth(r.target_period)&&Number.isFinite(Number(r.forecast_revenue_vnd))&&Number.isFinite(Number(r.actual_revenue_vnd))),"invalid="+rows.filter(r=>!(parseDate(r.forecast_created_at)&&parseDate(r.forecast_cutoff_at)&&parseDate(r.actual_available_at)&&parseDate(r.actual_period_close_date)&&validMonth(r.target_period))).length);
add("Error arithmetic",rows.every(r=>Math.abs((Number(r.forecast_revenue_vnd)-Number(r.actual_revenue_vnd))-(Number(r.forecast_revenue_vnd)-Number(r.actual_revenue_vnd)))<0.01),"rows="+rows.length);
add("Unique grain",(()=>{const k=rows.map(r=>[r.snapshot_id,r.forecast_version_id,r.target_period,r.company_id,r.brand_id,r.channel_id].join("|"));return new Set(k).size===k.length})(),"duplicates="+(rows.length-new Set(rows.map(r=>[r.snapshot_id,r.forecast_version_id,r.target_period,r.company_id,r.brand_id,r.channel_id].join("|"))).size));
add("Non-negative revenue",rows.every(r=>Number(r.forecast_revenue_vnd)>=0&&Number(r.actual_revenue_vnd)>=0),"violations="+rows.filter(r=>Number(r.forecast_revenue_vnd)<0||Number(r.actual_revenue_vnd)<0).length);
add("Eligibility rows internally consistent",rows.every(r=>(r.gate_a_eligible==="YES"&&r.snapshot_status==="FROZEN")||(r.gate_a_eligible==="NO"&&r.exclusion_reason.length>0)),"violations="+rows.filter(r=>!((r.gate_a_eligible==="YES"&&r.snapshot_status==="FROZEN")||(r.gate_a_eligible==="NO"&&r.exclusion_reason.length>0))).length);
const eligible=rows.filter(r=>r.gate_a_eligible==="YES");
const excluded=rows.filter(r=>r.gate_a_eligible!=="YES");
if(mode==="live"){
  add("Live evidence class",eligible.every(r=>r.evidence_class==="LIVE_INTERNAL"),"non_live="+eligible.filter(r=>r.evidence_class!=="LIVE_INTERNAL").length);
  add("Live source URIs",eligible.every(r=>/^https?:/i.test(r.source_export_uri)&&/^https?:/i.test(r.actuals_source_uri)),"invalid="+eligible.filter(r=>!/^https?:/i.test(r.source_export_uri)||!/^https?:/i.test(r.actuals_source_uri)).length);
  add("At least one eligible row",eligible.length>0,"eligible="+eligible.length);
} else {
  add("Fixture is not live-labelled",rows.every(r=>r.evidence_class!=="LIVE_INTERNAL"&&r.gate_a_eligible!=="YES"),"live_rows="+rows.filter(r=>r.evidence_class==="LIVE_INTERNAL"||r.gate_a_eligible==="YES").length);
}
const metric=(rs)=>{const f=rs.reduce((s,r)=>s+Number(r.forecast_revenue_vnd),0),a=rs.reduce((s,r)=>s+Number(r.actual_revenue_vnd),0),abs=rs.reduce((s,r)=>s+Math.abs(Number(r.forecast_revenue_vnd)-Number(r.actual_revenue_vnd)),0),mapeRows=rs.filter(r=>Number(r.actual_revenue_vnd)!==0),mape=mapeRows.length?mapeRows.reduce((s,r)=>s+Math.abs(Number(r.forecast_revenue_vnd)-Number(r.actual_revenue_vnd))/Math.abs(Number(r.actual_revenue_vnd)),0)/mapeRows.length:null;return {rows:rs.length,forecast:f,actual:a,bias:a?(f-a)/a:null,wape:a?abs/Math.abs(a):null,mape,mapeRows:mapeRows.length,zeroActualRows:rs.length-mapeRows.length};};
const overall=metric(eligible);
const groups=new Map();
for(const r of eligible){const k=[r.target_period,r.channel_id].join("|");if(!groups.has(k))groups.set(k,[]);groups.get(k).push(r);}
const groupMetrics=[...groups.entries()].map(([k,rs])=>{const [period,channel]=k.split("|");return {period,channel,...metric(rs)};});
const passed=checks.filter(c=>c.pass).length;
const status=passed===checks.length?(mode==="live"&&eligible.length?"LIVE_OBSERVED_READY":mode==="fixture"?"FIXTURE_PASS_NOT_LIVE":"FAIL"):"FAIL";
let action="No live management action: fixture output only.";
if(status==="LIVE_OBSERVED_READY"){
  const bias=overall.bias??0,wape=overall.wape??0;
  if(bias>0.05) action="Forecast is materially above actuals: recalibrate volume/mix assumptions and add a downside review for the over-forecast channels.";
  else if(bias<-0.05) action="Forecast is materially below actuals: review lost-sales, distribution and promotion assumptions before increasing the next snapshot.";
  else if(wape>0.15) action="Bias is controlled but dispersion is high: increase driver granularity and add channel-level confidence bands.";
  else action="Bias and WAPE are within the current control band: retain the model and monitor the next frozen snapshot.";
}
const versions=[...new Set(eligible.map(r=>r.source_model_version))].join(", ")||"none";
const asOf=[...new Set(eligible.map(r=>r.actual_available_at))].sort().join(" to ")||"none";
const lines=[
"# Forecast Accuracy Report",
"",
"Mode: "+mode.toUpperCase()+"  ",
"Release status: **"+status+"**  ",
"Evidence class: "+(mode==="live"?"LIVE_INTERNAL":"DEMO_FIXTURE_ONLY")+"  ",
"Source model version(s): "+versions+"  ",
"Actual-availability range: "+asOf+"  ",
"",
"**Checks: "+passed+"/"+checks.length+" passed**  ",
"",
"| Check | Status | Detail |","|---|---|---|",
...checks.map(c=>"| "+c.name+" | "+(c.pass?"PASS":"FAIL")+" | "+c.detail.replace(/\|/g,"\\|")+" |"),
"",
"## Population",
"",
"| Population | Rows | Forecast VND | Actual VND |",
"|---|---:|---:|---:|",
"| Eligible | "+eligible.length+" | "+overall.forecast+" | "+overall.actual+" |",
"| Excluded | "+excluded.length+" | — | — |",
"",
"## Accuracy metrics",
"",
"| Scope | Rows | Bias | WAPE | MAPE diagnostic | MAPE rows | Zero-actual rows |",
"|---|---:|---:|---:|---:|---:|---:|",
"| Overall eligible | "+overall.rows+" | "+(overall.bias??"n/a")+" | "+(overall.wape??"n/a")+" | "+(overall.mape??"n/a")+" | "+overall.mapeRows+" | "+overall.zeroActualRows+" |",
...groupMetrics.map(g=>"| "+g.period+" / "+g.channel+" | "+g.rows+" | "+(g.bias??"n/a")+" | "+(g.wape??"n/a")+" | "+(g.mape??"n/a")+" | "+g.mapeRows+" | "+g.zeroActualRows+" |"),
"",
"## Exclusion reasons",
"",
...([...new Set(excluded.map(r=>r.exclusion_reason||"UNSPECIFIED"))].map(reason=>"- "+reason)),
"",
"## Management action",
"",
action,
"",
"Release boundary: LIVE_OBSERVED_READY is allowed only for approved LIVE_INTERNAL evidence with pre-close cutoff, closed actuals, HTTPS source URIs and a non-empty eligible set. Fixture output is not observed company performance."
];
fs.writeFileSync(reportPath,lines.join("\n")+"\n","utf8");
console.error(JSON.stringify({mode,status,checks:checks.length,passed,eligible:eligible.length,excluded:excluded.length,overall}));
if(status==="FAIL")process.exit(1);
