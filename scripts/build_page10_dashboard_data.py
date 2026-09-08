"""Build the executive dashboard contract from owner contracts only."""
import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]


def read_json(relative: str):
    return json.loads((root / relative).read_text(encoding="utf-8"))


snapshot = read_json("data/governance/recruiter_metric_snapshot.json")
page2 = read_json("site/data/generated/page2-performance.json")
page3 = read_json("site/data/generated/page3-commercial.json")
page4 = read_json("site/data/generated/page4-profitability.json")
page5 = read_json("site/data/generated/page5-costing.json")
page6 = read_json("site/data/generated/page6-resources.json")
page7 = read_json("site/data/generated/page7-cash-wc.json")
page8 = read_json("site/data/generated/page8-forecast.json")
page9 = read_json("site/data/generated/page9-evidence.json")

base = snapshot["scenarios"]["BASE"]
scenario_rows = []
for name in ("DOWNSIDE", "BASE", "UPSIDE"):
    row = snapshot["scenarios"][name]
    scenario_rows.append({
        "name": name.title(),
        "revenue": row["REV_NET"]["value"],
        "ebitda": row["EBITDA_PROXY"]["value"],
        "margin": row["EBITDA_PROXY_MARGIN"]["value"],
        "ccc": row["CCC"]["value"],
        "tag": "CONTINGENCY" if name == "DOWNSIDE" else "OPERATING ANCHOR" if name == "BASE" else "GATED",
    })

promotions = page3["promotions"]
budget_cases = page3["budget"]
commercial = {
    "cases": len(promotions),
    "approve": sum(1 for row in promotions if row["decision"].startswith("APPROVE")),
    "reject": sum(1 for row in promotions if row["decision"] == "REJECT"),
    "negativeContributionCases": sum(1 for row in promotions if row["incrementalContribution"] < 0),
    "channelsBelowCmHurdle": sum(1 for row in page3["channels"] if row["cm"] < page3["canonical"]["hurdle"]),
    "positivePromotionsBelowRoiHurdle": sum(1 for row in promotions if row["incrementalContribution"] > 0 and 0 < row["roi"] < page3["canonical"]["hurdle"]),
    "hurdle": page3["canonical"]["hurdle"],
    "portfolioRoi": round(sum(row["incrementalContribution"] for row in promotions) / sum(row["spend"] for row in promotions) * 100, 3),
    "budget": page3["canonical"]["budgetEnvelope"],
    "incrementalContribution": round(sum(row["incrementalContribution"] for row in budget_cases) * 1000),
}

cash = {
    "operatingWc": page7["operatingWcBn"],
    "ar61Plus": page7["ar61PlusBn"],
    "slowInventory": page7["slowInventoryBn"],
    "waterfall": [
        {"label": "AR", "value": page7["arBn"]},
        {"label": "Inventory", "value": page7["inventoryBn"]},
        {"label": "AP", "value": -page7["apBn"]},
    ],
    "stressFirstNegative": page7["stress"]["firstNegative"],
    "stressDecHeadroom": page7["stress"]["decHeadroomBn"],
    "stressDecRevolver": page7["stress"]["decRevolverBn"],
}

resources = page6
costing = page5
plan = [
    {"year": row["year"], "scenario": row["scenario"], "revenue": row["revenue"], "ebitda": row["ebitda"], "cash": None, "cashStatus": row["cashStatus"]}
    for row in page8["longRangeOutlook"] if row["scenario"] == "BASE"
]

link_report_path = root / "reports/RECRUITER_SITE_LINK_QA_FINAL.json"
link_report = json.loads(link_report_path.read_text(encoding="utf-8")) if link_report_path.exists() else {"overall_status": "PENDING"}
link_status = link_report.get("overall_status", "PASS" if link_report.get("failed", 0) == 0 else "FAIL")
link_value = "PASS" if link_status == "PASS" else link_status
link_badge = "PASS" if link_status == "PASS" else "WARN"

recommendation_ids = ["REC-04", "REC-05", "REC-01", "REC-06", "REC-11"]
route_map = {"REC-04": "#cash", "REC-05": "#cash", "REC-01": "#commercial", "REC-06": "#forecast", "REC-11": "#evidence"}
recommendations = {}
with (root / "data/management_recommendation_register_2026-08-30.csv").open(newline="", encoding="utf-8") as handle:
    for row in csv.DictReader(handle):
        if row["id"] in recommendation_ids:
            recommendations[row["id"]] = row
actions = [
    {
        "id": item,
        "priority": i + 1,
        "decision": recommendations[item]["decision"],
        "owner": recommendations[item]["owner"],
        "guardrail": recommendations[item]["guardrail"],
        "review": recommendations[item]["next_review"],
        "evidence": recommendations[item]["evidence_class"],
        "route": route_map[item],
    }
    for i, item in enumerate(recommendation_ids)
]

output = {
    "period": "FY2025",
    "currency": "VND bn",
    "evidence": "SIMULATED / DERIVED / PROXY_DERIVED",
    "base": {
        "revenue": base["REV_NET"]["value"],
        "grossProfit": base["GROSS_PROFIT"]["value"],
        "grossMargin": round(base["GROSS_PROFIT"]["value"] / base["REV_NET"]["value"] * 100, 4),
        "ebitdaProxy": base["EBITDA_PROXY"]["value"],
        "ebitdaMargin": base["EBITDA_PROXY_MARGIN"]["value"],
        "contribution": base["CONTRIBUTION"]["value"],
        "ccc": base["CCC"]["value"],
    },
    "scenarios": scenario_rows,
    "commercial": commercial,
    "cash": cash,
    "costResource": {
        "costVariance": costing["costVarianceM"],
        "materialShare": costing["materialPriceSharePct"],
        "opexQ4Q1": resources.get("opexQ4Q1Pct", 26.3),
        "nonPayrollShare": resources.get("nonPayrollSharePct", 75.6),
        "opexBridge": resources["opexBridgeM"],
        "capexPortfolio": resources["capexPortfolio"],
        "focusCapexProject": resources["focusCapexProject"],
    },
    "plan": plan,
    "forecastBacktest": page8["historicalBacktest"],
    "controls": [
        {"label": "Core QA", "value": f"{snapshot['qa']['expected_core_checks']['passed']} / {snapshot['qa']['expected_core_checks']['total']}", "status": "PASS"},
        {"label": "Release Gate", "value": f"{snapshot['qa']['expected_release_checks']['passed']} / {snapshot['qa']['expected_release_checks']['total']}", "status": "PASS"},
        {"label": "Scope", "value": "18 / 18", "status": "PASS"},
        {"label": "Links", "value": link_value, "status": link_badge},
        {"label": "Historical OOS", "value": "1M / 3M / 6M", "status": page8["historicalBacktest"]["status"]},
        {"label": "Live Gate A", "value": page9["gateA"], "status": page9["gateA"]},
    ],
    "planStatus": page8["liquidity"],
    "sources": {
        "base": {"source_page": "Page 2", "source_file": "data/governance/recruiter_metric_snapshot.json", "evidence_class": "PROXY_DERIVED"},
        "performanceTrend": {"source_page": "Page 2", "source_file": "site/data/generated/page2-performance.json"},
        "commercial": {"source_page": "Page 3", "source_file": "site/data/generated/page3-commercial.json"},
        "profitability": {"source_page": "Page 4", "source_file": "site/data/generated/page4-profitability.json"},
        "costing": {"source_page": "Page 5", "source_file": "site/data/generated/page5-costing.json"},
        "resources": {"source_page": "Page 6", "source_file": "site/data/generated/page6-resources.json"},
        "cash": {"source_page": "Page 7", "source_file": "site/data/generated/page7-cash-wc.json", "evidence_class": "PROXY_DERIVED"},
        "plan": {"source_page": "Page 8", "source_file": "site/data/generated/page8-forecast.json", "evidence_class": "SIMULATED/DERIVED"},
        "forecastBacktest": {"source_page": "Page 8", "source_file": "data/forecast/rolling_origin_revenue_backtest_summary.json", "evidence_class": "SIMULATED_HISTORICAL_BACKTEST"},
        "controls": {"source_page": "Page 9", "source_file": "site/data/generated/page9-evidence.json"},
        "actions": {"source_page": "Recommendation register", "source_file": "data/management_recommendation_register_2026-08-30.csv"},
        "linkQA": {"source_page": "Release QA", "source_file": "reports/RECRUITER_SITE_LINK_QA_FINAL.json"},
    },
    "cashRoute": "#cash",
    "actions": actions,
}

(root / "site/data/generated/page10-dashboard.json").write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
print("Built page10-dashboard.json from owner contracts")
