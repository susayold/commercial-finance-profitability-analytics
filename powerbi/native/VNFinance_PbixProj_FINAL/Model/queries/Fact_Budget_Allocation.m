let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_budget_allocation.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ChannelKey", type text}, {"CurrentBudgetVND", type number}, {"MarginalROI", type number}, {"CapacityVND", type number}, {"MaxIncreasePct", type number}, {"RecommendedBudgetVND", type number}, {"BudgetDeltaVND", type number}, {"IncrementalContributionVND", type number}, {"Decision", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed