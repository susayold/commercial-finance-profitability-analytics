let
    Source = Csv.Document(File.Contents(DataRoot & "\\commercial_costs.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"month", type date}, {"sku_id", type text}, {"channel_id", type text}, {"trade_spend", type number}, {"listing_fee", type number}, {"rebate", type number}, {"freight", type number}, {"payment_fee", type number}, {"commission", type number}, {"writeoff", type number}, {"cost_version", type text}}, "en-US")
in
    Typed