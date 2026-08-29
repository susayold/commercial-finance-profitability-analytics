#!/usr/bin/env python3
"""Generate deterministic VietNova synthetic operating data.

The output is a runtime artifact. Upload the QA-approved result to Drive under
03_Synthetic_Company; do not commit raw generated rows to Git by default.
"""
from __future__ import annotations
import argparse, csv, json, random
from datetime import date
from pathlib import Path

SEED = 20260829
DATASET_VERSION = "v1.0.0"
START, END = date(2023, 1, 1), date(2025, 12, 1)
CHANNELS = [
    ("MT", "Modern Trade", 0.018, 0.040, 35, 0.04),
    ("GT", "General Trade", 0.000, 0.025, 21, 0.02),
    ("EC", "E-commerce", 0.025, 0.085, 7, 0.10),
    ("CV", "Convenience", 0.010, 0.035, 14, 0.05),
    ("FS", "Food Service", 0.000, 0.020, 30, 0.03),
]
CATEGORIES = ["Dairy", "Beverages", "Condiments", "Convenience Foods"]
REGIONS = ["North", "Central", "South"]

def month_list():
    y, m = START.year, START.month
    out = []
    while (y, m) <= (END.year, END.month):
        out.append(date(y, m, 1))
        m += 1
        if m == 13:
            y, m = y + 1, 1
    return out

def write_csv(path: Path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = sorted({key for row in rows for key in row}) if rows else []
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    rng, months = random.Random(SEED), month_list()

    products = []
    for i in range(36):
        price = 18_000 + (i % 9) * 3_500
        products.append({
            "sku_id": f"SKU{i+1:03d}", "category": CATEGORIES[i % 4],
            "brand": f"VN{(i % 6)+1}", "pack_size": [180, 250, 500, 1000][i % 4],
            "list_price": price, "standard_cogs": round(price * (0.43 + (i % 5) * 0.025)),
            "supplier_id": f"SUP{(i % 4)+1}", "launch_month": months[i % 12].isoformat(),
            "status": "active",
        })
    customers = []
    for i in range(24):
        ctype = "modern_trade" if i < 8 else "distributor" if i < 16 else "ecommerce" if i < 21 else "food_service"
        customers.append({
            "customer_id": f"CUST{i+1:03d}", "customer_type": ctype,
            "segment": ["A", "B", "C"][i % 3], "region": REGIONS[i % 3],
            "payment_terms_days": {"modern_trade": 45, "distributor": 30, "ecommerce": 7, "food_service": 30}[ctype],
            "credit_limit": 2_000_000_000 + (i % 4) * 500_000_000,
            "acquisition_month": months[i % 18].isoformat(),
        })
    channels = [{"channel_id": c[0], "channel_type": c[1], "platform_fee_pct": c[2],
                 "commission_pct": c[3], "settlement_days": c[4],
                 "default_discount_pct": c[5]} for c in CHANNELS]

    sales, costs, inventory, receivables, payables, debt = [], [], [], [], [], []
    promotions, marketing, budgets, forecasts = [], [], [], []
    inv = {(warehouse, p["sku_id"]): 1_500 for warehouse in ("WH_N", "WH_S") for p in products}
    ar = {c["customer_id"]: 0.0 for c in customers}
    ap = {f"SUP{i}": 0.0 for i in range(1, 5)}
    debt_bal = {"RCF": 2_000_000_000.0, "TERM": 5_000_000_000.0}
    seq = 1

    for month in months:
        month_start = len(sales)
        dairy_cost = 1.12 if month >= date(2023, 8, 1) else 1.0
        beverage_fx = 1.08 if month >= date(2025, 8, 1) else 1.0
        for product in products:
            for channel in channels:
                base = 120 + (int(product["sku_id"][-3:]) % 17) * 8 + (month.month % 5) * 5
                season = 1.12 if month.month in (11, 12) else 1.0
                units = max(0, int(rng.gauss(base * season, base * 0.12)))
                discount_pct = channel["default_discount_pct"]
                promo = ""
                if month >= date(2023, 4, 1) and channel["channel_id"] == "MT" and product["sku_id"] in ("SKU001", "SKU002"):
                    units = int(units * 1.10)
                if month == date(2024, 1, 1) and channel["channel_id"] == "EC":
                    channel = dict(channel, platform_fee_pct=channel["platform_fee_pct"] + 0.025)
                if month == date(2024, 9, 1) and channel["channel_id"] == "EC" and product["category"] == "Dairy":
                    units, discount_pct, promo = int(units * 1.30), discount_pct + 0.22, "PROMO_2024_09"
                if month == date(2025, 4, 1) and channel["channel_id"] == "MT":
                    units = int(units * 0.78)
                gross = units * product["list_price"]
                returns = round(gross * (0.018 if channel["channel_id"] == "EC" else 0.005))
                discount = round(gross * discount_pct)
                net = gross - discount - returns
                cost_factor = dairy_cost if product["category"] == "Dairy" else beverage_fx if product["category"] == "Beverages" else 1.0
                cogs = round(units * product["standard_cogs"] * cost_factor)
                freight = round(net * (0.018 if month == date(2025, 4, 1) else 0.012))
                fee = round(net * channel["platform_fee_pct"])
                commission = round(net * channel["commission_pct"])
                trade_spend = round(net * (0.045 if channel["channel_id"] == "MT" else 0.02))
                accrual_factor = 0.80 if month == date(2025, 6, 1) and channel["channel_id"] == "MT" else 1.0
                customer = customers[(seq + int(product["sku_id"][-3:])) % len(customers)]
                sales.append({
                    "date": month.isoformat(), "month": month.isoformat(),
                    "order_id": f"ORD{seq:08d}", "line_id": f"LINE{seq:09d}",
                    "sku_id": product["sku_id"], "customer_id": customer["customer_id"],
                    "channel_id": channel["channel_id"], "region": customer["region"],
                    "units": units, "gross_sales": gross, "discount": discount, "returns": returns,
                    "net_sales": net, "cogs": cogs, "freight": freight,
                    "payment_fee": fee, "commission": commission,
                    "trade_spend": round(trade_spend * accrual_factor),
                    "contribution_margin": net - cogs - freight - fee - commission - round(trade_spend * accrual_factor),
                    "promo_id": promo, "is_stockout": bool(month == date(2025, 4, 1) and channel["channel_id"] == "MT"),
                    "is_intercompany": False,
                })
                costs.append({
                    "month": month.isoformat(), "sku_id": product["sku_id"], "channel_id": channel["channel_id"],
                    "trade_spend": round(trade_spend * accrual_factor), "listing_fee": 0,
                    "rebate": 0, "freight": freight, "payment_fee": fee,
                    "commission": commission, "writeoff": 0,
                    "cost_version": "v1.0.0",
                })
                seq += 1
        current = sales[month_start:]
        for channel in channels:
            spend = 35_000_000 + rng.randint(-5_000_000, 8_000_000)
            if channel["channel_id"] == "EC" and month.year == 2024:
                spend *= 2
            marketing.append({
                "month": month.isoformat(), "channel_id": channel["channel_id"],
                "campaign_id": f"CAMP_{month:%Y%m}_{channel['channel_id']}",
                "spend": spend, "impressions": spend // 12, "clicks": spend // 120,
                "orders": max(1, spend // 25_000), "attributed_net_sales": spend * 4,
                "cac": round(spend / max(1, spend // 25_000), 2), "roas": 4.0,
            })
        for product in products:
            total_units = sum(row["units"] for row in current if row["sku_id"] == product["sku_id"])
            for warehouse in ("WH_N", "WH_S"):
                key, opening = (warehouse, product["sku_id"]), inv[(warehouse, product["sku_id"])]
                stockout = month == date(2025, 4, 1) and warehouse == "WH_S" and product["category"] == "Beverages"
                receipts = 0 if stockout else int(opening * (0.15 + rng.random() * 0.15))
                sold = int(total_units * (0.70 if stockout else 0.50))
                expiry = int(opening * 0.01) if month.month in (3, 9) else 0
                available = max(0, opening + receipts - expiry)
                sold = min(sold, available)
                closing = available - sold
                inv[key] = closing
                inventory.append({"month": month.isoformat(), "warehouse_id": warehouse, "sku_id": product["sku_id"],
                    "opening_units": opening, "receipts_units": receipts, "sales_units": sold,
                    "closing_units": closing, "unit_cost": product["standard_cogs"],
                    "inventory_value": closing * product["standard_cogs"],
                    "days_on_hand": round(closing / max(1, sold) * 30, 1),
                    "stockout_flag": stockout, "expiry_writeoff": expiry * product["standard_cogs"]})
        for customer in customers:
            prior = ar[customer["customer_id"]]
            invoiced = sum(row["net_sales"] for row in current if row["customer_id"] == customer["customer_id"])
            stretch = 25 if month >= date(2025, 2, 1) and customer["customer_id"] in ("CUST009", "CUST010") else 0
            days = customer["payment_terms_days"] + stretch
            collected = max(0, invoiced * (30 / max(30, days)) * (0.90 + rng.random() * 0.10))
            closing = max(0, prior + invoiced - collected)
            receivables.append({"month": month.isoformat(), "customer_id": customer["customer_id"],
                "opening_ar": round(prior), "invoiced": round(invoiced), "cash_collected": round(collected),
                "credit_note": 0, "closing_ar": round(closing), "overdue_0_30": round(closing * .55),
                "overdue_31_60": round(closing * .25), "overdue_61_plus": round(closing * .20), "dso": days})
            ar[customer["customer_id"]] = closing
        for supplier_id in ap:
            purchases = 120_000_000 + rng.randint(-20_000_000, 40_000_000)
            paid = purchases * (1.20 if month == date(2025, 10, 1) else .80)
            closing = max(0, ap[supplier_id] + purchases - paid)
            payables.append({"month": month.isoformat(), "supplier_id": supplier_id, "opening_ap": round(ap[supplier_id]),
                "purchases": round(purchases), "cash_paid": round(paid), "closing_ap": round(closing),
                "overdue_ap": round(closing * .15), "dpo": round(closing / max(1, purchases) * 30, 1)})
            ap[supplier_id] = closing
        for facility, rate in (("RCF", .075), ("TERM", .085)):
            opening = debt_bal[facility]
            draw = 1_000_000_000 if month == date(2024, 5, 1) and facility == "RCF" else 0
            repayment = 50_000_000 if facility == "RCF" else 0
            closing = max(0, opening + draw - repayment)
            debt.append({"month": month.isoformat(), "facility_id": facility, "opening_balance": round(opening),
                "drawdown": draw, "repayment": repayment, "closing_balance": round(closing),
                "interest_rate": rate, "interest_expense": round((opening + closing) / 2 * rate / 12),
                "covenant_headroom": round(12_000_000_000 - closing)})
            debt_bal[facility] = closing
        for product in products:
            for channel in channels:
                current_net = sum(r["net_sales"] for r in current if r["sku_id"] == product["sku_id"] and r["channel_id"] == channel["channel_id"])
                current_units = sum(r["units"] for r in current if r["sku_id"] == product["sku_id"] and r["channel_id"] == channel["channel_id"])
                budget_units = round(current_units * (1.05 if month.year < 2025 else 1.02))
                budget_sales = round(current_net * (1.08 if month.month in (11, 12) else 1.05))
                if month == date(2024, 5, 1): budget_sales = round(current_net * 1.18)
                budgets.append({"version": "FY_BASE", "month": month.isoformat(), "sku_id": product["sku_id"], "channel_id": channel["channel_id"],
                    "budget_units": budget_units, "budget_net_sales": budget_sales,
                    "budget_cogs": round(budget_sales * product["standard_cogs"] / product["list_price"]),
                    "budget_trade_spend": round(budget_sales * .025), "budget_opex": 0})
                forecasts.append({"snapshot_month": month.isoformat(), "target_month": month.isoformat(),
                    "sku_id": product["sku_id"], "channel_id": channel["channel_id"],
                    "forecast_units": round(current_units * (1.03 if month.year == 2025 else 1.06)),
                    "forecast_net_sales": round(current_net * (1.04 if month != date(2024, 5, 1) else 1.18)),
                    "forecast_cogs": round(current_net * product["standard_cogs"] / product["list_price"]),
                    "forecast_trade_spend": round(current_net * .025), "forecast_opex": 0, "forecast_version": "LE1"})
        if month == date(2024, 9, 1):
            promotions.append({"promo_id": "PROMO_2024_09", "start_date": "2024-09-01", "end_date": "2024-09-30",
                "channel_id": "EC", "sku_id": "SKU001", "mechanic": "deep_discount",
                "planned_discount_pct": .20, "planned_units_lift_pct": .30, "actual_discount_pct": .22,
                "incremental_units": 300, "baseline_units": 1000, "promo_spend": 50_000_000, "roi": .80, "status": "completed"})

    output = args.output_dir
    for name, rows in [("sales_fact", sales), ("product_master", products), ("customer_master", customers),
        ("channel_master", channels), ("commercial_costs", costs), ("inventory", inventory),
        ("receivables", receivables), ("payables", payables), ("debt", debt),
        ("budget", budgets), ("forecast", forecasts), ("promotions", promotions), ("marketing_spend", marketing)]:
        write_csv(output / f"{name}.csv", rows)
    manifest = {"dataset_version": DATASET_VERSION, "seed": SEED, "months": len(months),
        "sales_fact_rows": len(sales), "sku_count": len(products), "channel_count": len(channels),
        "customer_count": len(customers), "event_ids": [f"E{i:02d}" for i in range(1, 11)]}
    output.mkdir(parents=True, exist_ok=True)
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest, indent=2))

if __name__ == "__main__":
    main()
