let
    Source = Csv.Document(File.Contents(DataRoot & "\\capex_fixed_asset_planning_synthetic.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"period", type text}, {"project_id", type text}, {"cost_center", type text}, {"capex_type", type text}, {"approval_status", type text}, {"budget_capex_vnd", type number}, {"actual_capex_vnd", type number}, {"forecast_capex_vnd", type number}, {"committed_capex_vnd", type number}, {"asset_cost_vnd", type number}, {"in_service_period", type text}, {"useful_life_months", Int64.Type}, {"depreciation_vnd", type number}, {"expected_annual_contribution_vnd", type number}, {"payback_months", type number}, {"cash_payment_vnd", type number}, {"budget_variance_vnd", type number}, {"forecast_variance_vnd", type number}, {"evidence_class", type text}, {"source_system", type text}}, "en-US")
in
    Typed