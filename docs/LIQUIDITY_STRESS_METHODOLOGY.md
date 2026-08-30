# Liquidity Stress Methodology — VietNova Consumer Case

**Status:** SYNTHETIC / REHEARSAL  
**Coverage:** monthly BASE and DOWNSIDE scenarios, January–December 2026  
**Unit:** VND million

## Decision question

Can the business preserve the minimum-cash policy after operating cash flow, working-capital investment, CapEx, interest and principal payments under base and downside conditions?

## Cash roll-forward

For each scenario and month:

```text
Pre-financing cash
= Opening cash
+ Operating cash flow
− CapEx
− Working-capital cash use
− Interest
− Principal repayment
```

```text
Revolver draw
= MIN(
    MAX(0, Minimum cash policy − Pre-financing cash),
    Revolver limit − Opening revolver
  )
```

```text
Revolver repayment
= MIN(
    Opening revolver,
    MAX(0, Pre-financing cash − Minimum cash policy)
  )
```

```text
Ending cash
= Pre-financing cash + Draw − Repayment
```

```text
Closing revolver
= Opening revolver + Draw − Repayment
```

```text
Liquidity headroom
= Ending cash + (Revolver limit − Closing revolver)
− Minimum cash policy
```

## Scenario design

| Scenario | Operating assumption | Working-capital assumption | Financing interpretation |
|---|---|---|---|
| BASE | CFO rises from VND560m to VND680m seasonally | VND120m monthly cash use | Facility is repaid in month 1; cash builds without further draw |
| DOWNSIDE | CFO is lower and seasonally constrained | VND420m monthly cash use | Revolver capacity is progressively consumed; cash falls below policy once capacity is exhausted |

The schedule intentionally uses transparent deterministic inputs so a reviewer can recompute every row without a black-box simulation.

## Control requirements

1. Opening cash equals prior-month ending cash within each scenario.
2. Opening revolver equals prior-month closing revolver.
3. Draw never exceeds undrawn facility.
4. Repayment never exceeds opening revolver.
5. Ending cash and closing revolver tie to the formulas above.
6. Negative headroom is surfaced as a liquidity breach; it is not masked with `IFERROR` or zero.
7. Scenario and evidence class remain visible in every row.

## Management readout

- BASE ends December with VND5,280m cash, zero revolver and VND6,580m headroom.
- DOWNSIDE reaches the facility limit in October and ends December with VND460m cash, VND2,500m revolver and negative VND740m headroom.
- The decision implication is to trigger a pre-breach action plan before October: reduce working-capital cash use, defer non-essential CapEx, re-phase principal repayment, or secure additional committed liquidity.
- These figures are synthetic rehearsal outputs, not a forecast of a real company.

## Link to the broader model

The standalone schedule is a controlled evidence layer for the model's `17_Liquidity_Stress` / debt schedule, CFO memo, recommendation register and Power BI Working Capital & Liquidity page. It should reconcile to those outputs after any future model regeneration.

## Limitations

No lender term sheet, covenant definition, maturity ladder or interest-rate curve is provided. Therefore the case demonstrates liquidity mechanics and policy headroom, not debt-service capacity or a real financing recommendation.
