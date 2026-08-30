let
    Source = Csv.Document(File.Contents(DataRoot & "\\customer_master.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"customer_id", type text}, {"customer_type", type text}, {"segment", type text}, {"region", type text}, {"payment_terms_days", Int64.Type}, {"credit_limit", type number}, {"acquisition_month", type date}}, "en-US")
in
    Typed