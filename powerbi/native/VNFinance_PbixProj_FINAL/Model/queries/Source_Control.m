let
    Source = Csv.Document(File.Contents(DataRoot & "\\source_control.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ControlID", type text}, {"ControlName", type text}, {"Status", type text}, {"EvidenceClass", type text}, {"SourceFile", type text}}, "en-US")
in
    Typed