# VNFinance Commercial Finance — Boss Handoff Pack

**Prepared:** 31 August 2026  
**Purpose:** one-page navigation index for the complete Finance Analyst / FP&A portfolio case.

## 1. Start here

| Review item | Link | What the reviewer sees |
|---|---|---|
| Recruiter portfolio site | [Live site](https://vn-finance-fpa-case.sangkenny200.chatgpt.site/) | Executive story, finance modules, Power BI scope and contact page |
| GitHub source of truth | [commercial-finance-profitability-analytics](https://github.com/susayold/commercial-finance-profitability-analytics) | Versioned source, synthetic data, model logic, QA scripts and reports |
| Private Drive project root | [Google Drive project folder](https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR) | Archived public filings, workbooks, exports, binaries and handoff files |
| Full reproducible archive | [Project tar.gz](https://drive.google.com/file/d/1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX/view?usp=drivesdk) | GitHub `main` snapshot at commit `647a93b620171f7ac5334c11bf737897e127b62a` |

## 2. Recommended review order

1. **Website:** understand the business question and executive outputs.
2. **FP&A model:** open the [editable Google Sheet](https://docs.google.com/spreadsheets/d/1-DAMs7zqQr8a6Otimm3WgkAIsX3kazpm/edit) and the [CFO memo](https://drive.google.com/file/d/1_n7SF2fNpWlAi2EZJLJ_pwdoc-mqsXzI/view).
3. **Operating rhythm:** read the [Monthly Business Review pack](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/MONTHLY_BUSINESS_REVIEW_FINANCE_ANALYST_2026-08-30.md), [recommendation register](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/MANAGEMENT_RECOMMENDATION_REGISTER_2026-08-30.md), [KPI dictionary](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/docs/FINANCE_ANALYST_KPI_DICTIONARY.md) and [close/forecast calendar](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/docs/MONTHLY_CLOSE_FORECAST_BUSINESS_PARTNERING_CALENDAR.md).
4. **Evidence and reproducibility:** inspect the GitHub `data/`, `schemas/`, `scripts/`, `powerbi/` and `reports/` folders; every major output has a validator or evidence record.
5. **Power BI:** use the [editable PBIP source](https://github.com/susayold/commercial-finance-profitability-analytics/tree/main/powerbi/native/VNFinance_PBIP_Extended), [extended PBIT](https://drive.google.com/file/d/1MhuMrznyyJcqXroyQ0nZeuZs8zjo9M8t/view), [scenario-driver QA](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/POWER_BI_SCENARIO_DRIVER_QA_2026-08-31.md) and [native PBIX candidate](https://drive.google.com/file/d/1mqZ_ZkMqCXu7qnpO3L6gZ5L0U1TybmGE/view).
6. **Public-company finance lens:** review the [MCH equity research rehearsal](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/MCH_EQUITY_RESEARCH_REHEARSAL.md), [credit memo](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/MCH_CREDIT_MEMO_FINANCE_ANALYST.md), [valuation rehearsal](https://github.com/susayold/commercial-finance-profitability-analytics/blob/main/reports/MCH_VALUATION_REHEARSAL.md) and [MCH trend sheet](https://docs.google.com/spreadsheets/d/1AH5nMI6W4N6YGPjf3sLYxtNZSFBzehg7STkkKNPtAPM/edit?usp=drivesdk).
7. **Candidate profile:** open the [one-page CV PDF](https://drive.google.com/file/d/1Gm2kGAoktzWA-DDakfrzo_-sL1sL9jax/view?usp=drivesdk).

## 3. Deliverables included

| Workstream | Included outputs | Status |
|---|---|---|
| Driver-based FP&A / Business Finance | 28-tab editable model, assumptions, budget/forecast versions, P&L, variance bridge, PVM, profitability, working capital, liquidity and CFO output | **Complete** — formula-driven and QA-checked |
| Commercial profitability | SKU/channel/customer contribution, pricing and promotion cases, mix and margin bridges | **Complete** — synthetic ledger labelled and reproducible |
| Working capital and risk | AR/AP, inventory, CCC, cash and downside/upside scenarios | **Complete** — assumptions and guardrails disclosed |
| Finance operating system | KPI dictionary, close/forecast calendar, MBR pack, recommendation register, battle cards and interview talk track | **Complete** |
| Public-company analyst lens | MCH FY2016–FY2025 evidence layer, peer panel (VNM/QNS/KDC), equity/credit/valuation rehearsals | **Complete with caveat** — FY2017 MCH comparative remains `INDEXED_ONLY` until primary-source review |
| Power BI | 20-table PBIP/PBIT contract, 19-file CSV refresh contract, scenario selector, DirectQuery/local rehearsal and native Desktop artifacts | **Source/package complete**; formal native QA and production refresh remain gated |
| Portfolio and CV | Recruiter site, finance-first CV PDF and interview narrative | **Complete** — personal facts should be personalised before submission |

## 4. Evidence boundary (important for an executive review)

- The operating company and transaction-level ledger are **synthetic**, designed to demonstrate finance method without exposing confidential data.
- Public-company figures are sourced/calibrated from official filings and are kept separate from synthetic management outputs.
- The current release is reproducible from GitHub commit `647a93b`; the Drive archive is the same snapshot (SHA-256: `D1E1F4FDBBE5D3EF86A6D807BE15F157877DEC9967A675C8653ADB77D66C6745`).
- **Gate A open:** a genuine internal forecast/budget snapshot is still required to claim real-company forecast accuracy.
- **Gate B open:** formal Desktop QA-01–QA-18 and production Power BI Service/API refresh evidence are not inferred from package checks.
- The extended native PBIX is a real Desktop-produced candidate container, but its formal QA sign-off is still pending.

## 5. Storage and sharing boundary

- **GitHub:** public source and reproducible synthetic/public-safe evidence.
- **Google Drive:** private/permission-controlled master archive. It contains raw filings, editable workbooks, PDFs and binary Power BI artifacts that are intentionally not all committed to GitHub.
- The Drive folder and files have **not** been made publicly writable. To grant a specific boss direct access, share the folder with their work email (or send the folder link after applying the company’s access policy).

## 6. Machine-readable export manifest

```text
github_repo=https://github.com/susayold/commercial-finance-profitability-analytics.git
github_commit=647a93b620171f7ac5334c11bf737897e127b62a
github_tracked_file_count=1425
drive_project_root_id=1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR
drive_archive_id=1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX
drive_extended_pbit_id=1MhuMrznyyJcqXroyQ0nZeuZs8zjo9M8t
drive_extended_native_pbix_candidate_id=1mqZ_ZkMqCXu7qnpO3L6gZ5L0U1TybmGE
live_site=https://vn-finance-fpa-case.sangkenny200.chatgpt.site/
```

## Suggested message to send with the pack

> Em gửi anh/chị portfolio Finance Analyst end-to-end. Website là điểm vào nhanh; GitHub chứa source, data synthetic/public-safe và QA; Drive chứa workbook, filing archive và Power BI binaries. Các giới hạn bằng chứng (synthetic ledger, Gate A/B) được ghi rõ để review minh bạch.
