#!/usr/bin/env python3
"""Validate replacement CSVs before a Power BI refresh is allowed."""

from __future__ import annotations

import argparse
import csv
import json
import math
from datetime import date
from decimal import Decimal, InvalidOperation
from pathlib import Path

from build_powerbi_refreshable_project import TABLES


BOOLS = {"true", "false", "1", "0"}
PRIMARY_KEYS = {
    "Product": ["sku_id"],
    "Customer": ["customer_id"],
    "Channel": ["channel_id"],
    "Sales": ["line_id"],
    "Promotions": ["promo_id"],
    "Source_Control": ["control_id"],
}
REFS = {
    "Sales": [("sku_id", "Product", "sku_id"), ("customer_id", "Customer", "customer_id"), ("channel_id", "Channel", "channel_id")],
    "Commercial_Costs": [("sku_id", "Product", "sku_id"), ("channel_id", "Channel", "channel_id")],
    "Inventory": [("sku_id", "Product", "sku_id")],
    "Receivables": [("customer_id", "Customer", "customer_id")],
    "Budget": [("sku_id", "Product", "sku_id"), ("channel_id", "Channel", "channel_id")],
    "Forecast": [("sku_id", "Product", "sku_id"), ("channel_id", "Channel", "channel_id")],
    "Marketing": [("channel_id", "Channel", "channel_id")],
    "Promotions": [("sku_id", "Product", "sku_id"), ("channel_id", "Channel", "channel_id")],
}
NULLABLE_COLUMNS = {("Sales", "promo_id")}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", type=Path, required=True)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    checks: list[tuple[str, bool, str]] = []
    tables: dict[str, list[dict[str, str]]] = {}

    def add(name: str, ok: bool, detail: str = "") -> None:
        checks.append((name, bool(ok), detail))

    for table, spec in TABLES.items():
        if not spec["file"]:
            continue
        path = args.input_dir / spec["file"]
        expected = [column[0] for column in spec["columns"]]
        if not path.exists():
            add(f"{table}: file exists", False, spec["file"])
            continue
        with path.open(newline="", encoding="utf-8-sig") as handle:
            reader = csv.DictReader(handle)
            headers = reader.fieldnames or []
            rows = list(reader)
        tables[table] = rows
        add(f"{table}: headers exact", set(headers) == set(expected), f"expected {len(expected)}, got {len(headers)}; order-independent")
        add(f"{table}: non-empty", len(rows) > 0, str(len(rows)))
        missing_cells = sum(1 for row in rows for column in expected if (table, column) not in NULLABLE_COLUMNS and row.get(column, "") == "")
        add(f"{table}: no blank cells", missing_cells == 0, str(missing_cells))
        bad_values: list[str] = []
        for row_number, row in enumerate(rows, start=2):
            for column, data_type, _ in spec["columns"]:
                value = row.get(column, "")
                if value == "" and (table, column) in NULLABLE_COLUMNS:
                    continue
                try:
                    if data_type == "dateTime":
                        date.fromisoformat(value[:10])
                    elif data_type == "int64":
                        int(value)
                    elif data_type == "double":
                        number = float(Decimal(value))
                        if not math.isfinite(number):
                            raise ValueError("non-finite")
                    elif data_type == "boolean" and value.casefold() not in BOOLS:
                        raise ValueError("boolean must be true/false/1/0")
                except (ValueError, InvalidOperation) as exc:
                    if len(bad_values) < 5:
                        bad_values.append(f"row {row_number} {column}: {exc}")
        add(f"{table}: types parse", not bad_values, "; ".join(bad_values))

        key_columns = PRIMARY_KEYS.get(table)
        if key_columns:
            keys = [tuple(row[column] for column in key_columns) for row in rows]
            duplicate_count = len(keys) - len(set(keys))
            add(f"{table}: primary key unique", duplicate_count == 0, str(duplicate_count))

    for child, refs in REFS.items():
        child_rows = tables.get(child, [])
        for child_column, parent, parent_column in refs:
            allowed = {row[parent_column] for row in tables.get(parent, [])}
            missing = sum(1 for row in child_rows if row.get(child_column) not in allowed)
            add(f"{child}.{child_column} -> {parent}.{parent_column}", missing == 0, str(missing))

    sales = tables.get("Sales", [])
    gross_to_net_bad = 0
    contribution_bad = 0
    tolerance = Decimal("0.01")
    for row in sales:
        try:
            if abs(Decimal(row["net_sales"]) - (Decimal(row["gross_sales"]) - Decimal(row["discount"]) - Decimal(row["returns"]))) > tolerance:
                gross_to_net_bad += 1
            expected_cm = Decimal(row["net_sales"]) - Decimal(row["cogs"]) - Decimal(row["freight"]) - Decimal(row["payment_fee"]) - Decimal(row["commission"]) - Decimal(row["trade_spend"])
            if abs(Decimal(row["contribution_margin"]) - expected_cm) > tolerance:
                contribution_bad += 1
        except (KeyError, InvalidOperation):
            gross_to_net_bad += 1
            contribution_bad += 1
    add("Sales gross-to-net identity", gross_to_net_bad == 0, str(gross_to_net_bad))
    add("Sales contribution identity", contribution_bad == 0, str(contribution_bad))

    passed = sum(ok for _, ok, _ in checks)
    failed = [name for name, ok, _ in checks if not ok]
    payload = {"status": "PASS" if not failed else "FAIL", "checks": len(checks), "passed": passed, "failed": failed, "row_counts": {name: len(rows) for name, rows in tables.items()}}
    print(json.dumps(payload, indent=2))
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        lines = ["# Power BI Input Contract QA", "", f"**Status:** `{payload['status']}`", "", "| Check | Result | Evidence |", "|---|---:|---|"]
        lines += [f"| {name} | {'PASS' if ok else 'FAIL'} | {detail.replace('|', '/')} |" for name, ok, detail in checks]
        args.report.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
