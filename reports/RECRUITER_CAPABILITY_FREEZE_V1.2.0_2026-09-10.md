# Recruiter Capability Freeze — v1.2.0

**Date:** 2026-09-10  
**Repository:** `susayold/commercial-finance-profitability-analytics`  
**Status:** `FROZEN_RECRUITER_CAPABILITY_LAYER`  
**Controlled finance release:** `VNFINANCE-FPA-v1.1.1` · tag `fpa-portfolio-v1.1.1`  
**Recruiter capability version:** `v1.2.0`

## Scope of this freeze

This freeze does **not** redefine the controlled FY2025 finance truth. It freezes the additive recruiter capability layer introduced after v1.1.1:

- public `/excel/` FP&A model showcase;
- downloadable `VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx`;
- 12-sheet workbook architecture and recruiter skill map;
- Excel recruiter binary / structure validator;
- recruiter interview pack with CV bullets, 60-second pitch, 3-minute management walkthrough, 10-minute technical / financial walkthrough and interview Q&A;
- interview-pack governance validator wired into final recruiter QA;
- recruiter-start handoff guidance for using those assets.

## Controlled workbook identity

- File: `site/public/downloads/VietNova_FPA_Commercial_Finance_Excel_Model_v1.2.0.xlsx`
- Size: `56,805 bytes`
- SHA-256: `f37f38bc42500868e0af90e36d71312e29c85502cb0e62d453b4d05a906f8474`
- Expected sheets: `12`
- Public route: `https://susayold.github.io/commercial-finance-profitability-analytics/excel/`

The workbook remains a controlled portfolio artifact using simulated / derived operating evidence. It does not create a live ERP, statutory-close, employer-impact or live forecast-accuracy claim.

## Recruiter interview asset

Canonical pack:

`reports/RECRUITER_INTERVIEW_PACK_V1.2.0_2026-09-10.md`

The pack is governed for:

- FP&A / Commercial Finance role positioning;
- 60-second / 3-minute / 10-minute speaking paths;
- 3–4 CV bullet discipline;
- Excel skill evidence;
- historical forecast evidence wording;
- claim-safe interview language;
- explicit feature-freeze exclusions.

## QA evidence

Finance Core QA on the recruiter-pack gated source completed successfully:

- Main source SHA: `62ebcfffc025af607fb9bd3ad7e49654c1f59cad`
- Finance Core QA run: `34504832973`
- Final recruiter release QA: `PASS`
- Recruiter interview pack validator: `PASS`
- Excel recruiter showcase validator: `PASS`
- Rolling-origin forecast validator: `21/21 PASS`
- Release identity validator: `PASS`
- Website content alignment: `PASS`
- Existing finance reconciliation / scope / evidence gates: `PASS`

This source SHA is evidence for the gated recruiter capability state immediately before this freeze-record-only commit. The canonical finance release identity remains governed separately by `data/governance/release_identity_nonbi.json`.

## Evidence boundary retained

### Historical forecast evidence

The primary seasonal-naive benchmark remains historical out-of-sample evidence on simulated operating history:

- 1M WAPE: `1.1734%`
- 3M WAPE: `1.1554%`
- 6M WAPE: `1.1782%`
- Evidence class: `SIMULATED_HISTORICAL_BACKTEST`

### Live forecast Gate A

**OPEN BY DESIGN.** A live forecast-accuracy claim still requires a genuine forecast frozen before the target actual is known plus the later post-close actual.

### Other retained boundaries

- Page 6 OPEX bridge: `OPEN BY DESIGN` where disclosed.
- Detailed 36-SKU costing: standalone rehearsal, `NOT_CORE_COGS`.
- Power BI: `OUT_OF_ACTIVE_SCOPE`.
- No realized employer savings / EBITDA improvement claim.
- No live ERP or statutory-close ownership claim.

## Feature-freeze rule

After this record, do not add more modules merely to make the repository larger.

Changes are justified only for:

1. verified numerical / formula defects;
2. broken recruiter links, downloads or site builds;
3. genuine new evidence, especially a real frozen pre-close forecast plus later actual for Gate A;
4. security or dependency maintenance;
5. a specific target-job requirement with material incremental value.

Do not expand this repository into Power BI, M&A valuation, project-finance debt sculpting or unrelated analytics. Those belong in separate portfolio projects if needed.

## Final recruiter positioning

The project should be presented primarily as:

**FP&A / Commercial Finance — management P&L, profitability, working capital, scenario planning, forecasting, Excel modelling, management reporting and controls.**

Secondary fit:

**Financial Analyst / Finance Business Partner / Management Accounting / Cost Finance.**

It should not be presented as a dedicated Corporate Finance / M&A or Project Finance case.

## Final operating spine

**reconcile → explain → decide → assign → control → reproduce**

That is the frozen recruiter story for this repository.
