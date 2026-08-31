let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_scenario.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ScenarioKey", type text}, {"Scenario", type text}, {"ScenarioGroup", type text}, {"IsHistoricalActual", type logical}, {"EvidenceClass", type text}}, "en-US")
in
    Typed