'use client';

import { ArrowRight, BarChart3, Calculator, CheckCircle2, Download, ExternalLink, FileSpreadsheet, GitBranch, Layers3, ShieldCheck, Table2, Target, TrendingUp, WalletCards } from 'lucide-react';
import './excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';
const fileName = 'VietNova_FPA_Commercial_Finance_Excel_Model_v1.0.xlsx';
const workbookUrl = `${BASE}/downloads/${fileName}`;
const publicWorkbookUrl = `https://susayold.github.io${workbookUrl}`;
const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(publicWorkbookUrl)}`;

const previews = [
  { src: `${BASE}/excel-preview/cover.webp`, title: '00_Cover', note: 'Workbook map, modelling conventions and recruiter review path.' },
  { src: `${BASE}/excel-preview/pnl.webp`, title: '03_PnL_Variance', note: 'Formula-driven Actual vs Budget vs Forecast with conditional variance signals.' },
  { src: `${BASE}/excel-preview/commercial.webp`, title: '04_Commercial', note: 'Channel contribution, 25% hurdle and interactive SUMIFS selector.' },
  { src: `${BASE}/excel-preview/forecast.webp`, title: '07_Forecast_Accuracy', note: 'Rolling-origin OOS Bias / WAPE benchmark and model-governance decision.' },
  { src: `${BASE}/excel-preview/skills.webp`, title: '10_Skills', note: 'What I built, learned and can contribute to an FP&A / Commercial Finance team.' },
];

const workbookMap = [
  ['00_Cover', 'Model map & review guide', 'Documentation / auditability'],
  ['01_Assumptions', 'Base / Upside / Downside drivers', 'Controlled hardcodes + input convention'],
  ['02_Actuals', 'Monthly operating history', 'Cross-sheet source base + margin formulas'],
  ['03_PnL_Variance', 'Actual vs Budget vs Forecast', 'Variance %, IF logic, conditional formatting, chart'],
  ['04_Commercial', 'Channel economics', 'SUMIFS, selector, CM hurdle and decision logic'],
  ['05_Working_Capital', 'AR / Inventory / AP / CCC', 'Driver formulas and cash-conversion logic'],
  ['06_Scenario', 'What-if scenario review', 'Data validation + INDEX/MATCH'],
  ['07_Forecast_Accuracy', 'Bias / WAPE benchmark', 'Forecast governance + chart'],
  ['08_Costing', 'Cost variance & inventory', 'Variance bridge + evidence boundary'],
  ['09_Controls', 'Formula checks / open gates', 'Reconciliation and model-risk controls'],
  ['10_Skills', 'Recruiter summary', 'Documentation and communication'],
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

const features = [
  ['Model architecture', 'Separate assumptions, workings, outputs and controls instead of mixing everything in one tab.', Layers3],
  ['Formula discipline', 'Derived metrics are formulas; hardcoded inputs are visually separated from calculations and cross-sheet links.', Calculator],
  ['Variance analysis', 'Actual / Budget / Forecast bridges with formula-driven variance and conditional review flags.', BarChart3],
  ['Commercial analysis', 'SUMIFS channel selector, contribution-margin hurdle and decision-oriented profitability review.', Target],
  ['Scenario planning', 'Data validation selector with INDEX/MATCH outputs for Base / Upside / Downside what-if review.', TrendingUp],
  ['Controls & governance', 'Live reconciliation checks, PASS / OPEN status and explicit evidence boundaries.', ShieldCheck],
];

const learned = [
  ['What I built', 'A recruiter-ready FP&A workbook that connects operating data to P&L, profitability, working capital, scenarios, forecast evidence and controls.'],
  ['What I learned', 'Excel modelling is not only about formulas: the model must be structured, auditable, easy to hand over and clear about what is an input, calculation, output or unresolved evidence item.'],
  ['What I can bring', 'I can support monthly reporting, variance investigation, profitability analysis, working-capital monitoring, forecast / scenario cycles and finance-model controls.'],
];

function SectionTitle({ n, title, note }: { n: string; title: string; note?: string }) {
  return <div className="xl11-section-title"><span>{n}</span><div><h2>{title}</h2>{note && <p>{note}</p>}</div></div>;
}

export default function ExcelPageEleven() {
  return <div className="xl11-page">
    <section className="xl11-hero">
      <div className="xl11-hero-copy">
        <div className="xl11-kicker">EXCEL FP&amp;A MODEL · RECRUITER SHOWCASE</div>
        <h1>Not just “I know Excel”.<br /><em>Here is the model.</em></h1>
        <p>A downloadable, formula-driven workbook showing how I structure FP&amp;A analysis from controlled inputs to management outputs, decisions and checks.</p>
        <div className="xl11-actions">
          <a className="primary" href={officeViewerUrl} target="_blank" rel="noreferrer"><FileSpreadsheet size={18} /> Open workbook in browser <ExternalLink size={15} /></a>
          <a href={workbookUrl} download><Download size={18} /> Download Excel (.xlsx)</a>
        </div>
        <small className="xl11-file-note">Public recruiter copy · no macros · simulated / derived portfolio data · {fileName}</small>
      </div>
      <aside className="xl11-hero-card">
        <b><CheckCircle2 size={18} /> EXCEL CAPABILITY</b>
        <strong>11 sheets</strong><span>inputs → workings → outputs → controls</span>
        <strong>Formula-driven</strong><span>SUM / IF / IFERROR / SUMIFS / INDEX + MATCH</span>
        <strong>Interactive</strong><span>data validation · scenario / channel selectors</span>
        <strong>Reviewable</strong><span>conditional formatting · charts · live checks</span>
      </aside>
    </section>

    <main className="xl11-main">
      <div className="xl11-context">
        <span><b>Role Lens</b>FP&amp;A / Commercial Finance</span>
        <span><b>Workbook</b>11 sheets</span>
        <span><b>Evidence</b>Simulated / Derived</span>
        <span><b>Forecast OOS</b>PASS</span>
        <span><b>Live Gate A</b>OPEN</span>
      </div>

      <section><SectionTitle n="01" title="See the Excel model" note="Real workbook previews — not mock dashboard screenshots." />
        <div className="xl11-preview-grid">{previews.map((p, i) => <figure key={p.title} className={i === 1 ? 'wide' : ''}><a href={p.src} target="_blank" rel="noreferrer"><img src={p.src} alt={`${p.title} Excel worksheet preview`} loading="lazy" /></a><figcaption><b>{p.title}</b><span>{p.note}</span><a href={p.src} target="_blank" rel="noreferrer">Open full preview <ExternalLink size={13} /></a></figcaption></figure>)}</div>
      </section>

      <section><SectionTitle n="02" title="Professional workbook architecture" note="Designed around inputs → workings → outputs → controls so another reviewer can follow the model." />
        <div className="xl11-map"><div className="xl11-map-head"><span>Sheet</span><span>Finance purpose</span><span>Excel capability shown</span></div>{workbookMap.map(r => <div key={r[0]}><b>{r[0]}</b><span>{r[1]}</span><span>{r[2]}</span></div>)}</div>
      </section>

      <section><SectionTitle n="03" title="Excel skills demonstrated inside the workbook" />
        <div className="xl11-feature-grid">{features.map(([title, text, Icon]) => <article key={String(title)}><Icon size={25} /><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="xl11-tech-strip"><b>Functions / features used</b><span>SUM</span><span>IF</span><span>IFERROR</span><span>SUMIFS</span><span>INDEX + MATCH</span><span>cross-sheet links</span><span>data validation</span><span>conditional formatting</span><span>charts</span><span>number formats</span></div>
      </section>

      <section><SectionTitle n="04" title="Finance formulas I can explain in an interview" note="The point is not memorising formulas — it is understanding the business decision behind them." />
        <div className="xl11-formulas">{formulas.map(([name, formula, use]) => <article key={name}><small>{name}</small><code>{formula}</code><p>{use}</p></article>)}</div>
      </section>

      <section><SectionTitle n="05" title="What I did, what I learned, what I can bring" />
        <div className="xl11-learned">{learned.map(([title, text], i) => <article key={title}><span>{String(i + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        <blockquote className="xl11-quote">“Em có thể dùng Excel để biến dữ liệu vận hành thành management reporting, tìm driver của biến động, chạy scenario, theo dõi profitability / working capital và đặt control để output có thể kiểm chứng được.”</blockquote>
      </section>

      <section><SectionTitle n="06" title="How I would use this skill in a finance team" />
        <div className="xl11-employer-grid">
          <article><Table2 /><b>Monthly reporting</b><span>Update controlled actuals, budget / forecast comparators and management P&amp;L.</span></article>
          <article><BarChart3 /><b>Variance investigation</b><span>Move from KPI movement to revenue, margin, cost or working-capital driver.</span></article>
          <article><WalletCards /><b>Planning support</b><span>Maintain assumptions, scenarios and what-if outputs with a clear version boundary.</span></article>
          <article><GitBranch /><b>Model handover</b><span>Keep calculations traceable, documented and supported by checks rather than opaque hardcodes.</span></article>
        </div>
      </section>

      <section><SectionTitle n="07" title="Evidence boundary" />
        <div className="xl11-boundary"><ShieldCheck size={28} /><p>The workbook is a <b>portfolio modelling demonstration</b> using controlled simulated / derived project data. Historical forecast results are labelled <b>SIMULATED_HISTORICAL_BACKTEST</b>. It does not claim live employer performance, live ERP access, statutory-close ownership or genuine live forecast accuracy.</p></div>
      </section>

      <div className="xl11-final-cta"><div><small>RECRUITER QUICK REVIEW</small><h2>Open the workbook, change the scenario / channel selector, inspect the formulas and review the control sheet.</h2></div><a href={workbookUrl} download><Download size={18} /> Download Excel model</a></div>
    </main>
  </div>;
}
