# Non-Power-BI FP&A Handoff Index — 2026-09-01

## Scope

This handoff covers the active Finance Analyst / FP&A release: integrated statements, GL/TB controls, FMCG standard costing, management reporting, forecast governance, UAT and recruiter-facing website. Power BI is archived and intentionally excluded from the active acceptance path.

## GitHub source

- Repository: https://github.com/susayold/commercial-finance-profitability-analytics
- Release commit: `a5c0e18` (final non-Power-BI QA/link-evidence sync)
- Canonical status: `data/governance/project_status_nonbi.json`

## Drive handoff files

| Artifact | Drive link |
|---|---|
| Full committed non-BI source archive | https://drive.google.com/file/d/1p_9-3RHe8Et2WalJRuYFM1vsC286D4Ir/view?usp=drivesdk |
| Updated gap-research and execution plan | https://drive.google.com/file/d/1pNFlBzhbD_ncA0ApV0nSSY50h7AWdpef/view?usp=drivesdk |
| Final non-BI QA (51/51 core; 40/40 release gate; recruiter links 41/41) | https://drive.google.com/file/d/1RQBU1j-Y2_tDvGEKQ0c13TCgWc7ZsoAq/view?usp=drivesdk |
| Release gate JSON | https://drive.google.com/file/d/1kS9SDbIi6XeCJWsdHTt_MXXDgDqk7_JF/view?usp=drivesdk |
| Three-statement reconciliation | https://drive.google.com/file/d/1vLh81lUnZSnY8f2mfdHPWLmEsslbYmOK/view?usp=drivesdk |
| FMCG standard-cost reconciliation | https://drive.google.com/file/d/1uXOezPturyR9BX6-wiC8aACxOlXi9SCd/view?usp=drivesdk |
| Canonical non-BI project status | https://drive.google.com/file/d/1sUGUk6dy8UhQ5_EhNozXmfjdNe7m686w/view?usp=drivesdk |
| Editable management pack (PPTX) | https://docs.google.com/presentation/d/1oroRz0IJAnY__YbFbCkxZa4VLuSVyXDO/edit?usp=drivesdk |
| Three-year driver plan | https://drive.google.com/file/d/1MrIgrmMiGH8wLpKsE3WvjuYXkfQ9kbS9/view?usp=drivesdk |
| Forecast versioning/backtest v2 | https://drive.google.com/file/d/12Rs_cFNzt9yrR2nUu66dEmX8oG9TijU0/view?usp=drivesdk |
| Finance analyst narration script | https://drive.google.com/file/d/1J10PKKs8W_unfkTsx8oUzdY24hQH-_cl/view?usp=drivesdk |
| Executive board-pack index | https://drive.google.com/file/d/1NBKH3xuXL_8PzzzzUaMWkM3Qrz2Xb-jn/view?usp=drivesdk |
| Full release archive (GitHub HEAD) | https://drive.google.com/file/d/1tPKphroOXjgCcRHF1MC1fiOfQ87Lff0c/view?usp=drivesdk |

### Appendix direct Drive links

| Appendix artifact | Drive link |
|---|---|
| Correlated Monte Carlo v2 report | https://drive.google.com/file/d/1KD6LIVpWj3glTfhc_C6wmo4VRxnzqNdT/view?usp=drivesdk |
| Correlated Monte Carlo v2 summary CSV | https://drive.google.com/file/d/1RwNItazMzRqNa1t6RYBtZPx7q1GscuIu/view?usp=drivesdk |
| Correlation matrix CSV | https://drive.google.com/file/d/1Wl1ee9l96MUEAIltD5PlvnJ9h88aPYds/view?usp=drivesdk |
| Monte Carlo v2 draw-level CSV | https://drive.google.com/file/d/1uo8lezFt1vLWpDYldYcDGu2ni3KJ9WRW/view?usp=drivesdk |
| SAP-like mapping report | https://drive.google.com/file/d/1rO4ko2r1r0Mo4_vFAswTyoc5CF2tciAB/view?usp=drivesdk |
| SAP-like mapping CSV | https://drive.google.com/file/d/1-tTSuxRj2z_P4riQg2wtMN_OxIwyOMjI/view?usp=drivesdk |
| SAP-like QA JSON | https://drive.google.com/file/d/1uR7erB-E3m3l3Gw5xk5CfqxYULZpojv1/view?usp=drivesdk |
| Commentary draft report | https://drive.google.com/file/d/19KvrPbXLXE3Ou9i28oZ_6HUxXYbAdgkw/view?usp=drivesdk |
| Commentary draft CSV | https://drive.google.com/file/d/1-ByW-8D819E0heZ_HeNq2NGbqyS8XrIS/view?usp=drivesdk |
| Commentary approval log | https://drive.google.com/file/d/1TgMcJLFCG9xSnUc5nxBDEd4dOuKkIoD-/view?usp=drivesdk |
| GL management mapping CSV | https://drive.google.com/file/d/1kemPECFcXN8fdxHlOHZ2ZNi9C3Gvr2ub/view?usp=drivesdk |

## New release artifacts (GitHub)

- Editable management pack: `output/pptx/VNFINANCE_NONBI_FPA_MBR_2026-09-01.pptx`
- Three-year driver plan: `docs/THREE_YEAR_DRIVER_BASED_OPERATING_PLAN.md` and `data/planning/`
- Forecast versioning/backtest v2: `docs/FORECAST_VERSIONING_BACKTEST_V2.md` and `data/forecast/`
- Finance analyst walkthrough: `docs/FINANCE_ANALYST_WALKTHROUGH_SCRIPT_5_MIN.md`
- Board-pack index: `reports/EXECUTIVE_BOARD_PACK_INDEX_2026-09-01.md`
- Recruiter link QA: `reports/RECRUITER_SITE_LINK_QA_2026-09-02.json` (41/41 PASS)
- Correlated Monte Carlo v2: `data/monte_carlo_risk_overlay_v2_2026-09-02.csv`, draw-level output, matrix, report and validator (16/16 PASS)
- SAP-like mapping rehearsal: `data/accounting/sap_like_mapping_rehearsal.csv` and QA report (9/9 PASS; simulated only)
- Automated commentary draft: `data/governance/commentary_draft_2026-09-02.csv`, draft report and approval log (9/9 PASS; NEEDS_REVIEW)

## Production website

https://vn-finance-fpa-case.sangkenny200.chatgpt.site

The deployed recruiter site is owner-only and reflects the non-BI path. The current production version is Sites version 22; the source mirror commit is `6ed310f8c84b4d1a93189f8df6d5db4e14dff114`. The active site path exposes the editable management pack, forecast v2, three-year plan and the new appendix evidence links; Power BI remains archived and excluded. DOM order is now core FP&A → evidence → appendix valuation → recruiter tour → footer.

## Open external input

Only Gate A remains open: an approved internal pre-close forecast snapshot plus post-close actuals are required before claiming live forecast accuracy. No synthetic fixture is used to close that gate. The manual five-minute screen recording is a user-side handoff item; the script and editable deck are complete.
