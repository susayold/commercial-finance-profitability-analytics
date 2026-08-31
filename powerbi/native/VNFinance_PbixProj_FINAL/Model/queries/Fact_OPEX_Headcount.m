let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_opex_headcount.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"Period", type text}, {"CompanyKey", type text}, {"CostCenterKey", type text}, {"Function", type text}, {"HeadcountOpen", Int64.Type}, {"Hires", Int64.Type}, {"Exits", Int64.Type}, {"HeadcountClose", Int64.Type}, {"AverageHeadcount", type number}, {"AverageSalaryVND", type number}, {"PayrollVND", type number}, {"BenefitsVND", type number}, {"BonusVND", type number}, {"NonPayrollOPEXVND", type number}, {"OPEXActualVND", type number}, {"OPEXBudgetVND", type number}, {"OPEXForecastVND", type number}, {"BudgetVarianceVND", type number}, {"ForecastVarianceVND", type number}, {"EvidenceClass", type text}, {"SourceSystem", type text}}, "en-US")
in
    Typed