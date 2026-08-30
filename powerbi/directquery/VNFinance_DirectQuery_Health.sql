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
    latency_minutes,
    CASE
        WHEN status = N'SUCCEEDED'
         AND rejected_row_count = 0
         AND latency_minutes BETWEEN 0 AND @SlaMinutes
        THEN N'PASS'
        WHEN status = N'SUCCEEDED' THEN N'WARN_STALE'
        ELSE N'FAIL'
    END AS control_status
FROM latest;

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
UNION ALL SELECT N'Calendar', COUNT_BIG(*) FROM finance.Calendar;
