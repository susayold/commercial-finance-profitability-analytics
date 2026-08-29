import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'data', 'role_alignment_matrix.csv');
const text = fs.readFileSync(file, 'utf8').trim();
const parse = (line) => { const out=[]; let cur=''; let quoted=false; for(let i=0;i<line.length;i++){ const c=line[i]; if(c==='"' && line[i+1]==='"'){cur+='"';i++;continue;} if(c==='"'){quoted=!quoted;continue;} if(c===','&&!quoted){out.push(cur);cur='';} else cur+=c; } out.push(cur); return out; };
const lines = text.split(/\r?\n/); const headers=parse(lines[0]);
const rows=lines.slice(1).map(line=>Object.fromEntries(parse(line).map((v,i)=>[headers[i],v])));
const required=['requirement_id','role_family','priority','requirement','evidence_artifacts','cv_signal','status','next_action'];
const failures=[]; const ids=new Set();
for(const h of required) if(!headers.includes(h)) failures.push(`missing header ${h}`);
for(const r of rows){
  if(ids.has(r.requirement_id)) failures.push(`duplicate id ${r.requirement_id}`); ids.add(r.requirement_id);
  for(const h of required) if(!r[h]) failures.push(`blank ${h} in ${r.requirement_id}`);
  if(!['COMPLETE','COMPLETE_WITH_CAVEAT','PARTIAL','PENDING'].includes(r.status)) failures.push(`invalid status ${r.status}`);
}
for(const role of ['Junior FP&A / Finance Analyst','Business Finance / Commercial Finance Analyst','Finance Data Analyst']) if(!rows.some(r=>r.role_family===role)) failures.push(`missing role ${role}`);
const result={status:failures.length?'FAIL':'PASS',rows:rows.length,complete:rows.filter(r=>r.status==='COMPLETE').length,with_caveat:rows.filter(r=>r.status==='COMPLETE_WITH_CAVEAT').length,partial:rows.filter(r=>r.status==='PARTIAL').length,failures};
console.log(JSON.stringify(result,null,2)); if(failures.length) process.exit(1);
