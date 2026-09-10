'use client';

import { ArrowLeft, BarChart3, Calculator, CheckCircle2, Download, ExternalLink, FileSpreadsheet, GitBranch, Layers3, ShieldCheck, Table2, Target, TrendingUp, WalletCards } from 'lucide-react';
import '../excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';
const fileName = 'VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx';
const workbookUrl = `${BASE}/downloads/${fileName}`;
const publicWorkbookUrl = `https://susayold.github.io${workbookUrl}`;
const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(publicWorkbookUrl)}`;

const workbookMap = [
  ['00_Cover', 'Model map, release metadata & review guide', 'Documentation / auditability'],
  ['01_Assumptions', 'Base / Upside / Downside drivers', 'Controlled hardcodes + input convention'],
  ['02_Actuals', 'Monthly operating history', 'Cross-sheet source base + margin formulas'],
  ['03_PnL_Variance', 'Actual vs Budget vs Forecast', 'Variance %, IF logic, conditional formatting, chart'],
  ['04_Commercial', 'Channel economics', 'SUMIFS, selector, CM hurdle and decision logic'],
  ['05_Working_Capital', 'AR / Inventory / AP / CCC', 'Driver formulas and cash-conversion logic'],
  ['06_Scenario', 'What-if scenario review', 'Data validation + INDEX/MATCH'],
  ['07_Forecast_Accuracy', 'Bias / WAPE benchmark', 'Forecast governance + chart'],
  ['08_Costing', 'Cost variance & inventory', 'Variance bridge + evidence boundary'],
  ['09_Controls', 'Formula checks / open gates', 'Reconciliation and model-risk controls'],
  ['10_Skills', 'Recruiter capability summary', 'Documentation and communication'],
  ['11_Change_Log', 'Version / change / test history', 'Version control and handover'],
];

const formulas = [
  ['Gross Margin', 'Gross Profit / Net Revenue', 'Understand margin conversion'],
  ['Contribution Margin', 'Contribution / Net Revenue', 'Gate profitable growth'],
  ['Variance %', '(Actual − Budget) / Budget', 'Explain performance movement'],
  ['Operating WC', 'AR + Inventory − AP', 'Quantify cash tied in operations'],
  ['CCC', 'DSO + DIO − DPO', 'Monitor cash-conversion efficiency'],
  ['Promo ROI', 'Incremental Contribution / Promo Cost', 'Evaluate promotion economics'],
  ['Bias %', '(Forecast − Actual) / Actual', 'Identify over / under forecasting'],
  ['WAPE', 'Σ|Forecast − Actual| / ΣActual', 'Compare forecast accuracy'],
];

const pnlPreview = [
  ['Net Revenue', '82.514', '85.718', '76.906'],
  ['Gross Profit', '26.915', '31.189', '18.634'],
  ['EBITDA Proxy', '12.896', '17.450', '3.493'],
  ['EBITDA Proxy Margin', '15.63%', '20.36%', '4.54%'],
  ['Contribution', '24.207', '28.481', '15.872'],
  ['CCC', '54 days', '48 days', '68 days'],
];

const commercialPreview = [
  ['General Trade', '30.649', '8.231', '26.86%', 'SCALE / PROTECT'],
  ['Modern Trade', '20.717', '5.041', '24.33%', 'REVIEW TERMS'],
  ['Marketplace', '14.308', '3.399', '23.75%', 'REVIEW TERMS'],
  ['D2C', '9.377', '2.040', '21.76%', 'REVIEW TERMS'],
  ['Wholesale', '9.507', '2.409', '25.34%', 'SCALE / PROTECT'],
];

const forecastPreview = [
  ['1M', 'SEASONAL_NAIVE_12', '24', '+0.2510%', '1.1734%', 'PRIMARY / KEEP SIMPLE'],
  ['3M', 'SEASONAL_NAIVE_12', '22', '+0.1558%', '1.1554%', 'PRIMARY / KEEP SIMPLE'],
  ['6M', 'SEASONAL_NAIVE_12', '19', '+0.1125%', '1.1782%', 'PRIMARY / KEEP SIMPLE'],
];

const controlPreview = [
  ['XL-01', 'FY2025 scenario / model tie', 'PASS'],
  ['XL-03', 'Operating WC identity', 'PASS'],
  ['XL-05', 'Scenario selector / INDEX+MATCH', 'PASS'],
  ['XL-07', 'Historical rolling-origin OOS', 'PASS'],
  ['XL-08', 'Live forecast accuracy', 'OPEN'],
  ['XL-09', 'Page 6 OPEX bridge', 'OPEN'],
];

const features = [
  ['Model architecture', 'Separated assumptions, workings, outputs and controls instead of mixing inputs and calculations in one tab.', Layers3],
  ['Formula discipline', 'Hardcoded inputs are visually separated from formulas and cross-sheet links using finance-model conventions.', Calculator],
  ['Variance analysis', 'Actual / Budget / Forecast bridges with formula-driven variance and conditional review flags.', BarChart3],
  ['Commercial analysis', 'SUMIFS channel selector, contribution-margin hurdle and decision-oriented profitability review.', Target],
  ['Scenario planning', 'Data validation selector with INDEX/MATCH outputs for Base / Upside / Downside what-if review.', TrendingUp],
  ['Controls & versioning', 'Live reconciliation checks, PASS / OPEN status, evidence boundaries and a dedicated change log.', ShieldCheck],
];

const learned = [
  ['What I built', 'A recruiter-ready Excel FP&A model connecting monthly operating data to P&L, profitability, working capital, scenarios, forecast evidence and model controls.'],
  ['What I learned', 'Excel modelling is not only about knowing formulas. A useful finance model must be structured, auditable, easy to hand over and explicit about inputs, calculations, outputs and unresolved evidence.'],
  ['What I can bring', 'I can support monthly reporting, variance investigation, profitability analysis, working-capital monitoring, forecast / scenario cycles and finance-model controls.'],
];

function SectionTitle({ n, title, note }: { n: string; title: string; note?: string }) {
  return <div className="xl11-section-title"><span>{n}</span><div><h2>{title}</h2>{note && <p>{note}</p>}</div></div>;
}

function MiniTable({ title, headers, rows }: { title: string; headers: string[]; rows: string[][] }) {
  return <article className="xl11-map" style={{overflow:'auto'}}>
    <div className="xl11-map-head" style={{gridTemplateColumns:'1fr'}}><span>{title}</span></div>
    <div style={{gridTemplateColumns:`repeat(${headers.length}, minmax(120px,1fr))`,minWidth:headers.length*125}}>{headers.map(h => <b key={h} style={{fontFamily:'inherit',color:'#0b2f4f'}}>{h}</b>)}</div>
    {rows.map((r,i) => <div key={`${title}-${i}`} style={{gridTemplateColumns:`repeat(${headers.length}, minmax(120px,1fr))`,minWidth:headers.length*125}}>{r.map((v,j) => <span key={`${i}-${j}`} style={{fontWeight:j===0?800:500,color:v==='OPEN'?'#b45309':v==='PASS'?'#047857':undefined}}>{v}</span>)}</div>)}
  </article>;
}

export default function ExcelShowcasePage() {
  return <div className="xl11-page">
    <section className="xl11-hero">
      <div className="xl11-hero-copy">
        <a href={`${BASE}/`} style={{display:'inline-flex',alignItems:'center',gap:6,textDecoration:'none',fontWeight:800,color:'#0f8b8d',marginBottom:18}}><ArrowLeft size={16}/> Back to finance case</a>
        <div className="xl11-kicker">EXCEL FP&amp;A MODEL · RECRUITER SHOWCASE</div>
        <h1>Not just “I know Excel”.<br /><em>Here is the model.</em></h1>
        <p>A downloadable, formula-driven workbook showing how I structure FP&amp;A analysis from controlled inputs to management outputs, decisions, checks and model handover.</p>
        <div className="xl11-actions">
          <a className="primary" href={officeViewerUrl} target="_blank" rel="noreferrer"><FileSpreadsheet size={18} /> Open workbook in browser <ExternalLink size={15} /></a>
          <a href={workbookUrl} download><Download size={18} /> Download Excel (.xlsx)</a>
        </div>
        <small className="xl11-file-note">Public recruiter copy · no macros · simulated / derived portfolio data · {fileName}</small>
      </div>
      <aside className="xl11-hero-card">
        <b><CheckCircle2 size={18} /> EXCEL CAPABILITY</b>
        <strong>12 sheets</strong><span>inputs → workings → outputs → controls → change log</span>
        <strong>Formula-driven</strong><span>SUM · IF · IFERROR · SUMIFS · INDEX + MATCH</span>
        <strong>Interactive</strong><span>data validation · scenario / channel selectors</span>
        <strong>Reviewable</strong><span>conditional formatting · charts · live checks · version history</span>
      </aside>
    </section>

    <main className="xl11-main">
      <div className="xl11-context">
        <span><b>Role Lens</b>FP&amp;A / Commercial Finance</span>
        <span><b>Workbook</b>12 sheets · v1.2.0</span>
        <span><b>Formula QA</b>0 formula errors</span>
        <span><b>Historical OOS</b>PASS</span>
        <span><b>Live Gate A</b>OPEN by design</span>
      </div>

      <section><SectionTitle n="01" title="Workbook snapshots" note="Representative outputs from the downloadable workbook. The .xlsx remains the source recruiters can inspect directly." />
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(520px,1fr))',gap:18}}>
          <MiniTable title="06_Scenario · controlled FY2025 scenario truth" headers={['Metric','Base','Upside','Downside']} rows={pnlPreview} />
          <MiniTable title="04_Commercial · channel economics" headers={['Channel','Revenue','Contribution','CM %','Decision']} rows={commercialPreview} />
          <MiniTable title="07_Forecast_Accuracy · simulated historical OOS" headers={['Horizon','Model','Eligible','Bias','WAPE','Decision']} rows={forecastPreview} />
          <MiniTable title="09_Controls · live checks" headers={['ID','Control','Status']} rows={controlPreview} />
        </div>
      </section>

      <section><SectionTitle n="02" title="Professional workbook architecture" note="Designed around a clear flow of inputs → workings → outputs → controls, with version history for handover." />
        <div className="xl11-map"><div className="xl11-map-head"><span>Sheet</span><span>Finance purpose</span><span>Excel capability shown</span></div>{workbookMap.map(r => <div key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><span>{r[2]}</span></div>)}</div>
      </section>

      <section><SectionTitle n="03" title="Excel skills demonstrated inside the workbook" />
        <div className="xl11-feature-grid">{features.map(([title, text, Icon]) => { const I = Icon as typeof Layers3; return <article key={String(title)}><I size={25} /><h3>{title}</h3><p>{text}</p></article>; })}</div>
        <div className="xl11-tech-strip"><b>Functions / features used</b><span>SUM</span><span>IF</span><span>IFERROR</span><span>SUMIFS</span><span>INDEX + MATCH</span><span>cross-sheet links</span><span>data validation</span><span>conditional formatting</span><span>charts</span><span>number formats</span><span>change log</span></div>
      </section>

      <section><SectionTitle n="04" title="Finance formulas I can explain in an interview" note="The point is not memorising formulas — it is understanding the business decision behind them." />
        <div className="xl11-formulas">{formulas.map(([name, formula, use]) => <article key={name}><small>{name}</small><code>{formula}</code><p>{use}</p></article>)}</div>
      </section>

      <section><SectionTitle n="05" title="What I did, what I learned, what I can bring" />
        <div className="xl11-learned">{learned.map(([title, text], i) => <article key={title}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        <blockquote className="xl11-quote">“I can use Excel to turn operating data into management reporting, investigate performance drivers, run scenarios, monitor profitability and working capital, and build controls so outputs remain reviewable.”</blockquote>
      </section>

      <section><SectionTitle n="06" title="How I would use this skill in a finance team" />
        <div className="xl11-employer-grid">
          <article><Table2 /><b>Monthly reporting</b><span>Update controlled actuals, budget / forecast comparators and management P&amp;L.</span></article>
          <article><BarChart3 /><b>Variance investigation</b><span>Move from KPI movement to revenue, margin, cost or working-capital drivers.</span></article>
          <article><WalletCards /><b>Planning support</b><span>Maintain assumptions, scenarios and what-if outputs with a clear version boundary.</span></article>
          <article><GitBranch /><b>Model handover</b><span>Keep calculations traceable, documented, versioned and supported by checks rather than opaque hardcodes.</span></article>
        </div>
      </section>

      <section><SectionTitle n="07" title="Modelling standards used" note="The workbook structure follows established spreadsheet-control and financial-model documentation principles." />
        <div className="xl11-employer-grid">
          <article><Layers3 /><b>ICAEW spreadsheet principles</b><span>Clear purpose, audience, inputs / processes / outputs, consistency, built-in controls and version management.</span><a href="https://www.icaew.com/technical/technology/excel-community/20-principles-for-good-spreadsheet-practice-2024-edition" target="_blank" rel="noreferrer">Reference <ExternalLink size={12}/></a></article>
          <article><FileSpreadsheet /><b>CFI model documentation</b><span>Meaningful worksheet titles, labelled units, documented structure, validation, conditional formatting and protection-oriented design.</span><a href="https://corporatefinanceinstitute.com/resources/excel/documenting-excel-models-best-practices/" target="_blank" rel="noreferrer">Reference <ExternalLink size={12}/></a></article>
          <article><GitBranch /><b>FP&amp;A version discipline</b><span>Meaningful version convention and a change log for substantive model changes and review history.</span><a href="https://corporatefinanceinstitute.com/resources/fpa/fp-a-modeling-best-practices/" target="_blank" rel="noreferrer">Reference <ExternalLink size={12}/></a></article>
          <article><ShieldCheck /><b>Evidence discipline</b><span>Historical OOS evidence is clearly separated from genuine live forecast performance; unresolved claims remain open.</span></article>
        </div>
      </section>

      <section><SectionTitle n="08" title="Evidence boundary" />
        <div className="xl11-boundary"><ShieldCheck size={28} /><p>The workbook is a <b>portfolio modelling demonstration</b> using controlled simulated / derived project data. Historical forecast results are labelled <b>SIMULATED_HISTORICAL_BACKTEST</b>. It does not claim live employer performance, live ERP access, statutory-close ownership or genuine live forecast accuracy.</p></div>
      </section>

      <div className="xl11-final-cta"><div><small>RECRUITER QUICK REVIEW</small><h2>Open the workbook, change the scenario / channel selector, inspect formulas, review controls and check the version log.</h2></div><a href={workbookUrl} download><Download size={18} /> Download Excel model</a></div>
    </main>
  </div>;
}
