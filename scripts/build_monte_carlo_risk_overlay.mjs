import fs from "node:fs";
const outPath=process.argv[2]||"data/monte_carlo_risk_overlay_2026-08-30.csv";
let seed=20260830;
const rnd=()=>{seed|=0;seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return ((seed>>>0)+1)/4294967297;};
const norm=()=>{let u=0,v=0;while(u===0)u=rnd();while(v===0)v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
// Centers are the approved FY2025 BASE scenario source of truth (VND bn, %, days).
const N=5000, rows=[]; for(let i=0;i<N;i++) rows.push({revenue:82.5138+3*norm(),ebitda_proxy:12.8956+1.8*norm(),ebitda_margin:15.6284+1.8*norm(),ccc:Math.max(20,54+7*norm())});
const pct=(key,q)=>{const a=rows.map(r=>r[key]).sort((x,y)=>x-y);return a[Math.floor(q*(a.length-1))];};
const defs=[["revenue","VND_bn",76.9,"below"],["ebitda_proxy","VND_bn",3.5,"below"],["ebitda_margin","percent",5,"below"],["ccc","days",68,"above"]];
const lines=["metric,statistic,value,unit,threshold,threshold_direction,simulation_count,seed,evidence_class"];
for(const [key,unit,threshold,dir] of defs){for(const q of [.05,.25,.5,.75,.95]) lines.push([key,"p"+String(q*100).padStart(2,"0"),pct(key,q).toFixed(4),unit,threshold,dir,N,20260830,"SIMULATED_DERIVED"].join(",")); const breach=rows.filter(r=>dir==="below"?r[key]<threshold:r[key]>threshold).length/N; lines.push([key,"probability_breach",breach.toFixed(4),"probability",threshold,dir,N,20260830,"SIMULATED_DERIVED"].join(","));}
const joint=rows.filter(r=>r.revenue<76.9&&r.ebitda_proxy<3.5&&r.ccc>68).length/N; lines.push(["joint_downside","probability_breach",joint.toFixed(4),"probability","revenue<76.9 & EBITDA<3.5 & CCC>68","joint",N,20260830,"SIMULATED_DERIVED"].join(","));
fs.writeFileSync(outPath,lines.join("\n")+"\n");
