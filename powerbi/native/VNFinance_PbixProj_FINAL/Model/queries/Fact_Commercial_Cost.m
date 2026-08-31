let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_commercial_cost.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"MonthStart", type date}, {"ChannelKey", type text}, {"CostType", type text}, {"AmountVND", type number}, {"SourceCostBucket", type text}, {"AllocationMethod", type text}, {"EvidenceClass", type text}, {"DatasetVersion", type text}}, "en-US")
in
    Typed