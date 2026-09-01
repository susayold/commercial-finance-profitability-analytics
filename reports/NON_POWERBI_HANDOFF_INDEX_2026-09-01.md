# Non-Power-BI FP&A Handoff Index — 2026-09-01

## Scope

This handoff covers the active Finance Analyst / FP&A release: integrated statements, GL/TB controls, FMCG standard costing, management reporting, forecast governance, UAT and recruiter-facing website. Power BI is archived and intentionally excluded from the active acceptance path.

## GitHub source

- Repository: https://github.com/susayold/commercial-finance-profitability-analytics
- Release commit: `9f8543819de9d039c5571d9efefee68889261bc8`
- Canonical status: `data/governance/project_status_nonbi.json`

## Drive handoff files

| Artifact | Drive link |
|---|---|
| Full committed non-BI source archive | https://drive.google.com/file/d/1p_9-3RHe8Et2WalJRuYFM1vsC286D4Ir/view?usp=drivesdk |
| Updated gap-research and execution plan | https://drive.google.com/file/d/1pNFlBzhbD_ncA0ApV0nSSY50h7AWdpef/view?usp=drivesdk |
| Final non-BI QA (45/45) | https://drive.google.com/file/d/1RQBU1j-Y2_tDvGEKQ0c13TCgWc7ZsoAq/view?usp=drivesdk |
| Release gate JSON | https://drive.google.com/file/d/1kS9SDbIi6XeCJWsdHTt_MXXDgDqk7_JF/view?usp=drivesdk |
| Three-statement reconciliation | https://drive.google.com/file/d/1vLh81lUnZSnY8f2mfdHPWLmEsslbYmOK/view?usp=drivesdk |
| FMCG standard-cost reconciliation | https://drive.google.com/file/d/1uXOezPturyR9BX6-wiC8aACxOlXi9SCd/view?usp=drivesdk |
| Canonical non-BI project status | https://drive.google.com/file/d/1sUGUk6dy8UhQ5_EhNozXmfjdNe7m686w/view?usp=drivesdk |

## New release artifacts (GitHub)

- Editable management pack: `output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx`
- Three-year driver plan: `docs/THREE_YEAR_DRIVER_BASED_OPERATING_PLAN.md` and `data/planning/`
- Forecast versioning/backtest v2: `docs/FORECAST_VERSIONING_BACKTEST_V2.md` and `data/forecast/`
- Finance analyst walkthrough: `docs/FINANCE_ANALYST_WALKTHROUGH_SCRIPT_5_MIN.md`
- Board-pack index: `reports/EXECUTIVE_BOARD_PACK_INDEX_2026-09-01.md`

## Production website

https://vn-finance-fpa-case.sangkenny200.chatgpt.site

The deployed recruiter site is owner-only and reflects the non-BI path. The current production version is Sites version 18; the source mirror commit is `5dcf308e3615b3e776b47249a3ef8fbda03dafc2`.

## Open external input

Only Gate A remains open: an approved internal pre-close forecast snapshot plus post-close actuals are required before claiming live forecast accuracy. No synthetic fixture is used to close that gate. The manual five-minute screen recording is a user-side handoff item; the script and editable deck are complete.
