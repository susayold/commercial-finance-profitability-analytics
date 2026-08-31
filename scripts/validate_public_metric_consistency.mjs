#!/usr/bin/env node
/** Validate one canonical public-company metric dictionary and ROE basis. */
import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd(); const p=process.argv[2]||path.join(root,'data','public_company','mch_financial_metrics_approved.csv'); const d=process.argv[3]||path.join(root,'data','public_company','public_metric_dictionary.csv');
function parse(t){const ls=t.trim().split(/\r?\n/);const h=ls.shift().split(',');return ls.map(x=>{const a=x.split(',');return Object.fromEntries(h.map((k,i)=>[k,a[i]??'']))})}
const r=parse(fs.readFileSync(p,'utf8')), dict=parse(fs.readFileSync(d,'utf8'));const checks=[];const add=(id,name,ok,detail)=>checks.push({id,name,status:ok?'PASS':'FAIL',detail});
add('PUB-01','Metric dictionary includes canonical ROE',dict.some(x=>x.metric_id==='ROE'&&/average equity/i.test(x.denominator_convention||'')&&/PAT \/ average equity/i.test(x.formula||'')),'ROE denominator = average equity attributable to owners');
add('PUB-02','FY2016-FY2025 ROE coverage',new Set(r.filter(x=>x.metric_id==='ROE').map(x=>x.fiscal_year)).size===10,'10 fiscal years');
add('PUB-03','One ROE row per fiscal year',r.filter(x=>x.metric_id==='ROE').length===10,'rows='+r.filter(x=>x.metric_id==='ROE').length);
add('PUB-04','ROE rows are calculated public metrics',r.filter(x=>x.metric_id==='ROE').every(x=>x.calculation_status==='CALCULATED_PUBLIC'&&x.source_status==='APPROVED_COMPARABLE'),'source and calculation status');
add('PUB-05','FY2024 ROE has a single value',new Set(r.filter(x=>x.metric_id==='ROE'&&x.fiscal_year==='2024').map(x=>x.value)).size===1,'FY2024');
add('PUB-06','No same-name metric has multiple units',(()=>{const m=new Map();for(const x of r){const k=x.metric_id+'|'+x.fiscal_year;if(!m.has(k))m.set(k,x.unit);else if(m.get(k)!==x.unit)return false;}return true})(),'metric_id/year unit equality');
console.log(JSON.stringify({status:checks.every(x=>x.status==='PASS')?'PASS':'FAIL',checks},null,2)); if(checks.some(x=>x.status==='FAIL'))process.exit(1);
