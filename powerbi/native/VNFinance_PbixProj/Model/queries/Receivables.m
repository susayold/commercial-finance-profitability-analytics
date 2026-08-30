let
    Source = Csv.Document(File.Contents(DataRoot & "\\receivables.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"month", type date}, {"customer_id", type text}, {"opening_ar", type number}, {"invoiced", type number}, {"cash_collected", type number}, {"credit_note", type number}, {"closing_ar", type number}, {"overdue_0_30", type number}, {"overdue_31_60", type number}, {"overdue_61_plus", type number}, {"dso", type number}}, "en-US")
in
    Typed