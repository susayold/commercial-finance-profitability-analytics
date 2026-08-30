/*
  VNFinance DirectQuery-ready source schema
  Target: Azure SQL Database / SQL Server / Fabric Warehouse-compatible SQL.
  The table and column names intentionally match the CSV Import contract so
  measures, page bindings and QA controls can be reused during migration.
  Run once in a controlled deployment database, then load rows through an
  approved pipeline (ADF, Fabric Data Factory, dbt or a reviewed bulk load).
*/

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'finance')
    EXEC(N'CREATE SCHEMA finance');
GO

/* Calendar is the one report dimension generated from the sales month range
   in the CSV release; materialize it in the warehouse for pure DirectQuery. */
IF OBJECT_ID(N'finance.Calendar', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Calendar (
        [month]       date          NOT NULL,
        [year]        int           NOT NULL,
        [quarter]     nvarchar(20)  NOT NULL,
        month_number  int           NOT NULL,
        year_month    nvarchar(20)  NOT NULL,
        CONSTRAINT PK_finance_Calendar PRIMARY KEY CLUSTERED ([month])
    );
END;
GO

IF OBJECT_ID(N'finance.Product', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Product (
        sku_id           nvarchar(80)  NOT NULL,
        brand            nvarchar(120) NOT NULL,
        category         nvarchar(120) NOT NULL,
        launch_month     date          NULL,
        list_price       decimal(19,4) NOT NULL,
        pack_size        int           NOT NULL,
        standard_cogs    decimal(19,4) NOT NULL,
        status           nvarchar(40)  NOT NULL,
        supplier_id      nvarchar(80)  NOT NULL,
        CONSTRAINT PK_finance_Product PRIMARY KEY CLUSTERED (sku_id)
    );
END;
GO

IF OBJECT_ID(N'finance.Customer', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Customer (
        customer_id          nvarchar(80)  NOT NULL,
        customer_type        nvarchar(80)  NOT NULL,
        segment               nvarchar(80)  NOT NULL,
        region                nvarchar(80)  NOT NULL,
        payment_terms_days   int           NOT NULL,
        credit_limit         decimal(19,4) NOT NULL,
        acquisition_month    date          NULL,
        CONSTRAINT PK_finance_Customer PRIMARY KEY CLUSTERED (customer_id)
    );
END;
GO

IF OBJECT_ID(N'finance.Channel', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Channel (
        channel_id            nvarchar(80)  NOT NULL,
        channel_type          nvarchar(80)  NOT NULL,
        platform_fee_pct      decimal(12,8) NOT NULL,
        commission_pct        decimal(12,8) NOT NULL,
        settlement_days       int           NOT NULL,
        default_discount_pct  decimal(12,8) NOT NULL,
        CONSTRAINT PK_finance_Channel PRIMARY KEY CLUSTERED (channel_id)
    );
END;
GO

IF OBJECT_ID(N'finance.Sales', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Sales (
        line_id              nvarchar(100) NOT NULL,
        order_id             nvarchar(100) NOT NULL,
        [date]               date          NOT NULL,
        [month]              date          NOT NULL,
        sku_id               nvarchar(80)  NOT NULL,
        customer_id          nvarchar(80)  NOT NULL,
        channel_id           nvarchar(80)  NOT NULL,
        region               nvarchar(80)  NOT NULL,
        units                bigint        NOT NULL,
        gross_sales          decimal(19,4) NOT NULL,
        discount             decimal(19,4) NOT NULL,
        returns              decimal(19,4) NOT NULL,
        net_sales            decimal(19,4) NOT NULL,
        cogs                 decimal(19,4) NOT NULL,
        freight              decimal(19,4) NOT NULL,
        payment_fee          decimal(19,4) NOT NULL,
        commission           decimal(19,4) NOT NULL,
        trade_spend          decimal(19,4) NOT NULL,
        contribution_margin  decimal(19,4) NOT NULL,
        promo_id             nvarchar(100) NULL,
        is_stockout          bit           NOT NULL,
        is_intercompany      bit           NOT NULL,
        CONSTRAINT PK_finance_Sales PRIMARY KEY CLUSTERED (line_id)
    );
END;
GO

IF OBJECT_ID(N'finance.Commercial_Costs', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Commercial_Costs (
        [month]       date          NOT NULL,
        sku_id        nvarchar(80)  NOT NULL,
        channel_id    nvarchar(80)  NOT NULL,
        trade_spend   decimal(19,4) NOT NULL,
        listing_fee   decimal(19,4) NOT NULL,
        rebate        decimal(19,4) NOT NULL,
        freight       decimal(19,4) NOT NULL,
        payment_fee   decimal(19,4) NOT NULL,
        commission    decimal(19,4) NOT NULL,
        writeoff      decimal(19,4) NOT NULL,
        cost_version  nvarchar(80)  NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Inventory', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Inventory (
        [month]          date          NOT NULL,
        warehouse_id     nvarchar(80)  NOT NULL,
        sku_id           nvarchar(80)  NOT NULL,
        opening_units    bigint        NOT NULL,
        receipts_units   bigint        NOT NULL,
        sales_units      bigint        NOT NULL,
        closing_units    bigint        NOT NULL,
        unit_cost        decimal(19,4) NOT NULL,
        inventory_value  decimal(19,4) NOT NULL,
        days_on_hand     decimal(12,4) NOT NULL,
        stockout_flag    bit           NOT NULL,
        expiry_writeoff  decimal(19,4) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Receivables', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Receivables (
        [month]        date          NOT NULL,
        customer_id    nvarchar(80)  NOT NULL,
        opening_ar     decimal(19,4) NOT NULL,
        invoiced       decimal(19,4) NOT NULL,
        cash_collected decimal(19,4) NOT NULL,
        credit_note    decimal(19,4) NOT NULL,
        closing_ar     decimal(19,4) NOT NULL,
        overdue_0_30   decimal(19,4) NOT NULL,
        overdue_31_60  decimal(19,4) NOT NULL,
        overdue_61_plus decimal(19,4) NOT NULL,
        dso            decimal(12,4) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Payables', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Payables (
        [month]       date          NOT NULL,
        supplier_id   nvarchar(80)  NOT NULL,
        opening_ap    decimal(19,4) NOT NULL,
        purchases     decimal(19,4) NOT NULL,
        cash_paid     decimal(19,4) NOT NULL,
        closing_ap    decimal(19,4) NOT NULL,
        overdue_ap    decimal(19,4) NOT NULL,
        dpo           decimal(12,4) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Debt', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Debt (
        [month]             date          NOT NULL,
        facility_id         nvarchar(80)  NOT NULL,
        opening_balance     decimal(19,4) NOT NULL,
        drawdown            decimal(19,4) NOT NULL,
        repayment           decimal(19,4) NOT NULL,
        closing_balance     decimal(19,4) NOT NULL,
        interest_rate       decimal(12,8) NOT NULL,
        interest_expense    decimal(19,4) NOT NULL,
        covenant_headroom   decimal(19,4) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Budget', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Budget (
        [month]             date          NOT NULL,
        sku_id              nvarchar(80)  NOT NULL,
        channel_id          nvarchar(80)  NOT NULL,
        [version]           nvarchar(80)  NOT NULL,
        budget_units        bigint        NOT NULL,
        budget_net_sales    decimal(19,4) NOT NULL,
        budget_cogs         decimal(19,4) NOT NULL,
        budget_trade_spend  decimal(19,4) NOT NULL,
        budget_opex         decimal(19,4) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Forecast', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Forecast (
        snapshot_month      date          NOT NULL,
        target_month        date          NOT NULL,
        sku_id              nvarchar(80)  NOT NULL,
        channel_id          nvarchar(80)  NOT NULL,
        forecast_units      bigint        NOT NULL,
        forecast_net_sales  decimal(19,4) NOT NULL,
        forecast_cogs       decimal(19,4) NOT NULL,
        forecast_trade_spend decimal(19,4) NOT NULL,
        forecast_opex       decimal(19,4) NOT NULL,
        forecast_version    nvarchar(80)  NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Marketing', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Marketing (
        [month]               date          NOT NULL,
        channel_id            nvarchar(80)  NOT NULL,
        campaign_id           nvarchar(100) NOT NULL,
        spend                 decimal(19,4) NOT NULL,
        impressions           bigint        NOT NULL,
        clicks                bigint        NOT NULL,
        orders                bigint        NOT NULL,
        attributed_net_sales  decimal(19,4) NOT NULL,
        cac                   decimal(19,4) NOT NULL,
        roas                  decimal(12,4) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Promotions', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Promotions (
        promo_id               nvarchar(100) NOT NULL,
        start_date             date          NOT NULL,
        end_date               date          NOT NULL,
        channel_id             nvarchar(80)  NOT NULL,
        sku_id                 nvarchar(80)  NOT NULL,
        mechanic               nvarchar(120) NOT NULL,
        planned_discount_pct   decimal(12,8) NOT NULL,
        planned_units_lift_pct decimal(12,8) NOT NULL,
        actual_discount_pct    decimal(12,8) NOT NULL,
        incremental_units      bigint        NOT NULL,
        baseline_units         bigint        NOT NULL,
        promo_spend            decimal(19,4) NOT NULL,
        roi                    decimal(19,4) NOT NULL,
        status                 nvarchar(40)  NOT NULL,
        CONSTRAINT PK_finance_Promotions PRIMARY KEY CLUSTERED (promo_id)
    );
END;
GO

IF OBJECT_ID(N'finance.Source_Control', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Source_Control (
        control_id      nvarchar(80)  NOT NULL,
        control_name    nvarchar(200) NOT NULL,
        status          nvarchar(40)  NOT NULL,
        evidence_class  nvarchar(80)  NOT NULL,
        source_file     nvarchar(260) NOT NULL,
        CONSTRAINT PK_finance_Source_Control PRIMARY KEY CLUSTERED (control_id)
    );
END;
GO

/* Extended finance-analyst scope. The report caption "Scenario Selector"
   maps to the SQL-safe underscore identifier via the migration contract. */
IF OBJECT_ID(N'finance.Scenario_Selector', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Scenario_Selector (
        scenario nvarchar(40) NOT NULL,
        CONSTRAINT PK_finance_Scenario_Selector PRIMARY KEY CLUSTERED (scenario)
    );
END;
GO

IF OBJECT_ID(N'finance.Peer_Benchmark', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Peer_Benchmark (
        company                    nvarchar(160) NOT NULL,
        ticker                     nvarchar(40)  NOT NULL,
        fiscal_year                int           NOT NULL,
        net_revenue_vnd_bn         decimal(19,4) NULL,
        gross_profit_vnd_bn        decimal(19,4) NULL,
        operating_profit_vnd_bn    decimal(19,4) NULL,
        profit_before_tax_vnd_bn   decimal(19,4) NULL,
        profit_after_tax_vnd_bn    decimal(19,4) NULL,
        total_assets_vnd_bn        decimal(19,4) NULL,
        owners_equity_vnd_bn       decimal(19,4) NULL,
        operating_cash_flow_vnd_bn decimal(19,4) NULL,
        source_status              nvarchar(80)  NOT NULL,
        source_layer               nvarchar(80)  NOT NULL,
        revenue_basis              nvarchar(120) NOT NULL,
        source_document            nvarchar(260) NOT NULL,
        source_url                 nvarchar(1000) NOT NULL,
        page_anchor                nvarchar(120) NULL,
        comparability_note         nvarchar(2000) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.Peer_Review_Queue', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Peer_Review_Queue (
        company          nvarchar(160)  NOT NULL,
        ticker           nvarchar(40)   NOT NULL,
        fiscal_year      int            NOT NULL,
        source_document  nvarchar(260)  NOT NULL,
        source_layer     nvarchar(120)  NOT NULL,
        review_status    nvarchar(80)   NOT NULL,
        required_metrics nvarchar(1000) NOT NULL,
        source_url       nvarchar(1000) NOT NULL,
        page_anchor      nvarchar(120)  NOT NULL,
        reported_basis   nvarchar(160)  NOT NULL,
        reviewer_note    nvarchar(2000) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.OPEX_Headcount', N'U') IS NULL
BEGIN
    CREATE TABLE finance.OPEX_Headcount (
        period                 nvarchar(20)  NOT NULL,
        cost_center            nvarchar(80)  NOT NULL,
        [function]             nvarchar(120) NOT NULL,
        headcount_open         bigint        NOT NULL,
        hires                  bigint        NOT NULL,
        exits                  bigint        NOT NULL,
        headcount_close        bigint        NOT NULL,
        avg_headcount          decimal(19,4) NOT NULL,
        avg_salary_vnd         decimal(19,4) NOT NULL,
        payroll_vnd            decimal(19,4) NOT NULL,
        benefits_vnd           decimal(19,4) NOT NULL,
        bonus_vnd              decimal(19,4) NOT NULL,
        non_payroll_opex_vnd   decimal(19,4) NOT NULL,
        opex_actual_vnd        decimal(19,4) NOT NULL,
        opex_budget_vnd        decimal(19,4) NOT NULL,
        opex_forecast_vnd      decimal(19,4) NOT NULL,
        budget_variance_vnd    decimal(19,4) NOT NULL,
        forecast_variance_vnd  decimal(19,4) NOT NULL,
        evidence_class         nvarchar(80)  NOT NULL,
        source_system           nvarchar(120) NOT NULL
    );
END;
GO

IF OBJECT_ID(N'finance.CAPEX_Projects', N'U') IS NULL
BEGIN
    CREATE TABLE finance.CAPEX_Projects (
        period                         nvarchar(20)  NOT NULL,
        project_id                     nvarchar(100) NOT NULL,
        cost_center                    nvarchar(80)  NOT NULL,
        capex_type                     nvarchar(160) NOT NULL,
        approval_status                nvarchar(80)  NOT NULL,
        budget_capex_vnd               decimal(19,4) NOT NULL,
        actual_capex_vnd               decimal(19,4) NOT NULL,
        forecast_capex_vnd             decimal(19,4) NOT NULL,
        committed_capex_vnd            decimal(19,4) NOT NULL,
        asset_cost_vnd                 decimal(19,4) NOT NULL,
        in_service_period              nvarchar(20)  NOT NULL,
        useful_life_months             bigint        NOT NULL,
        depreciation_vnd               decimal(19,4) NOT NULL,
        expected_annual_contribution_vnd decimal(19,4) NOT NULL,
        payback_months                 decimal(19,4) NOT NULL,
        cash_payment_vnd               decimal(19,4) NOT NULL,
        budget_variance_vnd            decimal(19,4) NOT NULL,
        forecast_variance_vnd          decimal(19,4) NOT NULL,
        evidence_class                 nvarchar(80)  NOT NULL,
        source_system                  nvarchar(120) NOT NULL
    );
END;
GO

/* Operational metadata deliberately sits outside the 20 report-facing tables.
   Power BI can expose this through a one-row health query, while the finance
   facts remain stable for the Import-to-DirectQuery migration. */
IF OBJECT_ID(N'finance.Refresh_Control', N'U') IS NULL
BEGIN
    CREATE TABLE finance.Refresh_Control (
        batch_id                nvarchar(120) NOT NULL,
        status                  nvarchar(40)  NOT NULL,
        source_watermark_utc    datetime2(3)  NOT NULL,
        load_started_utc        datetime2(3)  NOT NULL,
        load_completed_utc      datetime2(3)  NULL,
        physical_table_count    int           NOT NULL,
        source_row_count        bigint        NOT NULL,
        loaded_row_count        bigint        NOT NULL,
        rejected_row_count      bigint        NOT NULL,
        source_hash_sha256      nvarchar(64)  NULL,
        error_message           nvarchar(2000) NULL,
        CONSTRAINT PK_finance_Refresh_Control PRIMARY KEY CLUSTERED (batch_id)
    );
END;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_finance_Refresh_Control_Status_Completed' AND object_id = OBJECT_ID(N'finance.Refresh_Control'))
    CREATE NONCLUSTERED INDEX IX_finance_Refresh_Control_Status_Completed
        ON finance.Refresh_Control (status, load_completed_utc DESC)
        INCLUDE (source_watermark_utc, source_row_count, loaded_row_count, rejected_row_count, source_hash_sha256);
GO

/* Query-path indexes: dimensions first, then common monthly slices. */
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_finance_Sales_Month_Channel' AND object_id = OBJECT_ID(N'finance.Sales'))
    CREATE NONCLUSTERED INDEX IX_finance_Sales_Month_Channel ON finance.Sales ([month], channel_id) INCLUDE (net_sales, cogs, contribution_margin, units);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_finance_Sales_Month_Customer' AND object_id = OBJECT_ID(N'finance.Sales'))
    CREATE NONCLUSTERED INDEX IX_finance_Sales_Month_Customer ON finance.Sales ([month], customer_id) INCLUDE (net_sales, contribution_margin, units);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_finance_Sales_Month_SKU' AND object_id = OBJECT_ID(N'finance.Sales'))
    CREATE NONCLUSTERED INDEX IX_finance_Sales_Month_SKU ON finance.Sales ([month], sku_id) INCLUDE (net_sales, cogs, units);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_finance_Costs_Month_Channel' AND object_id = OBJECT_ID(N'finance.Commercial_Costs'))
    CREATE NONCLUSTERED INDEX IX_finance_Costs_Month_Channel ON finance.Commercial_Costs ([month], channel_id) INCLUDE (trade_spend, freight, payment_fee, commission);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_finance_Receivables_Month_Customer' AND object_id = OBJECT_ID(N'finance.Receivables'))
    CREATE NONCLUSTERED INDEX IX_finance_Receivables_Month_Customer ON finance.Receivables ([month], customer_id) INCLUDE (closing_ar, dso);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_finance_Inventory_Month_SKU' AND object_id = OBJECT_ID(N'finance.Inventory'))
    CREATE NONCLUSTERED INDEX IX_finance_Inventory_Month_SKU ON finance.Inventory ([month], sku_id) INCLUDE (inventory_value, days_on_hand, closing_units);
GO
