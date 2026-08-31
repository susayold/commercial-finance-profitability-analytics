let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_inventory_snapshot.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"MonthStart", type date}, {"SKUKey", type text}, {"OpeningInventoryVND", type number}, {"ReceiptsVND", type number}, {"COGSFlowVND", type number}, {"ClosingInventoryVND", type number}, {"InventoryValueVND", type number}, {"DIOProxyDays", type text}, {"SlowMovingFlag", type logical}, {"EvidenceClass", type text}}, "en-US")
in
    Typed