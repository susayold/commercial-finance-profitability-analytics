# Customer Profitability Analysis QA

- Overall: **PASS**
- Summary: **14/14 checks PASS**
- Evidence class: **SYNTHETIC_REHEARSAL**
- Source: [customer schedule](../data/customer_profitability_synthetic.csv)
- Derived output: [summary JSON](../data/customer_profitability_summary.json)

The validator recomputes portfolio totals, margins, DSO, top-five concentration and channel roll-ups from the source schedule. It also confirms the deliberately embedded C06 high-revenue/low-margin/long-DSO review signal and non-negative economic inputs. Rounded VND million values use a documented 0.5 tolerance.

No real customer conclusion is asserted; contracts, invoice aging, service-cost allocation and approved trade terms remain required for production use.
