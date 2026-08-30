#!/usr/bin/env python3
"""Validate the extended Power BI scenario-driver contract and show outputs.

This is a deterministic source-level rehearsal. It proves the CSV driver rows
and their arithmetic; it does not pretend to replace native Desktop visual
sign-off.
"""

from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path


SCENARIOS = {"Actual", "Budget", "Forecast", "Upside", "Downside"}


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def total(path: Path, column: str) -> float:
    return sum(float(row[column]) for row in read_rows(path))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", type=Path, default=Path("powerbi/data/current"))
    parser.add_argument("--json", type=Path, default=Path("reports/POWER_BI_SCENARIO_DRIVER_QA_2026-08-31.json"))
    parser.add_argument("--markdown", type=Path, default=Path("reports/POWER_BI_SCENARIO_DRIVER_QA_2026-08-31.md"))
    args = parser.parse_args()
    root = args.input_dir
    scenario_rows = read_rows(root / "scenario_selector.csv")
    actual_revenue = total(root / "sales_fact.csv", "net_sales")
    actual_cogs = total(root / "sales_fact.csv", "cogs")
    budget_revenue = total(root / "budget.csv", "budget_net_sales")
    budget_cogs = total(root / "budget.csv", "budget_cogs")
    forecast_revenue = total(root / "forecast.csv", "forecast_net_sales")
    forecast_cogs = total(root / "forecast.csv", "forecast_cogs")
    actual_opex = total(root / "opex_headcount_planning_synthetic.csv", "opex_actual_vnd")
    budget_opex = total(root / "opex_headcount_planning_synthetic.csv", "opex_budget_vnd")
    forecast_opex = total(root / "opex_headcount_planning_synthetic.csv", "opex_forecast_vnd")
    bases = {
        "Actual": (actual_revenue, actual_cogs, actual_opex),
        "Budget": (budget_revenue, budget_cogs, budget_opex),
        "Forecast": (forecast_revenue, forecast_cogs, forecast_opex),
    }
    checks: list[dict[str, object]] = []

    def add(name: str, ok: bool, detail: str) -> None:
        checks.append({"name": name, "status": "PASS" if ok else "FAIL", "detail": detail})

    required = {"scenario", "base_case", "revenue_multiplier", "cogs_multiplier", "opex_multiplier", "working_capital_days_delta", "scenario_note"}
    headers = set(scenario_rows[0]) if scenario_rows else set()
    add("driver columns are present", required <= headers, ", ".join(sorted(required - headers)))
    add("five scenario rows are present", {row.get("scenario") for row in scenario_rows} == SCENARIOS, json.dumps(sorted({row.get("scenario") for row in scenario_rows})))

    outputs: list[dict[str, object]] = []
    for row in scenario_rows:
        scenario = row["scenario"]
        base_case = row["base_case"]
        base_revenue, base_cogs, base_opex = bases.get(base_case, bases["Actual"])
        revenue_multiplier = float(row["revenue_multiplier"])
        cogs_multiplier = float(row["cogs_multiplier"])
        opex_multiplier = float(row["opex_multiplier"])
        scenario_revenue = base_revenue * revenue_multiplier
        scenario_ebitda = scenario_revenue - base_cogs * cogs_multiplier - base_opex * opex_multiplier
        outputs.append({
            "scenario": scenario,
            "base_case": base_case,
            "revenue_multiplier": revenue_multiplier,
            "cogs_multiplier": cogs_multiplier,
            "opex_multiplier": opex_multiplier,
            "working_capital_days_delta": float(row["working_capital_days_delta"]),
            "scenario_revenue_vnd": round(scenario_revenue, 2),
            "scenario_ebitda_proxy_vnd": round(scenario_ebitda, 2),
            "scenario_note": row["scenario_note"],
        })

    by_name = {item["scenario"]: item for item in outputs}
    add("base cases resolve to source totals", all(item["base_case"] in bases for item in outputs), "Actual/Budget/Forecast source totals")
    add("Upside and Downside are non-neutral", by_name["Upside"]["scenario_revenue_vnd"] != by_name["Forecast"]["scenario_revenue_vnd"] and by_name["Downside"]["scenario_revenue_vnd"] != by_name["Forecast"]["scenario_revenue_vnd"], "Forecast base multiplied by 1.08 / 0.92")
    add("Upside EBITDA exceeds Downside", by_name["Upside"]["scenario_ebitda_proxy_vnd"] > by_name["Downside"]["scenario_ebitda_proxy_vnd"], "driver arithmetic direction")

    payload = {
        "status": "PASS" if all(item["status"] == "PASS" for item in checks) else "FAIL",
        "evidence_boundary": "Static source-data arithmetic; native Power BI Desktop visual QA remains a separate gate.",
        "source_totals_vnd": {
            "actual": {"revenue": actual_revenue, "cogs": actual_cogs, "opex": actual_opex},
            "budget": {"revenue": budget_revenue, "cogs": budget_cogs, "opex": budget_opex},
            "forecast": {"revenue": forecast_revenue, "cogs": forecast_cogs, "opex": forecast_opex},
        },
        "scenarios": outputs,
        "checks": checks,
    }
    args.json.parent.mkdir(parents=True, exist_ok=True)
    args.json.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# Power BI scenario-driver QA — 2026-08-31",
        "",
        f"**Overall:** `{payload['status']}`; static source-level rehearsal only.",
        "",
        "The disconnected selector now chooses a base case and applies finance-owned revenue, COGS and OPEX multipliers. Replace the CSV and refresh the extended PBIT/PBIP to recalculate the same measures.",
        "",
        "| Scenario | Base | Revenue multiplier | COGS multiplier | OPEX multiplier | Scenario revenue (VND) | EBITDA proxy (VND) |",
        "|---|---|---:|---:|---:|---:|---:|",
    ]
    lines.extend(
        f"| {item['scenario']} | {item['base_case']} | {item['revenue_multiplier']:.2f} | {item['cogs_multiplier']:.2f} | {item['opex_multiplier']:.2f} | {item['scenario_revenue_vnd']:,.0f} | {item['scenario_ebitda_proxy_vnd']:,.0f} |"
        for item in outputs
    )
    lines += ["", "## Checks", "", "| Check | Result | Detail |", "|---|---|---|"]
    lines.extend(f"| {item['name']} | {item['status']} | {item['detail']} |" for item in checks)
    lines += ["", f"Evidence boundary: {payload['evidence_boundary']}", ""]
    args.markdown.parent.mkdir(parents=True, exist_ok=True)
    args.markdown.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(payload, indent=2))
    return 0 if payload["status"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
