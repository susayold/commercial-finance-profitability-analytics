let
    Source = Csv.Document(File.Contents(DataRoot & "\\promotions.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"promo_id", type text}, {"start_date", type date}, {"end_date", type date}, {"channel_id", type text}, {"sku_id", type text}, {"mechanic", type text}, {"planned_discount_pct", type number}, {"planned_units_lift_pct", type number}, {"actual_discount_pct", type number}, {"incremental_units", Int64.Type}, {"baseline_units", Int64.Type}, {"promo_spend", type number}, {"roi", type number}, {"status", type text}}, "en-US")
in
    Typed