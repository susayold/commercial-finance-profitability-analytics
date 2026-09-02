"""Build the recruiter dashboard snapshot from the governed FP&A project data."""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MODEL = ROOT / "data" / "finance_model" / "final_v1"


def rows(path: Path):
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def num(value: str | None) -> float:
    return float(value or 0)


def round2(value: float) -> float:
    return round(value, 2)


sales = rows(MODEL / "fact_sales.csv")
sales_2025 = [row for row in sales if row["MonthStart"].startswith("2025-")]
opex = [row for row in rows(MODEL / "fact_opex_headcount.csv") if row["Period"].startswith("2025-")]

channel_names = {row["ChannelKey"]: row["Channel"] for row in rows(MODEL / "dim_channel.csv")}

monthly = defaultdict(lambda: {"revenue": 0.0, "cogs": 0.0, "grossProfit": 0.0, "contribution": 0.0, "opex": 0.0})
for row in sales_2025:
    month = row["MonthStart"][:7]
    revenue = num(row["NetRevenueVND"])
    cogs = num(row["CorrectedCOGSVND"])
    monthly[month]["revenue"] += revenue
    monthly[month]["cogs"] += cogs
    monthly[month]["grossProfit"] += revenue - cogs
    monthly[month]["contribution"] += num(row["ContributionProfitVND"])
for row in opex:
    month = row["Period"]
    monthly[month]["opex"] += num(row["OPEXActualVND"])

monthly_rows = []
for month in sorted(monthly):
    item = monthly[month]
    item["ebitdaProxy"] = item["grossProfit"] - item["opex"]
    monthly_rows.append(
        {
            "month": month,
            "label": month[5:7],
            **{key: round2(value / 1_000_000_000) for key, value in item.items()},
        }
    )

channel = defaultdict(lambda: {"netSales": 0.0, "grossSales": 0.0, "contribution": 0.0})
for row in sales_2025:
    key = row["ChannelKey"]
    channel[key]["netSales"] += num(row["NetRevenueVND"])
    channel[key]["grossSales"] += num(row["GrossSalesVND"])
    channel[key]["contribution"] += num(row["ContributionProfitVND"])
channel_rows = []
for key, item in sorted(channel.items(), key=lambda pair: pair[1]["netSales"], reverse=True):
    channel_rows.append(
        {
            "channel": channel_names.get(key, key),
            "netSales": round2(item["netSales"] / 1_000_000_000),
            "grossSales": round2(item["grossSales"] / 1_000_000_000),
            "contribution": round2(item["contribution"] / 1_000_000_000),
            "contributionMargin": round2(item["contribution"] / item["netSales"] * 100) if item["netSales"] else 0,
        }
    )

scenario_rows = []
for row in rows(ROOT / "data" / "scenarios" / "scenario_summary.csv"):
    scenario_rows.append(
        {
            "scenario": row["scenario"].title(),
            "revenue": round2(num(row["revenue_vnd_bn"])),
            "grossProfit": round2(num(row["gross_profit_vnd_bn"])),
            "opex": round2(num(row["opex_vnd_bn"])),
            "ebitdaProxy": round2(num(row["ebitda_proxy_vnd_bn"])),
            "ebitdaMargin": round2(num(row["ebitda_proxy_margin_pct"])),
            "contribution": round2(num(row["contribution_vnd_bn"])),
            "ccc": round2(num(row["ccc_days"])),
        }
    )

customers = []
for row in rows(ROOT / "data" / "customer_profitability_synthetic.csv"):
    customers.append(
        {
            "id": row["customer_id"],
            "name": row["customer_name"],
            "channel": row["channel"],
            "netSales": round2(num(row["net_sales_vnd_mn"]) / 1000),
            "contributionMargin": round2(num(row["contribution_margin_pct"])),
            "dso": round2(num(row["dso_days"])),
            "workingCapitalCost": round2(num(row["working_capital_cost_vnd_mn"]) / 1000),
            "afterWcContribution": round2(num(row["contribution_after_wc_cost_vnd_mn"]) / 1000),
            "strategicFlag": row["strategic_flag"],
        }
    )

liquidity = []
for row in rows(ROOT / "data" / "liquidity_stress_synthetic.csv"):
    liquidity.append(
        {
            "scenario": row["scenario"].title(),
            "month": row["month"][:7],
            "headroom": round2(num(row["liquidity_headroom_vnd_mn"])),
            "endingCash": round2(num(row["ending_cash_vnd_mn"])),
            "revolverDraw": round2(num(row["revolver_draw_vnd_mn"])),
            "minCashPolicy": round2(num(row["min_cash_policy_vnd_mn"])),
        }
    )

promotions = []
for row in rows(ROOT / "data" / "promotion_roi_synthetic.csv"):
    promotions.append(
        {
            "id": row["event"].split()[0],
            "name": row["event"][5:],
            "roi": round2(num(row["roi_on_spend"])),
            "incrementalContribution": round2(num(row["incremental_cm_after_spend_vnd"]) / 1_000_000_000),
            "decision": row["decision"].replace("_", " ").title(),
        }
    )

budget = []
for row in rows(ROOT / "data" / "budget_reallocation_synthetic.csv"):
    budget.append(
        {
            "channel": row["channel"],
            "current": round2(num(row["current_budget_vnd"]) / 1_000_000),
            "recommended": round2(num(row["recommended_budget_vnd"]) / 1_000_000),
            "delta": round2(num(row["budget_delta_vnd"]) / 1_000_000),
            "marginalRoi": round2(num(row["marginal_roi"])),
            "decision": row["decision"].replace("_", " "),
        }
    )

snapshot = {
    "period": "FY2025",
    "currency": "VND bn unless stated",
    "evidence": "SIMULATED / DERIVED — governed project case data",
    "monthly": monthly_rows,
    "channels": channel_rows,
    "scenarios": scenario_rows,
    "customers": customers,
    "liquidity": liquidity,
    "promotions": promotions,
    "budget": budget,
    "sources": [
        "data/finance_model/final_v1/fact_sales.csv",
        "data/finance_model/final_v1/fact_opex_headcount.csv",
        "data/scenarios/scenario_summary.csv",
        "data/customer_profitability_synthetic.csv",
        "data/liquidity_stress_synthetic.csv",
        "data/promotion_roi_synthetic.csv",
        "data/budget_reallocation_synthetic.csv",
    ],
}

output = ROOT / "site" / "data" / "dashboard_snapshot.json"
output.write_text(json.dumps(snapshot, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"output": str(output), "monthly": len(monthly_rows), "channels": len(channel_rows), "customers": len(customers), "liquidity_rows": len(liquidity)}))
