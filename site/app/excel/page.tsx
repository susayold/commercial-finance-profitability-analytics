'use client';

import { BarChart3, Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import { useMemo, useState } from 'react';
import '../excel-page11.css';

const BASE = '/commercial-finance-profitability-analytics';
const MBR_SHA256 = 'e3cc9f726fe1213c31706c1b445e7b4eaa03b34148b91782d75d1bb782042956';
const MBR_PARTS = [
  `${BASE}/downloads/excel/mbr-v4/part01.b64`,
  `${BASE}/downloads/excel/mbr-v4/part02.b64`,
  `${BASE}/downloads/excel/mbr-v4/part03.b64`,
  `${BASE}/downloads/excel/mbr-v4/part04.b64`,
  `${BASE}/downloads/excel/mbr-v4/part05.b64`,
] as const;

const workbooks = [
  {
    id: 'flagship',
    label: 'Full FP&A Model',
    short: 'Flagship',
    file: 'VietNova_FPA_Flagship_Model_v2.0.xlsx',
    sheets: 28,
    charts: 15,
    available: false,
    driveUrl: null,
    description: 'End-to-end model: source registers, assumptions, operating facts, budget, forecast, P&L, PVM, profitability, working capital, scenario, costing, three statements and controls.',
  },
  {
    id: 'mbr',
    label: 'Management Reporting & MBR',
    short: 'Management Reporting',
    file: '02_Management_Reporting_MBR_Aberdeen_Style_v4_Legibility_Fixed.xlsx',
    sheets: 17,
    charts: 15,
    available: true,
    driveUrl: 'https://drive.google.com/file/d/1PnPtTP-hDamsUcbaQr8t_lKhUSIWgfQx/view',
    description: 'Approved Aberdeen-style MBR model: Actual vs Budget vs Forecast, executive summary, PVM, commercial and promotion economics, working capital, costing, forecast governance, scenarios, CAPEX/OPEX, actions, checks and source log.',
  },
  {
    id: 'commercial',
    label: 'Commercial & Profitability',
    short: 'Commercial',
    file: 'VietNova_Commercial_Profitability_v2.0.xlsx',
    sheets: 11,
    charts: 12,
    available: false,
    driveUrl: null,
    description: 'Channel, customer, SKU and promotion economics, contribution margin, GTN, PVM and commercial budget allocation.',
  },
  {
    id: 'working-capital',
    label: 'Working Capital & Liquidity',
    short: 'Working Capital',
    file: 'VietNova_Working_Capital_Liquidity_v2.0.xlsx',
    sheets: 10,
    charts: 10,
    available: false,
    driveUrl: null,
    description: 'AR/AP/inventory, DSO/DIO/DPO, CCC bridge, aging analysis and FY2026 liquidity stress rehearsal.',
  },
  {
    id: 'costing',
    label: 'Costing & Variance',
    short: 'Costing',
    file: 'VietNova_Costing_Variance_v2.0.xlsx',
    sheets: 10,
    charts: 9,
    available: false,
    driveUrl: null,
    description: '36-SKU standard costing, material-price/usage/conversion variance, inventory reserve and slow-mover controls.',
  },
  {
    id: 'forecast',
    label: 'Forecast & Scenario',
    short: 'Forecast',
    file: 'VietNova_Forecast_Scenario_v2.0.xlsx',
    sheets: 10,
    charts: 9,
    available: false,
    driveUrl: null,
    description: 'Forecast versions, rolling-origin backtest, WAPE/Bias/MAE, Base/Upside/Downside scenarios, sensitivities and Gate A controls.',
  },
] as const;

const reportPages = [
  ['Executive', 'executive'], ['Performance', 'performance'], ['Commercial', 'commercial'],
  ['Profitability', 'profitability'], ['Costing', 'costing'], ['Resources', 'resources'],
  ['Cash & WC', 'cash'], ['Forecast', 'forecast'], ['Evidence', 'evidence'],
] as const;

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export default function ExcelShowcasePage() {
  const [selectedId, setSelectedId] = useState<(typeof workbooks)[number]['id']>('mbr');
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'error'>('idle');
  const selected = useMemo(() => workbooks.find((x) => x.id === selectedId) ?? workbooks[1], [selectedId]);

  async function downloadApprovedMbr() {
    if (downloadState === 'loading') return;
    setDownloadState('loading');

    try {
      const parts = await Promise.all(MBR_PARTS.map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Could not load workbook payload: ${url}`);
        return (await response.text()).trim();
      }));

      const payload = parts.join('').replace(/\s/g, '');
      const binary = atob(payload);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

      const digest = await crypto.subtle.digest('SHA-256', bytes);
      const digestHex = bytesToHex(new Uint8Array(digest));
      if (digestHex !== MBR_SHA256) throw new Error('Workbook integrity check failed.');

      const blob = new Blob([bytes], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.download = workbooks[1].file;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
      setDownloadState('idle');
    } catch (error) {
      console.error(error);
      setDownloadState('error');
    }
  }

  function handleDownload(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    void downloadApprovedMbr();
  }

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
        {selected.available ? (
          <a className="report-dashboard-link" href="#download-approved-mbr" onClick={handleDownload}>
            {downloadState === 'loading' ? 'Preparing Excel…' : 'Download Excel'} <Download size={14} />
          </a>
        ) : (
          <a className="report-dashboard-link" href="#portfolio-status">Planned workbook</a>
        )}
      </header>

      <section className="excel-portfolio-head" id="portfolio-status">
        <div>
          <b>EXCEL MODEL PORTFOLIO</b>
          <strong>1 approved workbook live · 5 portfolio modules staged</strong>
          <span>Management Reporting &amp; MBR v4 is the approved native workbook. Planned modules remain visible without broken download links.</span>
        </div>
        <div className="excel-portfolio-stats">
          <span><b>17</b> approved sheets</span>
          <span><b>15</b> approved charts</span>
          <span><b>6</b> portfolio workbooks</span>
        </div>
      </section>

      <section className="excel-workbook-tabs" aria-label="Excel workbook selector">
        {workbooks.map((book) => (
          <button key={book.id} type="button" className={selected.id === book.id ? 'active' : ''} onClick={() => setSelectedId(book.id)}>
            <FileSpreadsheet size={17} />
            <span>
              <b>{book.short}</b>
              <small>{book.sheets} sheets · {book.charts} charts · {book.available ? 'READY' : 'PLANNED'}</small>
            </span>
          </button>
        ))}
      </section>

      <section className="excel-live-filebar" aria-label="Excel workbook controls">
        <div className="excel-live-file">
          <FileSpreadsheet size={24} />
          <span><strong>{selected.label}</strong><small>{selected.file} · {selected.sheets} sheets · {selected.charts} charts</small></span>
        </div>
        <p className="excel-live-description">{selected.description}</p>
        <div className="excel-live-actions">
          {selected.available ? (
            <>
              <a href="#download-approved-mbr" onClick={handleDownload}>{downloadState === 'loading' ? 'Preparing…' : 'Download .xlsx'} <Download size={14} /></a>
              {selected.driveUrl && <a href={selected.driveUrl} target="_blank" rel="noreferrer">Drive storage copy <ExternalLink size={14} /></a>}
            </>
          ) : (
            <a href="#portfolio-status">Planned module · download not published yet</a>
          )}
        </div>
      </section>

      {selected.available ? (
        <div className="excel-viewer-fallback" id="download-approved-mbr">
          <strong>Approved workbook ready.</strong> The GitHub-hosted payload is reconstructed in your browser and SHA-256 verified before the native .xlsx download starts. This release contains 17 sheets and 15 charts, with Aberdeen-style model formatting and the final legibility pass. SHA-256: <code>{MBR_SHA256}</code>.
          {downloadState === 'error' && <> The GitHub payload could not be verified in this browser; use the Drive storage copy above.</>}
        </div>
      ) : (
        <div className="excel-viewer-fallback">
          <strong>{selected.label}</strong> is part of the staged six-workbook portfolio and is not published as an approved download yet. This page deliberately avoids linking to a placeholder .xlsx.
        </div>
      )}
    </main>
  );
}
