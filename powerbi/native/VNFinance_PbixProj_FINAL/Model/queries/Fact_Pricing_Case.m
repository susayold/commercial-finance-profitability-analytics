let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_pricing_case.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"PricingCaseKey", type text}, {"PricingCase", type text}, {"ChannelKey", type text}, {"BaselineUnits", Int64.Type}, {"BaselinePriceVND", type number}, {"UnitCostVND", type number}, {"PriceChangePct", type number}, {"Elasticity", type number}, {"NewPriceVND", type number}, {"VolumeChangePct", type number}, {"NewUnits", Int64.Type}, {"BaselineContributionVND", type number}, {"ScenarioContributionVND", type number}, {"ContributionDeltaVND", type number}, {"BreakEvenPriceChangePct", type number}, {"EvidenceClass", type text}}, "en-US")
in
    Typed