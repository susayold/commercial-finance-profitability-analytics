let
    Source = Csv.Document(File.Contents(DataRoot & "\\product_master.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"sku_id", type text}, {"brand", type text}, {"category", type text}, {"launch_month", type date}, {"list_price", type number}, {"pack_size", Int64.Type}, {"standard_cogs", type number}, {"status", type text}, {"supplier_id", type text}}, "en-US")
in
    Typed