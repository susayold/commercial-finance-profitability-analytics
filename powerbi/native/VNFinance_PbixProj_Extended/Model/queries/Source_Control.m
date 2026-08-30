let
    Source = Csv.Document(File.Contents(DataRoot & "\\source_control.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"control_id", type text}, {"control_name", type text}, {"status", type text}, {"evidence_class", type text}, {"source_file", type text}}, "en-US")
in
    Typed