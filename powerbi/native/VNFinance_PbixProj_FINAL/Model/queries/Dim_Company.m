let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_company.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"CompanyKey", type text}, {"Company", type text}, {"CompanyType", type text}, {"EvidenceClass", type text}, {"SourceURL", type text}}, "en-US")
in
    Typed