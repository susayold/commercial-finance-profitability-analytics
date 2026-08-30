/*
  One-row source-health query for the Controls & Evidence page.
  Run in the finance database after the loader has populated Refresh_Control.
  The 60-minute SLA is a portfolio default; set it to the operating SLA agreed
  with the data owner before enabling Automatic Page Refresh.
*/
DECLARE @SlaMinutes int = 60;

WITH latest AS (
    SELECT TOP (1)
        batch_id,
        status,
        source_watermark_utc,
        load_started_utc,
        load_completed_utc,
        physical_table_count,
        source_row_count,
        loaded_row_count,
        rejected_row_count,
        source_hash_sha256,
        DATEDIFF_BIG(MINUTE, source_watermark_utc, SYSUTCDATETIME()) AS latency_minutes
    FROM finance.Refresh_Control
    ORDER BY load_completed_utc DESC, load_started_utc DESC
)
SELECT
    COALESCE(latest.batch_id, N'NO_LOAD') AS batch_id,
    COALESCE(latest.status, N'NO_LOAD') AS status,
    source_watermark_utc,
    load_started_utc,
    load_completed_utc,
    COALESCE(physical_table_count, 0) AS physical_table_count,
    COALESCE(source_row_count, 0) AS source_row_count,
    COALESCE(loaded_row_count, 0) AS loaded_row_count,
    COALESCE(rejected_row_count, 0) AS rejected_row_count,
    source_hash_sha256,
    latency_minutes,
    CASE
        WHEN latest.batch_id IS NULL THEN N'FAIL'
        WHEN latest.status <> N'SUCCEEDED' THEN N'FAIL'
        WHEN rejected_row_count > 0 THEN N'WARN'
        WHEN latency_minutes BETWEEN 0 AND @SlaMinutes THEN N'PASS'
        ELSE N'WARN'
    END AS control_status,
    CASE
        WHEN latest.batch_id IS NULL THEN N'NO_LOAD'
        WHEN latest.status <> N'SUCCEEDED' THEN N'LOAD_FAILED'
        WHEN rejected_row_count > 0 THEN N'REJECTED_ROWS'
        WHEN latency_minutes < 0 THEN N'CLOCK_SKEW'
        WHEN latency_minutes <= @SlaMinutes THEN N'CURRENT'
        ELSE N'STALE_WATERMARK'
    END AS control_reason
FROM (SELECT 1 AS sentinel) AS one_row
LEFT JOIN latest ON 1 = 1;

/* Optional table-level tie-out for a reviewer or monitoring job. */
SELECT N'Product' AS table_name, COUNT_BIG(*) AS row_count FROM finance.Product
UNION ALL SELECT N'Customer', COUNT_BIG(*) FROM finance.Customer
UNION ALL SELECT N'Channel', COUNT_BIG(*) FROM finance.Channel
UNION ALL SELECT N'Sales', COUNT_BIG(*) FROM finance.Sales
UNION ALL SELECT N'Commercial_Costs', COUNT_BIG(*) FROM finance.Commercial_Costs
UNION ALL SELECT N'Inventory', COUNT_BIG(*) FROM finance.Inventory
UNION ALL SELECT N'Receivables', COUNT_BIG(*) FROM finance.Receivables
UNION ALL SELECT N'Payables', COUNT_BIG(*) FROM finance.Payables
UNION ALL SELECT N'Debt', COUNT_BIG(*) FROM finance.Debt
UNION ALL SELECT N'Budget', COUNT_BIG(*) FROM finance.Budget
UNION ALL SELECT N'Forecast', COUNT_BIG(*) FROM finance.Forecast
UNION ALL SELECT N'Marketing', COUNT_BIG(*) FROM finance.Marketing
UNION ALL SELECT N'Promotions', COUNT_BIG(*) FROM finance.Promotions
UNION ALL SELECT N'Source_Control', COUNT_BIG(*) FROM finance.Source_Control
UNION ALL SELECT N'Scenario Selector', COUNT_BIG(*) FROM finance.Scenario_Selector
UNION ALL SELECT N'Peer_Benchmark', COUNT_BIG(*) FROM finance.Peer_Benchmark
UNION ALL SELECT N'Peer_Review_Queue', COUNT_BIG(*) FROM finance.Peer_Review_Queue
UNION ALL SELECT N'OPEX_Headcount', COUNT_BIG(*) FROM finance.OPEX_Headcount
UNION ALL SELECT N'CAPEX_Projects', COUNT_BIG(*) FROM finance.CAPEX_Projects
UNION ALL SELECT N'Calendar', COUNT_BIG(*) FROM finance.Calendar;
