let
    Source = Csv.Document(File.Contents(DataRoot & "\\dim_channel.csv"), [Delimiter=",", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    Typed = Table.TransformColumnTypes(Promoted, {{"ChannelKey", type text}, {"ChannelID", type text}, {"Channel", type text}, {"ChannelGroup", type text}, {"FeeRate", type number}, {"PaymentTermsDays", Int64.Type}, {"CMHurdle", type number}}, "en-US")
in
    Typed