#!/usr/bin/env python3
"""Build the plan-aligned VNFinance final PBIP/PbixProj source.

The script reuses the repository's conservative PBIP/PBIT writer but supplies
the reconciled ``final_v1`` schema, finance-owned measures, an 11-page CFO
operating system, hidden drillthrough/tooltip pages, and machine-readable
visual coordinates.  It intentionally produces editable text source and a
PBIT candidate; native PBIX rendering remains a Power BI Desktop gate.
"""
from __future__ import annotations

import csv
import importlib.util
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_PATH = ROOT / "scripts" / "build_powerbi_refreshable_project.py"
spec = importlib.util.spec_from_file_location("base_powerbi_builder", BASE_PATH)
if spec is None or spec.loader is None:
    raise RuntimeError("Cannot load base Power BI writer")
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
_base_csv_query = base.csv_query
_base_calendar_query = base.calendar_query

PROJECT = "VNFinance_Commercial_Finance_FINAL"
DATA_DIR = ROOT / "powerbi" / "data" / "final_v1"
DEFAULT_DATA_ROOT = r"C:\VNFinancePowerBI\data\final_v1"
THEME_PATH = ROOT / "powerbi" / "theme" / "VNFinance_Final_Theme.json"


def _columns(path: Path) -> list[tuple[str, str, dict]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        headers = reader.fieldnames or []
        sample = list(reader)[:150]
    date_cols = {"DateKey", "Date", "MonthStart", "SnapshotDate", "TargetMonth", "StartDate", "EndDate", "InServicePeriod"}
    bool_cols = {"IsClosedMonth", "IsLatestClosedMonth", "IsHistoricalActual", "Approved", "SlowMovingFlag", "IsIntercompany", "IsStockout"}
    int_cols = {"Year", "MonthNumber", "FiscalYear", "DaysInMonth", "PaymentTermsDays", "BaselineUnits", "IncrementalUnits", "NewUnits", "ForecastUnits", "BudgetUnits", "HeadcountOpen", "Hires", "Exits", "HeadcountClose", "UsefulLifeMonths", "ForecastYear", "Year"}
    pct_cols = {"StandardGM", "FeeRate", "CMHurdle", "MarginalROI", "MaxIncreasePct", "UpliftPct", "PriceChangePct", "Elasticity", "VolumeChangePct", "BreakEvenPriceChangePct", "ROI", "InterestRate", "WACC", "TerminalGrowth", "TargetEBITDAMargin", "EPSAccretionPct"}
    amount_tokens = ("VND", "Revenue", "COGS", "Cost", "Spend", "Profit", "Contribution", "Balance", "AR", "AP", "Inventory", "Cash", "Budget", "Forecast", "Value", "Price", "Units", "Amount", "Payables", "Receivables", "CFO", "PAT", "Assets", "Equity", "Capital", "Debt", "Payment", "Depreciation", "Salary", "Payroll", "Benefits", "Bonus", "Headcount")
    out: list[tuple[str, str, dict]] = []
    for col in headers:
        values = [row.get(col, "") for row in sample if row.get(col, "") not in (None, "")]
        if col in date_cols:
            dtype = "dateTime"
        elif col in bool_cols:
            dtype = "boolean"
        elif col in int_cols:
            dtype = "int64"
        else:
            numeric = True
            integral = True
            for value in values:
                try:
                    number = float(value)
                    integral = integral and number.is_integer()
                except (TypeError, ValueError):
                    numeric = False
                    break
            dtype = "int64" if numeric and integral and col.lower().endswith(("year", "count", "rows", "units", "months")) else "double" if numeric and (col in pct_cols or any(token.lower() in col.lower() for token in amount_tokens)) else "string"
        extras: dict = {"summarizeBy": "none"}
        if dtype in ("int64", "double") and (col in pct_cols or any(token.lower() in col.lower() for token in amount_tokens)):
            extras["summarizeBy"] = "sum"
        if col in {"DateKey", "ProductKey", "CustomerKey", "ChannelKey", "ScenarioKey", "ForecastVersionKey", "CostCenterKey", "CAPEXProjectKey", "CompanyKey", "EvidenceClass", "LineID", "PromotionKey", "PricingCaseKey", "ValuationCaseKey"}:
            extras["isKey"] = True
        if col in {"YearMonth", "MonthStart"}:
            extras["sortByColumn"] = "MonthStart" if col == "YearMonth" else "DateKey"
        if col in pct_cols or col.endswith("Pct") or col.endswith("Margin"):
            extras["formatString"] = "0.0%"
        elif "Days" in col or col.endswith("Days"):
            extras["formatString"] = "0.0"
        elif dtype in ("int64", "double") and any(token.lower() in col.lower() for token in amount_tokens):
            extras["formatString"] = "#,0"
        out.append((col, dtype, extras))
    return out


FILE_MAP = [
    ("Dim_Date", "dim_date.csv"), ("Dim_Product", "dim_product.csv"), ("Dim_Customer", "dim_customer.csv"), ("Dim_Channel", "dim_channel.csv"),
    ("Dim_Scenario", "dim_scenario.csv"), ("Dim_Forecast_Version", "dim_forecast_version.csv"), ("Dim_Cost_Center", "dim_cost_center.csv"), ("Dim_CAPEX_Project", "dim_capex_project.csv"),
    ("Dim_Company", "dim_company.csv"), ("Dim_Evidence_Class", "dim_evidence_class.csv"), ("Dim_Commercial_View", "dim_commercial_view.csv"),
    ("Sales", "fact_sales.csv"), ("Fact_Commercial_Cost", "fact_commercial_cost.csv"), ("Fact_Budget", "fact_budget.csv"), ("Fact_Forecast", "fact_forecast.csv"),
    ("Fact_PVM_Bridge", "fact_pvm_bridge.csv"), ("Fact_AR", "fact_ar_snapshot.csv"), ("Fact_Inventory", "fact_inventory_snapshot.csv"), ("Fact_AP", "fact_ap_snapshot.csv"),
    ("Fact_Debt_Liquidity", "fact_debt_liquidity.csv"), ("Fact_Promotion", "fact_promotion.csv"), ("Fact_Pricing_Case", "fact_pricing_case.csv"), ("Fact_Budget_Allocation", "fact_budget_allocation.csv"),
    ("Fact_OPEX_Headcount", "fact_opex_headcount.csv"), ("Fact_CAPEX", "fact_capex.csv"), ("Fact_Public_Financials", "fact_public_financials.csv"), ("Fact_Public_Cashflow", "fact_public_cashflow.csv"),
    ("Fact_Valuation", "fact_valuation.csv"), ("Fact_MNA", "fact_mna.csv"), ("Source_Control", "source_control.csv"),
]
TABLES = {name: {"file": filename, "columns": _columns(DATA_DIR / filename), **({"data_category": "Time"} if name == "Dim_Date" else {})} for name, filename in FILE_MAP}


def _m(name: str, dax: str, fmt: str, folder: str) -> tuple[str, str, str, str]:
    return name, dax, fmt, folder


MEASURES = [
    _m("Management Message", 'VAR gap = [Revenue vs Budget %] RETURN IF ( gap < 0, "Revenue is " & FORMAT ( gap, "0.0%" ) & " below budget; protect contribution and release cash.", "Revenue is on or above budget; keep hurdle discipline and fund growth." )', "@", "00 Financial"),
    _m("Public Evidence Banner", '"PUBLIC REPORTED / DERIVED — NOT VIETNOVA OPERATING ACTUALS"', "@", "09 Public Company"),
    _m("Strategic Evidence Banner", '"EV ONLY — NOT A PRICE TARGET | SYNTHETIC STRATEGIC REHEARSAL"', "@", "10 Strategic Finance"),
    _m("Forecast Governance Banner", '"DEMO FORECAST GOVERNANCE — GATE A OPEN"', "@", "06 Forecast"),
    _m("Gross Sales", "SUM ( Sales[GrossSalesVND] )", "#,0", "01 Financial"),
    _m("Discounts", "SUM ( Sales[DiscountVND] )", "#,0", "01 Financial"),
    _m("Returns", "SUM ( Sales[ReturnsVND] )", "#,0", "01 Financial"),
    _m("Net Revenue", "SUM ( Sales[NetRevenueVND] )", "#,0", "01 Financial"),
    _m("Units Corrected", "SUM ( Sales[UnitsCorrected] )", "#,0", "01 Financial"),
    _m("COGS", "SUM ( Sales[CorrectedCOGSVND] )", "#,0", "01 Financial"),
    _m("Gross Profit", "[Net Revenue] - [COGS]", "#,0", "01 Financial"),
    _m("Gross Margin %", "DIVIDE ( [Gross Profit], [Net Revenue] )", "0.0%", "01 Financial"),
    _m("Channel Fees", "SUM ( Sales[AllocatedChannelFeeVND] )", "#,0", "04 Commercial"),
    _m("Trade Spend", "SUM ( Sales[AllocatedTradeSpendVND] )", "#,0", "04 Commercial"),
    _m("Variable Fulfilment", "SUM ( Sales[AllocatedVariableFulfilmentVND] )", "#,0", "04 Commercial"),
    _m("Contribution Profit", "[Net Revenue] - [COGS] - [Channel Fees] - [Trade Spend] - [Variable Fulfilment]", "#,0", "04 Commercial"),
    _m("Contribution Margin %", "DIVIDE ( [Contribution Profit], [Net Revenue] )", "0.0%", "04 Commercial"),
    _m("ASP", "DIVIDE ( [Net Revenue], [Units Corrected] )", "#,0", "01 Financial"),
    _m("Budget Revenue", "SUM ( Fact_Budget[BudgetRevenueVND] )", "#,0", "02 Comparison"),
    _m("Latest Estimate Revenue", 'CALCULATE ( SUM ( Fact_Forecast[ForecastRevenueVND] ), Fact_Forecast[ScenarioKey] = "BASE" )', "#,0", "02 Comparison"),
    _m("Prior Year Revenue", "CALCULATE ( [Net Revenue], DATEADD ( Dim_Date[Date], -1, YEAR ) )", "#,0", "02 Comparison"),
    _m("Revenue vs Budget", "[Net Revenue] - [Budget Revenue]", "#,0;(#,0)", "02 Comparison"),
    _m("Revenue vs Budget %", "DIVIDE ( [Revenue vs Budget], [Budget Revenue] )", "0.0%;(0.0%)", "02 Comparison"),
    _m("Revenue vs LE", "[Net Revenue] - [Latest Estimate Revenue]", "#,0;(#,0)", "02 Comparison"),
    _m("Revenue vs LE %", "DIVIDE ( [Revenue vs LE], [Latest Estimate Revenue] )", "0.0%;(0.0%)", "02 Comparison"),
    _m("Revenue Growth %", "DIVIDE ( [Net Revenue] - [Prior Year Revenue], [Prior Year Revenue] )", "0.0%", "02 Comparison"),
    _m("Gross-to-Net %", "DIVIDE ( [Gross Sales] - [Net Revenue], [Gross Sales] )", "0.0%", "03 Revenue Bridge"),
    _m("Price Effect", 'CALCULATE ( SUM ( Fact_PVM_Bridge[AmountVND] ), Fact_PVM_Bridge[Component] = "PRICE" )', "#,0", "03 Revenue Bridge"),
    _m("Volume Effect", 'CALCULATE ( SUM ( Fact_PVM_Bridge[AmountVND] ), Fact_PVM_Bridge[Component] = "VOLUME" )', "#,0", "03 Revenue Bridge"),
    _m("Mix Effect", 'CALCULATE ( SUM ( Fact_PVM_Bridge[AmountVND] ), Fact_PVM_Bridge[Component] = "MIX_RESIDUAL" )', "#,0", "03 Revenue Bridge"),
    _m("PVM Residual", "SUMX ( SUMMARIZE ( Fact_PVM_Bridge, Fact_PVM_Bridge[MonthStart], Fact_PVM_Bridge[SKUKey], Fact_PVM_Bridge[ChannelKey], \"CurrentValue\", MAX ( Fact_PVM_Bridge[CurrentRevenueVND] ), \"BaseValue\", MAX ( Fact_PVM_Bridge[BaseRevenueVND] ), \"BridgeValue\", SUM ( Fact_PVM_Bridge[AmountVND] ) ), [CurrentValue] - [BaseValue] - [BridgeValue] )", "#,0", "03 Revenue Bridge"),
    _m("AR Closing", "SUM ( Fact_AR[ClosingARVND] )", "#,0", "05 Working Capital"),
    _m("Inventory Closing", "SUM ( Fact_Inventory[ClosingInventoryVND] )", "#,0", "05 Working Capital"),
    _m("AP Closing", "SUM ( Fact_AP[ClosingAPVND] )", "#,0", "05 Working Capital"),
    _m("Net Credit Sales", "SUM ( Fact_AR[InvoicedCreditSalesVND] )", "#,0", "05 Working Capital"),
    _m("COGS Flow", "SUM ( Fact_Inventory[COGSFlowVND] )", "#,0", "05 Working Capital"),
    _m("Purchases", "SUM ( Fact_AP[PurchasesVND] )", "#,0", "05 Working Capital"),
    _m("Days In Selected Period", "SUM ( Dim_Date[DaysInMonth] )", "0.0", "05 Working Capital"),
    _m("DSO", "DIVIDE ( [AR Closing], [Net Credit Sales] ) * [Days In Selected Period]", "0.0", "05 Working Capital"),
    _m("DIO", "DIVIDE ( [Inventory Closing], [COGS Flow] ) * [Days In Selected Period]", "0.0", "05 Working Capital"),
    _m("DPO", "DIVIDE ( [AP Closing], [Purchases] ) * [Days In Selected Period]", "0.0", "05 Working Capital"),
    _m("CCC", "[DSO] + [DIO] - [DPO]", "0.0", "05 Working Capital"),
    _m("Average AR LTM", "AVERAGEX ( VALUES ( Dim_Date[MonthStart] ), CALCULATE ( [AR Closing] ) )", "#,0", "05 Working Capital"),
    _m("Average Inventory LTM", "AVERAGEX ( VALUES ( Dim_Date[MonthStart] ), CALCULATE ( [Inventory Closing] ) )", "#,0", "05 Working Capital"),
    _m("Average AP LTM", "AVERAGEX ( VALUES ( Dim_Date[MonthStart] ), CALCULATE ( [AP Closing] ) )", "#,0", "05 Working Capital"),
    _m("DSO LTM", "DIVIDE ( [Average AR LTM], CALCULATE ( [Net Credit Sales], DATESINPERIOD ( Dim_Date[Date], MAX ( Dim_Date[Date] ), -12, MONTH ) ) ) * 365", "0.0", "05 Working Capital"),
    _m("Cash Release Opportunity", "MAX ( 0, [CCC] - 45 ) * DIVIDE ( [Net Revenue], [Days In Selected Period] )", "#,0", "05 Working Capital"),
    _m("Contribution After WC", "[Contribution Profit] - DIVIDE ( [AR Closing] * 0.08, 365 )", "#,0", "05 Working Capital"),
    _m("Debt Balance", "SUM ( Fact_Debt_Liquidity[ClosingBalanceVND] )", "#,0", "05 Working Capital"),
    _m("Liquidity Headroom", "SUM ( Fact_Debt_Liquidity[CovenantHeadroomVND] )", "#,0", "05 Working Capital"),
    _m("Selected Scenario", 'SELECTEDVALUE ( Dim_Scenario[Scenario], "Actual" )', "@", "06 Forecast"),
    _m("Scenario Revenue", 'VAR s = [Selected Scenario] RETURN SWITCH ( s, "Actual", [Net Revenue], "Budget", [Budget Revenue], "Latest Estimate", [Latest Estimate Revenue], CALCULATE ( SUM ( Fact_Forecast[ForecastRevenueVND] ), Fact_Forecast[ScenarioKey] = SWITCH ( s, "Base", "BASE", "Upside", "UPSIDE", "Downside", "DOWNSIDE", "BASE" ) ) )', "#,0", "06 Forecast"),
    _m("Scenario COGS", 'VAR s = [Selected Scenario] RETURN SWITCH ( s, "Actual", [COGS], "Budget", SUM ( Fact_Budget[BudgetCOGSVND] ), CALCULATE ( SUM ( Fact_Forecast[ForecastCOGSVND] ), Fact_Forecast[ScenarioKey] = SWITCH ( s, "Base", "BASE", "Upside", "UPSIDE", "Downside", "DOWNSIDE", "BASE" ) ) )', "#,0", "06 Forecast"),
    _m("OPEX Actual", "SUM ( Fact_OPEX_Headcount[OPEXActualVND] )", "#,0", "08 OPEX & CAPEX"),
    _m("OPEX Budget", "SUM ( Fact_OPEX_Headcount[OPEXBudgetVND] )", "#,0", "08 OPEX & CAPEX"),
    _m("OPEX Forecast", "SUM ( Fact_OPEX_Headcount[OPEXForecastVND] )", "#,0", "08 OPEX & CAPEX"),
    _m("OPEX vs Budget", "[OPEX Actual] - [OPEX Budget]", "#,0;(#,0)", "08 OPEX & CAPEX"),
    _m("Operating Profit", "[Contribution Profit] - [OPEX Actual]", "#,0", "01 Financial"),
    _m("Scenario Operating Profit", "[Scenario Revenue] - [Scenario COGS] - [OPEX Actual]", "#,0", "06 Forecast"),
    _m("Scenario CM %", "DIVIDE ( [Scenario Revenue] - [Scenario COGS] - [Trade Spend], [Scenario Revenue] )", "0.0%", "06 Forecast"),
    _m("Scenario CCC", 'VAR s = [Selected Scenario] VAR delta = COALESCE ( CALCULATE ( MAX ( Fact_Forecast[WorkingCapitalDaysDelta] ), Fact_Forecast[ScenarioKey] = SWITCH ( s, "Base", "BASE", "Upside", "UPSIDE", "Downside", "DOWNSIDE", "BASE" ) ), 0 ) RETURN [CCC] + delta', "0.0", "06 Forecast"),
    _m("Scenario Liquidity Headroom", "[Liquidity Headroom] - MAX ( 0, [Scenario CCC] - 45 ) * DIVIDE ( [Scenario Revenue], 365 )", "#,0", "06 Forecast"),
    _m("Forecast Bias Eligible", 'VAR f = CALCULATE ( SUM ( Fact_Forecast[ForecastRevenueVND] ), Fact_Forecast[ScenarioKey] = "BASE", Fact_Forecast[Eligibility] = "true" ) RETURN DIVIDE ( f - [Net Revenue], [Net Revenue] )', "0.0%", "06 Forecast"),
    _m("WAPE Eligible", 'VAR f = CALCULATE ( SUM ( Fact_Forecast[ForecastRevenueVND] ), Fact_Forecast[ScenarioKey] = "BASE", Fact_Forecast[Eligibility] = "true" ) RETURN DIVIDE ( ABS ( f - [Net Revenue] ), ABS ( [Net Revenue] ) )', "0.0%", "06 Forecast"),
    _m("Promotion Spend", "SUM ( Fact_Promotion[PromotionSpendVND] )", "#,0", "07 Pricing & Promotion"),
    _m("Incremental Contribution", "SUM ( Fact_Promotion[IncrementalContributionVND] )", "#,0", "07 Pricing & Promotion"),
    _m("Promotion ROI", "DIVIDE ( [Incremental Contribution], [Promotion Spend] )", "0.00x", "07 Pricing & Promotion"),
    _m("Budget Reallocated", "SUM ( Fact_Budget_Allocation[BudgetDeltaVND] )", "#,0", "07 Pricing & Promotion"),
    _m("Expected CM Uplift", "DIVIDE ( SUM ( Fact_Budget_Allocation[IncrementalContributionVND] ), SUM ( Fact_Budget_Allocation[CurrentBudgetVND] ) )", "0.0%", "07 Pricing & Promotion"),
    _m("Pricing Contribution Delta", "SUM ( Fact_Pricing_Case[ContributionDeltaVND] )", "#,0", "07 Pricing & Promotion"),
    _m("Average Headcount", "SUM ( Fact_OPEX_Headcount[AverageHeadcount] )", "#,0.0", "08 OPEX & CAPEX"),
    _m("CAPEX Actual", "SUM ( Fact_CAPEX[ActualCAPEXVND] )", "#,0", "08 OPEX & CAPEX"),
    _m("CAPEX Committed", "SUM ( Fact_CAPEX[CommittedCAPEXVND] )", "#,0", "08 OPEX & CAPEX"),
    _m("CAPEX Payback", "AVERAGE ( Fact_CAPEX[PaybackMonths] )", "0.0", "08 OPEX & CAPEX"),
    _m("Public Revenue", "SUM ( Fact_Public_Financials[NetRevenueVNDBn] )", "0.0", "09 Public Company"),
    _m("Public PAT Margin", "DIVIDE ( SUM ( Fact_Public_Financials[PATVNDBn] ), SUM ( Fact_Public_Financials[NetRevenueVNDBn] ) )", "0.0%", "09 Public Company"),
    _m("Public CFO Conversion", "DIVIDE ( SUM ( Fact_Public_Cashflow[OperatingCashFlowVNDBn] ), SUM ( Fact_Public_Cashflow[PATVNDBn] ) )", "0.00x", "09 Public Company"),
    _m("Base EV", 'CALCULATE ( AVERAGE ( Fact_Valuation[EnterpriseValueVNDBn] ), Fact_Valuation[Scenario] = "Base", Fact_Valuation[WACC] = 0.12, Fact_Valuation[TerminalGrowth] = 0.03 )', "0.0", "10 Strategic Finance"),
    _m("Upside EV", 'CALCULATE ( AVERAGE ( Fact_Valuation[EnterpriseValueVNDBn] ), Fact_Valuation[Scenario] = "Base", Fact_Valuation[WACC] = 0.11, Fact_Valuation[TerminalGrowth] = 0.03 )', "0.0", "10 Strategic Finance"),
    _m("Downside EV", 'CALCULATE ( AVERAGE ( Fact_Valuation[EnterpriseValueVNDBn] ), Fact_Valuation[Scenario] = "Base", Fact_Valuation[WACC] = 0.14, Fact_Valuation[TerminalGrowth] = 0.02 )', "0.0", "10 Strategic Finance"),
    _m("WACC", "AVERAGE ( Fact_Valuation[WACC] )", "0.0%", "10 Strategic Finance"),
    _m("Terminal Growth", "AVERAGE ( Fact_Valuation[TerminalGrowth] )", "0.0%", "10 Strategic Finance"),
    _m("Data Version", '"final_v1.0.0"', "@", "11 QA & Metadata"),
    _m("Source File Count", "COUNTROWS ( Source_Control )", "#,0", "11 QA & Metadata"),
    _m("Evidence Coverage %", "DIVIDE ( COUNTROWS ( FILTER ( Sales, Sales[EvidenceClass] <> BLANK () ) ), COUNTROWS ( Sales ) )", "0.0%", "11 QA & Metadata"),
    _m("QA Pass Rate", 'DIVIDE ( COUNTROWS ( FILTER ( Source_Control, Source_Control[Status] = "PASS" ) ), COUNTROWS ( Source_Control ) )', "0.0%", "11 QA & Metadata"),
    _m("Revenue Tie", "[Net Revenue] - SUM ( Sales[NetRevenueVND] )", "#,0", "11 QA & Metadata"),
    _m("COGS Tie", "[COGS] - SUM ( Sales[CorrectedCOGSVND] )", "#,0", "11 QA & Metadata"),
]


def _entity_ref(alias: str) -> dict:
    return {"SourceRef": {"Source": alias}}


def _visual(name: str, visual_type: str, pos: dict, fields: list[tuple[str, str, str]], projections: dict, order_by=None) -> dict:
    aliases: dict[str, str] = {}
    selects = []
    for kind, table, field in fields:
        alias = aliases.setdefault(table, f"t{len(aliases)}")
        if kind == "measure":
            selects.append({"Measure": {"Expression": _entity_ref(alias), "Property": field}, "Name": f"{table}.{field}", "NativeReferenceName": field})
        else:
            selects.append({"Column": {"Expression": _entity_ref(alias), "Property": field}, "Name": f"{table}.{field}", "NativeReferenceName": field})
    query = {"Version": 2, "From": [{"Name": alias, "Entity": table, "Type": 0} for table, alias in aliases.items()], "Select": selects}
    if order_by:
        table, field, direction = order_by
        query["OrderBy"] = [{"Direction": direction, "Expression": {"Measure": {"Expression": _entity_ref(aliases[table]), "Property": field}}}]
    return {"name": name, "layouts": [{"id": 0, "position": pos}], "singleVisual": {"visualType": visual_type, "projections": projections, "prototypeQuery": query, "drillFilterOtherVisuals": True}}


def card(name: str, metric: str, x: int, y: int, width: int = 250, height: int = 90) -> dict:
    return _visual(name, "card", {"x": x, "y": y, "z": 20, "width": width, "height": height}, [("measure", "Sales", metric)], {"Values": [{"queryRef": f"Sales.{metric}"}]})


def slicer(name: str, table: str, field: str, x: int, y: int, width: int = 250) -> dict:
    return _visual(name, "slicer", {"x": x, "y": y, "z": 30, "width": width, "height": 48}, [("column", table, field)], {"Values": [{"queryRef": f"{table}.{field}"}]})


def chart(name: str, visual_type: str, category: tuple[str, str], metrics: list[str], x: int, y: int, width: int, height: int) -> dict:
    fields = [("column", category[0], category[1])] + [("measure", "Sales", metric) for metric in metrics]
    refs = [{"queryRef": f"{category[0]}.{category[1]}"}] + [{"queryRef": f"Sales.{metric}"} for metric in metrics]
    return _visual(name, visual_type, {"x": x, "y": y, "z": 10, "width": width, "height": height}, fields, {"Category": [refs[0]], "Y": refs[1:]}, order_by=("Sales", metrics[0], 2) if metrics else None)


def table(name: str, columns: list[tuple[str, str]], metrics: list[str], x: int, y: int, width: int, height: int, visual_type: str = "tableEx") -> dict:
    fields = [("column", t, c) for t, c in columns] + [("measure", "Sales", metric) for metric in metrics]
    refs = [{"queryRef": f"{t}.{c}"} for t, c in columns] + [{"queryRef": f"Sales.{metric}"} for metric in metrics]
    return _visual(name, visual_type, {"x": x, "y": y, "z": 5, "width": width, "height": height}, fields, {"Values": refs})


def message(name: str, metric: str, x: int = 40, y: int = 82, width: int = 1590) -> dict:
    return card(name, metric, x, y, width, 48)


def _filters(prefix: str) -> list[dict]:
    return [slicer(f"{prefix}_F_Period", "Dim_Date", "YearMonth", 40, 20, 250), slicer(f"{prefix}_F_Scenario", "Dim_Scenario", "Scenario", 305, 20, 250), slicer(f"{prefix}_F_Channel", "Dim_Channel", "Channel", 570, 20, 250), slicer(f"{prefix}_F_Region", "Dim_Customer", "Region", 835, 20, 250)]


def _page(name: str, ordinal: int, visuals: list[dict], hidden: bool = False) -> dict:
    return {"name": f"ReportSection{ordinal + 1:02d}", "displayName": name, "displayOption": 2 if hidden else 1, "width": 1672, "height": 941, "ordinal": ordinal, "config": "{}", "filters": "[]", "visuals": visuals}


def build_pages() -> list[dict]:
    pages: list[dict] = []
    # 00 Executive Decision Cockpit
    v = _filters("00") + [message("00_MSG_Management", "Management Message"), card("00_KPI_NetRevenue", "Net Revenue", 40, 145), card("00_KPI_VarBudget", "Revenue vs Budget %", 305, 145), card("00_KPI_CM", "Contribution Margin %", 570, 145), card("00_KPI_OperatingProfit", "Operating Profit", 835, 145), card("00_KPI_CCC", "CCC", 1100, 145), card("00_KPI_CashRelease", "Cash Release Opportunity", 1365, 145, 267), chart("00_CH_ActualBudgetLE", "lineChart", ("Dim_Date", "YearMonth"), ["Net Revenue", "Budget Revenue", "Latest Estimate Revenue"], 40, 255, 780, 330), chart("00_CH_ChannelGap", "waterfallChart", ("Dim_Channel", "Channel"), ["Revenue vs Budget"], 840, 255, 792, 330), table("00_TBL_Actions", [("Fact_Budget_Allocation", "ChannelKey"), ("Fact_Budget_Allocation", "Decision")], ["Incremental Contribution"], 40, 610, 780, 270), table("00_TBL_WC", [("Dim_Date", "YearMonth")], ["DSO", "DIO", "DPO", "CCC", "Cash Release Opportunity"], 840, 610, 792, 270)]
    pages.append(_page("00 Executive Decision Cockpit", 0, v))
    # 01 P&L & Variance
    v = _filters("01") + [message("01_MSG_Management", "Management Message"), card("01_KPI_GrossSales", "Gross Sales", 40, 145), card("01_KPI_NetRevenue", "Net Revenue", 305, 145), card("01_KPI_GrossProfit", "Gross Profit", 570, 145), card("01_KPI_GM", "Gross Margin %", 835, 145), card("01_KPI_Contribution", "Contribution Profit", 1100, 145), card("01_KPI_OperatingProfit", "Operating Profit", 1365, 145, 267), table("01_MTX_PnL", [("Dim_Date", "YearMonth")], ["Gross Sales", "Discounts", "Returns", "Net Revenue", "COGS", "Gross Profit", "Gross Margin %", "Contribution Profit", "Contribution Margin %", "OPEX Actual", "Operating Profit"], 40, 255, 760, 625, "pivotTable"), chart("01_CH_ProfitVariance", "waterfallChart", ("Dim_Channel", "Channel"), ["Revenue vs Budget"], 825, 255, 807, 290), chart("01_CH_MonthlyTrend", "lineChart", ("Dim_Date", "YearMonth"), ["Net Revenue", "Gross Profit", "Operating Profit"], 825, 565, 807, 315)]
    pages.append(_page("01 P&L & Variance", 1, v))
    # 02 Revenue / Gross-to-Net / PVM
    v = _filters("02") + [message("02_MSG_Management", "Management Message"), card("02_KPI_GrossSales", "Gross Sales", 40, 145), card("02_KPI_NetRevenue", "Net Revenue", 305, 145), card("02_KPI_GTN", "Gross-to-Net %", 570, 145), card("02_KPI_Price", "Price Effect", 835, 145), card("02_KPI_Volume", "Volume Effect", 1100, 145), card("02_KPI_PVMResidual", "PVM Residual", 1365, 145, 267), chart("02_CH_GTN", "waterfallChart", ("Dim_Date", "YearMonth"), ["Gross Sales", "Net Revenue"], 40, 255, 515, 300), chart("02_CH_PVM", "waterfallChart", ("Fact_PVM_Bridge", "Component"), ["Price Effect", "Volume Effect", "Mix Effect"], 580, 255, 515, 300), table("02_TBL_Bridge", [("Dim_Date", "YearMonth"), ("Fact_PVM_Bridge", "Component")], ["Price Effect", "Volume Effect", "Mix Effect", "PVM Residual"], 1120, 255, 512, 300), chart("02_CH_PriceUnits", "lineClusteredColumnComboChart", ("Dim_Date", "YearMonth"), ["ASP", "Units Corrected", "Net Revenue"], 40, 575, 780, 305), table("02_TBL_ChannelSKU", [("Dim_Channel", "Channel"), ("Dim_Product", "SKU")], ["Net Revenue", "Contribution Profit", "Contribution Margin %"], 840, 575, 792, 305)]
    pages.append(_page("02 Revenue, Gross-to-Net & PVM", 2, v))
    # 03 Commercial Profitability
    v = _filters("03") + [message("03_MSG_Management", "Management Message"), card("03_KPI_NetRevenue", "Net Revenue", 40, 145), card("03_KPI_Contribution", "Contribution Profit", 305, 145), card("03_KPI_CM", "Contribution Margin %", 570, 145), card("03_KPI_AfterWC", "Contribution After WC", 835, 145), card("03_KPI_Top5", "Revenue Growth %", 1100, 145), card("03_KPI_DSO", "DSO", 1365, 145, 267), chart("03_CH_Portfolio", "scatterChart", ("Dim_Channel", "Channel"), ["Contribution Margin %", "Net Revenue"], 40, 255, 650, 300), chart("03_CH_AfterWC", "clusteredBarChart", ("Dim_Customer", "CustomerName"), ["Contribution Profit", "Contribution After WC"], 710, 255, 922, 300), table("03_TBL_Economics", [("Dim_Customer", "CustomerName"), ("Dim_Customer", "Segment"), ("Dim_Customer", "StrategicFlag")], ["Net Revenue", "Contribution Profit", "Contribution Margin %", "DSO"], 40, 575, 1592, 305)]
    pages.append(_page("03 Commercial Profitability", 3, v))
    # 04 Pricing / Promotion / Resource Allocation
    v = _filters("04") + [message("04_MSG_Management", "Management Message"), card("04_KPI_PromoSpend", "Promotion Spend", 40, 145), card("04_KPI_IncCM", "Incremental Contribution", 305, 145), card("04_KPI_ROI", "Promotion ROI", 570, 145), card("04_KPI_AboveHurdle", "Expected CM Uplift", 835, 145), card("04_KPI_Reallocated", "Budget Reallocated", 1100, 145), card("04_KPI_BudgetControl", "QA Pass Rate", 1365, 145, 267), chart("04_CH_PromoROI", "clusteredBarChart", ("Fact_Promotion", "Promotion"), ["Promotion ROI", "Incremental Contribution"], 40, 255, 510, 300), table("04_TBL_Pricing", [("Fact_Pricing_Case", "PricingCase"), ("Fact_Pricing_Case", "ChannelKey")], ["Pricing Contribution Delta"], 570, 255, 510, 300), table("04_TBL_Allocation", [("Dim_Channel", "Channel")], ["Budget Reallocated", "Expected CM Uplift"], 1100, 255, 532, 300), chart("04_CH_Capacity", "scatterChart", ("Dim_Channel", "Channel"), ["Promotion ROI", "Expected CM Uplift"], 40, 575, 760, 305), table("04_TBL_DecisionQueue", [("Fact_Budget_Allocation", "ChannelKey"), ("Fact_Budget_Allocation", "Decision"), ("Fact_Budget_Allocation", "EvidenceClass")], ["Incremental Contribution"], 825, 575, 807, 305)]
    pages.append(_page("04 Pricing, Promotion & Resource Allocation", 4, v))
    # 05 Forecast & Scenario
    v = _filters("05") + [message("05_MSG_Governance", "Forecast Governance Banner"), card("05_KPI_ScenarioRevenue", "Scenario Revenue", 40, 145), card("05_KPI_ScenarioOP", "Scenario Operating Profit", 305, 145), card("05_KPI_ScenarioCM", "Scenario CM %", 570, 145), card("05_KPI_ScenarioCCC", "Scenario CCC", 835, 145), card("05_KPI_Liquidity", "Scenario Liquidity Headroom", 1100, 145), card("05_KPI_WAPE", "WAPE Eligible", 1365, 145, 267), chart("05_CH_Outlook", "lineChart", ("Dim_Date", "YearMonth"), ["Net Revenue", "Budget Revenue", "Latest Estimate Revenue", "Scenario Revenue"], 40, 255, 780, 300), chart("05_CH_Scenario", "clusteredColumnChart", ("Dim_Scenario", "Scenario"), ["Scenario Revenue", "Scenario Operating Profit"], 840, 255, 792, 300), table("05_TBL_Drivers", [("Fact_Forecast", "ScenarioKey"), ("Fact_Forecast", "ForecastVersionKey")], ["Scenario Revenue", "Scenario CM %", "Scenario CCC"], 40, 575, 780, 305), table("05_TBL_Decision", [("Dim_Scenario", "Scenario"), ("Dim_Scenario", "ScenarioGroup"), ("Dim_Scenario", "EvidenceClass")], ["Scenario Revenue", "Scenario Operating Profit", "Scenario CCC"], 840, 575, 792, 305)]
    pages.append(_page("05 Forecast & Scenario", 5, v))
    # 06 Working Capital & Liquidity
    v = _filters("06") + [message("06_MSG_Management", "Management Message"), card("06_KPI_DSO", "DSO", 40, 145), card("06_KPI_DIO", "DIO", 305, 145), card("06_KPI_DPO", "DPO", 570, 145), card("06_KPI_CCC", "CCC", 835, 145), card("06_KPI_Headroom", "Liquidity Headroom", 1100, 145), card("06_KPI_CashRelease", "Cash Release Opportunity", 1365, 145, 267), chart("06_CH_Days", "lineChart", ("Dim_Date", "YearMonth"), ["DSO", "DIO", "DPO", "CCC"], 40, 255, 760, 300), chart("06_CH_CCCBridge", "waterfallChart", ("Fact_Forecast", "ScenarioKey"), ["DSO", "DIO", "DPO", "CCC"], 840, 255, 792, 300), table("06_TBL_AR", [("Dim_Customer", "CustomerName"), ("Fact_AR", "MonthStart")], ["AR Closing", "DSO"], 40, 575, 510, 305), table("06_TBL_Inventory", [("Dim_Product", "SKU"), ("Fact_Inventory", "MonthStart")], ["Inventory Closing", "DIO"], 570, 575, 510, 305), table("06_TBL_Actions", [("Dim_Evidence_Class", "EvidenceClass")], ["Cash Release Opportunity"], 1100, 575, 532, 305)]
    pages.append(_page("06 Working Capital & Liquidity", 6, v))
    # 07 OPEX / Headcount / CAPEX
    v = _filters("07") + [message("07_MSG_Management", "Management Message"), card("07_KPI_OPEX", "OPEX Actual", 40, 145), card("07_KPI_OPEXVar", "OPEX vs Budget", 305, 145), card("07_KPI_OPEXForecast", "OPEX Forecast", 570, 145), card("07_KPI_HC", "Average Headcount", 835, 145), card("07_KPI_CAPEX", "CAPEX Actual", 1100, 145), card("07_KPI_Payback", "CAPEX Payback", 1365, 145, 267), chart("07_CH_OPEX", "lineChart", ("Dim_Date", "YearMonth"), ["OPEX Actual", "OPEX Budget", "OPEX Forecast"], 40, 255, 760, 300), chart("07_CH_CostCenter", "clusteredBarChart", ("Dim_Cost_Center", "CostCenter"), ["OPEX Actual", "OPEX vs Budget"], 840, 255, 792, 300), table("07_TBL_HC", [("Dim_Cost_Center", "CostCenter"), ("Fact_OPEX_Headcount", "Period")], ["Average Headcount", "OPEX Actual", "OPEX vs Budget"], 40, 575, 760, 305), table("07_TBL_CAPEX", [("Dim_CAPEX_Project", "Project"), ("Fact_CAPEX", "Stage"), ("Fact_CAPEX", "Decision")], ["CAPEX Actual", "CAPEX Committed", "CAPEX Payback"], 840, 575, 792, 305)]
    pages.append(_page("07 OPEX, Headcount & CAPEX", 7, v))
    # 08 MCH & peers
    v = [message("08_MSG_Banner", "Public Evidence Banner")] + [slicer("08_F_Entity", "Dim_Company", "Company", 40, 20, 250), slicer("08_F_Period", "Fact_Public_Financials", "FiscalYear", 305, 20, 250), slicer("08_F_Compare", "Fact_Public_Financials", "RevenueBasis", 570, 20, 250), slicer("08_F_Peer", "Fact_Public_Financials", "Ticker", 835, 20, 250)] + [card("08_KPI_PublicRevenue", "Public Revenue", 40, 145), card("08_KPI_PATMargin", "Public PAT Margin", 305, 145), card("08_KPI_CFOConversion", "Public CFO Conversion", 570, 145), card("08_KPI_ApprovedRows", "Source File Count", 835, 145), card("08_KPI_Evidence", "Evidence Coverage %", 1100, 145), card("08_KPI_QA", "QA Pass Rate", 1365, 145, 267), chart("08_CH_MCHTrend", "lineChart", ("Fact_Public_Financials", "FiscalYear"), ["Public Revenue", "Public PAT Margin"], 40, 255, 780, 300), chart("08_CH_Peers", "clusteredBarChart", ("Fact_Public_Financials", "Ticker"), ["Public PAT Margin", "Public CFO Conversion"], 840, 255, 792, 300), table("08_TBL_Public", [("Fact_Public_Financials", "Company"), ("Fact_Public_Financials", "Ticker"), ("Fact_Public_Financials", "FiscalYear"), ("Fact_Public_Financials", "SourceStatus")], ["Public Revenue", "Public PAT Margin", "Public CFO Conversion"], 40, 575, 1592, 305)]
    pages.append(_page("08 MCH & Peer Financial Quality", 8, v))
    # 09 Valuation & strategic finance
    v = [message("09_MSG_Banner", "Strategic Evidence Banner")] + [slicer("09_F_Scenario", "Fact_Valuation", "Scenario", 40, 20, 250), slicer("09_F_WACC", "Fact_Valuation", "WACC", 305, 20, 250), slicer("09_F_Growth", "Fact_Valuation", "TerminalGrowth", 570, 20, 250), slicer("09_F_Deal", "Fact_MNA", "DealKey", 835, 20, 250)] + [card("09_KPI_DownsideEV", "Downside EV", 40, 145), card("09_KPI_BaseEV", "Base EV", 305, 145), card("09_KPI_UpsideEV", "Upside EV", 570, 145), card("09_KPI_WACC", "WACC", 835, 145), card("09_KPI_TerminalGrowth", "Terminal Growth", 1100, 145), card("09_KPI_Payback", "CAPEX Payback", 1365, 145, 267), chart("09_CH_Sensitivity", "lineChart", ("Fact_Valuation", "TerminalGrowth"), ["Base EV", "Upside EV", "Downside EV"], 40, 255, 760, 300), chart("09_CH_EVBridge", "waterfallChart", ("Fact_Valuation", "Scenario"), ["Base EV", "Upside EV", "Downside EV"], 840, 255, 792, 300), table("09_TBL_MNA", [("Fact_MNA", "Year"), ("Fact_MNA", "DealKey")], ["Scenario Operating Profit", "CAPEX Payback"], 40, 575, 760, 305), table("09_TBL_Watchouts", [("Dim_Evidence_Class", "EvidenceClass"), ("Fact_Valuation", "OutputBoundary")], ["Base EV"], 840, 575, 792, 305)]
    pages.append(_page("09 Valuation & Strategic Finance", 9, v))
    # 10 Controls / Evidence / Release
    v = [message("10_MSG_Banner", "Public Evidence Banner")] + [card("10_KPI_DataVersion", "Data Version", 40, 145), card("10_KPI_SourceCount", "Source File Count", 305, 145), card("10_KPI_EvidenceCoverage", "Evidence Coverage %", 570, 145), card("10_KPI_QAPassRate", "QA Pass Rate", 835, 145), card("10_KPI_RevenueTie", "Revenue Tie", 1100, 145), card("10_KPI_PVMResidual", "PVM Residual", 1365, 145, 267), table("10_TBL_Controls", [("Source_Control", "ControlID"), ("Source_Control", "ControlName"), ("Source_Control", "Status"), ("Source_Control", "EvidenceClass")], [], 40, 255, 760, 300), table("10_TBL_Evidence", [("Dim_Evidence_Class", "EvidenceClass"), ("Dim_Evidence_Class", "Definition"), ("Dim_Evidence_Class", "AllowedHeadline")], [], 840, 255, 792, 300), table("10_TBL_Release", [("Dim_Forecast_Version", "ForecastVersionKey"), ("Dim_Forecast_Version", "Status"), ("Dim_Forecast_Version", "Eligibility")], [], 40, 575, 760, 305), table("10_TBL_SourceTrace", [("Dim_Company", "Company"), ("Dim_Company", "EvidenceClass"), ("Dim_Company", "SourceURL")], [], 840, 575, 792, 305)]
    pages.append(_page("10 Controls, Evidence & Release", 10, v))

    # Hidden drillthrough pages (D01–D04) and tooltip pages (TT_*).
    pages.append(_page("D01 Customer Detail", 11, _filters("D01") + [message("D01_MSG", "Management Message"), chart("D01_CH_Trend", "lineChart", ("Dim_Date", "YearMonth"), ["Net Revenue", "Contribution Profit"], 40, 145, 780, 300), table("D01_TBL", [("Dim_Customer", "CustomerName"), ("Dim_Customer", "StrategicFlag")], ["Net Revenue", "Contribution Profit", "Contribution Margin %", "DSO"], 840, 145, 792, 300)], True))
    pages.append(_page("D02 Product Detail", 12, _filters("D02") + [message("D02_MSG", "Management Message"), chart("D02_CH_Trend", "lineChart", ("Dim_Date", "YearMonth"), ["Net Revenue", "Contribution Profit"], 40, 145, 780, 300), table("D02_TBL", [("Dim_Product", "SKU"), ("Dim_Product", "Product"), ("Dim_Product", "Lifecycle")], ["Net Revenue", "Contribution Profit", "ASP", "Inventory Closing"], 840, 145, 792, 300)], True))
    pages.append(_page("D03 Channel Detail", 13, _filters("D03") + [message("D03_MSG", "Management Message"), chart("D03_CH_Trend", "lineChart", ("Dim_Date", "YearMonth"), ["Net Revenue", "COGS", "Contribution Profit"], 40, 145, 780, 300), table("D03_TBL", [("Dim_Channel", "Channel"), ("Dim_Channel", "ChannelGroup")], ["Net Revenue", "COGS", "Channel Fees", "Trade Spend", "Contribution Profit", "DSO"], 840, 145, 792, 300)], True))
    pages.append(_page("D04 KPI Source Trace", 14, [message("D04_MSG", "Public Evidence Banner"), table("D04_TBL", [("Dim_Evidence_Class", "EvidenceClass"), ("Dim_Company", "Company"), ("Source_Control", "ControlName"), ("Source_Control", "Status")], ["Evidence Coverage %", "QA Pass Rate"], 40, 145, 1592, 300)], True))
    for idx, (name, metric) in enumerate([("TT Financial Metric", "Net Revenue"), ("TT PVM", "PVM Residual"), ("TT Commercial", "Contribution Margin %"), ("TT Evidence", "Evidence Coverage %") ,]):
        pages.append(_page(name, 15 + idx, [card(f"{name}_KPI", metric, 20, 20, 500, 120), table(f"{name}_CTX", [("Dim_Date", "YearMonth"), ("Dim_Evidence_Class", "EvidenceClass")], [metric], 20, 160, 700, 200)], True))
    return pages


RELATIONSHIPS = [
    ("rel-date-sales", "Dim_Date", "DateKey", "Sales", "MonthStart"), ("rel-date-cost", "Dim_Date", "DateKey", "Fact_Commercial_Cost", "MonthStart"), ("rel-date-budget", "Dim_Date", "DateKey", "Fact_Budget", "MonthStart"), ("rel-date-forecast", "Dim_Date", "DateKey", "Fact_Forecast", "TargetMonth"), ("rel-date-pvm", "Dim_Date", "DateKey", "Fact_PVM_Bridge", "MonthStart"), ("rel-date-ar", "Dim_Date", "DateKey", "Fact_AR", "MonthStart"), ("rel-date-inventory", "Dim_Date", "DateKey", "Fact_Inventory", "MonthStart"), ("rel-date-ap", "Dim_Date", "DateKey", "Fact_AP", "MonthStart"), ("rel-date-debt", "Dim_Date", "DateKey", "Fact_Debt_Liquidity", "MonthStart"),
    ("rel-date-opex", "Dim_Date", "YearMonth", "Fact_OPEX_Headcount", "Period"), ("rel-date-capex", "Dim_Date", "YearMonth", "Fact_CAPEX", "Period"),
    ("rel-product-sales", "Dim_Product", "ProductKey", "Sales", "SKUKey"), ("rel-product-budget", "Dim_Product", "ProductKey", "Fact_Budget", "SKUKey"), ("rel-product-forecast", "Dim_Product", "ProductKey", "Fact_Forecast", "SKUKey"), ("rel-product-pvm", "Dim_Product", "ProductKey", "Fact_PVM_Bridge", "SKUKey"), ("rel-product-inventory", "Dim_Product", "ProductKey", "Fact_Inventory", "SKUKey"),
    ("rel-customer-sales", "Dim_Customer", "CustomerKey", "Sales", "CustomerKey"), ("rel-customer-ar", "Dim_Customer", "CustomerKey", "Fact_AR", "CustomerKey"),
    ("rel-channel-sales", "Dim_Channel", "ChannelKey", "Sales", "ChannelKey"), ("rel-channel-cost", "Dim_Channel", "ChannelKey", "Fact_Commercial_Cost", "ChannelKey"), ("rel-channel-budget", "Dim_Channel", "ChannelKey", "Fact_Budget", "ChannelKey"), ("rel-channel-forecast", "Dim_Channel", "ChannelKey", "Fact_Forecast", "ChannelKey"), ("rel-channel-pvm", "Dim_Channel", "ChannelKey", "Fact_PVM_Bridge", "ChannelKey"), ("rel-channel-promo", "Dim_Channel", "ChannelKey", "Fact_Promotion", "ChannelKey"), ("rel-channel-price", "Dim_Channel", "ChannelKey", "Fact_Pricing_Case", "ChannelKey"), ("rel-channel-allocation", "Dim_Channel", "ChannelKey", "Fact_Budget_Allocation", "ChannelKey"),
    ("rel-fv-forecast", "Dim_Forecast_Version", "ForecastVersionKey", "Fact_Forecast", "ForecastVersionKey"), ("rel-cc-opex", "Dim_Cost_Center", "CostCenterKey", "Fact_OPEX_Headcount", "CostCenterKey"), ("rel-cc-capex", "Dim_Cost_Center", "CostCenterKey", "Fact_CAPEX", "CostCenterKey"), ("rel-project-capex", "Dim_CAPEX_Project", "CAPEXProjectKey", "Fact_CAPEX", "ProjectKey"),
    ("rel-company-sales", "Dim_Company", "CompanyKey", "Sales", "CompanyKey"), ("rel-company-public", "Dim_Company", "CompanyKey", "Fact_Public_Financials", "CompanyKey"), ("rel-company-cashflow", "Dim_Company", "CompanyKey", "Fact_Public_Cashflow", "CompanyKey"), ("rel-evidence-sales", "Dim_Evidence_Class", "EvidenceClass", "Sales", "EvidenceClass"),
]


def measure_objs(builder=None) -> list[dict]:
    return [{"name": name, "formatString": fmt, "expression": dax + "\n", "displayFolder": folder} for name, dax, fmt, folder in MEASURES]


def csv_query(file_name: str, columns) -> str:
    return _base_csv_query(file_name, columns)


def calendar_query() -> str:
    return _base_calendar_query()


def write_coordinates(path: Path) -> None:
    rows = []
    for page in build_pages():
        for idx, cfg in enumerate(page["visuals"]):
            pos = cfg["layouts"][0]["position"]
            rows.append({"Page": page["displayName"], "Object": cfg["name"], "X": pos["x"], "Y": pos["y"], "Width": pos["width"], "Height": pos["height"], "ZIndex": pos["z"], "VisualType": cfg["singleVisual"]["visualType"], "Font": "Segoe UI", "Background": "#FFFFFF", "Border": "#D9E2EC", "Notes": "hidden" if page["displayOption"] == 2 else "primary"})
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader(); writer.writerows(rows)


def patch_pbip_measure_folders(pbip_dir: Path) -> None:
    path = pbip_dir / f"{PROJECT}.SemanticModel" / "definition" / "tables" / "Sales.tmdl"
    if not path.exists():
        return
    text = path.read_text(encoding="utf-8")
    folders = {name: folder for name, _, _, folder in MEASURES}
    for name, folder in folders.items():
        pattern = rf"(measure '{re.escape(name)}' = .*?\n\t\tformatString: .*?\n)"
        replacement = rf"\1\t\tdisplayFolder: {folder}\n"
        text = re.sub(pattern, replacement, text, flags=re.S)
    path.write_text(text, encoding="utf-8")


def main() -> None:
    if not DATA_DIR.exists():
        raise SystemExit(f"Missing final_v1 data directory: {DATA_DIR}")
    base.PROJECT = PROJECT; base.DEFAULT_DATA_ROOT = DEFAULT_DATA_ROOT; base.TABLES = TABLES; base.MEASURES = [(n, d, f) for n, d, f, _ in MEASURES]; base.RELATIONSHIPS = RELATIONSHIPS
    base.build_pages = build_pages
    base.csv_query = csv_query; base.calendar_query = calendar_query
    pbip_dir = ROOT / "powerbi" / "final" / PROJECT
    pbixproj_dir = ROOT / "powerbi" / "native" / "VNFinance_PbixProj_FINAL"
    base.write_pbip(pbip_dir, THEME_PATH); patch_pbip_measure_folders(pbip_dir)
    base.write_pbixproj(pbixproj_dir, THEME_PATH)
    write_coordinates(ROOT / "powerbi" / "final" / "VISUAL_COORDINATES.csv")
    print(json.dumps({"status": "PASS", "project": PROJECT, "tables": len(TABLES), "measures": len(MEASURES), "relationships": len(RELATIONSHIPS), "primary_pages": 11, "hidden_pages": len(build_pages()) - 11, "visuals": sum(len(p["visuals"]) for p in build_pages()), "pbip": str(pbip_dir), "pbixproj": str(pbixproj_dir)}, indent=2))


if __name__ == "__main__":
    main()
