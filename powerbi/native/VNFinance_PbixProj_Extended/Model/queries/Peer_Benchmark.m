let
    Source = Csv.Document(File.Contents(DataRoot & "\\peer_benchmark_approved_2016_2025.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"company", type text}, {"ticker", type text}, {"fiscal_year", Int64.Type}, {"net_revenue_vnd_bn", type number}, {"gross_profit_vnd_bn", type number}, {"operating_profit_vnd_bn", type number}, {"profit_before_tax_vnd_bn", type number}, {"profit_after_tax_vnd_bn", type number}, {"total_assets_vnd_bn", type number}, {"owners_equity_vnd_bn", type number}, {"operating_cash_flow_vnd_bn", type number}, {"source_status", type text}, {"source_layer", type text}, {"revenue_basis", type text}, {"source_document", type text}, {"source_url", type text}, {"page_anchor", type text}, {"comparability_note", type text}}, "en-US")
in
    Typed