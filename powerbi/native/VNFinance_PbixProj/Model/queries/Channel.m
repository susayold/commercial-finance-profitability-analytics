let
    Source = Csv.Document(File.Contents(DataRoot & "\\channel_master.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"channel_id", type text}, {"channel_type", type text}, {"platform_fee_pct", type number}, {"commission_pct", type number}, {"settlement_days", Int64.Type}, {"default_discount_pct", type number}}, "en-US")
in
    Typed