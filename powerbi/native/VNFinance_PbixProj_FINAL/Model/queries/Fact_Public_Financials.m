let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_public_financials.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"CompanyKey", type text}, {"Company", type text}, {"Ticker", type text}, {"FiscalYear", Int64.Type}, {"NetRevenueVNDBn", type number}, {"GrossProfitVNDBn", type number}, {"OperatingProfitVNDBn", type number}, {"PBT VNDBn", type number}, {"PATVNDBn", type number}, {"AssetsVNDBn", type number}, {"EquityVNDBn", type number}, {"CFO VNDBn", type number}, {"SourceStatus", type text}, {"RevenueBasis", type text}, {"SourceDocument", type text}, {"SourceURL", type text}, {"PageAnchor", type text}, {"ComparabilityNote", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed