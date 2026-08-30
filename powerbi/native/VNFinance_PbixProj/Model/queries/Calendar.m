let
    StartDate = #date(2023, 1, 1),
    MonthCount = 36,
    MonthList = List.Transform({0..MonthCount-1}, each Date.AddMonths(StartDate, _)),
    Base = Table.FromList(MonthList, Splitter.SplitByNothing(), {"month"}),
    Typed = Table.TransformColumnTypes(Base, {{"month", type date}}),
    AddYear = Table.AddColumn(Typed, "year", each Date.Year([month]), Int64.Type),
    AddQuarter = Table.AddColumn(AddYear, "quarter", each "Q" & Text.From(Date.QuarterOfYear([month])), type text),
    AddMonthNumber = Table.AddColumn(AddQuarter, "month_number", each Date.Month([month]), Int64.Type),
    AddYearMonth = Table.AddColumn(AddMonthNumber, "year_month", each Date.ToText([month], "yyyy-MM"), type text)
in
    AddYearMonth