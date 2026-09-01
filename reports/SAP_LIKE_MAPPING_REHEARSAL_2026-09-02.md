# SAP-like Finance Extraction Rehearsal — VietNova FP&A

**Status:** PASS  
**Scope:** Simulated FI/CO-style extraction and management-P&L mapping; no SAP production experience is claimed

## What this demonstrates

- 720 deterministic posting rows across 36 monthly periods.
- FI-like document type, company code, posting date, currency and GL account fields.
- CO-like cost-center and profit-center assignments.
- Every synthetic chart-of-accounts account maps to one management line under mapping version **VNO-FPA-MAP-v1**.
- Debit/credit control is re-performed by period, with an explicit exception field.

## Reconciliation

| Control | Result |
|---|---|
| Periods | 36 |
| Posting rows | 720 |
| Distinct GL accounts | 20 |
| Unmapped / exception rows | 0 |
| Period debit = credit | PASS |

## Management bridge

management_line is inherited from data/accounting/gl_management_mapping.csv. Revenue and contra-revenue accounts map to commercial lines; COGS maps to supply; channel fees/trade spend/fulfilment map to trade; controllable OPEX and D&A map to G&A; finance cost maps to treasury; tax proxy maps to tax.

## Evidence boundary

This is a **SAP-like mapping rehearsal** built from synthetic VietNova trial-balance rows. It is suitable for demonstrating finance-systems awareness, mapping discipline and close controls. It must not be described as SAP implementation, SAP access or production ERP experience.

## Files

- data/accounting/sap_like_mapping_rehearsal.csv — row-level FI/CO-style rehearsal extract.
- reports/SAP_LIKE_MAPPING_REHEARSAL_QA_2026-09-02.json — period tie-out and exception QA.
- scripts/build_sap_like_mapping_rehearsal.mjs — reproducible builder.
