let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_forecast_version.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ForecastVersionKey", type text}, {"SnapshotDate", type date}, {"TargetMonth", type date}, {"Status", type text}, {"Approver", type text}, {"Eligibility", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed