import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2] ?? path.join(process.cwd(), 'data', 'pricing_simulator_synthetic.csv');
const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
const parse = (line) => { const out=[]; let cur=''; let quoted=false; for(let i=0;i<line.length;i++){ const c=line[i]; if(c==='"' && line[i+1]==='"'){cur+='"';i++;continue;} if(c==='"'){quoted=!quoted;continue;} if(c===','&&!quoted){out.push(cur);cur='';} else cur+=c; } out.push(cur); return out; };
const headers=parse(lines[0]); const rows=lines.slice(1).map(l=>Object.fromEntries(parse(l).map((v,i)=>[headers[i],v])));
const n=(r,k)=>Number(r[k]); const failures=[];
for(const r of rows){
  const expectedNewPrice=n(r,'baseline_price_vnd')*(1+n(r,'price_change_pct'));
  const expectedVolumeChange=n(r,'elasticity')*n(r,'price_change_pct');
  const expectedUnits=n(r,'baseline_units')*(1+expectedVolumeChange);
  const expectedBase=n(r,'baseline_units')*(n(r,'baseline_price_vnd')-n(r,'unit_cost_vnd'));
  const expectedScenario=expectedUnits*(n(r,'new_price_vnd')-n(r,'unit_cost_vnd'));
  const m=n(r,'baseline_price_vnd')-n(r,'unit_cost_vnd'); const e=n(r,'elasticity');
  const expectedBreakEven=-((m*e)+n(r,'baseline_price_vnd'))/(n(r,'baseline_price_vnd')*e);
  if(Math.abs(n(r,'new_price_vnd')-expectedNewPrice)>0.01) failures.push(`${r.scenario}: new price mismatch`);
  if(Math.abs(n(r,'volume_change_pct')-expectedVolumeChange)>1e-9) failures.push(`${r.scenario}: volume response mismatch`);
  if(Math.abs(n(r,'new_units')-expectedUnits)>0.01) failures.push(`${r.scenario}: units mismatch`);
  if(Math.abs(n(r,'baseline_contribution_vnd')-expectedBase)>1) failures.push(`${r.scenario}: baseline CM mismatch`);
  if(Math.abs(n(r,'scenario_contribution_vnd')-expectedScenario)>1) failures.push(`${r.scenario}: scenario CM mismatch`);
  if(Math.abs(n(r,'contribution_delta_vnd')-(expectedScenario-expectedBase))>1) failures.push(`${r.scenario}: delta mismatch`);
  if(Math.abs(n(r,'break_even_price_change_pct')-expectedBreakEven)>1e-6) failures.push(`${r.scenario}: break-even mismatch`);
}
if(rows.length!==6) failures.push(`expected 6 pricing scenarios, got ${rows.length}`);
const negative=rows.filter(r=>n(r,'contribution_delta_vnd')<0).length;
const result={status:failures.length?'FAIL':'PASS',rows:rows.length,negative_contribution_scenarios:negative,checks:7,failures};
console.log(JSON.stringify(result,null,2)); if(failures.length) process.exit(1);
