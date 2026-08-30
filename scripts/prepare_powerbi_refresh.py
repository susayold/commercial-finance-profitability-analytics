#!/usr/bin/env python3
"""Validate and optionally apply a replacement Power BI CSV folder.

The report and model keep the same DataRoot and either the compact 14-file or
extended 19-file contract. This
utility validates a candidate folder before any target files are touched,
records hashes/row counts, and only mutates the target with ``--apply``.
It does not attempt to click Refresh in Power BI Desktop; the Desktop refresh
is the next explicit step in the runbook.
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from shutil import copy2


FILES = (
    "sales_fact.csv",
    "commercial_costs.csv",
    "inventory.csv",
    "receivables.csv",
    "payables.csv",
    "debt.csv",
    "budget.csv",
    "forecast.csv",
    "marketing_spend.csv",
    "promotions.csv",
    "product_master.csv",
    "customer_master.csv",
    "channel_master.csv",
    "source_control.csv",
)
EXTENDED_FILES = (
    "scenario_selector.csv",
    "peer_benchmark_approved_2016_2025.csv",
    "peer_extraction_queue.csv",
    "opex_headcount_planning_synthetic.csv",
    "capex_fixed_asset_planning_synthetic.csv",
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def row_count(path: Path) -> int:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        return max(sum(1 for _ in csv.reader(handle)) - 1, 0)


def validate(folder: Path, validator: Path, scope: str) -> dict:
    command = [sys.executable, str(validator), "--scope", scope, "--input-dir", str(folder)]
    result = subprocess.run(command, capture_output=True, text=True, check=False)
    payload: dict = {}
    try:
        candidate = json.loads(result.stdout)
        if isinstance(candidate, dict):
            payload = candidate
    except json.JSONDecodeError:
        # Keep this tolerant of a validator that emits a short preamble before
        # its final JSON object.
        decoder = json.JSONDecoder()
        for offset, character in enumerate(result.stdout):
            if character != "{":
                continue
            try:
                candidate, _ = decoder.raw_decode(result.stdout[offset:])
            except json.JSONDecodeError:
                continue
            if isinstance(candidate, dict) and "status" in candidate:
                payload = candidate
                break
    if result.returncode != 0 or payload.get("status") != "PASS":
        raise SystemExit(
            json.dumps(
                {
                    "status": "FAIL",
                    "stage": "input_contract",
                    "validator_exit_code": result.returncode,
                    "validator": payload,
                    "stderr": result.stderr[-2000:],
                },
                indent=2,
            )
        )
    return payload


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input-dir", type=Path, required=True, help="validated candidate CSV folder")
    parser.add_argument("--data-root", type=Path, required=True, help="Power BI DataRoot folder")
    parser.add_argument("--scope", choices=["auto", "compact", "extended"], default="auto")
    parser.add_argument(
        "--validator",
        type=Path,
        default=Path(__file__).with_name("validate_powerbi_input_contract.py"),
        help="replacement-input contract validator",
    )
    parser.add_argument("--report", type=Path, help="optional JSON evidence output")
    parser.add_argument("--apply", action="store_true", help="copy validated files into --data-root")
    args = parser.parse_args()

    source = args.input_dir.resolve()
    target = args.data_root.resolve()
    validator = args.validator.resolve()
    if not source.is_dir():
        raise SystemExit(f"input folder does not exist: {source}")
    if not validator.is_file():
        raise SystemExit(f"validator does not exist: {validator}")

    scope = args.scope
    if scope == "auto":
        scope = "extended" if any((source / name).is_file() for name in EXTENDED_FILES) else "compact"
    contract_files = FILES + EXTENDED_FILES if scope == "extended" else FILES
    validation = validate(source, validator, scope)
    if args.apply:
        if target.exists() and not target.is_dir():
            raise SystemExit(f"data-root is not a folder: {target}")
        target.mkdir(parents=True, exist_ok=True)
    files: dict[str, dict[str, object]] = {}
    for name in contract_files:
        candidate = source / name
        if not candidate.is_file():
            raise SystemExit(f"validated folder is missing required file: {candidate}")
        destination = target / name
        files[name] = {
            "source_sha256": sha256(candidate),
            "source_rows": row_count(candidate),
            "target_sha256_before": sha256(destination) if destination.is_file() else None,
            "target_rows_before": row_count(destination) if destination.is_file() else None,
        }

    applied = False
    if args.apply:
        if source != target:
            for name in contract_files:
                copy2(source / name, target / name)
        applied = True
        for name in contract_files:
            destination = target / name
            files[name]["target_sha256_after"] = sha256(destination)
            files[name]["target_rows_after"] = row_count(destination)
            if files[name]["target_sha256_after"] != files[name]["source_sha256"]:
                raise SystemExit(f"post-copy hash mismatch: {destination}")

    payload = {
        "status": "PASS",
        "scope": scope,
        "file_count": len(contract_files),
        "applied": applied,
        "source_dir": str(source),
        "data_root": str(target),
        "validated_at_utc": datetime.now(timezone.utc).isoformat(),
        "validator": validation,
        "files": files,
        "next_step": "Open the report and select Home > Refresh in Power BI Desktop" if applied else "Re-run with --apply, then refresh the report in Power BI Desktop",
    }
    rendered = json.dumps(payload, indent=2)
    print(rendered)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(rendered + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
