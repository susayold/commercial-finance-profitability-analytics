let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_cost_center.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"CostCenterKey", type text}, {"CostCenter", type text}, {"Function", type text}, {"CompanyKey", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed