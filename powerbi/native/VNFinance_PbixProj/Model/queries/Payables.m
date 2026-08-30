let
    Source = Csv.Document(File.Contents(DataRoot & "\\payables.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"month", type date}, {"supplier_id", type text}, {"opening_ap", type number}, {"purchases", type number}, {"cash_paid", type number}, {"closing_ap", type number}, {"overdue_ap", type number}, {"dpo", type number}}, "en-US")
in
    Typed