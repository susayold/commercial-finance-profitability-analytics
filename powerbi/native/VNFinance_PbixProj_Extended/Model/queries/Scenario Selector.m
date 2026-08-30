let
    Source = Csv.Document(File.Contents(DataRoot & "\\scenario_selector.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"scenario", type text}, {"base_case", type text}, {"revenue_multiplier", type number}, {"cogs_multiplier", type number}, {"opex_multiplier", type number}, {"working_capital_days_delta", type number}, {"scenario_note", type text}}, "en-US")
in
    Typed