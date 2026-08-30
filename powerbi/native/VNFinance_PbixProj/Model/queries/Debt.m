let
    Source = Csv.Document(File.Contents(DataRoot & "\\debt.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"month", type date}, {"facility_id", type text}, {"opening_balance", type number}, {"drawdown", type number}, {"repayment", type number}, {"closing_balance", type number}, {"interest_rate", type number}, {"interest_expense", type number}, {"covenant_headroom", type number}}, "en-US")
in
    Typed