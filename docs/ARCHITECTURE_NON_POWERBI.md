# VNFinance non-Power-BI architecture

```text
Source extracts / controlled synthetic generator
                 |
                 v
       Approved ledger + unit contract
                 |
                 v
      Finance metric registry / scenarios
          |              |              |
          v              v              v
     P&L / PVM     WC / liquidity    Public-company panel
          |              |              |
          +-------> Decision modules <+
                         |
                         v
       MBR / CFO memo / website / CV claims
                         |
                         v
            Cross-artifact QA + release gate
```

Operating data is synthetic and marked `SIMULATED`/`DERIVED`; public-company
figures are a separate observed subject area. Valuation, M&A and Monte Carlo
remain `SYNTHETIC_REHEARSAL` appendices. Gate A (genuine internal forecast
accuracy) and Gate B (native Power BI Desktop evidence) stay open until real
evidence is supplied.
