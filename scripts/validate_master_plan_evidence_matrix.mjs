import fs from 'node:fs';
import path from 'node:path';
const p = path.join(process.cwd(), 'data', 'master_plan_evidence_matrix.csv');
const lines = fs.readFileSync(p, 'utf8').trim().split(/\r?\n/);
const parse = (line) => { const out=[]; let cur=''; let quoted=false; for(let i=0;i<line.length;i++){ const c=line[i]; if(c==='"' && line[i+1]==='"'){cur+='"';i++;continue;} if(c==='"'){quoted=!quoted;continue;} if(c===','&&!quoted){out.push(cur);cur='';} else cur+=c;} out.push(cur); return out; };
const headers=parse(lines[0]); const rows=lines.slice(1).map(l=>Object.fromEntries(parse(l).map((v,i)=>[headers[i],v])));
const failures=[]; const ids=new Set();
for(const r of rows){ if(ids.has(r.requirement_id)) failures.push('duplicate id '+r.requirement_id); ids.add(r.requirement_id); if(!r.evidence_artifacts||!r.verification) failures.push('missing evidence '+r.requirement_id); }
const core=rows.filter(r=>r.scope==='mandatory_core');
if(core.length!==20) failures.push('mandatory core count must be 20');
for(const r of core){ if(!['COMPLETE','COMPLETE_WITH_CAVEAT'].includes(r.status)) failures.push('mandatory core not complete '+r.requirement_id); }
for(const id of ['GATE-A','GATE-B']){ const r=rows.find(x=>x.requirement_id===id); if(!r||r.status!=='PENDING_EXTERNAL') failures.push(id+' must remain PENDING_EXTERNAL until external evidence exists'); }
const result={status:failures.length?'FAIL':'PASS',rows:rows.length,mandatory_core:core.length,pending_external:rows.filter(r=>r.status==='PENDING_EXTERNAL').length,failures};
console.log(JSON.stringify(result,null,2)); if(failures.length) process.exit(1);