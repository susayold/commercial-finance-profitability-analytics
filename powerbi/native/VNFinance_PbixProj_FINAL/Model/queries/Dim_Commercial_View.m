let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_commercial_view.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ViewKey", type text}, {"View", type text}, {"FieldName", type text}, {"SortOrder", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed