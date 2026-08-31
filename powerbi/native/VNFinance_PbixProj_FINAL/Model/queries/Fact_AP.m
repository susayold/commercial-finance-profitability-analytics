let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_ap_snapshot.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"MonthStart", type date}, {"SupplierKey", type text}, {"OpeningAPVND", type number}, {"PurchasesVND", type number}, {"CashPaidVND", type number}, {"ClosingAPVND", type number}, {"OverdueAPVND", type number}, {"DPODays", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed