# Management Recommendation Register — Finance Analyst Portfolio

Date: 2026-08-30  
Purpose: convert model findings into decision-ready recommendations with an explicit value equation, owner, guardrail, evidence class and follow-up date.

## Decision policy

A recommendation is release-ready only when it states:

- The decision and the business problem.
- The quantified value equation or observed signal.
- The evidence class and source artifact.
- The accountable owner.
- The guardrail / stop-loss rule.
- The next review date and required evidence.

All VietNova recommendations below are simulated or proxy-derived. They are not claims of real-company impact.

## Recommendation register

| ID | Decision | Why now / signal | Quantified anchor | Value equation | Owner | Guardrail | Evidence class | Next review |
|---|---|---|---|---|---|---|---|---|
| REC-01 | Reallocate commercial budget toward positive-ROI promotions | Fixed-budget allocation identifies higher incremental contribution pockets | VND 4.35bn budget; modeled incremental contribution VND 55m | Incremental CM − trade spend | Commercial finance | Promo ROI ≥ 25%; CM% ≥ 25% | SIMULATED_DERIVED | Next monthly close |
| REC-02 | Stop or redesign negative-contribution promotion waves | High volume can hide fee, discount and trade-spend leakage | Four negative-contribution cases flagged in promotion QA | Incremental CM after spend | Revenue growth manager | No scale decision when ROI < 25% | SIMULATED_DERIVED | Post-promotion review |
| REC-03 | Enforce marketplace price floors | Marketplace revenue growth is accompanied by platform, voucher and fulfilment costs | Marketplace bar is 48% of top channel index; net CM must remain above hurdle | CM uplift = price change − variable cost | E-commerce finance | Net CM ≥ 25%; volume drop ≤ 3% | SIMULATED_DERIVED | Two-week test |
| REC-04 | Collect top overdue accounts before funding more growth | DSO deterioration converts a P&L win into cash pressure | Base CCC 54.8 days; Downside CCC 68.8 days | Cash release = DSO days reduced × approved daily sales | AR lead | DSO ≤ Base + 5 days | PROXY_DERIVED | Weekly cash call |
| REC-05 | Reduce slow-SKU inventory and protect service level | DIO deterioration ties cash in low-velocity stock | Downside CCC rises by 14.0 days versus Base | Cash release = DIO days reduced × approved daily COGS | Supply-chain finance | Service level ≥ 95%; no stock-out of A items | PROXY_DERIVED | Weekly S&OP |
| REC-06 | Keep Base as planning case; gate Upside on evidence | Upside assumes both growth and better cash conversion | Base revenue VND 80.1bn vs Upside VND 83.3bn; CCC 54.8 vs 48.8 days | Incremental contribution − incremental risk/cash | FP&A lead | Two closes above CM hurdle; no service breach | PROXY_DERIVED | Forecast cycle |
| REC-07 | Add a CoA mapping before calling proxy EBITDA/OCF production metrics | Proxy lines are useful for rehearsal but not statutory reporting | Current executive output labels EBITDA and OCF as proxy | Traceable mapped lines / total lines | Finance systems | CoA coverage ≥ 98% | SYNTHETIC_ASSUMPTION | Month-end close |
| REC-08 | Use MCH cash conversion as a credit watch item | Reported PAT is not enough to infer debt-service capacity | FY2025 CFO/PAT 31.5%; equity ratio 54.9% | Credit risk = cash conversion + leverage + maturity evidence | Credit reviewer | Debt, interest and maturity schedules required | OBSERVED_DERIVED | Annual-report refresh |
| REC-09 | Treat D2C acquisition as value-destructive until retention improves | Unit economics currently fail an illustrative hurdle | LTV/CAC 0.72x; payback 3.33 orders | LTV contribution − CAC | D2C finance | LTV/CAC ≥ 1.0x before scale | SIMULATED_DERIVED | Monthly cohort review |
| REC-10 | Screen the NovaBite acquisition only with downside sensitivities | Year 1 dilution means headline accretion is not sufficient | Year-2 EPS accretion 17.16%; deal NPV VND 28.39bn | PV of incremental cash flows − purchase price | Corporate finance | Integration costs, leverage and diligence complete | SYNTHETIC_DERIVED | Investment committee |
| REC-11 | Capture a FROZEN forecast snapshot before every close | Without pre-close versioning, Bias/WAPE is not defensible | Gate A currently open; public-guidance proxy excluded | Forecast error = frozen forecast − actual | FP&A lead | Approver, version, dates and close evidence present | GOVERNANCE_CONTROL | Before next close |
| REC-12 | Complete native Power BI QA before publishing visuals | A PBIP contract is not the same as a tested PBIX | Gate B currently open; 18 evidence rows required | Passed QA tests / 18 | Reporting lead | Observed value, reviewer, timestamp and remediation | GOVERNANCE_CONTROL | Before public release |

## Recommendation-to-evidence map

| Recommendation | Primary artifact | Validation / control |
|---|---|---|
| REC-01 / REC-02 | Promotion ROI and budget allocation modules | Promotion ROI QA; fixed-budget conservation |
| REC-03 | Pricing simulator and channel profitability | Pricing validator; contribution-margin hurdle |
| REC-04 / REC-05 | Working Capital and MBR operating pack | CCC arithmetic; owner/trigger fields |
| REC-06 / REC-07 | Executive Output reconciliation | Proxy labels; CoA mapping release checklist |
| REC-08 | MCH financial-statement analysis and credit memo | 11/11 analysis QA; 15/15 credit QA |
| REC-09 | D2C unit economics | 6/6 native controls |
| REC-10 | M&A accretion/dilution model | Formula and NPV QA |
| REC-11 | Forecast capture governance | Gate A schema and leakage validator |
| REC-12 | Power BI QA evidence log | QA-01–QA-18 evidence contract |

## How to present recommendations in an interview

Use this sequence:

1. State the business decision, not the chart.
2. Quantify the economic mechanism.
3. Explain the main uncertainty or caveat.
4. Name the owner and guardrail.
5. State the next evidence needed to confirm or reverse the decision.

Example:

> I would keep the Base case, reallocate promotion spend only where incremental contribution clears the 25% hurdle, and require a DSO action owner before funding Upside. The numbers are synthetic proxy outputs, so I would replace them with a locked budget, CoA-mapped P&L and a FROZEN pre-close snapshot before calling the recommendation production-ready.

## Release boundary

This register demonstrates management judgement and communication. It does not claim realized savings, revenue uplift or investment returns. Every recommendation remains conditional on its evidence class and guardrail.
