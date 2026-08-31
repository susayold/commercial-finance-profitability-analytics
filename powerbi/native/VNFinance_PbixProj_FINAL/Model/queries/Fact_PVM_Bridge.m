let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_pvm_bridge.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"MonthStart", type date}, {"SKUKey", type text}, {"ChannelKey", type text}, {"Component", type text}, {"AmountVND", type number}, {"BaseRevenueVND", type number}, {"CurrentRevenueVND", type number}, {"EvidenceClass", type text}}, "en-US")
in
    Typed