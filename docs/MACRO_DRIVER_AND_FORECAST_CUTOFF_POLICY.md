# Macro Driver Book & Forecast Cutoff Policy

## Purpose

Make external assumptions auditable without contaminating a forecast with information published after its as-of date. This is a planning input book, not a claim that the project has a live macro feed.

## Required fields

`data/macros/macro_driver_book.csv` stores driver, reference period, publication date, forecast cutoff, source URL, evidence class, base/upside/downside assumption, impacted line and owner.

## Cutoff rules

1. A public observation can enter a snapshot only when `publication_date <= forecast_cutoff`.
2. A synthetic assumption may be created after the cutoff only if it is labelled `SIMULATED_ASSUMPTION` and carries a rationale; it is not represented as an observed fact.
3. The as-of date is frozen with the forecast version. Re-running later must not silently backfill the old snapshot.
4. Every driver maps to a model line: revenue volume, COGS, freight, payroll, interest or FX translation.
5. A reviewer checks source URL, reference period, publication date and scenario direction before approval.

## Driver set

- CPI / food CPI → COGS, packaging and payroll.
- USD/VND → imported inputs and FX-sensitive COGS.
- Fuel/freight → logistics cost.
- Policy rate / lending rate → finance cost.
- Retail-sales growth → volume / revenue outlook.
- Wage index → payroll and OPEX.

The National Statistics Office CPI archive is the primary public reference for CPI-related rows: https://www.nso.gov.vn/en/cpi/ . Values in the current book are clearly labelled assumptions where no approved internal snapshot exists.

## Validation

```text
node scripts/validate_macro_cutoff.mjs
```

The validator rejects missing source metadata, invalid dates, post-cutoff public observations and unknown scenario directions.
