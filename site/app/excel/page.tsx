'use client';

import { BarChart3, Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import { useMemo, useState } from 'react';
import '../excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';
const PUBLIC_ROOT = 'https://susayold.github.io/commercial-finance-profitability-analytics';

const workbooks = [
  {
    id: 'flagship',
    label: 'Full FP&A Model',
    short: 'Flagship',
    file: 'VietNova_FPA_Flagship_Model_v2.0.xlsx',
    sheets: 28,
    charts: 15,
    description: 'End-to-end model: source registers, assumptions, operating facts, budget, forecast, P&L, PVM, profitability, working capital, scenario, costing, three statements and controls.',
  },
  {
    id: 'mbr',
    label: 'Management Reporting & MBR',
    short: 'Management Reporting',
    file: 'VietNova_Management_Reporting_MBR_v2.0.xlsx',
    sheets: 10,
    charts: 9,
    description: 'Actual vs Budget vs Forecast, monthly KPI trends, variance commentary, OPEX/headcount and management action register.',
  },
  {
    id: 'commercial',
    label: 'Commercial & Profitability',
    short: 'Commercial',
    file: 'VietNova_Commercial_Profitability_v2.0.xlsx',
    sheets: 11,
    charts: 12,
    description: 'Channel, customer, SKU and promotion economics, contribution margin, GTN, PVM and commercial budget allocation.',
  },
  {
    id: 'working-capital',
    label: 'Working Capital & Liquidity',
    short: 'Working Capital',
    file: 'VietNova_Working_Capital_Liquidity_v2.0.xlsx',
    sheets: 10,
    charts: 10,
    description: 'AR/AP/inventory, DSO/DIO/DPO, CCC bridge, aging analysis and FY2026 liquidity stress rehearsal.',
  },
  {
    id: 'costing',
    label: 'Costing & Variance',
    short: 'Costing',
    file: 'VietNova_Costing_Variance_v2.0.xlsx',
    sheets: 10,
    charts: 9,
    description: '36-SKU standard costing, material-price/usage/conversion variance, inventory reserve and slow-mover controls.',
  },
  {
    id: 'forecast',
    label: 'Forecast & Scenario',
    short: 'Forecast',
    file: 'VietNova_Forecast_Scenario_v2.0.xlsx',
    sheets: 10,
    charts: 9,
    description: 'Forecast versions, rolling-origin backtest, WAPE/Bias/MAE, Base/Upside/Downside scenarios, sensitivities and Gate A controls.',
  },
] as const;

const reportPages = [
  ['Executive', 'executive'], ['Performance', 'performance'], ['Commercial', 'commercial'],
  ['Profitability', 'profitability'], ['Costing', 'costing'], ['Resources', 'resources'],
  ['Cash & WC', 'cash'], ['Forecast', 'forecast'], ['Evidence', 'evidence'],
] as const;

export default function ExcelShowcasePage() {
  const [selectedId, setSelectedId] = useState<(typeof workbooks)[number]['id']>('flagship');
  const selected = useMemo(() => workbooks.find((x) => x.id === selectedId) ?? workbooks[0], [selectedId]);
  const workbookUrl = `${BASE}/downloads/excel/${selected.file}`;
  const publicWorkbookUrl = `${PUBLIC_ROOT}/downloads/excel/${selected.file}`;
  const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(publicWorkbookUrl)}`;

  return (
    <main className="excel-live-page" id="excel-model">
      <header className="report-nav excel-live-nav">
        <a className="report-brand" href={`${BASE}/#executive`}><span>VN<span className="report-brand-slash">/</span>FINANCE</span><small>Commercial Finance &amp; FP&amp;A</small></a>
        <span className="report-entity"><BarChart3 size={17} /> VietNova Consumer JSC</span>
        <nav aria-label="Primary navigation">
          {reportPages.map(([label, id]) => <a key={id} href={`${BASE}/#${id}`}>{label}</a>)}
          <a href={`${BASE}/dashboard/`}>Dashboard</a>
          <a className="active" aria-current="page" href={`${BASE}/excel/`}>Excel</a>
        </nav>
        <a className="report-dashboard-link" href={workbookUrl} download>Download Excel <Download size={14} /></a>
      </header>

      <section className="excel-portfolio-head">
        <div><b>EXCEL MODEL PORTFOLIO</b><strong>6 workbooks · 79 sheets · 64 charts</strong><span>Choose a workbook below. The native .xlsx opens directly inside the page.</span></div>
        <div className="excel-portfolio-stats"><span><b>28</b> flagship sheets</span><span><b>64</b> charts</span><span><b>6</b> review files</span></div>
      </section>

      <section className="excel-workbook-tabs" aria-label="Excel workbook selector">
        {workbooks.map((book) => (
          <button key={book.id} type="button" className={selected.id === book.id ? 'active' : ''} onClick={() => setSelectedId(book.id)}>
            <FileSpreadsheet size={17} /><span><b>{book.short}</b><small>{book.sheets} sheets · {book.charts} charts</small></span>
          </button>
        ))}
      </section>

      <section className="excel-live-filebar" aria-label="Excel workbook controls">
        <div className="excel-live-file"><FileSpreadsheet size={24} /><span><strong>{selected.label}</strong><small>{selected.file} · {selected.sheets} sheets · {selected.charts} charts</small></span></div>
        <p className="excel-live-description">{selected.description}</p>
        <div className="excel-live-actions">
          <a href={officeViewerUrl} target="_blank" rel="noreferrer">Open full screen <ExternalLink size={14} /></a>
          <a href={workbookUrl} download>Download .xlsx <Download size={14} /></a>
        </div>
      </section>

      <section className="excel-live-viewer" aria-label={`Live Excel workbook: ${selected.label}`}>
        <iframe key={selected.file} src={officeViewerUrl} title={`${selected.label} Excel workbook viewer`} loading="eager" allowFullScreen />
      </section>
      <div className="excel-viewer-fallback">If Microsoft Office Viewer is unavailable in your browser, use <a href={workbookUrl} download>Download .xlsx</a> or <a href={officeViewerUrl} target="_blank" rel="noreferrer">Open full screen</a>.</div>
    </main>
  );
}
