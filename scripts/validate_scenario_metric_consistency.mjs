#!/usr/bin/env node
/** Validate scenario arithmetic and source alignment for non-PBI artifacts. */
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const p=process.argv[2]||path.join(root,'data','scenarios','scenario_summary.csv');
function csv(t){const ls=t.trim().split(/\r?\n/);const h=ls.shift().split(',');return ls.map(l=>{const a=l.split(',');return Object.fromEntries(h.map((x,i)=>[x,a[i]??'']))})}
const rows=csv(fs.readFileSync(p,'utf8')); const fail=[]; const checks=[]; const add=(id,name,ok,detail)=>{checks.push({id,name,status:ok?'PASS':'FAIL',detail});if(!ok)fail.push(id)}; const n=(r,k)=>Number(r[k]);
add('SC-01','Three approved scenarios present',new Set(rows.map(r=>r.scenario)).size===3,rows.map(r=>r.scenario).join(','));
for(const r of rows){add(`SC-${r.scenario}-01`,`${r.scenario} EBITDA proxy identity`,Math.abs(n(r,'ebitda_proxy_vnd_bn')-(n(r,'gross_profit_vnd_bn')-n(r,'opex_vnd_bn'))) < .01,`EBITDA=${r.ebitda_proxy_vnd_bn}; GP-OPEX=${(n(r,'gross_profit_vnd_bn')-n(r,'opex_vnd_bn')).toFixed(4)}`);add(`SC-${r.scenario}-02`,`${r.scenario} margin identity`,Math.abs(n(r,'ebitda_proxy_margin_pct')-100*n(r,'ebitda_proxy_vnd_bn')/n(r,'revenue_vnd_bn')) < .01,`margin=${r.ebitda_proxy_margin_pct}%`);}
const b=rows.find(r=>r.scenario==='BASE'),u=rows.find(r=>r.scenario==='UPSIDE'),d=rows.find(r=>r.scenario==='DOWNSIDE');
add('SC-04','Upside revenue and EBITDA exceed downside',n(u,'revenue_vnd_bn')>n(d,'revenue_vnd_bn')&&n(u,'ebitda_proxy_vnd_bn')>n(d,'ebitda_proxy_vnd_bn'),`${u?.revenue_vnd_bn}/${d?.revenue_vnd_bn}; ${u?.ebitda_proxy_vnd_bn}/${d?.ebitda_proxy_vnd_bn}`);
add('SC-05','Downside CCC exceeds base and upside is lower',n(d,'ccc_days')>n(b,'ccc_days')&&n(u,'ccc_days')<n(b,'ccc_days'),`${u?.ccc_days}/${b?.ccc_days}/${d?.ccc_days}`);
add('SC-06','All rows labelled proxy-derived',rows.every(r=>r.evidence_class==='PROXY_DERIVED'),'evidence_class');
console.log(JSON.stringify({status:fail.length?'FAIL':'PASS',checks},null,2)); if(fail.length)process.exit(1);
