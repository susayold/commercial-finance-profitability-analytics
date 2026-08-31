let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_budget.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"MonthStart", type date}, {"SKUKey", type text}, {"ChannelKey", type text}, {"ScenarioKey", type text}, {"ForecastVersionKey", type text}, {"BudgetUnits", Int64.Type}, {"BudgetRevenueVND", type number}, {"BudgetCOGSVND", type number}, {"BudgetTradeSpendVND", type number}, {"BudgetOPEXVND", type number}, {"EvidenceClass", type text}}, "en-US")
in
    Typed