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
  return {header,rows:rows.filter(r=>r.some(x=>x!=="")).map(r=>Object.fromEntries(header.map((h,i)=>[h,(r[i]??"").trim()])))};
}
const [inputPath, reportPath, ...flags]=process.argv.slice(2);
if(!inputPath||!reportPath) throw new Error("Usage: node validate_gate_a_intake_contract.mjs input.csv report.md [--mode=template|fixture|live]");
const mode=flags.find(x=>x.startsWith("--mode="))?.split("=")[1]||"template";
const {header,rows}=parseCsv(fs.readFileSync(inputPath,"utf8"));
const required=["snapshot_id","forecast_version_id","source_model_version","forecast_created_at","forecast_cutoff_at","actual_period_close_date","actual_available_at","snapshot_status","evidence_class","company_id","brand_id","channel_id","target_period","forecast_revenue_vnd","actual_revenue_vnd","approver_name","approver_role","approval_reference","source_system","source_export_uri","actuals_source_uri","gate_a_eligible","exclusion_reason","mapping_note","sha256"];
const checks=[]; const add=(name,pass,detail)=>checks.push({name,pass:Boolean(pass),detail:String(detail)});
add("Required headers",required.every(h=>header.includes(h)),"missing="+required.filter(h=>!header.includes(h)).join("|"));
if(mode==="template"){
  add("Template has no data rows",rows.length===0,"rows="+rows.length);
} else {
  add("Non-empty submission",rows.length>0,"rows="+rows.length);
  const keys=rows.map(r=>[r.snapshot_id,r.forecast_version_id,r.target_period,r.company_id,r.brand_id,r.channel_id].join("|"));
  add("Unique snapshot grain",new Set(keys).size===keys.length,"duplicates="+(keys.length-new Set(keys).size));
  const parseDate=v=>{const d=new Date(v);return v&&!Number.isNaN(d.getTime())?d:null};
  const validMonth=v=>/^\d{4}-(0[1-9]|1[0-2])$/.test(v||"");
  add("Date, month and numeric types",rows.every(r=>parseDate(r.forecast_created_at)&&parseDate(r.forecast_cutoff_at)&&parseDate(r.actual_available_at)&&parseDate(r.actual_period_close_date)&&validMonth(r.target_period)&&Number.isFinite(Number(r.forecast_revenue_vnd))&&Number.isFinite(Number(r.actual_revenue_vnd))),"invalid="+rows.filter(r=>!(parseDate(r.forecast_created_at)&&parseDate(r.forecast_cutoff_at)&&parseDate(r.actual_available_at)&&parseDate(r.actual_period_close_date)&&validMonth(r.target_period))).length);
  add("Allowed statuses",rows.every(r=>["DRAFT","FROZEN","SUPERSEDED"].includes(r.snapshot_status)&&["LIVE_INTERNAL","SIMULATED","DEMO_FIXTURE_ONLY"].includes(r.evidence_class)&&["YES","NO"].includes(r.gate_a_eligible)),"invalid="+rows.filter(r=>!["DRAFT","FROZEN","SUPERSEDED"].includes(r.snapshot_status)||!["LIVE_INTERNAL","SIMULATED","DEMO_FIXTURE_ONLY"].includes(r.evidence_class)||!["YES","NO"].includes(r.gate_a_eligible)).length);
  add("Governance fields populated",rows.every(r=>[r.snapshot_id,r.forecast_version_id,r.source_model_version,r.approver_name,r.approver_role,r.approval_reference,r.source_system,r.source_export_uri,r.actuals_source_uri,r.mapping_note,r.sha256].every(Boolean)),"violations="+rows.filter(r=>![r.snapshot_id,r.forecast_version_id,r.source_model_version,r.approver_name,r.approver_role,r.approval_reference,r.source_system,r.source_export_uri,r.actuals_source_uri,r.mapping_note,r.sha256].every(Boolean)).length);
  add("SHA-256 format",rows.every(r=>/^[A-Fa-f0-9]{64}$/.test(r.sha256)),"invalid="+rows.filter(r=>!/^[A-Fa-f0-9]{64}$/.test(r.sha256)).length);
  add("Date order",rows.every(r=>{const c=new Date(r.forecast_created_at),cut=new Date(r.forecast_cutoff_at),close=new Date(r.actual_period_close_date+"T23:59:59Z"),av=new Date(r.actual_available_at);return c<=cut&&cut<close&&cut<av}),"violations="+rows.filter(r=>{const c=new Date(r.forecast_created_at),cut=new Date(r.forecast_cutoff_at),close=new Date(r.actual_period_close_date+"T23:59:59Z"),av=new Date(r.actual_available_at);return !(c<=cut&&cut<close&&cut<av)}).length);
  const expected=r=>r.snapshot_status==="FROZEN"&&r.evidence_class==="LIVE_INTERNAL"&&/^https?:/i.test(r.source_export_uri)&&/^https?:/i.test(r.actuals_source_uri)?"YES":"NO";
  add("Eligibility recomputation",rows.every(r=>r.gate_a_eligible===expected(r)),"mismatches="+rows.filter(r=>r.gate_a_eligible!==expected(r)).length);
  add("Non-eligible rows documented",rows.filter(r=>r.gate_a_eligible==="NO").every(r=>r.exclusion_reason.length>0),"undocumented="+rows.filter(r=>r.gate_a_eligible==="NO"&&!r.exclusion_reason).length);
  if(mode==="live"){
    add("Live evidence class",rows.filter(r=>r.gate_a_eligible==="YES").every(r=>r.evidence_class==="LIVE_INTERNAL"),"non_live="+rows.filter(r=>r.gate_a_eligible==="YES"&&r.evidence_class!=="LIVE_INTERNAL").length);
    add("Live source URIs",rows.filter(r=>r.gate_a_eligible==="YES").every(r=>/^https?:/i.test(r.source_export_uri)&&/^https?:/i.test(r.actuals_source_uri)),"invalid="+rows.filter(r=>r.gate_a_eligible==="YES"&&(!/^https?:/i.test(r.source_export_uri)||!/^https?:/i.test(r.actuals_source_uri))).length);
    add("At least one eligible live row",rows.some(r=>r.gate_a_eligible==="YES"),"eligible="+rows.filter(r=>r.gate_a_eligible==="YES").length);
  } else {
    add("Fixture is not live-labelled",rows.every(r=>r.evidence_class!=="LIVE_INTERNAL"&&r.gate_a_eligible!=="YES"),"live_rows="+rows.filter(r=>r.evidence_class==="LIVE_INTERNAL"||r.gate_a_eligible==="YES").length);
  }
}
const passed=checks.filter(c=>c.pass).length;
const status=passed===checks.length?(mode==="live"?"LIVE_OBSERVED_READY":mode==="fixture"?"FIXTURE_PASS_NOT_LIVE":"INTAKE_TEMPLATE_PASS"):"FAIL";
const lines=["# Gate A Intake Contract QA","","Mode: "+mode.toUpperCase()+"  ","Release status: **"+status+"**  ","","**Checks: "+passed+"/"+checks.length+" passed**  ","","| Check | Status | Detail |","|---|---|---|",...checks.map(c=>"| "+c.name+" | "+(c.pass?"PASS":"FAIL")+" | "+c.detail.replace(/\|/g,"\\|")+" |"),"","Release boundary: LIVE_OBSERVED_READY requires approved LIVE_INTERNAL evidence, pre-close cutoff, closed actuals, HTTPS source URIs and a non-empty eligible set. Synthetic rows remain fixture evidence."];
fs.writeFileSync(reportPath,lines.join("\n")+"\n","utf8");
console.error(JSON.stringify({mode,status,rows:rows.length,checks:checks.length,passed}));
if(passed!==checks.length)process.exit(1);
