let
    Source = Csv.Document(File.Contents(DataRoot & "\\forecast.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"snapshot_month", type date}, {"target_month", type date}, {"sku_id", type text}, {"channel_id", type text}, {"forecast_units", Int64.Type}, {"forecast_net_sales", type number}, {"forecast_cogs", type number}, {"forecast_trade_spend", type number}, {"forecast_opex", type number}, {"forecast_version", type text}}, "en-US")
in
    Typed