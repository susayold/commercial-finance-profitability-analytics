let
    Source = Csv.Document(File.Contents(DataRoot & "\\peer_extraction_queue.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"company", type text}, {"ticker", type text}, {"fiscal_year", Int64.Type}, {"source_document", type text}, {"source_layer", type text}, {"review_status", type text}, {"required_metrics", type text}, {"source_url", type text}, {"page_anchor", type text}, {"reported_basis", type text}, {"reviewer_note", type text}}, "en-US")
in
    Typed