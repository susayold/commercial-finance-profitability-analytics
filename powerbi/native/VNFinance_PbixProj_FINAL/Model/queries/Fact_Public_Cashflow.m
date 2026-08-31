let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_public_cashflow.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"CompanyKey", type text}, {"Ticker", type text}, {"FiscalYear", Int64.Type}, {"OperatingCashFlowVNDBn", type number}, {"PATVNDBn", type number}, {"EvidenceClass", type text}, {"SourceDocument", type text}}, "en-US")
in
    Typed