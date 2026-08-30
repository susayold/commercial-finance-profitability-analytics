let
    Source = Csv.Document(File.Contents(DataRoot & "\\sales_fact.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"line_id", type text}, {"order_id", type text}, {"date", type date}, {"month", type date}, {"sku_id", type text}, {"customer_id", type text}, {"channel_id", type text}, {"region", type text}, {"units", Int64.Type}, {"gross_sales", type number}, {"discount", type number}, {"returns", type number}, {"net_sales", type number}, {"cogs", type number}, {"freight", type number}, {"payment_fee", type number}, {"commission", type number}, {"trade_spend", type number}, {"contribution_margin", type number}, {"promo_id", type text}, {"is_stockout", type logical}, {"is_intercompany", type logical}}, "en-US")
in
    Typed