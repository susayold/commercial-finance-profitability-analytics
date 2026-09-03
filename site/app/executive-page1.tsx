'use client';

import { ArrowDownRight, ArrowRight, ArrowUpRight, BarChart3, Box, CalendarDays, CheckCircle2, CircleDollarSign, Clock3, Coins, FileCheck2, Gauge, ShieldCheck, Tag, Target, UserRound, WalletCards, XCircle } from 'lucide-react';
import { page1Data, page1Derived, type Page1Scenario } from '../lib/page1-data';

const one = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const whole = (v: number) => v.toLocaleString('en-US', { maximumFractionDigits: 0 });
const signed = (v: number) => `${v >= 0 ? '+' : ''}${one(v)}`;
const signedPct = (v: number) => `${v >= 0 ? '+' : ''}${one(v)}%`;

function ContextStrip() {
  const items = [
    [CalendarDays, 'Period', page1Data.period], [FileCheck2, 'Planning Case', 'Base'], [FileCheck2, 'Review Type', 'Management Review'],
    [Coins, 'Evidence', 'Simulated / Derived'], [ShieldCheck, 'Currency', 'VND bn'], [Clock3, 'Forecast Gate', 'Gate A Open'],
  ] as const;
  return <div className="exec1-context">{items.map(([Icon, label, value]) => <div key={label}><Icon size={24} /><span><small>{label}</small><b>{value}</b></span></div>)}</div>;
}

function Hero() {
  return <section className="exec1-hero"><div className="exec1-hero-copy"><span className="exec1-eyebrow">EXECUTIVE MANAGEMENT REPORT</span><h1>Growth is investable only<br />when contribution converts<br />into cash.</h1><p>FY2025 planning snapshot for CFO / Business Finance review — connecting earnings quality, cash conversion and scenario discipline.</p></div><aside className="exec1-decision"><span><ShieldCheck size={20} /> DECISION</span><h2>Approve the Base plan<br />with cash gates.</h2><p>{page1Data.decision.body}</p></aside></section>;
}

const kpis = [
  [BarChart3, 'NET REVENUE', one(page1Data.base.revenue), 'bn VND', 'FY2025 Base'],
  [Coins, 'GROSS PROFIT', one(page1Data.base.grossProfit), 'bn VND', `${one(page1Derived.grossMargin)}% gross margin`],
  [ArrowUpRight, 'EBITDA PROXY', one(page1Data.base.ebitdaProxy), 'bn VND', 'Management proxy / Not statutory EBITDA'],
  [Gauge, 'EBITDA PROXY MARGIN', one(page1Data.base.ebitdaMargin), '%', 'Base planning case'],
  [Target, 'CONTRIBUTION', one(page1Data.base.contribution), 'bn VND', `${one(page1Derived.contributionMargin)}% of revenue`],
  [Clock3, 'CASH CONVERSION CYCLE', whole(page1Data.base.ccc), 'days', 'Base case'],
] as const;

function SectionHeading({ number, children }: { number: string; children: React.ReactNode }) { return <div className="exec1-section-heading"><span>{number}</span><h2>{children}</h2></div>; }
function KpiSnapshot() { return <section><SectionHeading number="1">Executive KPI Snapshot</SectionHeading><div className="exec1-kpis">{kpis.map(([Icon, label, value, unit, detail]) => <article key={label}><Icon size={34} /><small>{label}</small><strong>{value} <em>{unit}</em></strong><span>{detail}</span></article>)}</div></section>; }

function ScenarioTable() {
  const rows: Array<[string, Exclude<keyof Page1Scenario, 'name'>, string]> = [['Net Revenue', 'revenue', ''], ['Gross Profit', 'grossProfit', ''], ['EBITDA Proxy', 'ebitdaProxy', ''], ['EBITDA Proxy Margin', 'ebitdaMargin', '%'], ['Contribution', 'contribution', ''], ['CCC', 'ccc', 'd']];
  return <div className="exec1-scenario-wrap"><h3>Scenario Planning Envelope</h3><table className="exec1-scenario"><thead><tr><th scope="col"> </th><th scope="col">Upside</th><th scope="col" className="base-col">Base</th><th scope="col">Downside</th></tr></thead><tbody>{rows.map(([label, key, suffix]) => <tr key={label}><th scope="row">{label}</th>{page1Data.scenarios.map((scenario) => <td key={scenario.name} className={scenario.name === 'Base' ? 'base-col' : ''}>{key === 'ccc' ? whole(scenario[key]) : one(scenario[key])}{suffix}{key === 'ebitdaMargin' ? '%' : ''}</td>)}</tr>)}</tbody></table><small className="exec1-table-note">VND bn except Margin and CCC.</small></div>;
}

function ManagementReadout() { const lines = [<>Base case generates VND {one(page1Data.base.revenue)}bn of Net Revenue, VND {one(page1Data.base.grossProfit)}bn of Gross Profit and VND {one(page1Data.base.ebitdaProxy)}bn of EBITDA proxy.</>, <>The Base case delivers a {one(page1Data.base.ebitdaMargin)}% EBITDA proxy margin, while contribution reaches VND {one(page1Data.base.contribution)}bn.</>, <>The main downside risk is earnings compression rather than revenue alone: Downside Revenue falls to VND {one(page1Data.downside.revenue)}bn, while EBITDA proxy compresses to VND {one(page1Data.downside.ebitdaProxy)}bn and CCC extends to {whole(page1Data.downside.ccc)} days.</>, <>Upside requires both stronger earnings and better cash conversion: Revenue reaches VND {one(page1Data.upside.revenue)}bn, EBITDA proxy VND {one(page1Data.upside.ebitdaProxy)}bn and CCC improves to {whole(page1Data.upside.ccc)} days.</>]; return <div className="exec1-readout">{lines.map((line, i) => <div key={i}><span>{i + 1}</span><BarChart3 size={25} /><p>{line}</p></div>)}</div>; }

function ScenarioDelta({ kind, title, scenario, note }: { kind: 'up' | 'down'; title: string; scenario: Page1Scenario; note: string }) { const isUp = kind === 'up'; const rev = scenario.revenue - page1Data.base.revenue; const revPct = (scenario.revenue / page1Data.base.revenue - 1) * 100; const ebitda = scenario.ebitdaProxy - page1Data.base.ebitdaProxy; const ebitdaPct = (scenario.ebitdaProxy / page1Data.base.ebitdaProxy - 1) * 100; const contribution = scenario.contribution - page1Data.base.contribution; return <article className={`exec1-delta ${kind}`}><h3>{title}</h3><dl><div><dt>Revenue</dt><dd>{signed(rev)}bn / {signedPct(revPct)}</dd></div><div><dt>EBITDA Proxy</dt><dd>{signed(ebitda)}bn / {signedPct(ebitdaPct)}</dd></div><div><dt>Contribution</dt><dd>{signed(contribution)}bn</dd></div><div><dt>CCC</dt><dd>{whole(page1Data.base.ccc)} → {whole(scenario.ccc)} days</dd></div></dl><p>{note}</p>{isUp ? <ArrowUpRight /> : <ArrowDownRight />}</article>; }

function DecisionRule() { return <article className="exec1-rule"><div><span>⚖</span><small>STAY IN BASE WHEN</small><strong>EBITDA Proxy Margin ≥ 15%</strong><b>AND</b><strong>CCC ≤ 58 days</strong><p>If either threshold is breached for two consecutive management reviews, activate the Downside response and freeze discretionary spend.</p></div></article>; }

function ActionIcon({ type }: { type: string }) { if (type === 'stop') return <XCircle />; if (type === 'user') return <UserRound />; if (type === 'box') return <Box />; return <Tag />; }
function PriorityActions() { return <div className="exec1-actions">{page1Data.actions.map((action) => <article key={action.id}><ActionIcon type={action.icon} /><div><h3>{action.title}</h3><p><b>Owner:</b> {action.owner}</p><p><b>Quantified anchor:</b> {action.anchor}</p><p><b>Guardrails:</b> {action.guardrail}</p><p><b>Next review:</b> {action.review}</p></div><span>{action.id}</span></article>)}</div>; }

function Questions() { return <div className="exec1-questions">{page1Data.questions.map(([question, href]) => <a key={href} href={`#${href.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}><ArrowRight /><span>{question}</span><b>{href} <ArrowRight size={15} /></b></a>)}</div>; }

export default function ExecutivePageOne() { return <div className="exec1-page"><Hero /><ContextStrip /><main className="exec1-main"><KpiSnapshot /><section><SectionHeading number="2">Management Readout</SectionHeading><div className="exec1-readout-grid"><ManagementReadout /><ScenarioTable /></div></section><section><SectionHeading number="3">What Changes vs Base?</SectionHeading><div className="exec1-deltas"><ScenarioDelta kind="up" title="UPSIDE VS BASE" scenario={page1Data.upside} note="Upside improves both earnings and cash conversion." /><ScenarioDelta kind="down" title="DOWNSIDE VS BASE" scenario={page1Data.downside} note="Earnings are significantly more sensitive than revenue under the downside case." /></div></section><section><SectionHeading number="4">Management Decision Rule</SectionHeading><DecisionRule /></section><section><SectionHeading number="5">Priority Actions</SectionHeading><PriorityActions /></section><section><SectionHeading number="6">What Management Should Ask Next</SectionHeading><Questions /></section><section><SectionHeading number="7">Evidence Boundary</SectionHeading><div className="exec1-evidence"><ShieldCheck size={40} /><p>Evidence boundary — VietNova operating data is <b>SIMULATED / DERIVED</b>. Executive planning metrics are <b>PROXY_DERIVED</b>. EBITDA Proxy is a management measure, not statutory EBITDA. Live forecast accuracy remains Gate A / <b>PENDING_EXTERNAL_INPUT</b>.</p><span>SIMULATED</span><span>PROXY_DERIVED</span><span>GATE A OPEN</span></div></section></main></div>; }
