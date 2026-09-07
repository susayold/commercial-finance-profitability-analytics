"""Build the Page 6 resource-planning contract from the governed CAPEX source.

CAPEX budgets are project-level envelopes repeated on monthly deployment rows;
the builder therefore takes the maximum budget per ProjectKey and sums actual
deployment rows so the portfolio is not inflated by monthly budget repeats.
"""
import csv
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
# The closeout plan names the operating-input CAPEX file.  That compact file
# predates the six-project planning layer and has no P-006 rows, so use it when
# complete and otherwise fall back to the governed final_v1 monthly source.
requested_source = root / "data/capex_fixed_asset_planning_synthetic.csv"
source = requested_source
if not requested_source.exists() or not any("P-006" in line for line in requested_source.read_text(encoding="utf-8").splitlines()[1:]):
    source = root / "data/finance_model/final_v1/fact_capex.csv"
rows = list(csv.DictReader(source.open(encoding="utf-8", newline="")))
if not rows:
    raise SystemExit("CAPEX source is empty")

projects = {}
for row in rows:
    pid = row["ProjectKey"]
    item = projects.setdefault(pid, {
        "id": pid,
        "name": row["Project"],
        "status": row["ApprovalStatus"].upper(),
        "budgetBn": 0.0,
        "actualBn": 0.0,
        "paybackMonths": int(float(row["PaybackMonths"])),
        "type": row["CAPEXType"],
    })
    # BudgetCAPEXVND is repeated on each monthly row: max is the project envelope.
    item["budgetBn"] = max(item["budgetBn"], float(row["BudgetCAPEXVND"]) / 1e9)
    item["actualBn"] += float(row["ActualCAPEXVND"]) / 1e9

project_rows = sorted(projects.values(), key=lambda x: x["id"])
portfolio = {
    "projectCount": len(project_rows),
    "envelopeBn": round(sum(x["budgetBn"] for x in project_rows), 3),
    "actualBn": round(sum(x["actualBn"] for x in project_rows), 4),
    "utilizationPct": round(sum(x["actualBn"] for x in project_rows) / sum(x["budgetBn"] for x in project_rows) * 100, 2),
    "approvedCount": sum(x["status"] == "APPROVED" for x in project_rows),
    "pendingCount": sum(x["status"] == "PENDING" for x in project_rows),
}
focus = next((x for x in project_rows if x["id"] == "P-006"), None)
if focus is None:
    raise SystemExit("P-006 is missing from CAPEX source")
focus_project = {
    "id": focus["id"],
    "name": focus["name"].title(),
    "budgetBn": round(focus["budgetBn"], 3),
    "status": "PENDING / REVIEW" if focus["status"] == "PENDING" else focus["status"],
    "paybackMonths": focus["paybackMonths"],
}

output = {
    "scope": "RESOURCE_PLANNING",
    "evidence_class": "SIMULATED/DERIVED",
    "sourceFile": source.relative_to(root).as_posix(),
    "opexBridgeM": 496.1,
    "opexBridgeStatus": "OPEN",
    "peopleCostBn": 12.201,
    "nonPayrollBn": 2.314,
    "opexQ4Q1Pct": 26.3,
    "nonPayrollSharePct": 15.9,
    "capexEnvelopeBn": portfolio["envelopeBn"],
    "capexPortfolio": portfolio,
    "focusCapexProject": focus_project,
    "projects": project_rows,
}
(root / "site/data/generated/page6-resources.json").write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
print(json.dumps({"portfolio": portfolio, "focusCapexProject": focus_project}, indent=2))
