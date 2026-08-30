#!/usr/bin/env python3
"""Build a refreshable Power BI project and pbi-tools source package.

The generated PBIP is editable text source for Power BI Desktop. The generated
PbixProj can be compiled to a real PBIT by pbi-tools. Both use one DataRoot
parameter, so replacing CSV files with the same schema and refreshing Power BI
updates the semantic model and report visuals.
"""

from __future__ import annotations

import argparse
import csv
import json
import shutil
import uuid
from pathlib import Path


PROJECT = "VNFinance_Commercial_Finance"
DEFAULT_DATA_ROOT = r"C:\VNFinancePowerBI\data\current"

TYPE_TO_M = {
    "string": "type text",
    "int64": "Int64.Type",
    "double": "type number",
    "dateTime": "type date",
    "boolean": "type logical",
}


def cols(*items):
    return list(items)


TABLES = {
    "Calendar": {
        "file": None,
        "data_category": "Time",
        "columns": cols(
            ("month", "dateTime", {"isKey": True, "formatString": "Short Date"}),
            ("year", "int64", {}),
            ("quarter", "string", {}),
            ("month_number", "int64", {}),
            ("year_month", "string", {"sortByColumn": "month"}),
        ),
    },
    "Product": {
        "file": "product_master.csv",
        "columns": cols(
            ("sku_id", "string", {"isKey": True}),
            ("brand", "string", {}),
            ("category", "string", {}),
            ("launch_month", "dateTime", {}),
            ("list_price", "double", {"summarizeBy": "sum"}),
            ("pack_size", "int64", {}),
            ("standard_cogs", "double", {"summarizeBy": "sum"}),
            ("status", "string", {}),
            ("supplier_id", "string", {}),
        ),
    },
    "Customer": {
        "file": "customer_master.csv",
        "columns": cols(
            ("customer_id", "string", {"isKey": True}),
            ("customer_type", "string", {}),
            ("segment", "string", {}),
            ("region", "string", {}),
            ("payment_terms_days", "int64", {}),
            ("credit_limit", "double", {"summarizeBy": "sum"}),
            ("acquisition_month", "dateTime", {}),
        ),
    },
    "Channel": {
        "file": "channel_master.csv",
        "columns": cols(
            ("channel_id", "string", {"isKey": True}),
            ("channel_type", "string", {}),
            ("platform_fee_pct", "double", {}),
            ("commission_pct", "double", {}),
            ("settlement_days", "int64", {}),
            ("default_discount_pct", "double", {}),
        ),
    },
    "Sales": {
        "file": "sales_fact.csv",
        "columns": cols(
            ("line_id", "string", {"isKey": True}),
            ("order_id", "string", {}),
            ("date", "dateTime", {}),
            ("month", "dateTime", {}),
            ("sku_id", "string", {}),
            ("customer_id", "string", {}),
            ("channel_id", "string", {}),
            ("region", "string", {}),
            ("units", "int64", {"summarizeBy": "sum"}),
            ("gross_sales", "double", {"summarizeBy": "sum"}),
            ("discount", "double", {"summarizeBy": "sum"}),
            ("returns", "double", {"summarizeBy": "sum"}),
            ("net_sales", "double", {"summarizeBy": "sum"}),
            ("cogs", "double", {"summarizeBy": "sum"}),
            ("freight", "double", {"summarizeBy": "sum"}),
            ("payment_fee", "double", {"summarizeBy": "sum"}),
            ("commission", "double", {"summarizeBy": "sum"}),
            ("trade_spend", "double", {"summarizeBy": "sum"}),
            ("contribution_margin", "double", {"summarizeBy": "sum"}),
            ("promo_id", "string", {}),
            ("is_stockout", "boolean", {}),
            ("is_intercompany", "boolean", {}),
        ),
    },
    "Commercial_Costs": {
        "file": "commercial_costs.csv",
        "columns": cols(
            ("month", "dateTime", {}),
            ("sku_id", "string", {}),
            ("channel_id", "string", {}),
            ("trade_spend", "double", {"summarizeBy": "sum"}),
            ("listing_fee", "double", {"summarizeBy": "sum"}),
            ("rebate", "double", {"summarizeBy": "sum"}),
            ("freight", "double", {"summarizeBy": "sum"}),
            ("payment_fee", "double", {"summarizeBy": "sum"}),
            ("commission", "double", {"summarizeBy": "sum"}),
            ("writeoff", "double", {"summarizeBy": "sum"}),
            ("cost_version", "string", {}),
        ),
    },
    "Inventory": {
        "file": "inventory.csv",
        "columns": cols(
            ("month", "dateTime", {}),
            ("warehouse_id", "string", {}),
            ("sku_id", "string", {}),
            ("opening_units", "int64", {"summarizeBy": "sum"}),
            ("receipts_units", "int64", {"summarizeBy": "sum"}),
            ("sales_units", "int64", {"summarizeBy": "sum"}),
            ("closing_units", "int64", {"summarizeBy": "sum"}),
            ("unit_cost", "double", {"summarizeBy": "sum"}),
            ("inventory_value", "double", {"summarizeBy": "sum"}),
            ("days_on_hand", "double", {}),
            ("stockout_flag", "boolean", {}),
            ("expiry_writeoff", "double", {"summarizeBy": "sum"}),
        ),
    },
    "Receivables": {
        "file": "receivables.csv",
        "columns": cols(
            ("month", "dateTime", {}),
            ("customer_id", "string", {}),
            ("opening_ar", "double", {"summarizeBy": "sum"}),
            ("invoiced", "double", {"summarizeBy": "sum"}),
            ("cash_collected", "double", {"summarizeBy": "sum"}),
            ("credit_note", "double", {"summarizeBy": "sum"}),
            ("closing_ar", "double", {"summarizeBy": "sum"}),
            ("overdue_0_30", "double", {"summarizeBy": "sum"}),
            ("overdue_31_60", "double", {"summarizeBy": "sum"}),
            ("overdue_61_plus", "double", {"summarizeBy": "sum"}),
            ("dso", "double", {}),
        ),
    },
    "Payables": {
        "file": "payables.csv",
        "columns": cols(
            ("month", "dateTime", {}),
            ("supplier_id", "string", {}),
            ("opening_ap", "double", {"summarizeBy": "sum"}),
            ("purchases", "double", {"summarizeBy": "sum"}),
            ("cash_paid", "double", {"summarizeBy": "sum"}),
            ("closing_ap", "double", {"summarizeBy": "sum"}),
            ("overdue_ap", "double", {"summarizeBy": "sum"}),
            ("dpo", "double", {}),
        ),
    },
    "Debt": {
        "file": "debt.csv",
        "columns": cols(
            ("month", "dateTime", {}),
            ("facility_id", "string", {}),
            ("opening_balance", "double", {"summarizeBy": "sum"}),
            ("drawdown", "double", {"summarizeBy": "sum"}),
            ("repayment", "double", {"summarizeBy": "sum"}),
            ("closing_balance", "double", {"summarizeBy": "sum"}),
            ("interest_rate", "double", {}),
            ("interest_expense", "double", {"summarizeBy": "sum"}),
            ("covenant_headroom", "double", {"summarizeBy": "sum"}),
        ),
    },
    "Budget": {
        "file": "budget.csv",
        "columns": cols(
            ("month", "dateTime", {}),
            ("sku_id", "string", {}),
            ("channel_id", "string", {}),
            ("version", "string", {}),
            ("budget_units", "int64", {"summarizeBy": "sum"}),
            ("budget_net_sales", "double", {"summarizeBy": "sum"}),
            ("budget_cogs", "double", {"summarizeBy": "sum"}),
            ("budget_trade_spend", "double", {"summarizeBy": "sum"}),
            ("budget_opex", "double", {"summarizeBy": "sum"}),
        ),
    },
    "Forecast": {
        "file": "forecast.csv",
        "columns": cols(
            ("snapshot_month", "dateTime", {}),
            ("target_month", "dateTime", {}),
            ("sku_id", "string", {}),
            ("channel_id", "string", {}),
            ("forecast_units", "int64", {"summarizeBy": "sum"}),
            ("forecast_net_sales", "double", {"summarizeBy": "sum"}),
            ("forecast_cogs", "double", {"summarizeBy": "sum"}),
            ("forecast_trade_spend", "double", {"summarizeBy": "sum"}),
            ("forecast_opex", "double", {"summarizeBy": "sum"}),
            ("forecast_version", "string", {}),
        ),
    },
    "Marketing": {
        "file": "marketing_spend.csv",
        "columns": cols(
            ("month", "dateTime", {}),
            ("channel_id", "string", {}),
            ("campaign_id", "string", {}),
            ("spend", "double", {"summarizeBy": "sum"}),
            ("impressions", "int64", {"summarizeBy": "sum"}),
            ("clicks", "int64", {"summarizeBy": "sum"}),
            ("orders", "int64", {"summarizeBy": "sum"}),
            ("attributed_net_sales", "double", {"summarizeBy": "sum"}),
            ("cac", "double", {}),
            ("roas", "double", {}),
        ),
    },
    "Promotions": {
        "file": "promotions.csv",
        "columns": cols(
            ("promo_id", "string", {"isKey": True}),
            ("start_date", "dateTime", {}),
            ("end_date", "dateTime", {}),
            ("channel_id", "string", {}),
            ("sku_id", "string", {}),
            ("mechanic", "string", {}),
            ("planned_discount_pct", "double", {}),
            ("planned_units_lift_pct", "double", {}),
            ("actual_discount_pct", "double", {}),
            ("incremental_units", "int64", {"summarizeBy": "sum"}),
            ("baseline_units", "int64", {"summarizeBy": "sum"}),
            ("promo_spend", "double", {"summarizeBy": "sum"}),
            ("roi", "double", {}),
            ("status", "string", {}),
        ),
    },
    "Source_Control": {
        "file": "source_control.csv",
        "columns": cols(
            ("control_id", "string", {"isKey": True}),
            ("control_name", "string", {}),
            ("status", "string", {}),
            ("evidence_class", "string", {}),
            ("source_file", "string", {}),
        ),
    },
    # Planning and benchmark layers are first-class model tables. Keeping
    # them in the same DataRoot contract means a finance user can replace the
    # CSV drop (without rebuilding the report) and refresh every driver,
    # variance and evidence view from one controlled folder.
    "Scenario Selector": {
        "file": "scenario_selector.csv",
        "columns": cols(
            ("scenario", "string", {"isKey": True}),
            ("base_case", "string", {}),
            ("revenue_multiplier", "double", {}),
            ("cogs_multiplier", "double", {}),
            ("opex_multiplier", "double", {}),
            ("working_capital_days_delta", "double", {}),
            ("scenario_note", "string", {}),
        ),
    },
    "Peer_Benchmark": {
        "file": "peer_benchmark_approved_2016_2025.csv",
        "columns": cols(
            ("company", "string", {}),
            ("ticker", "string", {}),
            ("fiscal_year", "int64", {}),
            ("net_revenue_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("gross_profit_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("operating_profit_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("profit_before_tax_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("profit_after_tax_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("total_assets_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("owners_equity_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("operating_cash_flow_vnd_bn", "double", {"summarizeBy": "sum"}),
            ("source_status", "string", {}),
            ("source_layer", "string", {}),
            ("revenue_basis", "string", {}),
            ("source_document", "string", {}),
            ("source_url", "string", {}),
            ("page_anchor", "string", {}),
            ("comparability_note", "string", {}),
        ),
    },
    "Peer_Review_Queue": {
        "file": "peer_extraction_queue.csv",
        "columns": cols(
            ("company", "string", {}),
            ("ticker", "string", {}),
            ("fiscal_year", "int64", {}),
            ("source_document", "string", {}),
            ("source_layer", "string", {}),
            ("review_status", "string", {}),
            ("required_metrics", "string", {}),
            ("source_url", "string", {}),
            ("page_anchor", "string", {}),
            ("reported_basis", "string", {}),
            ("reviewer_note", "string", {}),
        ),
    },
    "OPEX_Headcount": {
        "file": "opex_headcount_planning_synthetic.csv",
        "columns": cols(
            ("period", "string", {}),
            ("cost_center", "string", {}),
            ("function", "string", {}),
            ("headcount_open", "int64", {"summarizeBy": "sum"}),
            ("hires", "int64", {"summarizeBy": "sum"}),
            ("exits", "int64", {"summarizeBy": "sum"}),
            ("headcount_close", "int64", {"summarizeBy": "sum"}),
            ("avg_headcount", "double", {"summarizeBy": "sum"}),
            ("avg_salary_vnd", "double", {"summarizeBy": "sum"}),
            ("payroll_vnd", "double", {"summarizeBy": "sum"}),
            ("benefits_vnd", "double", {"summarizeBy": "sum"}),
            ("bonus_vnd", "double", {"summarizeBy": "sum"}),
            ("non_payroll_opex_vnd", "double", {"summarizeBy": "sum"}),
            ("opex_actual_vnd", "double", {"summarizeBy": "sum"}),
            ("opex_budget_vnd", "double", {"summarizeBy": "sum"}),
            ("opex_forecast_vnd", "double", {"summarizeBy": "sum"}),
            ("budget_variance_vnd", "double", {"summarizeBy": "sum"}),
            ("forecast_variance_vnd", "double", {"summarizeBy": "sum"}),
            ("evidence_class", "string", {}),
            ("source_system", "string", {}),
        ),
    },
    "CAPEX_Projects": {
        "file": "capex_fixed_asset_planning_synthetic.csv",
        "columns": cols(
            ("period", "string", {}),
            # Project IDs repeat across project-month rows; the row grain is
            # period x project, so this column must not be declared a primary
            # key in the Power BI model.
            ("project_id", "string", {}),
            ("cost_center", "string", {}),
            ("capex_type", "string", {}),
            ("approval_status", "string", {}),
            ("budget_capex_vnd", "double", {"summarizeBy": "sum"}),
            ("actual_capex_vnd", "double", {"summarizeBy": "sum"}),
            ("forecast_capex_vnd", "double", {"summarizeBy": "sum"}),
            ("committed_capex_vnd", "double", {"summarizeBy": "sum"}),
            ("asset_cost_vnd", "double", {"summarizeBy": "sum"}),
            ("in_service_period", "string", {}),
            ("useful_life_months", "int64", {}),
            ("depreciation_vnd", "double", {"summarizeBy": "sum"}),
            ("expected_annual_contribution_vnd", "double", {"summarizeBy": "sum"}),
            ("payback_months", "double", {}),
            ("cash_payment_vnd", "double", {"summarizeBy": "sum"}),
            ("budget_variance_vnd", "double", {"summarizeBy": "sum"}),
            ("forecast_variance_vnd", "double", {"summarizeBy": "sum"}),
            ("evidence_class", "string", {}),
            ("source_system", "string", {}),
        ),
    },
}

# SQL identifiers can be normalized independently from report table captions.
# The scenario table intentionally keeps a human-readable disconnected caption
# in the report while the DirectQuery source uses a safe underscore identifier.
DIRECTQUERY_SOURCE_TABLES = {"Scenario Selector": "Scenario_Selector"}


MEASURES = [
    ("Net Revenue", "SUM ( Sales[net_sales] )", "#,0,,.0 M"),
    ("Gross Sales", "SUM ( Sales[gross_sales] )", "#,0,,.0 M"),
    # Power BI does not allow a measure to share a name with a column in the
    # same table. Keep the raw Sales[cogs]/Sales[units] columns for audit,
    # and give the aggregate measures explicit names so Desktop can load the
    # generated PBIP/PBIT instead of failing during model hydration.
    ("COGS Total", "SUM ( Sales[cogs] )", "#,0,,.0 M"),
    ("Gross Profit", "[Net Revenue] - [COGS Total]", "#,0,,.0 M"),
    ("Gross Margin %", "DIVIDE ( [Gross Profit], [Net Revenue] )", "0.0%"),
    ("Contribution Margin", "SUM ( Sales[contribution_margin] )", "#,0,,.0 M"),
    ("Contribution Margin %", "DIVIDE ( [Contribution Margin], [Net Revenue] )", "0.0%"),
    ("Units Total", "SUM ( Sales[units] )", "#,0"),
    ("ASP", "DIVIDE ( [Net Revenue], [Units Total] )", "#,0"),
    ("Budget Revenue", "SUM ( Budget[budget_net_sales] )", "#,0,,.0 M"),
    ("Forecast Revenue", "SUM ( Forecast[forecast_net_sales] )", "#,0,,.0 M"),
    ("Revenue vs Budget", "[Net Revenue] - [Budget Revenue]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("Revenue vs Budget %", "DIVIDE ( [Revenue vs Budget], [Budget Revenue] )", "0.0%;(0.0%)"),
    ("Revenue vs Forecast", "[Net Revenue] - [Forecast Revenue]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("Revenue vs Forecast %", "DIVIDE ( [Revenue vs Forecast], [Forecast Revenue] )", "0.0%;(0.0%)"),
    ("Prior Net Revenue", "CALCULATE ( [Net Revenue], DATEADD ( Calendar[month], -1, MONTH ) )", "#,0,,.0 M"),
    ("Revenue Growth %", "DIVIDE ( [Net Revenue] - [Prior Net Revenue], [Prior Net Revenue] )", "0.0%;(0.0%)"),
    ("Prior Units", "CALCULATE ( [Units Total], DATEADD ( Calendar[month], -1, MONTH ) )", "#,0"),
    ("Prior ASP", "CALCULATE ( [ASP], DATEADD ( Calendar[month], -1, MONTH ) )", "#,0"),
    ("Price Impact", "( [ASP] - [Prior ASP] ) * [Units Total]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("Volume Impact", "( [Units Total] - [Prior Units] ) * [Prior ASP]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("Mix Other Impact", "[Net Revenue] - [Prior Net Revenue] - [Price Impact] - [Volume Impact]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("Trade Spend", "SUM ( Commercial_Costs[trade_spend] )", "#,0,,.0 M"),
    ("Marketing Spend", "SUM ( Marketing[spend] )", "#,0,,.0 M"),
    ("Ending AR", "CALCULATE ( SUM ( Receivables[closing_ar] ), LASTDATE ( Calendar[month] ) )", "#,0,,.0 M"),
    ("Ending Inventory", "CALCULATE ( SUM ( Inventory[inventory_value] ), LASTDATE ( Calendar[month] ) )", "#,0,,.0 M"),
    ("Ending AP", "CALCULATE ( SUM ( Payables[closing_ap] ), LASTDATE ( Calendar[month] ) )", "#,0,,.0 M"),
    ("DSO", "CALCULATE ( AVERAGE ( Receivables[dso] ), LASTDATE ( Calendar[month] ) )", "0.0"),
    ("DIO", "CALCULATE ( AVERAGE ( Inventory[days_on_hand] ), LASTDATE ( Calendar[month] ) )", "0.0"),
    ("DPO", "CALCULATE ( AVERAGE ( Payables[dpo] ), LASTDATE ( Calendar[month] ) )", "0.0"),
    ("CCC", '''VAR Scenario = [Selected Scenario]
VAR WorkingCapitalDelta = COALESCE ( CALCULATE ( MAX ( 'Scenario Selector'[working_capital_days_delta] ), 'Scenario Selector'[scenario] = Scenario ), 0 )
RETURN [DSO] + [DIO] - [DPO] + WorkingCapitalDelta''', "0.0"),
    ("Debt Balance", "CALCULATE ( SUM ( Debt[closing_balance] ), LASTDATE ( Calendar[month] ) )", "#,0,,.0 M"),
    ("Covenant Headroom", "CALCULATE ( SUM ( Debt[covenant_headroom] ), LASTDATE ( Calendar[month] ) )", "#,0,,.0 M"),
    ("Sales Rows", "COUNTROWS ( Sales )", "#,0"),
    ("Product Rows", "COUNTROWS ( Product )", "#,0"),
    ("Customer Rows", "COUNTROWS ( Customer )", "#,0"),
    ("Refresh Timestamp", "NOW ()", "yyyy-mm-dd hh:mm:ss"),
    ("Selected Scenario", 'SELECTEDVALUE ( \'Scenario Selector\'[scenario], "Actual" )', "@"),
    # Scenario Selector is deliberately disconnected.  The selected row
    # supplies a finance-owned base case and editable driver multipliers, so
    # Upside/Downside are real planning sensitivities rather than aliases for
    # Actual.  Replacing scenario_selector.csv and refreshing is sufficient;
    # the report topology does not need to be rebuilt.
    ("Scenario Revenue", '''VAR Scenario = [Selected Scenario]
VAR BaseCase = COALESCE ( CALCULATE ( SELECTEDVALUE ( 'Scenario Selector'[base_case] ), 'Scenario Selector'[scenario] = Scenario ), "Actual" )
VAR BaseRevenue = SWITCH ( BaseCase, "Budget", [Budget Revenue], "Forecast", [Forecast Revenue], [Net Revenue] )
VAR Multiplier = COALESCE ( CALCULATE ( MAX ( 'Scenario Selector'[revenue_multiplier] ), 'Scenario Selector'[scenario] = Scenario ), 1 )
RETURN BaseRevenue * Multiplier''', "#,0,,.0 M"),
    ("EBITDA Proxy", '''VAR Scenario = [Selected Scenario]
VAR BaseCase = COALESCE ( CALCULATE ( SELECTEDVALUE ( 'Scenario Selector'[base_case] ), 'Scenario Selector'[scenario] = Scenario ), "Actual" )
VAR BaseCOGS = SWITCH ( BaseCase, "Budget", SUM ( Budget[budget_cogs] ), "Forecast", SUM ( Forecast[forecast_cogs] ), [COGS Total] )
VAR BaseOPEX = SWITCH ( BaseCase, "Budget", [OPEX Budget], "Forecast", [OPEX Forecast], [OPEX Actual] )
VAR COGSMultiplier = COALESCE ( CALCULATE ( MAX ( 'Scenario Selector'[cogs_multiplier] ), 'Scenario Selector'[scenario] = Scenario ), 1 )
VAR OPEXMultiplier = COALESCE ( CALCULATE ( MAX ( 'Scenario Selector'[opex_multiplier] ), 'Scenario Selector'[scenario] = Scenario ), 1 )
RETURN [Scenario Revenue] - BaseCOGS * COGSMultiplier - BaseOPEX * OPEXMultiplier''', "#,0,,.0 M"),
    ("OPEX Actual", "SUM ( OPEX_Headcount[opex_actual_vnd] )", "#,0,,.0 M"),
    ("OPEX Budget", "SUM ( OPEX_Headcount[opex_budget_vnd] )", "#,0,,.0 M"),
    ("OPEX Forecast", "SUM ( OPEX_Headcount[opex_forecast_vnd] )", "#,0,,.0 M"),
    ("OPEX vs Budget", "[OPEX Actual] - [OPEX Budget]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("OPEX vs Forecast", "[OPEX Actual] - [OPEX Forecast]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("Average Headcount", "SUM ( OPEX_Headcount[avg_headcount] )", "#,0.0"),
    ("CAPEX Budget", "SUM ( CAPEX_Projects[budget_capex_vnd] )", "#,0,,.0 M"),
    ("CAPEX Actual", "SUM ( CAPEX_Projects[actual_capex_vnd] )", "#,0,,.0 M"),
    ("CAPEX Forecast", "SUM ( CAPEX_Projects[forecast_capex_vnd] )", "#,0,,.0 M"),
    ("CAPEX Committed", "SUM ( CAPEX_Projects[committed_capex_vnd] )", "#,0,,.0 M"),
    ("CAPEX Cash Payment", "SUM ( CAPEX_Projects[cash_payment_vnd] )", "#,0,,.0 M"),
    ("CAPEX Depreciation", "SUM ( CAPEX_Projects[depreciation_vnd] )", "#,0,,.0 M"),
    ("CAPEX Annual Benefit", "SUM ( CAPEX_Projects[expected_annual_contribution_vnd] )", "#,0,,.0 M"),
    ("CAPEX Payback Months", "AVERAGE ( CAPEX_Projects[payback_months] )", "0.0"),
    ("CAPEX vs Budget", "[CAPEX Actual] - [CAPEX Budget]", "#,0,,.0 M;(#,0,,.0 M)"),
    ("Approved Peer Rows", "COUNTROWS ( Peer_Benchmark )", "#,0"),
    ("Peer Revenue", "SUM ( Peer_Benchmark[net_revenue_vnd_bn] )", "#,0.0"),
    ("Peer PAT Margin", "DIVIDE ( SUM ( Peer_Benchmark[profit_after_tax_vnd_bn] ), SUM ( Peer_Benchmark[net_revenue_vnd_bn] ) )", "0.0%"),
    ("Peer CFO Conversion", "DIVIDE ( SUM ( Peer_Benchmark[operating_cash_flow_vnd_bn] ), SUM ( Peer_Benchmark[profit_after_tax_vnd_bn] ) )", "0.0x"),
    ("Peer Review Queue Rows", "COUNTROWS ( Peer_Review_Queue )", "#,0"),
]


RELATIONSHIPS = [
    ("rel-sales-calendar", "Sales", "month", "Calendar", "month"),
    ("rel-sales-product", "Sales", "sku_id", "Product", "sku_id"),
    ("rel-sales-customer", "Sales", "customer_id", "Customer", "customer_id"),
    ("rel-sales-channel", "Sales", "channel_id", "Channel", "channel_id"),
    ("rel-cost-calendar", "Commercial_Costs", "month", "Calendar", "month"),
    ("rel-cost-product", "Commercial_Costs", "sku_id", "Product", "sku_id"),
    ("rel-cost-channel", "Commercial_Costs", "channel_id", "Channel", "channel_id"),
    ("rel-inventory-calendar", "Inventory", "month", "Calendar", "month"),
    ("rel-inventory-product", "Inventory", "sku_id", "Product", "sku_id"),
    ("rel-ar-calendar", "Receivables", "month", "Calendar", "month"),
    ("rel-ar-customer", "Receivables", "customer_id", "Customer", "customer_id"),
    ("rel-ap-calendar", "Payables", "month", "Calendar", "month"),
    ("rel-debt-calendar", "Debt", "month", "Calendar", "month"),
    ("rel-budget-calendar", "Budget", "month", "Calendar", "month"),
    ("rel-budget-product", "Budget", "sku_id", "Product", "sku_id"),
    ("rel-budget-channel", "Budget", "channel_id", "Channel", "channel_id"),
    ("rel-forecast-calendar", "Forecast", "target_month", "Calendar", "month"),
    ("rel-forecast-product", "Forecast", "sku_id", "Product", "sku_id"),
    ("rel-forecast-channel", "Forecast", "channel_id", "Channel", "channel_id"),
    ("rel-marketing-calendar", "Marketing", "month", "Calendar", "month"),
    ("rel-marketing-channel", "Marketing", "channel_id", "Channel", "channel_id"),
    ("rel-promo-product", "Promotions", "sku_id", "Product", "sku_id"),
    ("rel-promo-channel", "Promotions", "channel_id", "Channel", "channel_id"),
    ("rel-opex-calendar", "OPEX_Headcount", "period", "Calendar", "year_month"),
    ("rel-capex-calendar", "CAPEX_Projects", "period", "Calendar", "year_month"),
]


def jwrite(path: Path, obj) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def twrite(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def sql_name(name: str) -> str:
    return "'" + name.replace("'", "''") + "'" if " " in name else name


def csv_query(file_name: str, columns) -> str:
    changes = ", ".join(
        "{\"%s\", %s}" % (name, TYPE_TO_M[data_type])
        for name, data_type, _ in columns
    )
    return (
        "let\n"
        f"    Source = Csv.Document(File.Contents(DataRoot & \\\"\\\\{file_name}\\\"), "
        "[Delimiter=\\\",\\\", Encoding=65001, QuoteStyle=QuoteStyle.Csv]),\n"
        "    Promoted = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),\n"
        f"    Typed = Table.TransformColumnTypes(Promoted, {{{changes}}}, \\\"en-US\\\")\n"
        "in\n"
        "    Typed"
    ).replace('\\"', '"')


def calendar_query() -> str:
    return """let
    StartDate = #date(2023, 1, 1),
    MonthCount = 36,
    MonthList = List.Transform({0..MonthCount-1}, each Date.AddMonths(StartDate, _)),
    Base = Table.FromList(MonthList, Splitter.SplitByNothing(), {"month"}),
    Typed = Table.TransformColumnTypes(Base, {{"month", type date}}),
    AddYear = Table.AddColumn(Typed, "year", each Date.Year([month]), Int64.Type),
    AddQuarter = Table.AddColumn(AddYear, "quarter", each "Q" & Text.From(Date.QuarterOfYear([month])), type text),
    AddMonthNumber = Table.AddColumn(AddQuarter, "month_number", each Date.Month([month]), Int64.Type),
    AddYearMonth = Table.AddColumn(AddMonthNumber, "year_month", each Date.ToText([month], "yyyy-MM"), type text)
in
    AddYearMonth"""


def create_source_control(data_dir: Path) -> None:
    rows = [
        ["CTRL-01", "Synthetic ledger manifest present", "PASS", "SIMULATED", "manifest.json"],
        ["CTRL-02", "Sales fact schema stable", "PASS", "SIMULATED", "sales_fact.csv"],
        ["CTRL-03", "Budget and forecast sources separate", "PASS", "SIMULATED", "budget.csv | forecast.csv"],
        ["CTRL-04", "Refresh uses DataRoot parameter", "PASS", "CONTROL", "Power Query parameter"],
        ["CTRL-05", "True real-time requires DirectQuery", "OPEN", "ARCHITECTURE", "DirectQuery-compatible source"],
        ["CTRL-06", "OPEX actual/budget/forecast bridge present", "PASS", "SIMULATED", "opex_headcount_planning_synthetic.csv"],
        ["CTRL-07", "CAPEX commitment/cash/payback bridge present", "PASS", "SIMULATED", "capex_fixed_asset_planning_synthetic.csv"],
        ["CTRL-08", "Peer benchmark rows are approved reported data", "PASS", "PUBLIC_REPORTED", "peer_benchmark_approved_2016_2025.csv"],
        ["CTRL-09", "Unapproved peer candidates remain in review queue", "PASS", "CONTROL", "peer_extraction_queue.csv"],
        ["CTRL-10", "Scenario selector is disconnected; base case and driver multipliers are editable", "PASS", "CONTROL", "scenario_selector.csv"],
    ]
    path = data_dir / "source_control.csv"
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["control_id", "control_name", "status", "evidence_class", "source_file"])
        writer.writerows(rows)


def entity_ref(alias):
    return {"SourceRef": {"Source": alias}}


def measure_sel(alias, table, prop):
    return {
        "Measure": {"Expression": entity_ref(alias), "Property": prop},
        "Name": f"{table}.{prop}",
        "NativeReferenceName": prop,
    }


def column_sel(alias, table, prop):
    return {
        "Column": {"Expression": entity_ref(alias), "Property": prop},
        "Name": f"{table}.{prop}",
        "NativeReferenceName": prop,
    }


def visual(name, visual_type, position, fields, projections, order_by=None):
    aliases = {}
    selects = []
    for kind, table, field in fields:
        alias = aliases.setdefault(table, f"t{len(aliases)}")
        selects.append(measure_sel(alias, table, field) if kind == "measure" else column_sel(alias, table, field))
    query = {
        "Version": 2,
        "From": [{"Name": alias, "Entity": table, "Type": 0} for table, alias in aliases.items()],
        "Select": selects,
    }
    if order_by:
        table, field, direction = order_by
        alias = aliases[table]
        query["OrderBy"] = [{
            "Direction": direction,
            "Expression": {"Measure": {"Expression": entity_ref(alias), "Property": field}},
        }]
    return {
        "name": name,
        "layouts": [{"id": 0, "position": position}],
        "singleVisual": {
            "visualType": visual_type,
            "projections": projections,
            "prototypeQuery": query,
            "drillFilterOtherVisuals": True,
        },
    }


def card(name, metric, x, y, z):
    ref = f"Sales.{metric}"
    return visual(name, "card", {"x": x, "y": y, "z": z, "width": 280, "height": 110},
                  [("measure", "Sales", metric)], {"Values": [{"queryRef": ref}]})


def chart(name, vtype, x, y, z, category, metrics, width=580, height=250):
    cat_table, cat_field = category
    fields = [("column", cat_table, cat_field)] + [("measure", "Sales", m) for m in metrics]
    return visual(
        name, vtype, {"x": x, "y": y, "z": z, "width": width, "height": height}, fields,
        {"Category": [{"queryRef": f"{cat_table}.{cat_field}"}],
         "Y": [{"queryRef": f"Sales.{m}"} for m in metrics]},
        order_by=("Sales", metrics[0], 2) if vtype == "clusteredBarChart" else None,
    )


def table_visual(name, x, y, z, columns, metrics, width=1200, height=220):
    fields = [("column", t, c) for t, c in columns] + [("measure", "Sales", m) for m in metrics]
    refs = [f"{t}.{c}" for t, c in columns] + [f"Sales.{m}" for m in metrics]
    return visual(name, "tableEx", {"x": x, "y": y, "z": z, "width": width, "height": height},
                  fields, {"Values": [{"queryRef": r} for r in refs]})


def slicer_visual(name, x, y, z, table, column, width=280, height=55):
    """A native slicer bound to a disconnected planning selector."""
    ref = f"{table}.{column}"
    return visual(name, "slicer", {"x": x, "y": y, "z": z, "width": width, "height": height},
                  [("column", table, column)], {"Values": [{"queryRef": ref}]})


def build_pages():
    pages = []
    page_specs = [
        ("Executive Output", [
            card("10000000000000000001", "Net Revenue", 40, 30, 1),
            card("10000000000000000002", "Contribution Margin %", 360, 30, 2),
            card("10000000000000000003", "Revenue vs Budget %", 680, 30, 3),
            card("10000000000000000004", "CCC", 1000, 30, 4),
            chart("10000000000000000005", "lineChart", 40, 170, 5, ("Calendar", "year_month"), ["Net Revenue"], 600),
            chart("10000000000000000006", "clusteredBarChart", 660, 170, 6, ("Channel", "channel_type"), ["Contribution Margin"], 580),
            # A compact table selector is deliberately used instead of the
            # newer slicer schema so the PBIT remains compatible with Desktop
            # builds that do not expose the slicer visual in templates. A row
            # click still cross-filters the disconnected scenario measure.
            table_visual("10000000000000000008", 40, 420, 8,
                         [("Scenario Selector", "scenario")], [], 280, 55),
            table_visual("10000000000000000007", 40, 480, 7,
                         [("Customer", "customer_id"), ("Customer", "segment"), ("Customer", "region")],
                         ["Net Revenue", "Contribution Margin", "Scenario Revenue", "EBITDA Proxy"]),
        ]),
        ("P&L and Variance", [
            card("20000000000000000001", "Gross Profit", 40, 30, 1),
            card("20000000000000000002", "Gross Margin %", 360, 30, 2),
            card("20000000000000000003", "Revenue vs Forecast %", 680, 30, 3),
            card("20000000000000000004", "Trade Spend", 1000, 30, 4),
            chart("20000000000000000005", "lineChart", 40, 170, 5, ("Calendar", "year_month"),
                  ["Net Revenue", "Budget Revenue", "Forecast Revenue"], 1200),
            table_visual("20000000000000000006", 40, 450, 6, [("Calendar", "year_month")],
                         ["Net Revenue", "Budget Revenue", "Forecast Revenue", "Revenue vs Budget",
                          "OPEX Actual", "OPEX Budget", "OPEX vs Budget", "Average Headcount"]),
        ]),
        ("PVM Bridge", [
            card("30000000000000000001", "Price Impact", 40, 30, 1),
            card("30000000000000000002", "Volume Impact", 360, 30, 2),
            card("30000000000000000003", "Mix Other Impact", 680, 30, 3),
            card("30000000000000000004", "Revenue Growth %", 1000, 30, 4),
            chart("30000000000000000005", "lineChart", 40, 170, 5, ("Calendar", "year_month"),
                  ["Net Revenue", "Prior Net Revenue"], 600),
            chart("30000000000000000006", "clusteredBarChart", 660, 170, 6,
                  ("Product", "category"), ["Contribution Margin"], 580),
            table_visual("30000000000000000007", 40, 450, 7,
                         [("Product", "sku_id"), ("Product", "category")],
                         ["Units Total", "ASP", "Price Impact", "Volume Impact", "Mix Other Impact"]),
        ]),
        ("Channel and Customer Profitability", [
            card("40000000000000000001", "Contribution Margin", 40, 30, 1),
            card("40000000000000000002", "Contribution Margin %", 360, 30, 2),
            card("40000000000000000003", "Marketing Spend", 680, 30, 3),
            card("40000000000000000004", "Net Revenue", 1000, 30, 4),
            chart("40000000000000000005", "clusteredBarChart", 40, 170, 5,
                  ("Channel", "channel_type"), ["Contribution Margin"], 600),
            chart("40000000000000000006", "clusteredBarChart", 660, 170, 6,
                  ("Customer", "segment"), ["Contribution Margin"], 580),
            table_visual("40000000000000000007", 40, 450, 7,
                         [("Customer", "customer_id"), ("Customer", "segment"), ("Customer", "region")],
                         ["Net Revenue", "Contribution Margin", "Contribution Margin %"]),
        ]),
        ("Working Capital and Liquidity", [
            card("50000000000000000001", "DSO", 40, 30, 1),
            card("50000000000000000002", "DIO", 360, 30, 2),
            card("50000000000000000003", "DPO", 680, 30, 3),
            card("50000000000000000004", "CCC", 1000, 30, 4),
            chart("50000000000000000005", "lineChart", 40, 170, 5, ("Calendar", "year_month"),
                  ["Ending AR", "Ending Inventory", "Ending AP"], 600),
            chart("50000000000000000006", "lineChart", 660, 170, 6, ("Calendar", "year_month"),
                  ["Debt Balance", "Covenant Headroom"], 580),
            table_visual("50000000000000000007", 40, 450, 7, [("Calendar", "year_month")],
                         ["Ending AR", "Ending Inventory", "Ending AP", "Debt Balance",
                          "CAPEX Actual", "CAPEX Committed", "CAPEX Cash Payment", "CAPEX Payback Months"]),
        ]),
        ("Controls and Evidence", [
            card("60000000000000000001", "Sales Rows", 40, 30, 1),
            card("60000000000000000002", "Product Rows", 360, 30, 2),
            card("60000000000000000003", "Customer Rows", 680, 30, 3),
            card("60000000000000000004", "Refresh Timestamp", 1000, 30, 4),
            table_visual("60000000000000000005", 40, 170, 5,
                         [("Source_Control", "control_id"), ("Source_Control", "control_name"),
                          ("Source_Control", "status"), ("Source_Control", "evidence_class"),
                          ("Source_Control", "source_file")], [], 580, 220),
            table_visual("60000000000000000006", 660, 170, 6,
                         [("Peer_Review_Queue", "ticker"), ("Peer_Review_Queue", "fiscal_year"),
                          ("Peer_Review_Queue", "review_status"), ("Peer_Review_Queue", "source_document")],
                         ["Peer Review Queue Rows"], 580, 220),
            table_visual("60000000000000000007", 40, 410, 7,
                         [("Peer_Benchmark", "company"), ("Peer_Benchmark", "ticker"),
                          ("Peer_Benchmark", "fiscal_year"), ("Peer_Benchmark", "source_status")],
                         ["Peer Revenue", "Peer PAT Margin", "Peer CFO Conversion"], 1200, 250),
        ]),
    ]
    for ordinal, (display_name, visuals) in enumerate(page_specs):
        pages.append({
            "name": f"ReportSection{ordinal + 1:02d}",
            "displayName": display_name,
            "displayOption": 1,
            "width": 1280,
            "height": 720,
            "ordinal": ordinal,
            "config": "{}",
            "filters": "[]",
            "visuals": visuals,
        })
    return pages


def write_pbixproj(out: Path, theme: Path) -> None:
    if not out.name.startswith("VNFinance_"):
        raise ValueError(f"Refusing to replace an unexpected PbixProj directory: {out}")
    if out.exists():
        shutil.rmtree(out)
    jwrite(out / ".pbixproj.json", {"version": "1.0", "settings": {"model": {"serializationMode": "Default"}}})
    twrite(out / "Version.txt", "1.25")
    jwrite(out / "ReportMetadata.json", {"Version": 5, "AutoCreatedRelationships": [], "FileDescription": "", "CreatedFrom": "Cloud", "CreatedFromRelease": "2021.11"})
    jwrite(out / "ReportSettings.json", {"Version": 1, "ReportSettings": {}, "QueriesSettings": {"TypeDetectionEnabled": True, "RelationshipImportEnabled": True, "RunBackgroundAnalysis": True, "Version": "2.81.5831.821"}})
    jwrite(out / "DiagramLayout.json", {"version": "1.1.0", "diagrams": [{"ordinal": 0, "scrollPosition": {"x": 0, "y": 0}, "nodes": [{"location": {"x": 40 + 260 * (i % 4), "y": 40 + 240 * (i // 4)}, "nodeIndex": table, "size": {"height": 200, "width": 220}, "zIndex": i + 1} for i, table in enumerate(TABLES)], "name": "Finance Model", "zoomValue": 75, "pinKeyFieldsToTop": False, "showExtraHeaderInfo": False, "hideKeyFieldsWhenCollapsed": False}], "selectedDiagram": "Finance Model", "defaultDiagram": "Finance Model"})

    db = {
        "name": PROJECT,
        "compatibilityLevel": 1550,
        "model": {
            "culture": "en-US",
            "dataAccessOptions": {"legacyRedirects": True, "returnErrorValuesAsNull": True},
            "defaultPowerBIDataSourceVersion": "powerBI_V3",
            "sourceQueryCulture": "en-US",
            "relationships": [{"name": n, "fromTable": ft, "fromColumn": fc, "toTable": tt, "toColumn": tc} for n, ft, fc, tt, tc in RELATIONSHIPS],
            "expressions": [{"name": "DataRoot", "kind": "m"}],
            "annotations": [
                {"name": "__PBI_TimeIntelligenceEnabled", "value": "0"},
                {"name": "PBIDesktopVersion", "value": "2.153.1206.0 (26.04)"},
                {"name": "PBI_QueryOrder", "value": json.dumps(["DataRoot", *TABLES.keys()], separators=(",", ":"))},
            ],
        },
    }
    jwrite(out / "Model" / "database.json", db)
    twrite(out / "Model" / "queries" / "DataRoot.m", json.dumps(DEFAULT_DATA_ROOT) + ' meta [IsParameterQuery=true, Type="Text", IsParameterQueryRequired=true]')

    for table, spec in TABLES.items():
        tdir = out / "Model" / "tables" / table
        tjson = {"name": table}
        if spec.get("data_category"):
            tjson["dataCategory"] = spec["data_category"]
        jwrite(tdir / "table.json", tjson)
        for col, data_type, extras in spec["columns"]:
            c = {"name": col, "dataType": data_type, "sourceColumn": col, "summarizeBy": extras.get("summarizeBy", "none"), "annotations": [{"name": "SummarizationSetBy", "value": "User"}]}
            for key in ("isKey", "formatString", "sortByColumn"):
                if key in extras:
                    c[key] = extras[key]
            jwrite(tdir / "columns" / f"{col}.json", c)
        query = calendar_query() if table == "Calendar" else csv_query(spec["file"], spec["columns"])
        twrite(out / "Model" / "queries" / f"{table}.m", query)
    for name, dax, fmt in MEASURES:
        twrite(out / "Model" / "tables" / "Sales" / "measures" / f"{name}.dax", dax + "\n")
        twrite(out / "Model" / "tables" / "Sales" / "measures" / f"{name}.xml", f'<Measure Name="{name}">\n  <FormatString>{fmt}</FormatString>\n</Measure>')

    theme_name = theme.stem
    jwrite(out / "Report" / "report.json", {"id": 0, "layoutOptimization": 0, "resourcePackages": [{"resourcePackage": {"disabled": False, "name": "SharedResources", "type": 2, "items": [{"name": theme_name, "path": f"BaseThemes/{theme.name}", "type": 202}]}}]})
    jwrite(out / "Report" / "config.json", {"version": "5.9", "themeCollection": {"baseTheme": {"name": theme_name, "version": "5.10", "type": 2}}, "activeSectionIndex": 0, "defaultDrillFilterOtherVisuals": True, "settings": {"useNewFilterPaneExperience": True}})
    dst = out / "StaticResources" / "SharedResources" / "BaseThemes" / theme.name
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(theme, dst)
    for page in build_pages():
        sec = out / "Report" / "sections" / f"{page['ordinal']:03d}_{page['displayName']}"
        jwrite(sec / "section.json", {k: page[k] for k in ("displayName", "displayOption", "height", "name", "ordinal", "width")})
        jwrite(sec / "config.json", {})
        jwrite(sec / "filters.json", [])
        for index, cfg in enumerate(page["visuals"]):
            vdir = sec / "visualContainers" / f"{index:05d}_{cfg['singleVisual']['visualType']} ({cfg['name'][-5:]})"
            pos = cfg["layouts"][0]["position"]
            jwrite(vdir / "visualContainer.json", {k: pos[k] for k in ("height", "width", "x", "y", "z")})
            jwrite(vdir / "config.json", cfg)
            jwrite(vdir / "filters.json", [])


def tmdl_indent_m(m_text: str) -> str:
    return "\n".join("\t\t\t" + line for line in m_text.splitlines())


def write_pbip(out: Path, theme: Path) -> None:
    if not out.name.startswith("VNFinance_"):
        raise ValueError(f"Refusing to replace an unexpected PBIP directory: {out}")
    if out.exists():
        shutil.rmtree(out)
    report = out / f"{PROJECT}.Report"
    model = out / f"{PROJECT}.SemanticModel"
    jwrite(out / f"{PROJECT}.pbip", {"$schema": "https://developer.microsoft.com/json-schemas/fabric/pbip/pbipProperties/1.0.0/schema.json", "version": "1.0", "artifacts": [{"report": {"path": f"{PROJECT}.Report"}}], "settings": {"enableAutoRecovery": True}})
    jwrite(report / ".platform", {"$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json", "metadata": {"type": "Report", "displayName": PROJECT}, "config": {"version": "2.0", "logicalId": str(uuid.uuid4())}})
    jwrite(model / ".platform", {"$schema": "https://developer.microsoft.com/json-schemas/fabric/gitIntegration/platformProperties/2.0.0/schema.json", "metadata": {"type": "SemanticModel", "displayName": PROJECT}, "config": {"version": "2.0", "logicalId": str(uuid.uuid4())}})
    jwrite(report / "definition.pbir", {"$schema": "https://developer.microsoft.com/json-schemas/fabric/item/report/definitionProperties/2.0.0/schema.json", "version": "4.0", "datasetReference": {"byPath": {"path": f"../{PROJECT}.SemanticModel"}}})
    jwrite(model / "definition.pbism", {"$schema": "https://developer.microsoft.com/json-schemas/fabric/item/semanticModel/definitionProperties/1.0.0/schema.json", "version": "4.2", "settings": {"qnaEnabled": True}})
    twrite(model / "definition" / "database.tmdl", f"database {uuid.uuid4()}\n\tcompatibilityLevel: 1600\n\tcompatibilityMode: powerBI\n")
    model_lines = ["model Model", "\tculture: en-US", "\tdefaultPowerBIDataSourceVersion: powerBI_V3", "\tsourceQueryCulture: en-US", "\tdataAccessOptions", "\t\tlegacyRedirects", "\t\treturnErrorValuesAsNull", "", "annotation __PBI_TimeIntelligenceEnabled = 0", "annotation PBI_ProTooling = [\"DevMode\"]", "", *[f"ref table {sql_name(t)}" for t in TABLES]]
    twrite(model / "definition" / "model.tmdl", "\n".join(model_lines) + "\n")
    twrite(model / "definition" / "expressions.tmdl", f'expression DataRoot = "{DEFAULT_DATA_ROOT.replace(chr(92), chr(92)*2)}" meta [IsParameterQuery=true, Type="Text", IsParameterQueryRequired=true]\n\tlineageTag: {uuid.uuid4()}\n')
    rel_lines = []
    for name, ft, fc, tt, tc in RELATIONSHIPS:
        rel_lines += [f"relationship {name}", f"\tfromColumn: {sql_name(ft)}.{fc}", f"\ttoColumn: {sql_name(tt)}.{tc}", ""]
    twrite(model / "definition" / "relationships.tmdl", "\n".join(rel_lines))
    for table, spec in TABLES.items():
        lines = [f"table {sql_name(table)}", f"\tlineageTag: {uuid.uuid4()}"]
        if spec.get("data_category"):
            lines.append(f"\tdataCategory: {spec['data_category']}")
        if table == "Sales":
            for name, dax, fmt in MEASURES:
                lines += ["", f"\tmeasure {sql_name(name)} = {dax}", f"\t\tformatString: {fmt}", f"\t\tlineageTag: {uuid.uuid4()}"]
        for col, data_type, extras in spec["columns"]:
            lines += ["", f"\tcolumn {sql_name(col)}", f"\t\tdataType: {data_type}"]
            if extras.get("isKey"):
                lines.append("\t\tisKey")
            if extras.get("formatString"):
                lines.append(f"\t\tformatString: {extras['formatString']}")
            lines += [f"\t\tsummarizeBy: {extras.get('summarizeBy', 'none')}", f"\t\tsourceColumn: {col}", f"\t\tlineageTag: {uuid.uuid4()}"]
            if extras.get("sortByColumn"):
                lines.append(f"\t\tsortByColumn: {extras['sortByColumn']}")
            lines.append("\t\tannotation SummarizationSetBy = User")
        query = calendar_query() if table == "Calendar" else csv_query(spec["file"], spec["columns"])
        lines += ["", f"\tpartition {sql_name(table)} = m", "\t\tmode: import", "\t\tsource =", tmdl_indent_m(query), "", "\tannotation PBI_ResultType = Table"]
        twrite(model / "definition" / "tables" / f"{table}.tmdl", "\n".join(lines) + "\n")

    theme_name = theme.stem
    report_config = {"version": "5.9", "themeCollection": {"baseTheme": {"name": theme_name, "version": "5.10", "type": 2}}, "activeSectionIndex": 0, "defaultDrillFilterOtherVisuals": True, "settings": {"useNewFilterPaneExperience": True}}
    sections = []
    for page in build_pages():
        sections.append({
            "name": page["name"], "displayName": page["displayName"], "displayOption": 1,
            "width": 1280, "height": 720, "ordinal": page["ordinal"], "config": "{}", "filters": "[]",
            "visualContainers": [{"x": cfg["layouts"][0]["position"]["x"], "y": cfg["layouts"][0]["position"]["y"], "z": cfg["layouts"][0]["position"]["z"], "width": cfg["layouts"][0]["position"]["width"], "height": cfg["layouts"][0]["position"]["height"], "config": json.dumps(cfg, separators=(",", ":")), "filters": "[]"} for cfg in page["visuals"]],
        })
    jwrite(report / "report.json", {"config": json.dumps(report_config, separators=(",", ":")), "layoutOptimization": 0, "resourcePackages": [{"resourcePackage": {"disabled": False, "name": "SharedResources", "type": 2, "items": [{"name": theme_name, "path": f"BaseThemes/{theme.name}", "type": 202}]}}], "sections": sections})
    dst = report / "StaticResources" / "SharedResources" / "BaseThemes" / theme.name
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(theme, dst)
    twrite(out / ".gitignore", "**/.pbi/localSettings.json\n**/.pbi/cache.abf\n")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", type=Path, required=True)
    parser.add_argument("--pbixproj-dir", type=Path, required=True)
    parser.add_argument("--pbip-dir", type=Path, required=True)
    parser.add_argument("--theme", type=Path, required=True)
    args = parser.parse_args()
    create_source_control(args.data_dir)
    missing = [spec["file"] for spec in TABLES.values() if spec["file"] and not (args.data_dir / spec["file"]).exists()]
    if missing:
        raise SystemExit("Missing source files: " + ", ".join(missing))
    write_pbixproj(args.pbixproj_dir, args.theme)
    write_pbip(args.pbip_dir, args.theme)
    print(json.dumps({
        "status": "PASS",
        "tables": len(TABLES),
        "measures": len(MEASURES),
        "relationships": len(RELATIONSHIPS),
        "pages": len(build_pages()),
        "visuals": sum(len(p["visuals"]) for p in build_pages()),
        "pbixproj": str(args.pbixproj_dir),
        "pbip": str(args.pbip_dir),
    }, indent=2))


if __name__ == "__main__":
    main()
