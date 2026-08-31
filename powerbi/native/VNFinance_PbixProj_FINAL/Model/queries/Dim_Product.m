let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_product.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ProductKey", type text}, {"SKU", type text}, {"Product", type text}, {"Category", type text}, {"Brand", type text}, {"Lifecycle", type text}, {"StandardGM", type number}, {"UnitPriceVND", type number}, {"StandardUnitCostVND", type number}}, "en-US")
in
    Typed