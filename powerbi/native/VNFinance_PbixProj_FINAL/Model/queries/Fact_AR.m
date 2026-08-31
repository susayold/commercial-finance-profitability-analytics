let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_ar_snapshot.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"MonthStart", type date}, {"CustomerKey", type text}, {"OpeningARVND", type number}, {"InvoicedCreditSalesVND", type number}, {"CashCollectedVND", type number}, {"CreditNoteVND", type number}, {"ClosingARVND", type number}, {"Aging0_30VND", type number}, {"Aging31_60VND", type number}, {"Aging61PlusVND", type number}, {"DSODays", type text}, {"EvidenceClass", type text}}, "en-US")
in
    Typed