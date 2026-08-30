let
    Source = Csv.Document(File.Contents(DataRoot & "\\scenario_selector.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"scenario", type text}}, "en-US")
in
    Typed