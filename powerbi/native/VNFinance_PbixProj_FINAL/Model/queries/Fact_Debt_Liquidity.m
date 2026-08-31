let
    Source = Csv.Document(File.Contents(DataRoot & "\\fact_debt_liquidity.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"MonthStart", type date}, {"FacilityKey", type text}, {"OpeningBalanceVND", type number}, {"DrawdownVND", type number}, {"RepaymentVND", type number}, {"ClosingBalanceVND", type number}, {"InterestRate", type number}, {"InterestExpenseVND", type number}, {"CovenantHeadroomVND", type number}, {"EvidenceClass", type text}}, "en-US")
in
    Typed