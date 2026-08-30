let
    Source = Csv.Document(File.Contents(DataRoot & "\\marketing_spend.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"month", type date}, {"channel_id", type text}, {"campaign_id", type text}, {"spend", type number}, {"impressions", Int64.Type}, {"clicks", Int64.Type}, {"orders", Int64.Type}, {"attributed_net_sales", type number}, {"cac", type number}, {"roas", type number}}, "en-US")
in
    Typed