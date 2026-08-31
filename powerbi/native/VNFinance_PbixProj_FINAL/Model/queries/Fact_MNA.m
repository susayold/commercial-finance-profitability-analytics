let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_mna.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"DealKey", type text}, {"Scenario", type text}, {"Year", Int64.Type}, {"TargetRevenueVNDBn", type number}, {"TargetEBITDAMargin", type number}, {"IncrementalEBITVNDBn", type number}, {"IncrementalInterestVNDBn", type number}, {"IncrementalNIVNDBn", type number}, {"ProFormaNIVNDBn", type number}, {"StandaloneEPSVND", type number}, {"ProFormaEPSVND", type number}, {"EPSAccretionPct", type number}, {"PVIncrementalFCFFVNDBn", type number}, {"EvidenceClass", type text}}, "en-US")
in
    Typed