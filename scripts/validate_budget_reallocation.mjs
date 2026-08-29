import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2] ?? path.join(process.cwd(), 'data', 'budget_reallocation_synthetic.csv');
const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
const parse = (line) => { const out=[]; let cur=''; let quoted=false; for(let i=0;i<line.length;i++){ const c=line[i]; if(c==='"' && line[i+1]==='"'){cur+='"';i++;continue;} if(c==='"'){quoted=!quoted;continue;} if(c===','&&!quoted){out.push(cur);cur='';} else cur+=c; } out.push(cur); return out; };
const headers=parse(lines[0]); const rows=lines.slice(1).map(l=>Object.fromEntries(parse(l).map((v,i)=>[headers[i],v])));
const n=(r,k)=>Number(r[k]); const failures=[];
const oldTotal=rows.reduce((s,r)=>s+n(r,'current_budget_vnd'),0); const newTotal=rows.reduce((s,r)=>s+n(r,'recommended_budget_vnd'),0);
if(Math.abs(oldTotal-newTotal)>1) failures.push(`fixed-budget conservation failed: ${oldTotal} vs ${newTotal}`);
for(const r of rows){
  if(n(r,'recommended_budget_vnd')>n(r,'capacity_vnd')+1) failures.push(`${r.channel}: capacity exceeded`);
  if(n(r,'recommended_budget_vnd')>n(r,'current_budget_vnd')*(1+n(r,'max_increase_pct'))+1) failures.push(`${r.channel}: max-increase cap exceeded`);
  const expectedDelta=n(r,'recommended_budget_vnd')-n(r,'current_budget_vnd');
  const expectedContribution=expectedDelta*n(r,'marginal_roi');
  if(Math.abs(n(r,'budget_delta_vnd')-expectedDelta)>1) failures.push(`${r.channel}: delta mismatch`);
  if(Math.abs(n(r,'incremental_contribution_vnd')-expectedContribution)>1) failures.push(`${r.channel}: contribution mismatch`);
}
if(rows.length!==5) failures.push(`expected 5 channels, got ${rows.length}`);
const result={status:failures.length?'FAIL':'PASS',rows:rows.length,old_budget_vnd:oldTotal,new_budget_vnd:newTotal,net_incremental_contribution_vnd:rows.reduce((s,r)=>s+n(r,'incremental_contribution_vnd'),0),checks:6,failures};
console.log(JSON.stringify(result,null,2)); if(failures.length) process.exit(1);
