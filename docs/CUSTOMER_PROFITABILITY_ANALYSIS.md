# Customer Profitability Analysis — FY2025 synthetic rehearsal

> **Scope boundary:** `SYNTHETIC_REHEARSAL` only. Customer IDs, invoices, payment terms and working-capital costs are generated for method demonstration; this is not evidence of real-company account performance or realized impact.

**Evidence class:** `SYNTHETIC_REHEARSAL`  
**Source:** [customer profitability schedule](../data/customer_profitability_synthetic.csv)  
**Derived output:** [machine-readable summary](../data/customer_profitability_summary.json)  
**Currency:** VND million

## Executive readout

The 24-customer portfolio produces VND288,300m gross sales and VND256,287m net sales after VND32,013m of discounts, rebates and returns. Contribution is VND103,221m (40.28% of net sales); after the illustrative 10% annual working-capital carrying-cost proxy, contribution is VND100,136m (39.07%). Portfolio AR is VND30,844m, equivalent to 43.93 days of sales.

The top five customers represent 28.62% of gross sales and 30.88% of contribution after working-capital cost. This is meaningful concentration, but not a single-account dependency. The ranking differs when economics replace revenue as the sort key: C06 is the largest gross-sales account but does not appear in the top five after-WC contribution because its 14.58% contribution margin and 88.72-day DSO consume value.

## Channel view

| Channel | Customers | Gross sales (VND m) | Net sales (VND m) | Contribution margin | After-WC margin | DSO |
|---|---:|---:|---:|---:|---:|---:|
| D2C | 5 | 61,500 | 57,068 | 48.55% | 48.36% | 7.00 |
| Marketplace | 5 | 59,250 | 53,025 | 39.75% | 38.93% | 30.01 |
| Modern Trade | 6 | 75,000 | 62,164 | 32.25% | 30.11% | 78.17 |
| General Trade | 4 | 46,050 | 42,274 | 40.97% | 39.74% | 45.00 |
| Wholesale | 4 | 46,500 | 41,756 | 40.88% | 39.24% | 60.00 |

Modern Trade is the main cash-quality watchpoint: it has the lowest channel after-WC margin (30.11%) and the longest aggregate DSO (78.17 days). D2C is the strongest modeled economic pool, with 48.36% after-WC margin and seven-day DSO; this is an allocation signal, not proof that incremental D2C demand exists.

## Account-level review signal

C06 — **MT National Account** — is deliberately constructed as a Finance Business Partner conversation:

- Gross sales: VND18,000m.
- Contribution margin: 14.58%, below the 20% review hurdle.
- DSO: 88.72 days.
- Strategic flag: Y.

Recommended decision path: do not cut the account on revenue alone. Re-price or renegotiate discounts/rebates, service requirements and payment terms; then test whether incremental volume clears the agreed contribution-after-cash hurdle. Any real decision requires contract, invoice-aging and service-cost evidence.

## Recommended management actions

1. Create a customer scorecard sorted by contribution after working-capital cost, not revenue.
2. Put Modern Trade accounts above the DSO and margin hurdles into a trade-term review queue.
3. Separate “strategic” from “economically protected”: strategic status should trigger a review, not an automatic margin exception.
4. Use the top-five concentration metrics in the monthly business review and monitor changes in gross-to-net leakage, DSO and after-WC contribution.

## Controls and limitations

The summary is generated from the 24-row synthetic schedule and is validated by [the dedicated analysis validator](../scripts/validate_customer_profitability_analysis.mjs). Rounded VND million values are reconciled with a documented tolerance. No real customer contract, invoice-level aging, service-level agreement, rebate approval or transfer-pricing evidence is supplied; this layer demonstrates the analysis mechanics and decision framing only.
