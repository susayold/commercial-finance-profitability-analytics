#!/usr/bin/env python3
"""Export canonical finance metrics used by narrative and web artifacts."""
from __future__ import annotations

import csv
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def rows(path: Path):
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    scenario_rows = rows(ROOT / "data" / "scenarios" / "scenario_summary.csv")
    output = []
    mapping = [
        ("REV_NET", "revenue_vnd_bn", "VND bn"),
        ("GROSS_PROFIT", "gross_profit_vnd_bn", "VND bn"),
        ("EBITDA_PROXY", "ebitda_proxy_vnd_bn", "VND bn"),
        ("EBITDA_PROXY_MARGIN", "ebitda_proxy_margin_pct", "%"),
        ("CONTRIBUTION", "contribution_vnd_bn", "VND bn"),
        ("CCC", "ccc_days", "days"),
    ]
    for row in scenario_rows:
        for metric_id, source_field, unit in mapping:
            output.append({
                "metric_id": metric_id,
                "period": row["period"],
                "scenario": row["scenario"],
                "segment": "ALL",
                "value": row[source_field],
                "unit": unit,
                "evidence_class": row["evidence_class"],
                "source_artifact": row["approved_source"],
            })
    mch = rows(ROOT / "data" / "public_company" / "mch_financial_metrics_approved.csv")
    for row in mch:
        if row["metric_id"] == "MCH_ROE" and row["period"] == "FY2024":
            output.append({
                "metric_id": "MCH_ROE",
                "period": row["period"],
                "scenario": "PUBLIC_REPORTED",
                "segment": "MCH",
                "value": row["value"],
                "unit": row["unit"],
                "evidence_class": row["evidence_class"],
                "source_artifact": row["source_artifact"],
            })
    target = ROOT / "data" / "governance" / "exported_metric_snapshot.csv"
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open("w", newline="", encoding="utf-8") as handle:
        fields = ["metric_id", "period", "scenario", "segment", "value", "unit", "evidence_class", "source_artifact"]
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(output)
    print(f"PASS exported {len(output)} metric rows to {target}")


if __name__ == "__main__":
    main()
