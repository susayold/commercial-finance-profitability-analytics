import recruiterSnapshot from '../data/recruiter_metric_snapshot.json';

type Metric = { value: number; unit: string; evidence_class: string };
type ScenarioSource = Record<string, Metric>;

const source = recruiterSnapshot.scenarios as Record<'BASE' | 'UPSIDE' | 'DOWNSIDE', ScenarioSource>;
const read = (scenario: ScenarioSource, key: string) => scenario[key].value;

export type Page1Scenario = {
  name: 'Base' | 'Upside' | 'Downside';
  revenue: number;
  grossProfit: number;
  ebitdaProxy: number;
  ebitdaMargin: number;
  contribution: number;
  ccc: number;
};

const makeScenario = (key: 'BASE' | 'UPSIDE' | 'DOWNSIDE', name: Page1Scenario['name']): Page1Scenario => ({
  name,
  revenue: read(source[key], 'REV_NET'),
  grossProfit: read(source[key], 'GROSS_PROFIT'),
  ebitdaProxy: read(source[key], 'EBITDA_PROXY'),
  ebitdaMargin: read(source[key], 'EBITDA_PROXY_MARGIN'),
  contribution: read(source[key], 'CONTRIBUTION'),
  ccc: read(source[key], 'CCC'),
});

export const page1Data = {
  period: 'FY2025',
  company: 'VietNova Consumer JSC',
  scenarios: [makeScenario('UPSIDE', 'Upside'), makeScenario('BASE', 'Base'), makeScenario('DOWNSIDE', 'Downside')],
  base: makeScenario('BASE', 'Base'),
  upside: makeScenario('UPSIDE', 'Upside'),
  downside: makeScenario('DOWNSIDE', 'Downside'),
  decision: {
    title: 'Approve the Base plan with cash gates.',
    body: 'Maintain the Base case while profitability and cash-conversion guardrails remain intact; escalate to downside actions when operating thresholds are breached.',
  },
  actions: [
    { id: 'REC-01', title: 'Reallocate promotion budget', icon: 'tag', owner: 'Commercial Finance', anchor: 'VND 4.35bn fixed budget envelope; VND 55m modeled incremental contribution', guardrail: 'ROI ≥ 25%; CM% ≥ 25%', review: 'Next monthly close', evidence: 'SIMULATED_DERIVED' },
    { id: 'REC-02', title: 'Stop negative promotions', icon: 'stop', owner: 'Revenue Growth Manager', anchor: '4 negative-contribution cases', guardrail: 'ROI ≥ 25%', review: 'Post-promotion review', evidence: 'SIMULATED_DERIVED' },
    { id: 'REC-04', title: 'Collect overdue accounts', icon: 'user', owner: 'AR Lead', anchor: 'CCC Base 54d vs Downside 68d', guardrail: 'DSO ≤ Base + 5 days', review: 'Weekly cash call', evidence: 'PROXY_DERIVED' },
    { id: 'REC-05', title: 'Reduce slow-SKU inventory', icon: 'box', owner: 'Supply-chain Finance', anchor: 'Downside CCC deterioration = +14 days', guardrail: 'Service level ≥ 95%', review: 'Weekly S&OP', evidence: 'PROXY_DERIVED' },
  ],
  questions: [
    ['What is driving the P&L outcome?', 'Performance'],
    ['Which channels and promotions create economic value?', 'Commercial'],
    ['Which customers destroy value after working-capital cost?', 'Profitability'],
    ['Where is cash trapped?', 'Cash & Working Capital'],
    ['What would move the plan into Upside or Downside?', 'Forecast'],
  ],
} as const;

export const page1Derived = {
  grossMargin: page1Data.base.grossProfit / page1Data.base.revenue * 100,
  contributionMargin: page1Data.base.contribution / page1Data.base.revenue * 100,
  upsideRevenueDelta: page1Data.upside.revenue - page1Data.base.revenue,
  upsideRevenuePct: (page1Data.upside.revenue / page1Data.base.revenue - 1) * 100,
  upsideEbitdaDelta: page1Data.upside.ebitdaProxy - page1Data.base.ebitdaProxy,
  upsideEbitdaPct: (page1Data.upside.ebitdaProxy / page1Data.base.ebitdaProxy - 1) * 100,
  upsideContributionDelta: page1Data.upside.contribution - page1Data.base.contribution,
  downsideRevenueDelta: page1Data.downside.revenue - page1Data.base.revenue,
  downsideRevenuePct: (page1Data.downside.revenue / page1Data.base.revenue - 1) * 100,
  downsideEbitdaDelta: page1Data.downside.ebitdaProxy - page1Data.base.ebitdaProxy,
  downsideEbitdaPct: (page1Data.downside.ebitdaProxy / page1Data.base.ebitdaProxy - 1) * 100,
  downsideContributionDelta: page1Data.downside.contribution - page1Data.base.contribution,
};
