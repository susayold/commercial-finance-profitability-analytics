from pathlib import Path
import re

root = Path('.')

def replace(rel, old, new):
    p = root / rel
    s = p.read_text(encoding='utf-8')
    if old not in s:
        raise SystemExit(f'Missing anchor in {rel}: {old[:100]}')
    p.write_text(s.replace(old, new), encoding='utf-8')

def sub(rel, pattern, replacement, count=1):
    p = root / rel
    s = p.read_text(encoding='utf-8')
    out, n = re.subn(pattern, replacement, s, count=count, flags=re.S)
    if n != count:
        raise SystemExit(f'Regex replacement mismatch in {rel}: expected {count}, got {n}')
    p.write_text(out, encoding='utf-8')

# Page 1 — analyst recommendation, not approval authority.
replace('site/app/executive-page1.tsx', '<span><ShieldCheck size={20} /> DECISION</span><h2>Approve the Base plan<br />with cash gates.</h2>', '<span><ShieldCheck size={20} /> RECOMMENDATION</span><h2>Recommend the Base plan<br />with cash gates.</h2>')

# Page 4 — make standalone scale boundary impossible to miss.
replace('site/app/profitability-page4.tsx', '<span><ShieldCheck size={21}/> <b>Scope</b>Standalone Economics Layer</span>', '<span><ShieldCheck size={21}/> <b>Scope</b>Standalone · Not Additive to Core P&amp;L</span>')
replace('site/app/profitability-page4.tsx', 'FY2025 customer-profitability rehearsal — connecting gross-to-net, service cost, contribution, accounts receivable and working-capital cost to reveal which accounts and channels truly create economic value.', 'FY2025 standalone customer-profitability rehearsal — connecting gross-to-net, service cost, contribution, accounts receivable and working-capital cost. Figures are synthetic and are not additive to the core FY2025 company P&amp;L.')

# Page 8 — avoid saying synthetic upside assumptions are "proven".
replace('site/app/forecast-page8.tsx', 'Favorable assumptions proven', 'Upside trigger conditions met')

# Page 9 — canonical evidence taxonomy, closed alias control, no visible Power BI references.
p = root / 'site/app/evidence-page9.tsx'
s = p.read_text(encoding='utf-8')
s = s.replace("['SIMULATED HISTORICAL OOS', 'Rolling-origin out-of-sample evidence on simulated history', '1M / 3M / 6M revenue backtest', 'Allowed with synthetic-history boundary'],", "['SIMULATED_HISTORICAL_BACKTEST', 'Rolling-origin out-of-sample evidence on simulated history', '1M / 3M / 6M revenue backtest', 'Allowed with synthetic-history boundary'],")
s = s.replace("  ['BI', 'Power BI historical archive', 'Out of active scope', 'No Page 1–10 dependency', 'PASS'],\n", '')
s = s.replace('<span><b>Active Scope</b>Non-Power-BI FP&amp;A</span>', '<span><b>Active Scope</b>FP&amp;A / Commercial Finance</span>')
s = s.replace('<div className="e9-mini-note"><ShieldAlert size={16} />OPEN CONTROL · Add `evidence_class_aliases.csv` or normalize through an explicit alias map.</div>', '<div className="e9-mini-note"><CheckCircle2 size={16} />CLOSED CONTROL · PROXY_DERIVED and CALCULATED_PUBLIC aliases are registered in governance; keep their public labels explicit.</div>')
p.write_text(s, encoding='utf-8')

# Page 10 — put revenue and margin on the same forecast-comparator basis.
p = root / 'site/app/dashboard-page10.tsx'
s = p.read_text(encoding='utf-8')
s = s.replace('const trend = page2.monthly.map((m) => ({ label: m.label, revenue: m.forecast.revenue, margin: m.actual.ebitdaProxy / m.actual.revenue * 100 }));', 'const trend = page2.monthly.map((m) => ({ label: m.label, revenue: m.forecast.revenue, margin: m.forecast.grossProfit / m.forecast.revenue * 100 }));')
s = s.replace('Performance & Landing Range" sub="Revenue bars · EBITDA Proxy Margin line · Page 2 current contract"', 'Performance & Landing Range" sub="Forecast revenue bars · forecast gross-margin line · Page 2 comparator contract"')
s = s.replace('aria-label="Monthly forecast revenue bars with EBITDA proxy margin line"', 'aria-label="Monthly forecast revenue bars with forecast gross margin line"')
s = s.replace('EBITDA Proxy Margin · simulated monthly actual-ledger proxy trend', 'Gross Margin · forecast comparator trend')
s = s.replace('Revenue range is contained;<br /><em>EBITDA risk is not.</em>', 'Revenue range is contained;<br /><em>margin discipline still matters.</em>')
p.write_text(s, encoding='utf-8')

# Page 5 — rebuild displayed numbers from the governed Page 5 data contract.
p = root / 'site/app/costing-page5.tsx'
s = p.read_text(encoding='utf-8')
s = s.replace("import { AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, CheckCircle2, Database, FileText, Gauge, Layers3, Package, ShieldCheck, Target, TrendingUp } from 'lucide-react';", "import { AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3, CheckCircle2, Database, FileText, Gauge, Layers3, Package, ShieldCheck, Target, TrendingUp } from 'lucide-react';\nimport page5Data from '../data/generated/page5-costing.json';")

s, n = re.subn(r"const skuRows=.*?const invRows=.*?;\n", """const monthVar=page5Data.monthly.map(r=>r.totalVarianceMn);\nconst top8=page5Data.decVarianceTop8;\nconst top8Std=top8.reduce((a,r)=>a+r.standardCogsVnd,0);\nconst top8Actual=top8.reduce((a,r)=>a+r.actualCogsVnd,0);\nconst top8Variance=top8.reduce((a,r)=>a+r.varianceVnd,0);\nconst monthLabel=(p:string)=>({\"09\":\"Sep\",\"10\":\"Oct\",\"11\":\"Nov\",\"12\":\"Dec\"} as Record<string,string>)[p.slice(5)] ?? p;\n""", s, count=1, flags=re.S)
if n != 1: raise SystemExit(f'Page5 constant replacement count={n}')

s, n = re.subn(r"function Bridge\(\{compact=false\}:\{compact\?:boolean\}\)\{.*?\}\nexport default", """function Bridge({compact=false}:{compact?:boolean}){const d=page5Data.fy2025;const data=[['Standard COGS',d.standardCogsVnd/1e9,'start'],['Material Price',d.materialPriceVarianceVnd/1e9,'red'],['Usage / Yield',d.usageYieldVarianceVnd/1e9,'amber'],['Conversion',d.conversionVarianceVnd/1e9,'amber'],['Actual COGS',d.actualCogsVnd/1e9,'end']];return <div className={`cost5-bridge ${compact?'compact':''}`}>{data.map(([l,v,t])=><div className={`cost5-bridge-col ${t}`} key={String(l)}><div className=\"cost5-bridge-bar\" style={{height:`${Math.max(20,Number(v)/(d.actualCogsVnd/1e9)*112)}px`}}><b>{Number(v).toFixed(Number(v)<1?3:2)}</b></div><span>{l}</span></div>)}</div>}\nexport default""", s, count=1, flags=re.S)
if n != 1: raise SystemExit(f'Page5 Bridge replacement count={n}')

sections = {}
sections[1] = '''<S n={1} title="Costing Scorecard" aside="FY2025 Base (Full Year)"><div className="cost5-kpis"><K icon={Layers3} label="Standard COGS" value={`${fmt(page5Data.fy2025.standardCogsVnd/1e9,4)}bn`} detail="100%"/><K icon={FileText} label="Modeled Actual COGS" value={`${fmt(page5Data.fy2025.actualCogsVnd/1e9,4)}bn`} detail="100%"/><K icon={ArrowUpRight} label="Total Variance" value={`${fmt(page5Data.fy2025.totalVarianceVnd/1e6,1)}m`} detail={`+${fmt(page5Data.fy2025.variancePct,1)}%`} tone="red"/><K icon={Target} label="Material Price Var" value={`${fmt(page5Data.fy2025.materialPriceVarianceVnd/1e6,1)}m`} detail={`${fmt(page5Data.fy2025.materialSharePct,1)}% of total`} tone="red"/><K icon={Gauge} label="Usage / Yield Var" value={`${fmt(page5Data.fy2025.usageYieldVarianceVnd/1e6,1)}m`} detail={`${fmt(page5Data.fy2025.usageSharePct,1)}% of total`}/><K icon={TrendingUp} label="Conversion Var" value={`${fmt(page5Data.fy2025.conversionVarianceVnd/1e6,1)}m`} detail={`${fmt(page5Data.fy2025.conversionSharePct,1)}% of total`}/><K icon={CheckCircle2} label="Monthly Bridge Pass" value={`${page5Data.fy2025.monthlyBridgePass} / 12`} detail="100%"/><K icon={ArrowUpRight} label="Cost Pressure (H2 vs H1)" value={`+${fmt(page5Data.fy2025.h2VsH1VariancePct,1)}%`} detail="Variance increased" tone="amber"/></div></S>'''
sections[4] = '''<S n={4} title="Cost Variance Decomposition" aside="FY2025"><div className="cost5-two"><div className="cost5-card"><table className="cost5-table"><thead><tr><th>Variance Driver</th><th>Variance (bn)</th><th>% of Total</th><th>Cum. %</th></tr></thead><tbody><tr><td>Material Price</td><td>{fmt(page5Data.fy2025.materialPriceVarianceVnd/1e9,4)}</td><td>{fmt(page5Data.fy2025.materialSharePct,1)}%</td><td>{fmt(page5Data.fy2025.materialSharePct,1)}%</td></tr><tr><td>Usage / Yield</td><td>{fmt(page5Data.fy2025.usageYieldVarianceVnd/1e9,4)}</td><td>{fmt(page5Data.fy2025.usageSharePct,1)}%</td><td>{fmt(page5Data.fy2025.materialSharePct+page5Data.fy2025.usageSharePct,1)}%</td></tr><tr><td>Conversion</td><td>{fmt(page5Data.fy2025.conversionVarianceVnd/1e9,4)}</td><td>{fmt(page5Data.fy2025.conversionSharePct,1)}%</td><td>100.0%</td></tr><tr className="total"><td>TOTAL</td><td>{fmt(page5Data.fy2025.totalVarianceVnd/1e9,4)}</td><td>100.0%</td><td>100.0%</td></tr></tbody></table></div><div className="cost5-alert"><AlertTriangle size={20}/><b>Material price inflation is the key cost pressure in FY2025.</b></div></div></S>'''
sections[5] = '''<S n={5} title="Monthly Cost Pressure Trend" aside="FY2025 · VND million"><div className="cost5-card"><div className="cost5-trend"><div className="cost5-bars">{monthVar.map((v,i)=><div key={i}><i style={{height:`${35+v/Math.max(...monthVar)*105}px`}}/><span>{v.toFixed(1)}</span><small>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</small></div>)}</div><svg viewBox="0 0 700 145" preserveAspectRatio="none"><polyline points={monthVar.map((v,i)=>`${20+i*60},${130-v/Math.max(...monthVar)*110}`).join(' ')} fill="none" stroke="#d83e37" strokeWidth="3"/>{monthVar.map((v,i)=><circle key={i} cx={20+i*60} cy={130-v/Math.max(...monthVar)*110} r="3" fill="#d83e37"/>)}</svg></div><div className="cost5-trend-footer"><span>Std COGS <b>{fmt(page5Data.monthly[0].standardCogsVnd/1e6,1)} → {fmt(page5Data.monthly.at(-1)!.standardCogsVnd/1e6,1)}</b></span><span>Act COGS <b>{fmt(page5Data.monthly[0].actualCogsVnd/1e6,1)} → {fmt(page5Data.monthly.at(-1)!.actualCogsVnd/1e6,1)}</b></span><span>Variance <b className="red">{fmt(monthVar[0],1)} → {fmt(monthVar.at(-1)!,1)}</b></span></div></div></S>'''
sections[6] = '''<S n={6} title="SKU-Level Variance Analysis" aside="December 2025 · VND million"><div className="cost5-card"><table className="cost5-table"><thead><tr><th>Top 8 SKUs by Variance</th><th>Std COGS</th><th>Act COGS</th><th>Variance</th><th>Variance %</th><th>Driver (Primary)</th></tr></thead><tbody>{top8.map(r=><tr key={r.sku}><td><b>{r.sku}</b></td><td>{fmt(r.standardCogsVnd/1e6,1)}</td><td>{fmt(r.actualCogsVnd/1e6,1)}</td><td>+{fmt(r.varianceVnd/1e6,1)}</td><td className="red">+{fmt(r.variancePct,1)}%</td><td>{r.primaryDriver}</td></tr>)}<tr className="total"><td>TOTAL (Top 8)</td><td>{fmt(top8Std/1e6,1)}</td><td>{fmt(top8Actual/1e6,1)}</td><td>+{fmt(top8Variance/1e6,1)}</td><td>+{fmt(top8Variance/top8Std*100,1)}%</td><td>—</td></tr></tbody></table></div></S>'''
sections[7] = '''<S n={7} title="Inventory Position" aside="December 2025 · source-driven"><div className="cost5-kpis inv"><K icon={Package} label="Gross Inventory" value={`${fmt(page5Data.inventory.grossInventoryVnd/1e9,3)}bn`} detail="100%"/><K icon={ShieldCheck} label="Reserve" value={`${fmt(page5Data.inventory.reserveVnd/1e9,3)}bn`} detail={`${fmt(page5Data.inventory.reservePct,1)}% of gross`} tone="amber"/><K icon={Database} label="Net Inventory" value={`${fmt(page5Data.inventory.netInventoryVnd/1e9,3)}bn`} detail="Gross − reserve"/><K icon={AlertTriangle} label="Slow-Moving Inventory" value={`${fmt(page5Data.inventory.slowMovingInventoryVnd/1e9,3)}bn`} detail={`${fmt(page5Data.inventory.slowMovingSharePct,1)}% of gross`} tone="red"/><K icon={AlertTriangle} label="Modeled Slow-Moving SKUs" value={`${page5Data.inventory.slowMovingCount} / 36`} detail="Source-driven Dec snapshot" tone="red"/></div><div className="cost5-two"><div className="cost5-card"><h3>Inventory Value Breakdown</h3><div className="cost5-inv-donut"/><p className="cost5-note">{page5Data.inventory.largestSku.sku} <b>{fmt(page5Data.inventory.largestSku.grossInventoryVnd/1e9,3)}bn · {fmt(page5Data.inventory.largestSku.sharePct,1)}%</b><br/>Other non-zero SKUs <b>{fmt((page5Data.inventory.grossInventoryVnd-page5Data.inventory.largestSku.grossInventoryVnd)/1e9,3)}bn · {fmt(100-page5Data.inventory.largestSku.sharePct,1)}%</b></p></div><div className="cost5-card"><h3>Gross Inventory Trend</h3><div className="cost5-dio">{page5Data.inventory.trend.map(r=><span key={r.period}>{monthLabel(r.period)}-25 <b>{fmt(r.grossInventoryVnd/1e9,3)}bn</b></span>)}</div><p className="cost5-note">Reserve is derived from the synthetic aging / slow-moving policy for each SKU-month.</p></div></div><div className="cost5-alert"><AlertTriangle size={18}/> All three Dec-2025 non-zero inventory balances are flagged slow-moving in the governed source; {page5Data.inventory.largestSku.sku} alone represents {fmt(page5Data.inventory.largestSku.sharePct,1)}% of gross inventory.</div></S>'''
sections[8] = '''<S n={8} title="Inventory by SKU" aside="Non-zero balances · Dec-2025"><div className="cost5-card"><table className="cost5-table"><thead><tr><th>Rank</th><th>SKU</th><th>Category</th><th>Gross Inventory</th><th>% of Total</th><th>Reserve</th><th>Net Inventory</th><th>DIO Proxy</th><th>Slow-Moving</th></tr></thead><tbody>{page5Data.inventory.nonZeroRows.map((r,i)=><tr key={r.sku} className={i===0?'highlight':''}><td>{i+1}</td><td><b>{r.sku}</b></td><td>{r.category}</td><td>{fmt(r.grossInventoryVnd/1e9,3)}</td><td>{fmt(r.sharePct,1)}%</td><td>{fmt(r.reserveVnd/1e9,4)}</td><td>{fmt(r.netInventoryVnd/1e9,3)}</td><td>{fmt(r.dioProxyDays,1)}</td><td>{r.slowMoving?<span className="red">⚠ YES</span>:'No'}</td></tr>)}<tr className="total"><td colSpan={3}>TOTAL</td><td>{fmt(page5Data.inventory.grossInventoryVnd/1e9,3)}</td><td>100.0%</td><td>{fmt(page5Data.inventory.reserveVnd/1e9,4)}</td><td>{fmt(page5Data.inventory.netInventoryVnd/1e9,3)}</td><td>—</td><td>{page5Data.inventory.slowMovingCount} flagged</td></tr></tbody></table></div></S>'''
sections[9] = '''<S n={9} title="Slow-Moving SKU Review"><div className="cost5-card"><table className="cost5-table"><thead><tr><th>SKU</th><th>Gross Inventory</th><th>DIO Proxy</th><th>Reserve Rate</th><th>Action</th></tr></thead><tbody>{page5Data.inventory.slowMovingRows.map((r,i)=><tr key={r.sku}><td><b>{r.sku}</b></td><td>{fmt(r.grossInventoryVnd/1e9,3)}bn</td><td>{fmt(r.dioProxyDays,1)}d</td><td>{fmt(r.reserveRate*100,0)}%</td><td>{i===0?'Reduce stock, validate demand and consider promotion / vendor return.':'Review demand plan, replenishment and exit path.'}</td></tr>)}</tbody></table><p className="cost5-note">{page5Data.inventory.slowMovingCount} slow-moving SKUs identified from the governed Dec-2025 36-SKU source: {page5Data.inventory.slowMovingRows.map(r=>r.sku).join(', ')}.</p></div></S>'''

for num, replacement in sections.items():
    pattern = rf'<S n=\{{{num}\}}.*?</S>'
    s2, n = re.subn(pattern, replacement, s, count=1, flags=re.S)
    if n != 1: raise SystemExit(f'Page5 section {num} replacement count={n}')
    s = s2

p.write_text(s, encoding='utf-8')

# Cross-page validator — enforce the fixes we just made.
p = root / 'scripts/validate_website_content_alignment.mjs'
s = p.read_text(encoding='utf-8')
s = s.replace("const d3 = json('site/data/generated/page3-commercial.json');", "const d3 = json('site/data/generated/page3-commercial.json');\nconst d5 = json('site/data/generated/page5-costing.json');")
s = s.replace("need(/OOS BACKTEST PASS/.test(p1) && /GATE A OPEN/.test(p1), 'Page 1 must show OOS PASS and Gate A OPEN');", "need(/RECOMMENDATION/.test(p1) && /Recommend the Base plan/.test(p1) && /OOS BACKTEST PASS/.test(p1) && /GATE A OPEN/.test(p1), 'Page 1 recommendation/evidence boundary mismatch');")
s = s.replace("need(/Standalone Economics Layer/.test(p4) && /SYNTHETIC REHEARSAL/.test(p4), 'Page 4 standalone boundary missing');", "need(/Standalone · Not Additive to Core P&amp;L/.test(p4) && /not additive to the core FY2025 company P&amp;L/.test(p4) && /SYNTHETIC REHEARSAL/.test(p4), 'Page 4 standalone boundary missing');")
s = s.replace("need(/no plant BOM, purchase-order or production-hour evidence is claimed/.test(p5), 'Page 5 plant-evidence boundary missing');", "need(/no plant BOM, purchase-order or production-hour evidence is claimed/.test(p5), 'Page 5 plant-evidence boundary missing');\nneed(d5.inventory?.slowMovingCount === 3 && JSON.stringify(d5.inventory.slowMovingRows.map((r) => r.sku).sort()) === JSON.stringify(['SKU018','SKU034','SKU035']), 'Page 5 source-driven slow-moving inventory mismatch');\nneed(/page5-costing\.json/.test(p5) && !/72\.8 days/.test(p5) && !/SKU033.*SKU033/s.test(p5), 'Page 5 still contains stale inventory snapshot');")
s = s.replace("need(/Historical Out-of-Sample Forecast Backtest/.test(p8) && /SIMULATED_HISTORICAL_BACKTEST/.test(p8) && /Live Accuracy Gate<\\/b>OPEN/.test(p8), 'Page 8 display does not separate OOS and live Gate A');", "need(/Historical Out-of-Sample Forecast Backtest/.test(p8) && /SIMULATED_HISTORICAL_BACKTEST/.test(p8) && /Live Accuracy Gate<\\/b>OPEN/.test(p8) && !/Favorable assumptions proven/.test(p8), 'Page 8 display/wording mismatch');")
s = s.replace("need(/VNFINANCE-FPA-v1.1.1/.test(p9) && /HISTORICAL OOS/.test(p9) && !/Production Power BI/.test(p9), 'Page 9 release/evidence content stale');", "need(/VNFINANCE-FPA-v1.1.1/.test(p9) && /SIMULATED_HISTORICAL_BACKTEST/.test(p9) && /CLOSED CONTROL/.test(p9) && !/OPEN CONTROL · Add `evidence_class_aliases\.csv`/.test(p9) && !/Power BI/.test(p9), 'Page 9 release/evidence content stale');")
s = s.replace("need(/Historical OOS/.test(p10) && /Live Gate A/.test(p10), 'Page 10 display does not surface OOS/Gate A split');", "need(/Historical OOS/.test(p10) && /Live Gate A/.test(p10) && /forecast gross-margin line/.test(p10) && /m\.forecast\.grossProfit \/ m\.forecast\.revenue/.test(p10) && !/m\.actual\.ebitdaProxy \/ m\.actual\.revenue/.test(p10), 'Page 10 forecast trend basis mismatch');")
p.write_text(s, encoding='utf-8')

print('Applied final website fixes: Pages 1,4,5,8,9,10 + cross-page QA')
