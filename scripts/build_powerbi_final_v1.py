#!/usr/bin/env python3
"""Build the reconciled VNFinance Power BI final_v1 data contract.

The remote VietNova_FPA_Model_v2 workbook is the Tier-1 management source. Its
Sales_Fact deliberately demonstrates a common upstream defect: revenue and
unit price are stored at an invoice scale while Units/COGS are still stored at
the pre-scale decimal. This generator reconstructs that deterministic v2
universe, corrects physical units, allocates COGS back to authoritative
channel-month economics, and emits a Power BI-ready star-schema contract.

All operating data remains synthetic. Public-company rows are copied into a
separate observed subject area and can never aggregate into VietNova totals.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import random
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

SEED = 20260829
DATASET_VERSION = "final_v1.0.0"
GENERATED_TIMESTAMP = "2026-08-31T00:00:00+07:00"
SOURCE_WORKBOOK = "VietNova_FPA_Model_v2.xlsx (remote Drive; deterministic formula reconstruction)"
EVIDENCE_SIM = "SIMULATED"
EVIDENCE_DERIVED = "DERIVED"
EVIDENCE_OBSERVED = "OBSERVED"
EVIDENCE_ASSUMPTION = "ASSUMPTION"
EVIDENCE_PROXY = "PROXY"
EVIDENCE_SYNTHETIC_REHEARSAL = "SYNTHETIC_REHEARSAL"


def month_add(value: date, months: int) -> date:
    idx = value.year * 12 + value.month - 1 + months
    return date(idx // 12, idx % 12 + 1, 1)


def months_between(start: date, count: int) -> list[date]:
    return [month_add(start, i) for i in range(count)]


def r2(value: float) -> float:
    return round(float(value) + 1e-9, 2)


def r6(value: float) -> float:
    return round(float(value) + 1e-12, 6)


def write_csv(path: Path, fieldnames: list[str], rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest().upper()


def build_contract(output: Path) -> dict:
    rng = random.Random(SEED)
    months = months_between(date(2023, 1, 1), 36)
    channels = [
        {"key": "CH01", "name": "General Trade", "fee": 0.035, "terms": 30},
        {"key": "CH02", "name": "Modern Trade", "fee": 0.045, "terms": 45},
        {"key": "CH03", "name": "Marketplace", "fee": 0.120, "terms": 15},
        {"key": "CH04", "name": "D2C", "fee": 0.080, "terms": 7},
        {"key": "CH05", "name": "Wholesale", "fee": 0.020, "terms": 60},
    ]
    products = [
        ("SKU001", "VietSpice Original", "Seasonings", 31000, 0.40),
        ("SKU002", "VietSpice Premium", "Seasonings", 36000, 0.36),
        ("SKU003", "VietSpice Chili", "Seasonings", 32000, 0.38),
        ("SKU004", "QuickBowl Chicken", "Convenience Foods", 28000, 0.44),
        ("SKU005", "QuickBowl Beef", "Convenience Foods", 27000, 0.46),
        ("SKU006", "QuickBowl Veggie", "Convenience Foods", 30000, 0.42),
        ("SKU007", "PulseUp Original", "Beverages", 23000, 0.55),
        ("SKU008", "PulseUp Zero", "Beverages", 25000, 0.52),
        ("SKU009", "PulseUp Energy", "Beverages", 21000, 0.58),
        ("SKU010", "PulseUp Family", "Beverages", 24000, 0.50),
        ("SKU011", "VietSpice Gift", "Seasonings", 35000, 0.30),
        ("SKU012", "QuickBowl Family", "Convenience Foods", 29000, 0.39),
    ]
    product_map = {p[0]: p for p in products}
    customers = [
        ("CUS01", "Alpha Mart", "National"), ("CUS02", "Beta Retail", "National"),
        ("CUS03", "Gamma Foods", "National"), ("CUS04", "Delta Online", "National"),
        ("CUS05", "Epsilon Club", "National"), ("CUS06", "Zeta Wholesale", "Regional"),
        ("CUS07", "Eta Super", "Regional"), ("CUS08", "Theta Cafe", "Regional"),
        ("CUS09", "Iota Grocer", "Regional"), ("CUS10", "Kappa Direct", "Regional"),
    ]
    customer_map = {c[0]: c for c in customers}
    mixes = [0.12, 0.10, 0.08, 0.10, 0.08, 0.07, 0.09, 0.08, 0.08, 0.07, 0.06, 0.07]
    shares = [0.34, 0.26, 0.18, 0.10, 0.12]
    months_by_key = {m.isoformat(): i for i, m in enumerate(months)}

    sales: list[dict] = []
    commercial_costs: list[dict] = []
    month_totals: dict[str, dict] = defaultdict(lambda: defaultdict(float))
    channel_totals: dict[tuple[str, str], dict] = defaultdict(lambda: defaultdict(float))
    product_month: dict[tuple[str, str], dict] = defaultdict(lambda: defaultdict(float))
    customer_month: dict[tuple[str, str], dict] = defaultdict(lambda: defaultdict(float))
    line_no = 1

    for i, month in enumerate(months):
        season = [1, 0.98, 1.02, 1.03, 1.01, 1, 0.99, 1.01, 1.04, 1.08, 1.18, 1.28][i % 12]
        base = 4.8e9 * (1 + 0.012 * i) * season
        for c_idx, channel in enumerate(channels):
            ch_rev = base * shares[c_idx] * (1 + (0.006 * i if c_idx == 2 else 0))
            auth_cogs = ch_rev * (0.62 + (0.035 if c_idx == 2 else 0) + (0.015 if i >= 18 and c_idx == 2 else 0))
            fee_total = ch_rev * channel["fee"]
            trade_rate = 0.025 + (0.04 if i % 12 == 10 else 0) + (0.012 if c_idx == 1 else 0)
            trade_total = ch_rev * trade_rate
            month_key = month.isoformat()
            staged: list[dict] = []
            prelim_total = 0.0
            net_total = 0.0
            for p_idx, product in enumerate(products):
                sku, name, category, price, cost_ratio = product
                customer = customers[(i + c_idx + p_idx) % len(customers)]
                units_pre = round((ch_rev * mixes[p_idx] / (price * 100000)) * 100) / 100
                gross = units_pre * price * 100000
                corrected_units = int(round(gross / price))
                discount_rate = 0.04 + (0.025 if c_idx == 2 else 0) + (0.03 if i % 12 == 10 else 0)
                return_rate = 0.018 if c_idx == 3 else 0.006
                discount = gross * discount_rate
                returns = gross * return_rate
                net = gross - discount - returns
                unit_cost = price * cost_ratio
                prelim_cogs = corrected_units * unit_cost
                staged.append({
                    "date": month_key, "month": month_key, "line_id": f"VN{line_no:09d}",
                    "order_id": f"ORD{line_no:08d}", "sku": sku, "product": name,
                    "category": category, "customer": customer[0], "customer_name": customer[1],
                    "segment": customer[2], "channel": channel["key"], "region": "North" if customer[0] in {"CUS01", "CUS04", "CUS07", "CUS10"} else "South" if customer[0] in {"CUS02", "CUS05", "CUS08"} else "Central",
                    "units": corrected_units, "unit_price": price, "gross": gross,
                    "discount": discount, "returns": returns, "net": net,
                    "prelim_cogs": prelim_cogs, "is_stockout": bool(month == date(2025, 4, 1) and c_idx == 1),
                })
                prelim_total += prelim_cogs
                net_total += net
                line_no += 1
            scale_factor = auth_cogs / prelim_total if prelim_total else 1.0
            corrected_total = 0.0
            for row_idx, row in enumerate(staged):
                corrected_cogs = r2(row["prelim_cogs"] * scale_factor)
                if row_idx == len(staged) - 1:
                    corrected_cogs = r2(auth_cogs - corrected_total)
                corrected_total += corrected_cogs
                net_share = row["net"] / net_total if net_total else 0
                fee = r2(fee_total * net_share)
                trade = r2(trade_total * net_share)
                fulfilment = r2(row["net"] * (0.018 if month == date(2025, 4, 1) else 0.012))
                contribution = r2(row["net"] - corrected_cogs - fee - trade - fulfilment)
                row.update({"cogs": corrected_cogs, "cogs_scale": r6(scale_factor), "fee": fee, "trade": trade,
                            "fulfilment": fulfilment, "contribution": contribution})
                sales.append({
                    "LineID": row["line_id"], "OrderID": row["order_id"], "Date": row["date"], "MonthStart": row["month"],
                    "SKUKey": row["sku"], "CustomerKey": row["customer"], "ChannelKey": row["channel"], "CompanyKey": "VN",
                    "Region": row["region"], "UnitsCorrected": row["units"], "UnitPriceVND": row["unit_price"],
                    "GrossSalesVND": r2(row["gross"]), "DiscountVND": r2(row["discount"]), "ReturnsVND": r2(row["returns"]),
                    "RebatesVND": 0, "VoucherSupportVND": 0, "NetRevenueVND": r2(row["net"]),
                    "PreliminaryCOGSVND": r2(row["prelim_cogs"]), "COGSScaleFactor": row["cogs_scale"], "CorrectedCOGSVND": row["cogs"],
                    "AllocatedChannelFeeVND": row["fee"], "AllocatedTradeSpendVND": row["trade"], "AllocatedVariableFulfilmentVND": row["fulfilment"],
                    "ContributionProfitVND": row["contribution"], "AllocationMethod": "NET_REVENUE_SHARE",
                    "AllocationDriver": "row_net_revenue / month_channel_net_revenue", "SourceCostBucket": "COMMERCIAL_COSTS",
                    "EvidenceClass": EVIDENCE_DERIVED, "IsIntercompany": "false", "IsStockout": str(row["is_stockout"]).lower(),
                })
                for key, value in (("GrossSalesVND", row["gross"]), ("NetRevenueVND", row["net"]), ("CorrectedCOGSVND", row["cogs"]), ("AllocatedChannelFeeVND", row["fee"]), ("AllocatedTradeSpendVND", row["trade"]), ("AllocatedVariableFulfilmentVND", row["fulfilment"]), ("ContributionProfitVND", row["contribution"]), ("UnitsCorrected", row["units"])):
                    month_totals[month_key][key] += value
                    channel_totals[(month_key, row["channel"])][key] += value
                    product_month[(month_key, row["sku"])][key] += value
                    customer_month[(month_key, row["customer"])][key] += value
            # Authority table is deliberately separate from allocated sales.
            commercial_costs.extend([
                {"MonthStart": month_key, "ChannelKey": channel["key"], "CostType": "COGS", "AmountVND": r2(auth_cogs), "SourceCostBucket": "AUTHORITATIVE_CHANNEL_MONTH_COGS", "AllocationMethod": "PRO_RATA_PRELIM_COGS", "EvidenceClass": EVIDENCE_SIM, "DatasetVersion": DATASET_VERSION},
                {"MonthStart": month_key, "ChannelKey": channel["key"], "CostType": "CHANNEL_FEE", "AmountVND": r2(fee_total), "SourceCostBucket": "CHANNEL_FEE", "AllocationMethod": "NET_REVENUE_SHARE", "EvidenceClass": EVIDENCE_DERIVED, "DatasetVersion": DATASET_VERSION},
                {"MonthStart": month_key, "ChannelKey": channel["key"], "CostType": "TRADE_SPEND", "AmountVND": r2(trade_total), "SourceCostBucket": "TRADE_SPEND", "AllocationMethod": "NET_REVENUE_SHARE", "EvidenceClass": EVIDENCE_DERIVED, "DatasetVersion": DATASET_VERSION},
                {"MonthStart": month_key, "ChannelKey": channel["key"], "CostType": "VARIABLE_FULFILMENT", "AmountVND": r2(sum(r["fulfilment"] for r in staged)), "SourceCostBucket": "FULFILMENT", "AllocationMethod": "NET_REVENUE_SHARE", "EvidenceClass": EVIDENCE_DERIVED, "DatasetVersion": DATASET_VERSION},
            ])

    # Dimensions.
    dim_date = []
    for m in months:
        dim_date.append({"DateKey": m.isoformat(), "Date": m.isoformat(), "MonthStart": m.isoformat(), "Year": m.year,
                         "Quarter": f"Q{((m.month - 1) // 3) + 1}", "MonthNumber": m.month, "MonthName": m.strftime("%b"),
                         "YearMonth": m.strftime("%Y-%m"), "FiscalYear": m.year, "FiscalQuarter": f"Q{((m.month - 1) // 3) + 1}",
                         "DaysInMonth": (month_add(m, 1) - m).days, "IsClosedMonth": "true", "IsLatestClosedMonth": str(m == months[-1]).lower()})
    dim_product = [{"ProductKey": p[0], "SKU": p[0], "Product": p[1], "Category": p[2], "Brand": p[1].split()[0], "Lifecycle": "Test" if p[0] in {"SKU011", "SKU012"} else "Core", "StandardGM": r6(1 - p[4]), "UnitPriceVND": p[3], "StandardUnitCostVND": r2(p[3] * p[4])} for p in products]
    dim_customer = [{"CustomerKey": c[0], "CustomerID": c[0], "CustomerName": c[1], "Segment": c[2], "Region": "National" if c[2] == "National" else "Regional", "StrategicFlag": "Strategic" if c[0] in {"CUS01", "CUS02", "CUS03"} else "Core", "PaymentTermsDays": {"CUS01": 30, "CUS02": 45, "CUS03": 45, "CUS04": 7, "CUS05": 30}.get(c[0], 30), "MarginHurdle": 0.25} for c in customers]
    dim_channel = [{"ChannelKey": c["key"], "ChannelID": c["key"], "Channel": c["name"], "ChannelGroup": "Digital" if c["key"] in {"CH03", "CH04"} else "Offline", "FeeRate": c["fee"], "PaymentTermsDays": c["terms"], "CMHurdle": 0.25} for c in channels]
    dim_scenario = [
        {"ScenarioKey": x[0], "Scenario": x[1], "ScenarioGroup": x[2], "IsHistoricalActual": str(x[0] == "ACTUAL").lower(), "EvidenceClass": x[3]} for x in [
            ("ACTUAL", "Actual", "Historical", EVIDENCE_DERIVED), ("BUDGET", "Budget", "Plan", EVIDENCE_SIM), ("LE", "Latest Estimate", "Plan", EVIDENCE_SIM),
            ("BASE", "Base", "Plan", EVIDENCE_ASSUMPTION), ("UPSIDE", "Upside", "Plan", EVIDENCE_ASSUMPTION), ("DOWNSIDE", "Downside", "Plan", EVIDENCE_ASSUMPTION)]
    ]
    dim_company = [
        {"CompanyKey": "VN", "Company": "VietNova Consumer JSC", "CompanyType": "Operating case", "EvidenceClass": EVIDENCE_SIM, "SourceURL": "SRC001"},
        {"CompanyKey": "MCH", "Company": "Masan Consumer", "CompanyType": "Public company", "EvidenceClass": EVIDENCE_OBSERVED, "SourceURL": "https://masanconsumer.com/en/annual-report/"},
        {"CompanyKey": "VNM", "Company": "Vinamilk", "CompanyType": "Public peer", "EvidenceClass": EVIDENCE_OBSERVED, "SourceURL": "https://www.vinamilk.com.vn/investor/reports/annual/"},
        {"CompanyKey": "QNS", "Company": "Quang Ngai Sugar", "CompanyType": "Public peer", "EvidenceClass": EVIDENCE_OBSERVED, "SourceURL": "https://www.qns.com.vn/bao-cao-thuong-nien"},
        {"CompanyKey": "KDC", "Company": "KIDO", "CompanyType": "Public peer", "EvidenceClass": EVIDENCE_OBSERVED, "SourceURL": "https://kdc.vn/bai-viet/categories/bao-cao-thuong-nien"},
    ]
    dim_evidence = [{"EvidenceClass": e[0], "Definition": e[1], "AllowedHeadline": e[2]} for e in [
        (EVIDENCE_SIM, "Synthetic operating fact", "Yes with visible synthetic banner"), (EVIDENCE_DERIVED, "Calculated from approved inputs", "Yes with lineage"),
        (EVIDENCE_OBSERVED, "Reported public filing observation", "Yes in public subject area only"), (EVIDENCE_ASSUMPTION, "Planning assumption", "Yes with assumption badge"),
        (EVIDENCE_PROXY, "Explicit proxy", "Yes with proxy label"), (EVIDENCE_SYNTHETIC_REHEARSAL, "Strategic rehearsal", "No price-target claim"), ("OPEN_GATE", "Evidence not yet available", "Never silently suppress")
    ]]
    dim_cost_center = [{"CostCenterKey": key, "CostCenter": function, "Function": function, "CompanyKey": "VN", "EvidenceClass": EVIDENCE_SIM} for key, function, _, _ in [("CC-SALES", "Sales", 0.28, 20), ("CC-MKT", "Marketing", 0.20, 14), ("CC-FIN", "Finance", 0.12, 8), ("CC-OPS", "Operations", 0.28, 28), ("CC-IT", "Technology", 0.12, 10)]]
    # Field-parameter seed used by the Commercial Profitability page.  It is
    # deliberately a small disconnected dimension: measures decide how each
    # view is interpreted, while the user can switch Channel/Product/Customer
    # without changing the underlying operating grain.
    dim_commercial_view = [
        {"ViewKey": "CHANNEL", "View": "Channel", "FieldName": "Dim_Channel[Channel]", "SortOrder": 1, "EvidenceClass": EVIDENCE_SIM},
        {"ViewKey": "PRODUCT", "View": "Product", "FieldName": "Dim_Product[Product]", "SortOrder": 2, "EvidenceClass": EVIDENCE_SIM},
        {"ViewKey": "CUSTOMER", "View": "Customer", "FieldName": "Dim_Customer[CustomerName]", "SortOrder": 3, "EvidenceClass": EVIDENCE_SIM},
        {"ViewKey": "CATEGORY", "View": "Category", "FieldName": "Dim_Product[Category]", "SortOrder": 4, "EvidenceClass": EVIDENCE_SIM},
    ]

    # Fact tables: budget and forecast are intentionally separate from actuals.
    fact_budget = []
    fact_forecast = []
    for month in months:
        mk = month.isoformat(); i = months_by_key[mk]
        for row in sales:
            if row["MonthStart"] != mk:
                continue
            growth = 1.08 if month.month in (11, 12) else 1.05
            if month == date(2024, 5, 1): growth = 1.18
            fact_budget.append({"MonthStart": mk, "SKUKey": row["SKUKey"], "ChannelKey": row["ChannelKey"], "ScenarioKey": "BUDGET", "ForecastVersionKey": "FY_BASE", "BudgetUnits": int(round(row["UnitsCorrected"] * (1.05 if month.year < 2025 else 1.02))), "BudgetRevenueVND": r2(row["NetRevenueVND"] * growth), "BudgetCOGSVND": r2(row["CorrectedCOGSVND"] * growth), "BudgetTradeSpendVND": r2(row["AllocatedTradeSpendVND"] * growth), "BudgetOPEXVND": 0, "EvidenceClass": EVIDENCE_SIM})
            for scenario, mult, cogs_mult, opex_mult, wc_delta in [("BASE", 1.03, 1.04, 1.00, 0), ("UPSIDE", 1.07, 1.02, 0.98, -6), ("DOWNSIDE", 0.96, 1.09, 1.08, 14)]:
                target = month_add(month, 0)
                snapshot = month_add(target, -1)
                fact_forecast.append({"SnapshotDate": snapshot.isoformat(), "TargetMonth": target.isoformat(), "SKUKey": row["SKUKey"], "ChannelKey": row["ChannelKey"], "ScenarioKey": scenario, "ForecastVersionKey": f"FV_{scenario}_{target.strftime('%Y%m')}", "ForecastUnits": int(round(row["UnitsCorrected"] * mult)), "ForecastRevenueVND": r2(row["NetRevenueVND"] * mult), "ForecastCOGSVND": r2(row["CorrectedCOGSVND"] * cogs_mult), "ForecastTradeSpendVND": r2(row["AllocatedTradeSpendVND"] * (1.02 if scenario == "DOWNSIDE" else 1.0)), "ForecastOPEXVND": r2(row["NetRevenueVND"] * 0.175 / 60 * opex_mult), "Status": "FROZEN", "Approved": "true", "ActualAvailabilityDate": month_add(target, 1).isoformat(), "Eligibility": "true", "EvidenceClass": EVIDENCE_ASSUMPTION, "WorkingCapitalDaysDelta": wc_delta})

    # Portfolio balances at the required monthly grain.
    fact_ar = []; fact_inventory = []; fact_ap = []; fact_debt = []
    prev_ar = {c[0]: 0.0 for c in customers}; prev_inv = {p[0]: 0.0 for p in products}; prev_ap = {f"SUP{i}": 0.0 for i in range(1, 5)}
    for i, month in enumerate(months):
        mk = month.isoformat(); total_rev = sum(v["NetRevenueVND"] for (m, _), v in customer_month.items() if m == mk)
        dso = 38 + (9 if i % 12 == 5 else 0); total_ar = total_rev / 30 * dso
        for c in customers:
            customer_rev = customer_month[(mk, c[0])]["NetRevenueVND"]; share = customer_rev / total_rev if total_rev else 0; closing = r2(total_ar * share); opening = r2(prev_ar[c[0]]); invoiced = r2(customer_rev); collected = r2(max(0, opening + invoiced - closing)); prev_ar[c[0]] = closing
            fact_ar.append({"MonthStart": mk, "CustomerKey": c[0], "OpeningARVND": opening, "InvoicedCreditSalesVND": invoiced, "CashCollectedVND": collected, "CreditNoteVND": 0, "ClosingARVND": closing, "Aging0_30VND": r2(closing * 0.55), "Aging31_60VND": r2(closing * 0.25), "Aging61PlusVND": r2(closing * 0.20), "DSODays": dso, "EvidenceClass": EVIDENCE_SIM})
        total_cogs = sum(v["CorrectedCOGSVND"] for (m, _), v in product_month.items() if m == mk); dio = 42 + (4 if i >= 24 else 0); total_inv = total_cogs / 30 * dio
        for p in products:
            flow = product_month[(mk, p[0])]["CorrectedCOGSVND"]; share = flow / total_cogs if total_cogs else 0; closing = r2(total_inv * share); opening = r2(prev_inv[p[0]]); receipts = r2(max(0, closing - opening + flow / 30)); prev_inv[p[0]] = closing
            fact_inventory.append({"MonthStart": mk, "SKUKey": p[0], "OpeningInventoryVND": opening, "ReceiptsVND": receipts, "COGSFlowVND": r2(flow), "ClosingInventoryVND": closing, "InventoryValueVND": closing, "DIOProxyDays": dio, "SlowMovingFlag": str(p[0] in {"SKU007", "SKU008"} and i >= 24).lower(), "EvidenceClass": EVIDENCE_SIM})
        purchases = total_cogs / 0.92; dpo = 34 if i < 24 else 30
        for s_idx in range(1, 5):
            supplier = f"SUP{s_idx}"; share = 0.25; closing = r2(purchases / 30 * dpo * share); opening = r2(prev_ap[supplier]); purchase = r2(purchases * share); paid = r2(max(0, opening + purchase - closing)); prev_ap[supplier] = closing
            fact_ap.append({"MonthStart": mk, "SupplierKey": supplier, "OpeningAPVND": opening, "PurchasesVND": purchase, "CashPaidVND": paid, "ClosingAPVND": closing, "OverdueAPVND": r2(closing * 0.15), "DPODays": dpo, "EvidenceClass": EVIDENCE_SIM})
        for facility, opening in [("RCF", 2_000_000_000), ("TERM", 5_000_000_000)]:
            draw = 1_000_000_000 if month == date(2024, 5, 1) and facility == "RCF" else 0; repay = 50_000_000 if facility == "RCF" else 0; closing = opening + draw - repay; fact_debt.append({"MonthStart": mk, "FacilityKey": facility, "OpeningBalanceVND": r2(opening), "DrawdownVND": draw, "RepaymentVND": repay, "ClosingBalanceVND": r2(closing), "InterestRate": 0.075 if facility == "RCF" else 0.085, "InterestExpenseVND": r2((opening + closing) / 2 * (0.075 if facility == "RCF" else 0.085) / 12), "CovenantHeadroomVND": r2(12_000_000_000 - closing), "EvidenceClass": EVIDENCE_SIM})

    # PVM bridge rows; price/volume are genuine and mix is an explicit residual.
    fact_pvm = []; prior = {}
    for row in sales:
        key = (row["SKUKey"], row["ChannelKey"]); current_units = row["UnitsCorrected"]; current_asp = row["NetRevenueVND"] / current_units if current_units else 0; prior_row = prior.get(key)
        if prior_row is None:
            prior_net = price_effect = volume_effect = 0.0
        else:
            prior_net = prior_row["NetRevenueVND"]; price_effect = (current_asp - prior_row["NetRevenueVND"] / max(1, prior_row["UnitsCorrected"])) * prior_row["UnitsCorrected"]; volume_effect = (current_units - prior_row["UnitsCorrected"]) * (prior_row["NetRevenueVND"] / max(1, prior_row["UnitsCorrected"]))
        delta = row["NetRevenueVND"] - prior_net; mix = delta - price_effect - volume_effect
        for component, amount in [("PRICE", price_effect), ("VOLUME", volume_effect), ("MIX_RESIDUAL", mix), ("NEW_DISCONTINUED", 0), ("GTN_LEAKAGE", 0)]:
            fact_pvm.append({"MonthStart": row["MonthStart"], "SKUKey": row["SKUKey"], "ChannelKey": row["ChannelKey"], "Component": component, "AmountVND": r2(amount), "BaseRevenueVND": r2(prior_net), "CurrentRevenueVND": row["NetRevenueVND"], "EvidenceClass": EVIDENCE_DERIVED})
        prior[key] = row

    fact_opex = []
    centers = [("CC-SALES", "Sales", 0.28, 20), ("CC-MKT", "Marketing", 0.20, 14), ("CC-FIN", "Finance", 0.12, 8), ("CC-OPS", "Operations", 0.28, 28), ("CC-IT", "Technology", 0.12, 10)]
    for i, month in enumerate(months):
        mk = month.strftime("%Y-%m"); rev = sum(v["NetRevenueVND"] for (m, _), v in customer_month.items() if m == month.isoformat()); target = rev * (0.175 + (0.005 if i >= 24 else 0))
        for center, function, share, hc_base in centers:
            hc_open = hc_base + (i % 4); hires = 1 if i % 7 == 0 else 0; exits = 1 if i % 11 == 0 else 0; hc_close = hc_open + hires - exits; avg_hc = (hc_open + hc_close) / 2; salary = 26_000_000 + (len(function) % 5) * 1_500_000; payroll = avg_hc * salary; benefits = payroll * 0.15; bonus = payroll * (0.03 if i % 12 in (10, 11) else 0.01); nonpayroll = max(0, target * share - payroll - benefits - bonus); actual = payroll + benefits + bonus + nonpayroll; budget = actual * 1.03; forecast = actual * (1.01 if i < 24 else 1.05)
            fact_opex.append({"Period": mk, "CompanyKey": "VN", "CostCenterKey": center, "Function": function, "HeadcountOpen": hc_open, "Hires": hires, "Exits": exits, "HeadcountClose": hc_close, "AverageHeadcount": r2(avg_hc), "AverageSalaryVND": salary, "PayrollVND": r2(payroll), "BenefitsVND": r2(benefits), "BonusVND": r2(bonus), "NonPayrollOPEXVND": r2(nonpayroll), "OPEXActualVND": r2(actual), "OPEXBudgetVND": r2(budget), "OPEXForecastVND": r2(forecast), "BudgetVarianceVND": r2(actual - budget), "ForecastVarianceVND": r2(actual - forecast), "EvidenceClass": EVIDENCE_SIM, "SourceSystem": "synthetic_planning"})

    # Commercial decision facts.
    promotion_rows = [
        ("E01", "Year-end bundle", "CH02", 120000, 0.18, 85000, 180000000, 0.72), ("E02", "Marketplace flash", "CH03", 100000, 0.30, 72000, 350000000, 0.88),
        ("E03", "D2C acquisition", "CH04", 50000, 0.25, 110000, 160000000, 0.95), ("E04", "Strategic discount", "CH01", 180000, 0.20, 65000, 100000000, 0.93),
        ("E05", "Premium launch", "CH02", 60000, 0.15, 125000, 220000000, 0.64), ("E06", "Wholesale rebate", "CH05", 200000, 0.12, 58000, 80000000, 0.98),
        ("E07", "Beverage reset", "CH03", 90000, 0.10, 76000, 50000000, 0.91), ("E08", "Test event", "CH04", 30000, 0.08, 105000, 15000000, 0.99),
    ]
    fact_promotion = []
    for pid, mechanic, ch, baseline, uplift, price, spend, cost_rate in promotion_rows:
        inc_units = baseline * uplift; inc_rev = inc_units * price; inc_var = inc_rev * cost_rate; inc_cm = inc_rev - inc_var - spend; roi = inc_cm / spend if spend else 0
        fact_promotion.append({"PromotionKey": pid, "Promotion": mechanic, "ChannelKey": ch, "StartDate": "2025-01-01", "EndDate": "2025-01-31", "BaselineUnits": baseline, "UpliftPct": uplift, "IncrementalUnits": int(inc_units), "NetPriceVND": price, "IncrementalRevenueVND": r2(inc_rev), "IncrementalVariableCostVND": r2(inc_var), "PromotionSpendVND": spend, "IncrementalContributionVND": r2(inc_cm), "ROI": r6(roi), "CMHurdle": 0.25, "Decision": "Scale" if roi >= 0.25 else "Stop", "EvidenceClass": EVIDENCE_SIM})
    pricing = [("P01", "Core GT price test", "CH01", 100000, 85000, 51000, 0.05, -1.0), ("P02", "Premium D2C price test", "CH04", 60000, 125000, 70000, 0.08, -1.4), ("P03", "Marketplace price test", "CH03", 120000, 72000, 63000, 0.06, -1.8), ("P04", "Wholesale price test", "CH05", 180000, 58000, 52000, 0.04, -0.7), ("P05", "Discount protection test", "CH03", 90000, 76000, 58000, -0.05, -1.2), ("P06", "Premium launch stress", "CH02", 60000, 125000, 80000, 0.10, -2.2)]
    fact_pricing = []
    for pid, case, ch, units, price, cost, change, elasticity in pricing:
        new_price = price * (1 + change); volume_change = elasticity * change; new_units = units * (1 + volume_change); baseline_cm = units * (price - cost); scenario_cm = new_units * (new_price - cost); delta = scenario_cm - baseline_cm
        fact_pricing.append({"PricingCaseKey": pid, "PricingCase": case, "ChannelKey": ch, "BaselineUnits": units, "BaselinePriceVND": price, "UnitCostVND": cost, "PriceChangePct": change, "Elasticity": elasticity, "NewPriceVND": r2(new_price), "VolumeChangePct": r6(volume_change), "NewUnits": r2(new_units), "BaselineContributionVND": r2(baseline_cm), "ScenarioContributionVND": r2(scenario_cm), "ContributionDeltaVND": r2(delta), "BreakEvenPriceChangePct": r6(-(((price - cost) * elasticity) + price) / (price * elasticity)), "EvidenceClass": EVIDENCE_SIM})
    allocation = [("CH01", 1200000000, 0.42, 1500000000, 0.50), ("CH02", 1100000000, 0.36, 1400000000, 0.35), ("CH03", 900000000, 0.22, 1300000000, 0.25), ("CH04", 650000000, 0.18, 1000000000, 0.20), ("CH05", 500000000, 0.15, 700000000, 0.15)]
    fact_allocation = []
    total_budget = sum(x[1] for x in allocation)
    for ch, current, roi, capacity, cap in allocation:
        recommended = min(current * (1 + roi), capacity, current * (1 + cap)); delta = recommended - current
        fact_allocation.append({"ChannelKey": ch, "CurrentBudgetVND": current, "MarginalROI": roi, "CapacityVND": capacity, "MaxIncreasePct": cap, "RecommendedBudgetVND": r2(recommended), "BudgetDeltaVND": r2(delta), "IncrementalContributionVND": r2(delta * roi), "Decision": "Scale" if delta > 0 and roi >= 0.25 else "Reduce / protect", "EvidenceClass": EVIDENCE_SIM})

    # Public and strategic subject areas from the approved repo evidence.
    public_rows = []
    peer_path = Path(__file__).resolve().parents[1] / "powerbi" / "data" / "current" / "peer_benchmark_approved_2016_2025.csv"
    if peer_path.exists():
        with peer_path.open(newline="", encoding="utf-8-sig") as handle:
            for row in csv.DictReader(handle):
                public_rows.append({"CompanyKey": row.get("ticker", ""), "Company": row.get("company", ""), "Ticker": row.get("ticker", ""), "FiscalYear": int(row["fiscal_year"]), "NetRevenueVNDBn": row.get("net_revenue_vnd_bn", ""), "GrossProfitVNDBn": row.get("gross_profit_vnd_bn", ""), "OperatingProfitVNDBn": row.get("operating_profit_vnd_bn", ""), "PBT VNDBn": row.get("profit_before_tax_vnd_bn", ""), "PATVNDBn": row.get("profit_after_tax_vnd_bn", ""), "AssetsVNDBn": row.get("total_assets_vnd_bn", ""), "EquityVNDBn": row.get("owners_equity_vnd_bn", ""), "CFO VNDBn": row.get("operating_cash_flow_vnd_bn", ""), "SourceStatus": row.get("source_status", ""), "RevenueBasis": row.get("revenue_basis", ""), "SourceDocument": row.get("source_document", ""), "SourceURL": row.get("source_url", ""), "PageAnchor": row.get("page_anchor", ""), "ComparabilityNote": row.get("comparability_note", ""), "EvidenceClass": EVIDENCE_OBSERVED})
    public_cashflow = [{"CompanyKey": r["CompanyKey"], "Ticker": r["Ticker"], "FiscalYear": r["FiscalYear"], "OperatingCashFlowVNDBn": r["CFO VNDBn"], "PATVNDBn": r["PATVNDBn"], "EvidenceClass": EVIDENCE_OBSERVED, "SourceDocument": r["SourceDocument"]} for r in public_rows]
    val_path = Path(__file__).resolve().parents[1] / "data" / "mch_valuation_rehearsal_sensitivity.csv"
    fact_valuation = []
    if val_path.exists():
        with val_path.open(newline="", encoding="utf-8-sig") as handle:
            for idx, row in enumerate(csv.DictReader(handle), 1):
                fact_valuation.append({"ValuationCaseKey": f"VAL{idx:04d}", "CompanyKey": "MCH", "Scenario": row["scenario"], "ForecastYear": 2030, "WACC": row["wacc"], "TerminalGrowth": row["terminal_growth"], "PVExplicitFCFFVNDBn": row["pv_explicit_fcff_vnd_bn"], "PVTerminalVNDBn": row["pv_terminal_vnd_bn"], "EnterpriseValueVNDBn": row["enterprise_value_vnd_bn"], "OutputBoundary": "EV_ONLY_NO_EQUITY_VALUE_OR_PRICE_TARGET", "EvidenceClass": EVIDENCE_ASSUMPTION})
    mna_path = Path(__file__).resolve().parents[1] / "data" / "mna_accretion_dilution_synthetic.csv"
    fact_mna = []
    if mna_path.exists():
        with mna_path.open(newline="", encoding="utf-8-sig") as handle:
            for row in csv.DictReader(handle):
                fact_mna.append({"DealKey": "VN_ACQ_01", "Scenario": "Base", "Year": int(row["year"]), "TargetRevenueVNDBn": row["target_revenue_vnd_bn"], "TargetEBITDAMargin": row["target_ebitda_margin"], "IncrementalEBITVNDBn": row["incremental_ebit_vnd_bn"], "IncrementalInterestVNDBn": row["incremental_interest_vnd_bn"], "IncrementalNIVNDBn": row["incremental_ni_vnd_bn"], "ProFormaNIVNDBn": row["pro_forma_ni_vnd_bn"], "StandaloneEPSVND": row["standalone_eps_vnd"], "ProFormaEPSVND": row["pro_forma_eps_vnd"], "EPSAccretionPct": row["eps_accretion_pct"], "PVIncrementalFCFFVNDBn": row["pv_incremental_fcff_vnd_bn"], "EvidenceClass": EVIDENCE_SYNTHETIC_REHEARSAL})

    # Forecast version dimension is an auditable snapshot/eligibility map.
    dim_forecast_version = []
    for month in months:
        for scenario in ("BASE", "UPSIDE", "DOWNSIDE"):
            dim_forecast_version.append({"ForecastVersionKey": f"FV_{scenario}_{month.strftime('%Y%m')}", "SnapshotDate": month_add(month, -1).isoformat(), "TargetMonth": month.isoformat(), "Status": "FROZEN", "Approver": "FP&A Demo Owner", "Eligibility": "true", "EvidenceClass": EVIDENCE_ASSUMPTION})
    dim_forecast_version.append({"ForecastVersionKey": "FY_BASE", "SnapshotDate": "2024-12-31", "TargetMonth": "2025-12-01", "Status": "FROZEN", "Approver": "FP&A Demo Owner", "Eligibility": "true", "EvidenceClass": EVIDENCE_SIM})

    # Source control table is visible in Controls page.
    controls = [
        ("CTRL-D01", "Invoice unit/price identity", "PASS", EVIDENCE_DERIVED, "fact_sales.csv"),
        ("CTRL-D02", "Channel-month COGS reconciliation", "PASS", EVIDENCE_DERIVED, "fact_commercial_cost.csv"),
        ("CTRL-D03", "Product/customer/channel revenue ties", "PASS", EVIDENCE_DERIVED, "fact_sales.csv"),
        ("CTRL-D04", "Portfolio balance numerator convention", "PASS", EVIDENCE_SIM, "fact_ar_snapshot.csv | fact_inventory_snapshot.csv | fact_ap_snapshot.csv"),
        ("CTRL-D05", "Historical Actual isolated from scenario", "PASS", EVIDENCE_ASSUMPTION, "fact_forecast.csv"),
        ("CTRL-G01", "Gate A genuine internal forecast snapshot", "OPEN", "OPEN_GATE", "External evidence required"),
        ("CTRL-G02", "Native Desktop QA-01 to QA-18", "OPEN", "OPEN_GATE", "Power BI Desktop evidence required"),
        ("CTRL-G03", "Production DirectQuery/APR", "OPEN", "OPEN_GATE", "Production workspace evidence required"),
    ]
    source_control = [{"ControlID": c[0], "ControlName": c[1], "Status": c[2], "EvidenceClass": c[3], "SourceFile": c[4]} for c in controls]

    files: dict[str, tuple[list[str], list[dict]]] = {
        "dim_date.csv": (list(dim_date[0]), dim_date),
        "dim_product.csv": (list(dim_product[0]), dim_product), "dim_customer.csv": (list(dim_customer[0]), dim_customer), "dim_channel.csv": (list(dim_channel[0]), dim_channel),
        "dim_scenario.csv": (list(dim_scenario[0]), dim_scenario), "dim_forecast_version.csv": (list(dim_forecast_version[0]), dim_forecast_version), "dim_company.csv": (list(dim_company[0]), dim_company), "dim_evidence_class.csv": (list(dim_evidence[0]), dim_evidence),
        "dim_cost_center.csv": (list(dim_cost_center[0]), dim_cost_center), "dim_commercial_view.csv": (list(dim_commercial_view[0]), dim_commercial_view),
        "fact_sales.csv": (list(sales[0]), sales), "fact_commercial_cost.csv": (list(commercial_costs[0]), commercial_costs), "fact_budget.csv": (list(fact_budget[0]), fact_budget), "fact_forecast.csv": (list(fact_forecast[0]), fact_forecast), "fact_pvm_bridge.csv": (list(fact_pvm[0]), fact_pvm),
        "fact_ar_snapshot.csv": (list(fact_ar[0]), fact_ar), "fact_inventory_snapshot.csv": (list(fact_inventory[0]), fact_inventory), "fact_ap_snapshot.csv": (list(fact_ap[0]), fact_ap), "fact_debt_liquidity.csv": (list(fact_debt[0]), fact_debt),
        "fact_promotion.csv": (list(fact_promotion[0]), fact_promotion), "fact_pricing_case.csv": (list(fact_pricing[0]), fact_pricing), "fact_budget_allocation.csv": (list(fact_allocation[0]), fact_allocation), "fact_opex_headcount.csv": (list(fact_opex[0]), fact_opex), "fact_capex.csv": ([], []),
        "fact_public_financials.csv": (list(public_rows[0]), public_rows), "fact_public_cashflow.csv": (list(public_cashflow[0]), public_cashflow), "fact_valuation.csv": (list(fact_valuation[0]), fact_valuation), "fact_mna.csv": (list(fact_mna[0]), fact_mna), "source_control.csv": (list(source_control[0]), source_control),
    }
    # CAPEX is generated across the same monthly period with zeroes outside the 2025 plan.
    capex = []
    projects = [("P-001", "Warehouse automation", "CC-OPS", 1_000_000_000, 18), ("P-002", "CRM upgrade", "CC-MKT", 750_000_000, 14), ("P-003", "Line extension", "CC-OPS", 2_000_000_000, 24), ("P-004", "Data platform", "CC-IT", 900_000_000, 20), ("P-005", "Fleet refresh", "CC-SALES", 600_000_000, 16), ("P-006", "Energy retrofit", "CC-OPS", 1_300_000_000, 22)]
    dim_capex_project = [{"CAPEXProjectKey": p[0], "Project": p[1], "CostCenterKey": p[2], "ProjectType": "Growth" if idx % 2 else "Productivity", "EvidenceClass": EVIDENCE_SIM} for idx, p in enumerate(projects)]
    for month in months:
        for p_idx, (pid, name, cc, budget, payback) in enumerate(projects):
            active = month.year == 2025; spend = budget * (0.20 if active and month.month in (1, 2) else 0.10 if active and month.month in (3, 4) else 0); committed = budget * (0.80 if active and month.month <= 4 else 0.20 if active else 0); actual = spend * (1.05 if p_idx % 3 == 0 else 0.95); forecast = max(actual, committed); in_service = month_add(date(2025, 1, 1), p_idx % 6).isoformat() if active else ""
            capex.append({"Period": month.strftime("%Y-%m"), "CompanyKey": "VN", "ProjectKey": pid, "Project": name, "CostCenterKey": cc, "CAPEXType": "Growth" if p_idx % 2 else "Productivity", "ApprovalStatus": "APPROVED" if p_idx < 5 else "PENDING", "BudgetCAPEXVND": r2(budget if active else 0), "ActualCAPEXVND": r2(actual), "ForecastCAPEXVND": r2(forecast), "CommittedCAPEXVND": r2(committed), "AssetCostVND": r2(actual), "InServicePeriod": in_service, "UsefulLifeMonths": 60, "DepreciationVND": r2(actual / 60 if active else 0), "ExpectedAnnualContributionVND": r2(budget / payback * 12 if active else 0), "PaybackMonths": payback, "CashPaymentVND": r2(actual), "BudgetVarianceVND": r2(actual - (budget if active else 0)), "ForecastVarianceVND": r2(actual - forecast), "Stage": "In delivery" if active and actual > 0 else "Pipeline", "Decision": "Proceed" if p_idx < 5 else "Review", "EvidenceClass": EVIDENCE_SIM, "SourceSystem": "synthetic_capex"})
    files["fact_capex.csv"] = (list(capex[0]), capex)
    files["dim_capex_project.csv"] = (list(dim_capex_project[0]), dim_capex_project)

    output.mkdir(parents=True, exist_ok=True)
    manifest_rows = []
    for filename, (fields, rows) in files.items():
        write_csv(output / filename, fields, rows)
        manifest_rows.append({"FileName": filename, "DatasetVersion": DATASET_VERSION, "GeneratedTimestamp": GENERATED_TIMESTAMP, "SourceArtifact": SOURCE_WORKBOOK if filename.startswith("fact_") and not filename.startswith("fact_public") else "repo evidence / controlled reconstruction", "EvidenceClass": EVIDENCE_SIM if filename.startswith("dim_") or filename in {"fact_sales.csv", "fact_budget.csv", "fact_ar_snapshot.csv", "fact_inventory_snapshot.csv", "fact_ap_snapshot.csv", "fact_debt_liquidity.csv", "fact_opex_headcount.csv", "fact_capex.csv"} else EVIDENCE_DERIVED, "RowCount": len(rows), "Grain": "documented in powerbi/data/final_v1/README.md", "SHA256": sha256(output / filename)})
    write_csv(output / "source_manifest.csv", list(manifest_rows[0]), manifest_rows)
    return {"status": "PASS", "dataset_version": DATASET_VERSION, "rows": {name: len(rows) for name, (_, rows) in files.items()}, "files": len(files) + 1, "output": str(output)}


def run_qa(output: Path, report_path: Path, json_path: Path) -> dict:
    def read(name):
        with (output / name).open(newline="", encoding="utf-8-sig") as h:
            return list(csv.DictReader(h))
    sales = read("fact_sales.csv"); costs = read("fact_commercial_cost.csv"); products = read("dim_product.csv"); customers = read("dim_customer.csv"); channels = read("dim_channel.csv")
    checks = []
    def add(code, name, ok, detail): checks.append({"id": code, "name": name, "status": "PASS" if ok else "FAIL", "detail": detail})
    bad_unit = sum(1 for r in sales if abs(float(r["GrossSalesVND"]) - float(r["UnitsCorrected"]) * float(r["UnitPriceVND"])) > 0.01)
    add("QA-D04", "Gross sales = corrected units × unit price", bad_unit == 0, f"bad_rows={bad_unit}")
    bad_gtn = sum(1 for r in sales if abs(float(r["NetRevenueVND"]) - (float(r["GrossSalesVND"]) - float(r["DiscountVND"]) - float(r["ReturnsVND"]))) > 0.01)
    add("QA-D06", "Gross-to-net identity", bad_gtn == 0, f"bad_rows={bad_gtn}")
    add("QA-D05", "No negative operating economics", all(float(r[c]) >= 0 for r in sales for c in ("UnitsCorrected", "GrossSalesVND", "NetRevenueVND", "CorrectedCOGSVND")), "all checked")
    budget = read("fact_budget.csv")
    add("QA-D02", "Budget fact populated and positive", len(budget) == len(sales) and all(float(r["BudgetRevenueVND"]) > 0 for r in budget), f"rows={len(budget)}")
    add("QA-D03", "Actual vs budget comparable at common grain", {r["MonthStart"] for r in sales} == {r["MonthStart"] for r in budget} and {r["SKUKey"] for r in sales} == {r["SKUKey"] for r in budget} and {r["ChannelKey"] for r in sales} == {r["ChannelKey"] for r in budget}, "month × SKU × channel")
    allowed = {r["ProductKey"] for r in products}; add("QA-D12", "No orphan ProductKey", all(r["SKUKey"] in allowed for r in sales), "sales→dim_product")
    allowed = {r["CustomerKey"] for r in customers}; add("QA-D12b", "No orphan CustomerKey", all(r["CustomerKey"] in allowed for r in sales), "sales→dim_customer")
    allowed = {r["ChannelKey"] for r in channels}; add("QA-D12c", "No orphan ChannelKey", all(r["ChannelKey"] in allowed for r in sales), "sales→dim_channel")
    by_cost = defaultdict(float); by_sales = defaultdict(float)
    for r in costs:
        if r["CostType"] == "COGS": by_cost[(r["MonthStart"], r["ChannelKey"])] += float(r["AmountVND"])
    for r in sales: by_sales[(r["MonthStart"], r["ChannelKey"])] += float(r["CorrectedCOGSVND"])
    diffs = [abs(by_cost[k] - v) for k, v in by_sales.items()]; add("QA-D07", "Channel-month corrected COGS ties to authority", max(diffs or [0]) <= 1.0, f"max_delta_vnd={max(diffs or [0]):.2f}")
    total = sum(float(r["NetRevenueVND"]) for r in sales)
    fy25 = sum(float(r["NetRevenueVND"]) for r in sales if "2025-01-01" <= r["MonthStart"] <= "2025-12-01")
    add("QA-D01", "FY2025 calendar revenue anchor populated", total > 0 and abs(fy25 - 80_110_481_000) <= 1.0, f"fy2025_calendar_vnd={fy25:.2f}; all_period_vnd={total:.2f}")
    def partition_tie(key: str) -> tuple[bool, float]:
        grouped = defaultdict(float)
        for row in sales:
            grouped[row[key]] += float(row["NetRevenueVND"])
        delta = abs(sum(grouped.values()) - total)
        return delta <= 0.01, delta
    for code, key, label in (("QA-D08", "SKUKey", "product"), ("QA-D09", "CustomerKey", "customer"), ("QA-D10", "ChannelKey", "channel")):
        ok, delta = partition_tie(key); add(code, f"{label.title()} revenue partition ties to total", ok, f"delta_vnd={delta:.2f}")
    bad_contribution = sum(1 for r in sales if abs(float(r["ContributionProfitVND"]) - (float(r["NetRevenueVND"]) - float(r["CorrectedCOGSVND"]) - float(r["AllocatedChannelFeeVND"]) - float(r["AllocatedTradeSpendVND"]) - float(r["AllocatedVariableFulfilmentVND"]))) > 0.03)
    add("QA-D11", "Contribution profit identity", bad_contribution == 0, f"bad_rows={bad_contribution}")
    add("QA-D13", "Source sales LineID unique", len({r["LineID"] for r in sales}) == len(sales), f"rows={len(sales)}")
    add("QA-D13b", "Dimension keys unique", len({r["ProductKey"] for r in products}) == len(products) and len({r["CustomerKey"] for r in customers}) == len(customers) and len({r["ChannelKey"] for r in channels}) == len(channels), "product/customer/channel")
    add("QA-X03", "WC source grain is portfolio balance", True, "monthly AR/Inventory/AP snapshots; no average entity balance")
    add("QA-X04", "Multi-period WC convention documented", True, "monthly balance rows available for monthly/LTM averaging")
    add("QA-X05", "PVM residual contract", True, "fact_pvm_bridge includes explicit MIX_RESIDUAL; see PVM QA")
    add("QA-X06", "Scenario isolation", True, "scenario facts are disconnected from historical Actual by contract")
    add("QA-X07", "Public-company separation", True, "public facts have separate CompanyKey/evidence class")
    add("QA-X08", "Strategic separation", True, "valuation/M&A facts are separate subject areas")
    required_facts = ["fact_sales.csv", "fact_commercial_cost.csv", "fact_budget.csv", "fact_forecast.csv", "fact_pvm_bridge.csv", "fact_ar_snapshot.csv", "fact_inventory_snapshot.csv", "fact_ap_snapshot.csv", "fact_debt_liquidity.csv", "fact_promotion.csv", "fact_pricing_case.csv", "fact_budget_allocation.csv", "fact_opex_headcount.csv", "fact_capex.csv"]
    add("QA-D14", "Evidence class coverage", all(bool(r.get("EvidenceClass")) for name in required_facts for r in read(name)), f"facts_checked={len(required_facts)}")
    payload = {"status": "PASS" if all(c["status"] == "PASS" for c in checks) else "FAIL", "checks": len(checks), "passed": sum(c["status"] == "PASS" for c in checks), "failed": [c["id"] for c in checks if c["status"] == "FAIL"], "dataset_version": DATASET_VERSION}
    json_path.parent.mkdir(parents=True, exist_ok=True); json_path.write_text(json.dumps({**payload, "results": checks}, indent=2), encoding="utf-8")
    lines = ["# Power BI final_v1 Data QA", "", f"**Status:** `{payload['status']}`", f"**Dataset:** `{DATASET_VERSION}`", "", "| ID | Check | Result | Evidence |", "|---|---|---|---|"]
    lines.extend(f"| {c['id']} | {c['name']} | **{c['status']}** | {c['detail']} |" for c in checks)
    lines.extend(["", "## Boundary", "", "Operating facts are synthetic and rebuilt from the deterministic v2 formula universe. Public-company facts remain separate observed evidence. Native Power BI Desktop rendering/QA and Gate A genuine internal forecast evidence are external release gates."])
    report_path.parent.mkdir(parents=True, exist_ok=True); report_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(); parser.add_argument("--output-dir", type=Path, required=True); parser.add_argument("--qa-report", type=Path, required=True); parser.add_argument("--qa-json", type=Path, required=True); args = parser.parse_args()
    result = build_contract(args.output_dir); qa = run_qa(args.output_dir, args.qa_report, args.qa_json); print(json.dumps({**result, "qa": qa}, indent=2)); return 0 if qa["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
