let
    Source = Csv.Document(File.Contents(DataRoot & "\\budget.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"month", type date}, {"sku_id", type text}, {"channel_id", type text}, {"version", type text}, {"budget_units", Int64.Type}, {"budget_net_sales", type number}, {"budget_cogs", type number}, {"budget_trade_spend", type number}, {"budget_opex", type number}}, "en-US")
in
    Typed