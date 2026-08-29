import fs from 'node:fs';
import path from 'node:path';

const file = process.argv[2] ?? path.join(process.cwd(), 'data', 'promotion_roi_synthetic.csv');
const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
const parse = (line) => { const out=[]; let cur=''; let quoted=false; for(let i=0;i<line.length;i++){ const c=line[i]; if(c==='"' && line[i+1]==='"'){cur+='"';i++;continue;} if(c==='"'){quoted=!quoted;continue;} if(c===','&&!quoted){out.push(cur);cur='';} else cur+=c; } out.push(cur); return out; };
const headers=parse(lines[0]); const rows=lines.slice(1).map(l=>Object.fromEntries(parse(l).map((v,i)=>[headers[i],v])));
const n=(r,k)=>Number(r[k]); const failures=[];
for(const r of rows){
  const expectedUnits=n(r,'baseline_units')*n(r,'uplift_pct');
  const expectedRevenue=n(r,'incremental_units')*n(r,'net_price_vnd');
  const expectedCm=n(r,'incremental_revenue_vnd')-n(r,'incremental_variable_cost_vnd')-n(r,'promotion_spend_vnd');
  const expectedRoi=expectedCm/n(r,'promotion_spend_vnd');
  if(Math.abs(n(r,'incremental_units')-expectedUnits)>0.01) failures.push(`${r.event}: incremental units mismatch`);
  if(Math.abs(n(r,'incremental_revenue_vnd')-expectedRevenue)>1) failures.push(`${r.event}: revenue mismatch`);
  if(Math.abs(n(r,'incremental_cm_after_spend_vnd')-expectedCm)>1) failures.push(`${r.event}: CM mismatch`);
  if(Math.abs(n(r,'roi_on_spend')-expectedRoi)>1e-6) failures.push(`${r.event}: ROI mismatch`);
  const expectedDecision=expectedRoi>=n(r,'hurdle')?'APPROVE_WITH_GUARDRAIL':'REJECT';
  if(r.decision!==expectedDecision) failures.push(`${r.event}: decision does not respect hurdle`);
}
if(rows.length!==8) failures.push(`expected 8 promotion rows, got ${rows.length}`);
const negative=rows.filter(r=>n(r,'incremental_cm_after_spend_vnd')<0).length;
const result={status:failures.length?'FAIL':'PASS',rows:rows.length,negative_cm_events:negative,checks:5,failures};
console.log(JSON.stringify(result,null,2)); if(failures.length) process.exit(1);
