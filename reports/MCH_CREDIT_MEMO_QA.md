# MCH Credit Memo QA

**Overall status: PASS (15/15 checks passed)**

- Input: `data/mch_finance_analyst_trend_2016_2025.csv`
- Validator: `scripts/validate_mch_credit_memo.mjs`
- GitHub Actions run: [33288457298](https://github.com/susayold/commercial-finance-profitability-analytics/actions/runs/33288457298)
- Validated commit: `f3ac7c37caa1dccc3d387fb4d72f10cc98018ae8`

## Checks

1. Required trend headers present
2. Ten annual rows present
3. FY2016–FY2025 contiguous
4. Fiscal years unique
5. Numeric fields parse as finite values
6. FY2025 revenue tie-out to approved statement layer
7. FY2025 PAT tie-out to approved statement layer
8. FY2025 CFO tie-out to approved statement layer
9. FY2025 CFO/PAT recomputes to 31.5240%
10. FY2024 CFO/PAT recomputes to 116.4982%
11. Descriptive FY2016–FY2025 revenue CAGR recomputes to 9.24%
12. FY2017 comparative/corresponding-column provenance caveat retained
13. FY2025 operating-margin compression is detected
14. FY2025 PAT decline is detected
15. FY2025 cash-conversion warning is detected

The validator checks the approved MCH trend layer used by the credit memo. It does not invent a debt-service ratio when gross debt, interest and maturities are unavailable; that limitation remains explicit in the memo.
