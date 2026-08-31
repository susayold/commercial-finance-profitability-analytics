let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_valuation.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ValuationCaseKey", type text}, {"CompanyKey", type text}, {"Scenario", type text}, {"ForecastYear", Int64.Type}, {"WACC", type number}, {"TerminalGrowth", type number}, {"PVExplicitFCFFVNDBn", type number}, {"PVTerminalVNDBn", type number}, {"EnterpriseValueVNDBn", type number}, {"OutputBoundary", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed