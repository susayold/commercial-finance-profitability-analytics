let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_evidence_class.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"EvidenceClass", type text}, {"Definition", type text}, {"AllowedHeadline", type text}}, "en-US")
in
    Typed