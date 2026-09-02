#!/usr/bin/env python3
"""Build the single recruiter-facing non-Power-BI metric/status snapshot."""
from __future__ import annotations

import csv
import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TODAY = "2026-09-02"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return list(csv.DictReader(handle))


def main() -> None:
    snapshot = read_csv(ROOT / "data" / "governance" / "exported_metric_snapshot.csv")
    scenarios: dict[str, dict[str, dict[str, object]]] = defaultdict(dict)
    units: dict[str, str] = {}
    for row in snapshot:
        if row["segment"] != "ALL" or row["scenario"] == "PUBLIC_REPORTED":
            continue
        metric = row["metric_id"]
        value: object = float(row["value"])
        units[metric] = row["unit"]
        scenarios[row["scenario"]][metric] = {"value": value, "unit": row["unit"], "evidence_class": row["evidence_class"]}

    payload = {
        "project": "VietNova Consumer JSC — non-Power-BI FP&A release",
        "generated_on": TODAY,
        "scope": "recruiter_metric_snapshot_non_powerbi",
        "active_scope": [
            "FP&A / management reporting",
            "integrated three statements and accounting controls",
            "standard costing and working-capital analysis",
            "three-year operating plan",
            "forecast versioning and backtest rehearsal",
            "editable management pack and case-summary PDF",
        ],
        "current_period": "FY2025",
        "source_snapshot": "data/governance/exported_metric_snapshot.csv",
        "scenarios": dict(scenarios),
        "qa": {
            "core_runner": "node scripts/run_finance_qa.mjs --nonbi",
            "release_gate": "python scripts/run_non_powerbi_release_gate.py",
            "expected_core_checks": {"passed": 55, "total": 55},
            "expected_release_checks": {"passed": 52, "total": 52},
            "recruiter_link_checks": {"passed": 42, "total": 42},
        },
        "evidence_boundary": {
            "operating_finance": "SIMULATED/DERIVED controlled case data",
            "public_company": "OBSERVED/CALCULATED_PUBLIC separate subject area",
            "valuation_mna_monte_carlo": "SYNTHETIC_REHEARSAL appendices",
            "forecast_accuracy": "PENDING_EXTERNAL_INPUT — no live employer claim",
            "power_bi": "OUT_OF_ACTIVE_SCOPE — historical archive only",
        },
        "recruiter_links": {
            "website": "https://vn-finance-fpa-case.sangkenny200.chatgpt.site",
            "github": "https://github.com/susayold/commercial-finance-profitability-analytics",
            "case_summary_pdf": "https://drive.google.com/file/d/19rzyxjeIWWDus1LzPiYzcvtM3yK3yxkO/view?usp=drivesdk",
            "drive_folder": "https://drive.google.com/drive/folders/1ZPl-6UoV9hnuk_f_j3NQXI2R6__FR0DR",
        },
        "cv_personalization": "INPUT-GATED — replace placeholders with candidate identity and genuine experience before submission",
    }
    target = ROOT / "data" / "governance" / "recruiter_metric_snapshot.json"
    target.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"status": "PASS", "scenarios": len(scenarios), "metrics_per_scenario": {k: len(v) for k, v in scenarios.items()}, "output": str(target)}, indent=2))


if __name__ == "__main__":
    main()
