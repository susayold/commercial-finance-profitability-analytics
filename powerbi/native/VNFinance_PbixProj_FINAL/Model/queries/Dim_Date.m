let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_date.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"DateKey", type date}, {"Date", type date}, {"MonthStart", type date}, {"Year", Int64.Type}, {"Quarter", type text}, {"MonthNumber", Int64.Type}, {"MonthName", type text}, {"YearMonth", type text}, {"FiscalYear", Int64.Type}, {"FiscalQuarter", type text}, {"DaysInMonth", Int64.Type}, {"IsClosedMonth", type logical}, {"IsLatestClosedMonth", type logical}}, "en-US")
in
    Typed