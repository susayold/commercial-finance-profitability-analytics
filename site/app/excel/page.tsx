'use client';

import { useState } from 'react';
import { BarChart3, Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import '../excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';

const workbooks = [
  {
    id: 'full-fpa',
    name: 'Full FP&A Model',
    role: 'Flagship integrated model',
    purpose: 'End-to-end planning, performance management and finance decision support.',
    sheets: 25,
    charts: 16,
    tags: ['Actual / Budget / Forecast', 'P&L & Variance', 'PVM', 'WC & Liquidity', 'Costing', 'Scenario'],
    driveId: '19xc_sxYIWHFniwnE5GSiWyQIxby0dOvJ',
    previewId: '15oK-aqYic44JOpden_efIYBD2eygn2SjsPCOD23Jymc',
    flagship: true,
  },
  {
    id: 'mbr',
    name: 'Management Reporting & MBR',
    role: 'Management reporting',
    purpose: 'Monthly business review pack linking operating performance to management actions.',
    sheets: 17,
    charts: 15,
    tags: ['Executive Summary', 'Monthly P&L', 'Variance', 'Commercial', 'CAPEX / OPEX'],
    driveId: '1BAmzlMw2X-1HSqSurrML9iUZr9UcU_sv',
    previewId: '14xSRpm4cL6E6ghJTgA0irKjy269PZswUn34knVa6iS8',
    flagship: false,
  },
  {
    id: 'commercial',
    name: 'Commercial Profitability',
    role: 'Commercial finance deep dive',
    purpose: 'Channel, customer, SKU, pricing and promotion economics focused on contribution quality.',
    sheets: 16,
    charts: 8,
    tags: ['Channel Economics', 'Customer / SKU', 'Promotion ROI', 'Pricing', 'PVM', 'Concentration'],
    driveId: '1-PAT64gK5zaY7vkaypv4pV6gIi38FEL3',
    previewId: '15wnlIXBMsuYocSjMmlOFAQfx6f-HSKsdLwQnUHVkRsE',
    flagship: false,
  },
  {
    id: 'working-capital',
    name: 'Working Capital & Liquidity',
    role: 'Cash & liquidity deep dive',
    purpose: 'AR, AP, inventory, CCC, collections and liquidity-stress decision support.',
    sheets: 14,
    charts: 6,
    tags: ['AR / AP Aging', 'Inventory', 'DSO / DIO / DPO', 'CCC', 'Liquidity Stress'],
    driveId: '1zN8m9S3NS__qCU506hWm3BbtTRd1Jo2F',
    previewId: '1J1uLgeFY0R-lKOFrGInLTx2I_IZH7rgUywG7cMGas7Y',
    flagship: false,
  },
  {
    id: 'costing',
    name: 'Costing & Variance',
    role: 'Cost control deep dive',
    purpose: 'Standard cost, material price, usage/yield and conversion variance with sourcing actions.',
    sheets: 13,
    charts: 5,
    tags: ['Standard vs Actual', 'MPV', 'Usage / Yield', 'Conversion', 'Inventory Reserve'],
    driveId: '1RVZL2LIfEXNQhdHjNRPGSe8fJ0dKEqSa',
    previewId: '1mBW_M1QpPhKHvQd_UjwOtLRjTV2TZPlz4a9iIk7_6tY',
    flagship: false,
  },
  {
    id: 'forecast',
    name: 'Forecast & Scenario Planning',
    role: 'Planning & forecast deep dive',
    purpose: 'Rolling-origin backtests, model comparison, scenarios, sensitivities and 3-year outlook.',
    sheets: 14,
    charts: 5,
    tags: ['Backtesting', 'Model Comparison', 'Scenario', 'Sensitivity', 'Rolling Forecast', '3Y Outlook'],
    driveId: '1J6PQa2jB6PrWLOjlT0t9-5QLV2IZyjRr',
    previewId: '1hF2oSLkJD6puiFTy_PDIBfrUuypWZMbUhOOXdYxRYQA',
    flagship: false,
  },
] as const;

const reportPages = [
  ['Executive', 'executive'],
  ['Performance', 'performance'],
  ['Commercial', 'commercial'],
  ['Profitability', 'profitability'],
  ['Costing', 'costing'],
  ['Resources', 'resources'],
  ['Cash & WC', 'cash'],
  ['Forecast', 'forecast'],
  ['Evidence', 'evidence'],
] as const;

export default function ExcelShowcasePage() {
  const [activeId, setActiveId] = useState<(typeof workbooks)[number]['id']>('full-fpa');
  const active = workbooks.find((workbook) => workbook.id === activeId) ?? workbooks[0];

  const previewUrl = `https://docs.google.com/spreadsheets/d/${active.previewId}/preview?rm=minimal&widget=true&headers=false`;
  const previewFullUrl = `https://docs.google.com/spreadsheets/d/${active.previewId}/edit`;
  const workbookUrl = `https://drive.google.com/file/d/${active.driveId}/view`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${active.driveId}`;

  return (
    <main className="excel-live-page" id="excel-model">
      <header className="report-nav excel-live-nav">
        <a className="report-brand" href={`${BASE}/#executive`}>
          <span>VN<span className="report-brand-slash">/</span>FINANCE</span>
          <small>Commercial Finance &amp; FP&amp;A</small>
        </a>
        <span className="report-entity"><BarChart3 size={17} /> VietNova Consumer JSC</span>
        <nav aria-label="Primary navigation">
          {reportPages.map(([label, id]) => <a key={id} href={`${BASE}/#${id}`}>{label}</a>)}
          <a href={`${BASE}/dashboard/`}>Dashboard</a>
          <a className="active" aria-current="page" href={`${BASE}/excel/`}>Excel</a>
        </nav>
        <a className="report-dashboard-link" href={downloadUrl} target="_blank" rel="noreferrer">
          Download active model <Download size={14} />
        </a>
      </header>

      <section className="excel-library-intro" aria-labelledby="excel-library-title">
        <div>
          <span className="excel-library-eyebrow">EXCEL FINANCIAL MODEL LIBRARY</span>
          <h1 id="excel-library-title">Six controlled workbooks. One integrated finance story.</h1>
          <p>Start with the flagship FP&amp;A model, then open the specialist workbooks for management reporting, commercial profitability, working capital, costing and forecasting.</p>
        </div>
        <div className="excel-library-stats" aria-label="Excel model library statistics">
          <span><strong>6</strong><small>workbooks</small></span>
          <span><strong>99</strong><small>sheets</small></span>
          <span><strong>55</strong><small>charts</small></span>
        </div>
      </section>

      <section className="excel-model-grid" aria-label="Choose an Excel financial model">
        {workbooks.map((workbook) => (
          <button
            key={workbook.id}
            type="button"
            className={`excel-model-card${workbook.flagship ? ' flagship' : ''}${active.id === workbook.id ? ' active' : ''}`}
            onClick={() => setActiveId(workbook.id)}
            aria-pressed={active.id === workbook.id}
          >
            <span className="excel-model-card-topline">
              <span className="excel-model-badge">{workbook.flagship ? 'FLAGSHIP' : 'DEEP DIVE'}</span>
              <span className="excel-model-meta">{workbook.sheets} sheets · {workbook.charts} charts</span>
            </span>
            <strong>{workbook.name}</strong>
            <em>{workbook.role}</em>
            <p>{workbook.purpose}</p>
            <span className="excel-model-tags">
              {workbook.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </span>
          </button>
        ))}
      </section>

      <section className="excel-live-filebar" aria-label="Active Excel workbook controls">
        <div className="excel-live-file">
          <FileSpreadsheet size={22} />
          <span>
            <strong>{active.name}</strong>
            <small>{active.role} · {active.sheets} sheets · {active.charts} charts</small>
          </span>
        </div>
        <div className="excel-live-actions">
          <a href={previewFullUrl} target="_blank" rel="noreferrer">Open preview <ExternalLink size={14} /></a>
          <a href={workbookUrl} target="_blank" rel="noreferrer">Open source <ExternalLink size={14} /></a>
          <a href={downloadUrl} target="_blank" rel="noreferrer">Download .xlsx <Download size={14} /></a>
        </div>
      </section>

      <section className="excel-live-viewer" aria-label={`${active.name} workbook preview`}>
        <iframe
          key={active.previewId}
          src={previewUrl}
          title={`${active.name} workbook preview`}
          loading="eager"
          allowFullScreen
        />
      </section>

      <div className="excel-viewer-fallback">
        Preview uses a chart-preserving Google Sheets conversion; the original Excel workbook remains the controlled download. Select any model above to switch the workbook without leaving the portfolio.
      </div>
    </main>
  );
}
