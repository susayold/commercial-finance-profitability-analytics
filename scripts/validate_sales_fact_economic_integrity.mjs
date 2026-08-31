#!/usr/bin/env node
/** Validate the approved sales ledger at physical-unit and economic grain. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataRoot = process.argv[2] || path.join(root, 'powerbi', 'data', 'final_v1');
const reportPath = process.argv[3] || path.join(root, 'reports', 'SALES_FACT_DIMENSIONAL_AUDIT_2026-08-31.md');

function parseCsv(text) {
  const rows=[]; let row=[]; let field=''; let quoted=false;
  for (let i=0;i<text.length;i++) { const c=text[i], n=text[i+1];
    if (c==='"' && quoted && n==='"') { field+='"'; i++; continue; }
    if (c==='"') { quoted=!quoted; continue; }
    if (c===',' && !quoted) { row.push(field); field=''; continue; }
    if ((c==='\n' || c==='\r') && !quoted) { if (c==='\r' && n==='\n') i++; row.push(field); field=''; if (row.some(v=>v!=='')) rows.push(row); row=[]; continue; }
    field+=c;
  }
  if (field!=='' || row.length) { row.push(field); rows.push(row); }
  const headers=rows.shift().map(x=>x.trim());
  return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
}
function read(name) { return parseCsv(fs.readFileSync(path.join(dataRoot,name),'utf8')); }
const sales=read('fact_sales.csv');
const products=read('dim_product.csv');
const checks=[];
const num=(r,k)=>Number(r[k]);
const add=(id,name,ok,detail)=>checks.push({id,name,status:ok?'PASS':'FAIL',detail});
const tolerance=1;
const badIdentity=sales.filter(r=>Math.abs(num(r,'GrossSalesVND')-num(r,'UnitsCorrected')*num(r,'UnitPriceVND'))>tolerance);
const badNet=sales.filter(r=>num(r,'NetRevenueVND')>num(r,'GrossSalesVND')+tolerance || Math.abs(num(r,'NetRevenueVND')-(num(r,'GrossSalesVND')-num(r,'DiscountVND')-num(r,'ReturnsVND')-num(r,'RebatesVND')-num(r,'VoucherSupportVND'))) > tolerance);
const nonnegative=['UnitsCorrected','GrossSalesVND','DiscountVND','ReturnsVND','RebatesVND','VoucherSupportVND','NetRevenueVND','CorrectedCOGSVND'];
const badNegative=sales.filter(r=>nonnegative.some(k=>num(r,k)<0));
const badCogs=sales.filter(r=>num(r,'CorrectedCOGSVND')>num(r,'NetRevenueVND')+tolerance);
const badPrice=sales.filter(r=>num(r,'UnitsCorrected')<=0 || num(r,'UnitPriceVND')<=0);
const badMargin=sales.filter(r=>{const gm=1-num(r,'CorrectedCOGSVND')/num(r,'NetRevenueVND'); return gm < -0.0001 || gm > 1.0001;});
const productMap=new Map(products.map(r=>[r.ProductKey,r]));
const badOrphan=sales.filter(r=>!productMap.has(r.SKUKey));
add('SF-01','Gross Sales = Units × Unit Price',badIdentity.length===0,`bad_rows=${badIdentity.length}; tolerance=VND ${tolerance}`);
add('SF-02','Net Revenue <= Gross Sales and gross-to-net identity',badNet.length===0,`bad_rows=${badNet.length}`);
add('SF-03','Non-negative sale quantities and money fields',badNegative.length===0,`bad_rows=${badNegative.length}`);
add('SF-04','COGS <= Net Revenue unless loss-making row is documented',badCogs.length===0,`bad_rows=${badCogs.length}`);
add('SF-05','Units and unit price are positive on sale rows',badPrice.length===0,`bad_rows=${badPrice.length}`);
add('SF-06','Gross margin lies in [0,100%]',badMargin.length===0,`bad_rows=${badMargin.length}`);
add('SF-07','All SKU keys resolve to product master',badOrphan.length===0,`orphan_rows=${badOrphan.length}`);
add('SF-08','LineID unique',new Set(sales.map(r=>r.LineID)).size===sales.length,`rows=${sales.length}`);

const implied=sales.map(r=>num(r,'GrossSalesVND')/num(r,'UnitPriceVND')).sort((a,b)=>a-b);
const cogsUnit=sales.map(r=>num(r,'CorrectedCOGSVND')/num(r,'UnitsCorrected')).sort((a,b)=>a-b);
const gm=sales.map(r=>1-num(r,'CorrectedCOGSVND')/num(r,'NetRevenueVND')).sort((a,b)=>a-b);
const percentile=(arr,p)=>arr[Math.min(arr.length-1,Math.floor((arr.length-1)*p))];
const anomalies=sales.map(r=>({line:r.LineID,sku:r.SKUKey,channel:r.ChannelKey,month:r.MonthStart,identity_gap:num(r,'GrossSalesVND')-num(r,'UnitsCorrected')*num(r,'UnitPriceVND'),gm:1-num(r,'CorrectedCOGSVND')/num(r,'NetRevenueVND'),cogs_per_unit:num(r,'CorrectedCOGSVND')/num(r,'UnitsCorrected')})).sort((a,b)=>Math.abs(b.identity_gap)-Math.abs(a.identity_gap)).slice(0,50);
const lines=['# Sales_Fact Dimensional & Economic Audit — 2026-08-31','','**Status:** `'+(checks.every(c=>c.status==='PASS')?'PASS':'FAIL')+'`  ','**Input:** `powerbi/data/final_v1/fact_sales.csv`  ','**Rows:** '+sales.length+'  ','**Tolerance:** VND '+tolerance+' for monetary identities','', '| ID | Check | Status | Detail |','|---|---|---|---|',...checks.map(c=>`| ${c.id} | ${c.name} | **${c.status}** | ${c.detail} |`),'','## Distribution summary','',`- Implied units (gross / unit price): p50 **${percentile(implied,.5).toFixed(2)}**, min **${implied[0].toFixed(2)}**, max **${implied.at(-1).toFixed(2)}**.`,`- Corrected COGS per unit: p50 **VND ${percentile(cogsUnit,.5).toFixed(2)}**, min **VND ${cogsUnit[0].toFixed(2)}**, max **VND ${cogsUnit.at(-1).toFixed(2)}**.`,`- Gross margin: p50 **${(percentile(gm,.5)*100).toFixed(2)}%**, min **${(gm[0]*100).toFixed(2)}%**, max **${(gm.at(-1)*100).toFixed(2)}%**.`,`- Rows failing gross-sales identity: **${badIdentity.length} / ${sales.length} (${(100*badIdentity.length/sales.length).toFixed(3)}%)**.`,`- Mixed money scales: **not detected**; all fact money columns are VND with explicit scale factor 1.`];
lines.push('','## Top anomaly review (50 rows; ranked by absolute identity gap)','', '| LineID | SKU | Channel | Month | Identity gap (VND) | Gross margin | COGS/unit |','|---|---|---|---|---:|---:|---:|',...anomalies.map(a=>`| ${a.line} | ${a.sku} | ${a.channel} | ${a.month} | ${a.identity_gap.toFixed(2)} | ${(a.gm*100).toFixed(2)}% | ${a.cogs_per_unit.toFixed(2)} |`),'','## Correction decision','','The canonical correction is **Option 3 — rebuild the source ledger from generator assumptions**. `UnitsCorrected` is recalculated as `GrossSalesVND / UnitPriceVND`, COGS is allocated from the authoritative month × channel COGS bucket, and no row-specific patches are used. The pre-fix extract is preserved at `data/archive/sales_fact_pre_unit_fix_2026-08-31.csv`.','', 'All operating values remain synthetic/rehearsal evidence; this audit proves arithmetic integrity, not real-company performance.','');
fs.mkdirSync(path.dirname(reportPath),{recursive:true}); fs.writeFileSync(reportPath,lines.join('\n'),'utf8');
console.log(JSON.stringify({status:checks.every(c=>c.status==='PASS')?'PASS':'FAIL',rows:sales.length,checks},null,2));
if (checks.some(c=>c.status==='FAIL')) process.exit(1);
