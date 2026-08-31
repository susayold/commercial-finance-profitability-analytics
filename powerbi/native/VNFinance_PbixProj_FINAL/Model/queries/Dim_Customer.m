let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_customer.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"CustomerKey", type text}, {"CustomerID", type text}, {"CustomerName", type text}, {"Segment", type text}, {"Region", type text}, {"StrategicFlag", type text}, {"PaymentTermsDays", Int64.Type}, {"MarginHurdle", type number}}, "en-US")
in
    Typed