let
    Source = Csv.Document(File.Contents(DataRoot & "\\inventory.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"month", type date}, {"warehouse_id", type text}, {"sku_id", type text}, {"opening_units", Int64.Type}, {"receipts_units", Int64.Type}, {"sales_units", Int64.Type}, {"closing_units", Int64.Type}, {"unit_cost", type number}, {"inventory_value", type number}, {"days_on_hand", type number}, {"stockout_flag", type logical}, {"expiry_writeoff", type number}}, "en-US")
in
    Typed