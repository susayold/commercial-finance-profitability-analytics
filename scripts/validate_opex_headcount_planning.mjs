#!/usr/bin/env node
import fs from "node:fs";
function parseCsv(text){const rows=[];let row=[],field="",quoted=false;for(let i=0;i<text.length;i++){const ch=text[i],next=text[i+1];if(quoted){if(ch==='"'&&next==='"'){field+='"';i++;}else if(ch==='"')quoted=false;else field+=ch;}else if(ch==='"')quoted=true;else if(ch===","){row.push(field);field="";}else if(ch==="\n"){row.push(field.replace(/\r$/,""));rows.push(row);row=[];field="";}else field+=ch;}if(field.length||row.length){row.push(field);rows.push(row);}const header=(rows.shift()||[]).map(x=>x.trim());return rows.filter(r=>r.some(x=>x!=="")).map(r=>Object.fromEntries(header.map((h,i)=>[h,(r[i]??"").trim()])));}
const [dataPath="data/opex_headcount_planning_synthetic.csv",reportPath="reports/OPEX_HEADCOUNT_PLANNING_QA.md"]=process.argv.slice(2);
const rows=parseCsv(fs.readFileSync(dataPath,"utf8"));
const req=["period","cost_center","function","headcount_open","hires","exits","headcount_close","avg_headcount","avg_salary_vnd","payroll_vnd","benefits_vnd","bonus_vnd","non_payroll_opex_vnd","opex_actual_vnd","opex_budget_vnd","opex_forecast_vnd","budget_variance_vnd","forecast_variance_vnd","evidence_class","source_system"];
const checks=[];const add=(name,pass,detail)=>checks.push({name,pass:Boolean(pass),detail:String(detail)});
add("Required headers",req.every(h=>Object.keys(rows[0]||{}).includes(h)),"missing="+req.filter(h=>!Object.keys(rows[0]||{}).includes(h)).join("|"));
add("Expected row count",rows.length===9,"rows="+rows.length);
const keys=rows.map(r=>[r.period,r.cost_center].join("|"));
add("Unique cost-center-month grain",new Set(keys).size===keys.length,"duplicates="+(keys.length-new Set(keys).size));
const n=k=>Number(k);
add("Headcount bridge",rows.every(r=>n(r.headcount_close)===n(r.headcount_open)+n(r.hires)-n(r.exits)),"violations="+rows.filter(r=>n(r.headcount_close)!==n(r.headcount_open)+n(r.hires)-n(r.exits)).length);
add("Average headcount",rows.every(r=>Math.abs(n(r.avg_headcount)-((n(r.headcount_open)+n(r.headcount_close))/2))<0.001),"violations="+rows.filter(r=>Math.abs(n(r.avg_headcount)-((n(r.headcount_open)+n(r.headcount_close))/2))>=0.001).length);
add("Payroll arithmetic",rows.every(r=>Math.abs(n(r.payroll_vnd)-n(r.avg_headcount)*n(r.avg_salary_vnd))<0.01),"violations="+rows.filter(r=>Math.abs(n(r.payroll_vnd)-n(r.avg_headcount)*n(r.avg_salary_vnd))>=0.01).length);
add("Benefits assumption",rows.every(r=>Math.abs(n(r.benefits_vnd)-n(r.payroll_vnd)*0.15)<0.01),"violations="+rows.filter(r=>Math.abs(n(r.benefits_vnd)-n(r.payroll_vnd)*0.15)>=0.01).length);
add("Total OPEX arithmetic",rows.every(r=>Math.abs(n(r.opex_actual_vnd)-(n(r.payroll_vnd)+n(r.benefits_vnd)+n(r.bonus_vnd)+n(r.non_payroll_opex_vnd)))<0.01),"violations="+rows.filter(r=>Math.abs(n(r.opex_actual_vnd)-(n(r.payroll_vnd)+n(r.benefits_vnd)+n(r.bonus_vnd)+n(r.non_payroll_opex_vnd)))>=0.01).length);
add("Budget variance",rows.every(r=>Math.abs(n(r.budget_variance_vnd)-(n(r.opex_actual_vnd)-n(r.opex_budget_vnd)))<0.01),"violations="+rows.filter(r=>Math.abs(n(r.budget_variance_vnd)-(n(r.opex_actual_vnd)-n(r.opex_budget_vnd)))>=0.01).length);
add("Forecast variance",rows.every(r=>Math.abs(n(r.forecast_variance_vnd)-(n(r.opex_actual_vnd)-n(r.opex_forecast_vnd)))<0.01),"violations="+rows.filter(r=>Math.abs(n(r.forecast_variance_vnd)-(n(r.opex_actual_vnd)-n(r.opex_forecast_vnd)))>=0.01).length);
add("Non-negative values",rows.every(r=>["headcount_open","hires","exits","headcount_close","avg_headcount","avg_salary_vnd","payroll_vnd","benefits_vnd","bonus_vnd","non_payroll_opex_vnd","opex_actual_vnd","opex_budget_vnd","opex_forecast_vnd"].every(k=>n(r[k])>=0)),"violations="+rows.filter(r=>!["headcount_open","hires","exits","headcount_close","avg_headcount","avg_salary_vnd","payroll_vnd","benefits_vnd","bonus_vnd","non_payroll_opex_vnd","opex_actual_vnd","opex_budget_vnd","opex_forecast_vnd"].every(k=>n(r[k])>=0)).length);
add("Synthetic evidence boundary",rows.every(r=>r.evidence_class==="SIMULATED"&&r.source_system==="synthetic_planning"),"non_synthetic="+rows.filter(r=>r.evidence_class!=="SIMULATED"||r.source_system!=="synthetic_planning").length);
const report=fs.readFileSync(process.argv[3]||"docs/OPEX_HEADCOUNT_PLANNING_MODULE.md","utf8");
add("Report governance detail",report.includes("owner")&&report.includes("guardrail")&&report.includes("Release boundary"),"missing governance text");
const passed=checks.filter(c=>c.pass).length;
const lines=["# OPEX & Headcount Planning QA","","**Overall status: "+(passed===checks.length?"PASS":"FAIL")+" ("+passed+"/"+checks.length+" checks passed)**","","| Check | Status | Detail |","|---|---|---|",...checks.map(c=>"| "+c.name+" | "+(c.pass?"PASS":"FAIL")+" | "+c.detail.replace(/\\|/g,"\\\\|")+" |"),""];
fs.writeFileSync(reportPath,lines.join("\n"),"utf8");
console.log(JSON.stringify({status:passed===checks.length?"PASS":"FAIL",checks:checks.length,passed,rows:rows.length}));
if(passed!==checks.length)process.exit(1);
