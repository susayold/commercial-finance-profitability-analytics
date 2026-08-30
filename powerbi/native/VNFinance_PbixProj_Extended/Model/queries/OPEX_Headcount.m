let
    Source = Csv.Document(File.Contents(DataRoot & "\\opex_headcount_planning_synthetic.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"period", type text}, {"cost_center", type text}, {"function", type text}, {"headcount_open", Int64.Type}, {"hires", Int64.Type}, {"exits", Int64.Type}, {"headcount_close", Int64.Type}, {"avg_headcount", type number}, {"avg_salary_vnd", type number}, {"payroll_vnd", type number}, {"benefits_vnd", type number}, {"bonus_vnd", type number}, {"non_payroll_opex_vnd", type number}, {"opex_actual_vnd", type number}, {"opex_budget_vnd", type number}, {"opex_forecast_vnd", type number}, {"budget_variance_vnd", type number}, {"forecast_variance_vnd", type number}, {"evidence_class", type text}, {"source_system", type text}}, "en-US")
in
    Typed