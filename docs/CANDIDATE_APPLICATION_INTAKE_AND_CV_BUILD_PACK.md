# Candidate Application Intake & CV Build Pack

This pack turns the portfolio into an application-ready Finance Analyst / FP&A package without inventing personal facts or overstating synthetic evidence. Complete the intake fields first; then select the role variant that matches the job description.

## 1. Candidate facts to complete

Replace every bracketed field before sending an application.

| Field | Required value | Evidence/source |
|---|---|---|
| Full name | `[FULL NAME]` | Passport/official spelling |
| City, country and work authorization | `[CITY, COUNTRY]` / `[STATUS]` | Candidate-confirmed |
| Email / phone / LinkedIn | `[CONTACT]` | Candidate-confirmed |
| Education | `[DEGREE, UNIVERSITY, GRADUATION]` | Transcript or CV |
| Experience | `[EMPLOYER, ROLE, DATES]` | Employment record |
| Tools | `[Excel, Power BI, SQL, Python, ERP]` | Only tools actually used |
| Languages | `[LANGUAGE + LEVEL]` | Candidate-confirmed |
| Availability | `[NOTICE PERIOD]` | Candidate-confirmed |

Do not place a portfolio result in the Experience section unless the candidate actually performed that work. Portfolio evidence belongs under Projects.

## 2. Evidence inventory

| Portfolio artifact | Validated signal | Safe CV wording before external gates | Link to proof |
|---|---|---|---|
| Excel FP&A v2 | 28 tabs, P&L, PVM, profitability, WC, liquidity, scenarios | “Built a formula-driven 28-tab FP&A model using deterministic synthetic operating data” | GitHub README / Drive workbook |
| Commercial stretch | Promotion ROI after spend, pricing elasticity, fixed-budget allocation | “Evaluated promotion and pricing scenarios with hurdle, break-even and budget-conservation controls” | Methodology + QA report |
| Public peer panel | VNM FY2006–FY2025; QNS/KDC/MCH context | “Normalized long-run public financial history with source and comparability flags” | Peer panel + source registry |
| Forecast proxy | Public-guidance Bias/WAPE only | “Analyzed a public-guidance forecast proxy; explicitly excluded from internal accuracy claims” | Public-guidance report |
| D2C unit economics | CAC, LTV contribution, payback, guardrails | “Built a unit-economics decision case with CAC/LTV and payback controls” | D2C methodology + QA |
| PBIP handoff | 6-page source scaffold, 18 QA definitions | “Prepared a portable Power BI source handoff and QA contract” | PBIP manifest + execution pack |
| M&A stretch | Accretion/dilution and sensitivity screen | “Built a synthetic accretion/dilution screen with integration-cost and synergy sensitivities” | M&A memo + QA |

Use the exact evidence class (`SYNTHETIC`, `PUBLIC_GUIDANCE_PROXY`, `PBIP_SCAFFOLD`) whenever a recruiter could otherwise infer company-internal data.

## 3. One-page CV architecture

Recommended order for a junior candidate:

1. Header and two-line positioning statement.
2. Skills grouped by Finance, Modelling, Analytics and Communication.
3. Selected Projects (above Education when the project is stronger than the academic section).
4. Experience with quantified, candidate-owned results.
5. Education, certifications and languages.

Keep one page, 10–10.5 pt body text, one date format, no unexplained acronyms and no generic “responsible for” bullets. Every portfolio bullet should point to a durable artifact.

## 4. Role-specific positioning

### Junior FP&A / Finance Analyst

Headline: `Finance Analyst | FP&A | Forecasting, Variance & Profitability`

Lead with:

- monthly P&L and Actual vs Budget / Forecast;
- PVM and margin bridge;
- rolling forecast, scenarios and working capital;
- Excel controls, reconciliation and management communication.

Suggested project bullets (replace links and keep labels):

- Built a formula-driven 28-tab FP&A model for a synthetic FMCG company, linking invoice-level sales to P&L, PVM, working capital, liquidity, scenarios and CFO outputs; reconciled totals with zero formula-error matches and nine control checks passed.
- Diagnosed channel and customer margin drivers using price-volume-mix and contribution-margin bridges; converted findings into promotion, pricing and budget-allocation decisions with explicit hurdle and break-even controls.
- Normalized 20 years of public financial history for VNM and peer context, preserving original labels, restatement flags, source pages and comparability caveats.

### Business / Commercial Finance Analyst

Headline: `Commercial Finance Analyst | Profitability, Pricing & Business Partnering`

Lead with:

- gross-to-net and contribution margin;
- channel/customer profitability;
- promotion ROI, price elasticity and trade-offs;
- stakeholder-ready recommendations with owner and timing.

Suggested bullets:

- Evaluated eight promotion events after spend and a 25% contribution hurdle; surfaced four negative-contribution cases and documented stop/scale decisions.
- Reallocated a fixed VND4.35bn commercial budget under capacity and maximum-increase constraints; preserved budget conservation and produced modeled incremental contribution of VND55m.
- Built six price-elasticity scenarios with volume response, contribution-margin delta and break-even price; flagged two scenarios with negative contribution.

### Finance Data Analyst

Headline: `Finance Data Analyst | Reconciliations, KPI Controls & Decision Support`

Lead with:

- data contracts, dimensional model and lineage;
- repeatable QA and exception handling;
- Power BI/PBIP source handoff;
- finance interpretation rather than chart production.

Suggested bullets:

- Designed a five-dimension, nine-fact finance semantic contract with 15 relationships, six report pages and an 18-test QA matrix; preserved evidence references for every PASS/FAIL result.
- Built reproducible validators for evidence matrix, peer panel, forecast leakage, promotion ROI, pricing and budget allocation; current repository runner passes 15 checks.
- Kept reported, calculated, synthetic and proxy evidence separate through source registry, schema fields and reviewer-facing caveats.

## 5. Bullet quality test

Every bullet must answer five questions:

1. What finance problem was solved?
2. What did the candidate personally build or analyze?
3. What method or control made it credible?
4. What quantified result or decision changed?
5. Where can a reviewer verify it?

Weak: `Created a dashboard for sales performance.`

Strong: `Built a formula-driven profitability model linking invoice-level sales to channel contribution; surfaced four promotion events below a 25% hurdle and documented stop/scale actions (synthetic rehearsal; QA report linked).`

## 6. ATS keyword matrix

Mirror the job description's wording only when the artifact supports it.

| Job signal | CV phrase | Portfolio proof |
|---|---|---|
| Budgeting / forecasting | `budgeting, rolling forecast, scenario planning` | Forecast methodology, Excel v2 |
| Variance analysis | `Actual vs Budget / Forecast, PVM bridge` | Variance + PVM tabs |
| Business partnering | `translated drivers into owner/timing/action` | CFO memo, battle cards |
| Profitability | `SKU, channel and customer contribution margin` | Profitability tabs |
| Commercial ROI | `promotion ROI after spend; hurdle decision` | Promotion QA |
| Working capital | `DSO, DIO, DPO, CCC, liquidity stress` | WC/liquidity tabs |
| Data quality | `reconciliation, lineage, evidence class, controls` | QA runner + schemas |
| Power BI | `PBIP source handoff; native PBIX pending` | PBIP manifest |

Never claim `native Power BI` or `internal forecast accuracy` until Gate B or Gate A is actually closed.

## 7. Interview conversion matrix

| Question | 60–90 second answer structure | Proof to open |
|---|---|---|
| Walk me through your project | Business question → model architecture → key driver → decision → control | Excel CFO Output + README |
| Why did margin fall? | Separate price, volume, mix, discount, returns, COGS and logistics; quantify bridge | PVM / profitability |
| How did you handle bad data? | Preserve source, classify evidence, reject unverified rows, log exception and tie-out | Source registry + QA |
| What did you recommend? | State threshold, downside, owner, timing and expected benefit | Promotion/pricing/allocation |
| How do you forecast? | Freeze version before close, prevent leakage, reconcile actuals and report Bias/WAPE | Gate A pack |
| What is unfinished? | Name Gate A/B honestly and explain the exact evidence required | External-gates pack |

## 8. Application tailoring checklist

- Copy the role's exact title and top five requirements into a scratch table.
- Select three project bullets and one experience bullet that map directly to those requirements.
- Put the most decision-relevant metric in the first project bullet.
- Remove any tool not used in the chosen project or work experience.
- Open every link from an incognito/non-owner session and ensure the evidence boundary is understandable.
- Replace all bracketed candidate fields.
- Run a one-page PDF render check for overflow, dates, links and ATS text extraction.
- Keep a versioned application log: company, role, date, CV variant, cover-note angle and follow-up date.

## 9. Gate-dependent upgrades

After Gate A closes, replace the proxy wording with the observed live Bias/WAPE, eligible observations and as-of date. After Gate B closes, replace “PBIP source handoff” with the native PBIX page count, `18/18 QA PASS`, refresh timestamp and Drive evidence link. Do not change the wording before those artifacts exist.

