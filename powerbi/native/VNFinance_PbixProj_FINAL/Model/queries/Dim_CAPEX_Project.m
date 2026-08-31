let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_capex_project.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"CAPEXProjectKey", type text}, {"Project", type text}, {"CostCenterKey", type text}, {"ProjectType", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed