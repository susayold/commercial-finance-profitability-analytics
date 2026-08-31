let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_promotion.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"PromotionKey", type text}, {"Promotion", type text}, {"ChannelKey", type text}, {"StartDate", type date}, {"EndDate", type date}, {"BaselineUnits", Int64.Type}, {"UpliftPct", type number}, {"IncrementalUnits", Int64.Type}, {"NetPriceVND", type number}, {"IncrementalRevenueVND", type number}, {"IncrementalVariableCostVND", type number}, {"PromotionSpendVND", type number}, {"IncrementalContributionVND", type number}, {"ROI", type number}, {"CMHurdle", type number}, {"Decision", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed