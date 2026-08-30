# Power BI Input Contract QA

**Status:** `PASS`

| Check | Result | Evidence |
|---|---:|---|
| Product: headers exact | PASS | expected 9, got 9; order-independent |
| Product: non-empty | PASS | 36 |
| Product: no blank cells | PASS | 0 |
| Product: types parse | PASS |  |
| Product: primary key unique | PASS | 0 |
| Customer: headers exact | PASS | expected 7, got 7; order-independent |
| Customer: non-empty | PASS | 24 |
| Customer: no blank cells | PASS | 0 |
| Customer: types parse | PASS |  |
| Customer: primary key unique | PASS | 0 |
| Channel: headers exact | PASS | expected 6, got 6; order-independent |
| Channel: non-empty | PASS | 5 |
| Channel: no blank cells | PASS | 0 |
| Channel: types parse | PASS |  |
| Channel: primary key unique | PASS | 0 |
| Sales: headers exact | PASS | expected 22, got 22; order-independent |
| Sales: non-empty | PASS | 6480 |
| Sales: no blank cells | PASS | 0 |
| Sales: types parse | PASS |  |
| Sales: primary key unique | PASS | 0 |
| Commercial_Costs: headers exact | PASS | expected 11, got 11; order-independent |
| Commercial_Costs: non-empty | PASS | 6480 |
| Commercial_Costs: no blank cells | PASS | 0 |
| Commercial_Costs: types parse | PASS |  |
| Inventory: headers exact | PASS | expected 12, got 12; order-independent |
| Inventory: non-empty | PASS | 2592 |
| Inventory: no blank cells | PASS | 0 |
| Inventory: types parse | PASS |  |
| Receivables: headers exact | PASS | expected 11, got 11; order-independent |
| Receivables: non-empty | PASS | 864 |
| Receivables: no blank cells | PASS | 0 |
| Receivables: types parse | PASS |  |
| Payables: headers exact | PASS | expected 8, got 8; order-independent |
| Payables: non-empty | PASS | 144 |
| Payables: no blank cells | PASS | 0 |
| Payables: types parse | PASS |  |
| Debt: headers exact | PASS | expected 9, got 9; order-independent |
| Debt: non-empty | PASS | 72 |
| Debt: no blank cells | PASS | 0 |
| Debt: types parse | PASS |  |
| Budget: headers exact | PASS | expected 9, got 9; order-independent |
| Budget: non-empty | PASS | 6480 |
| Budget: no blank cells | PASS | 0 |
| Budget: types parse | PASS |  |
| Forecast: headers exact | PASS | expected 10, got 10; order-independent |
| Forecast: non-empty | PASS | 6480 |
| Forecast: no blank cells | PASS | 0 |
| Forecast: types parse | PASS |  |
| Marketing: headers exact | PASS | expected 10, got 10; order-independent |
| Marketing: non-empty | PASS | 180 |
| Marketing: no blank cells | PASS | 0 |
| Marketing: types parse | PASS |  |
| Promotions: headers exact | PASS | expected 14, got 14; order-independent |
| Promotions: non-empty | PASS | 1 |
| Promotions: no blank cells | PASS | 0 |
| Promotions: types parse | PASS |  |
| Promotions: primary key unique | PASS | 0 |
| Source_Control: headers exact | PASS | expected 5, got 5; order-independent |
| Source_Control: non-empty | PASS | 10 |
| Source_Control: no blank cells | PASS | 0 |
| Source_Control: types parse | PASS |  |
| Source_Control: primary key unique | PASS | 0 |
| Scenario Selector: headers exact | PASS | expected 7, got 7; order-independent |
| Scenario Selector: non-empty | PASS | 5 |
| Scenario Selector: no blank cells | PASS | 0 |
| Scenario Selector: types parse | PASS |  |
| Peer_Benchmark: headers exact | PASS | expected 18, got 18; order-independent |
| Peer_Benchmark: non-empty | PASS | 30 |
| Peer_Benchmark: no blank cells | PASS | 0 |
| Peer_Benchmark: types parse | PASS |  |
| Peer_Review_Queue: headers exact | PASS | expected 11, got 11; order-independent |
| Peer_Review_Queue: non-empty | PASS | 25 |
| Peer_Review_Queue: no blank cells | PASS | 0 |
| Peer_Review_Queue: types parse | PASS |  |
| OPEX_Headcount: headers exact | PASS | expected 20, got 20; order-independent |
| OPEX_Headcount: non-empty | PASS | 9 |
| OPEX_Headcount: no blank cells | PASS | 0 |
| OPEX_Headcount: types parse | PASS |  |
| CAPEX_Projects: headers exact | PASS | expected 20, got 20; order-independent |
| CAPEX_Projects: non-empty | PASS | 6 |
| CAPEX_Projects: no blank cells | PASS | 0 |
| CAPEX_Projects: types parse | PASS |  |
| Sales.sku_id -> Product.sku_id | PASS | 0 |
| Sales.customer_id -> Customer.customer_id | PASS | 0 |
| Sales.channel_id -> Channel.channel_id | PASS | 0 |
| Commercial_Costs.sku_id -> Product.sku_id | PASS | 0 |
| Commercial_Costs.channel_id -> Channel.channel_id | PASS | 0 |
| Inventory.sku_id -> Product.sku_id | PASS | 0 |
| Receivables.customer_id -> Customer.customer_id | PASS | 0 |
| Budget.sku_id -> Product.sku_id | PASS | 0 |
| Budget.channel_id -> Channel.channel_id | PASS | 0 |
| Forecast.sku_id -> Product.sku_id | PASS | 0 |
| Forecast.channel_id -> Channel.channel_id | PASS | 0 |
| Marketing.channel_id -> Channel.channel_id | PASS | 0 |
| Promotions.sku_id -> Product.sku_id | PASS | 0 |
| Promotions.channel_id -> Channel.channel_id | PASS | 0 |
| Sales gross-to-net identity | PASS | 0 |
| Sales contribution identity | PASS | 0 |
