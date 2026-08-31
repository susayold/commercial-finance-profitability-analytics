let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_forecast.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"SnapshotDate", type date}, {"TargetMonth", type date}, {"SKUKey", type text}, {"ChannelKey", type text}, {"ScenarioKey", type text}, {"ForecastVersionKey", type text}, {"ForecastUnits", Int64.Type}, {"ForecastRevenueVND", type number}, {"ForecastCOGSVND", type number}, {"ForecastTradeSpendVND", type number}, {"ForecastOPEXVND", type number}, {"Status", type text}, {"Approved", type logical}, {"ActualAvailabilityDate", type text}, {"Eligibility", type text}, {"EvidenceClass", type text}, {"WorkingCapitalDaysDelta", type number}}, "en-US")
in
    Typed