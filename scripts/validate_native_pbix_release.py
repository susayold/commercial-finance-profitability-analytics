#!/usr/bin/env python3
"""Validate a native Power BI PBIX handoff without opening or rewriting it.

The validator checks that the supplied file is a non-trivial, readable PBIX
container, records a SHA-256 and size, rejects a byte-identical PBIT disguise,
and (when supplied) requires all 18 observed QA rows plus Desktop metadata.
It never changes the repository manifest and never promotes a claim by itself.

Exit codes:
  0 = READY_TO_CLAIM (all required evidence is present)
  2 = PENDING_EXTERNAL_EVIDENCE (file is usable but QA/metadata is incomplete)
  1 = FAIL (invalid or unsafe artifact)
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


EXPECTED_QA_IDS = [f"QA-{index:02d}" for index in range(1, 19)]
MINIMUM_PBIX_BYTES = 10_000
SENSITIVE_MEMBER_PATTERNS = (
    re.compile(r"(^|[/\\])\.pbi[/\\](cache\.abf|localSettings\.json)$", re.I),
    re.compile(r"(^|[/\\])(password|secret|access[_-]?token|connectionstring)([/\\]|$)", re.I),
)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def check(name: str, passed: bool, detail: str) -> dict[str, Any]:
    return {"name": name, "status": "PASS" if passed else "FAIL", "detail": detail}


def inspect_pbix(path: Path, pbit_reference: Path | None) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    checks: list[dict[str, Any]] = []
    profile: dict[str, Any] = {"path": str(path.resolve())}
    exists = path.is_file()
    checks.append(check("pbix_exists", exists, "present" if exists else "file not found"))
    if not exists:
        return checks, profile

    suffix_ok = path.suffix.lower() == ".pbix"
    checks.append(check("pbix_extension", suffix_ok, path.suffix or "missing extension"))
    size = path.stat().st_size
    profile["size_bytes"] = size
    checks.append(check("pbix_nontrivial_size", size >= MINIMUM_PBIX_BYTES, f"{size} bytes; minimum {MINIMUM_PBIX_BYTES}"))
    digest = sha256(path)
    profile["sha256"] = digest

    if pbit_reference and pbit_reference.is_file():
        pbit_digest = sha256(pbit_reference)
        profile["pbit_reference"] = str(pbit_reference.resolve())
        profile["pbit_reference_sha256"] = pbit_digest
        checks.append(check("not_byte_identical_to_pbit", digest != pbit_digest, "PBIX and PBIT hashes differ" if digest != pbit_digest else "PBIX bytes equal the PBIT reference"))
    else:
        profile["pbit_reference"] = None
        checks.append(check("pbit_reference_available", True, "no PBIT reference supplied; comparison skipped"))

    zip_ok = zipfile.is_zipfile(path)
    checks.append(check("pbix_zip_container", zip_ok, "readable ZIP container" if zip_ok else "not a readable ZIP container"))
    if not zip_ok:
        return checks, profile

    try:
        with zipfile.ZipFile(path) as archive:
            names = [item.filename for item in archive.infolist()]
            bad_member = archive.testzip()
    except (OSError, zipfile.BadZipFile) as exc:
        checks.append(check("pbix_crc_integrity", False, str(exc)))
        return checks, profile

    profile["member_count"] = len(names)
    profile["report_member_count"] = sum("report" in name.lower() for name in names)
    profile["model_member_count"] = sum(any(token in name.lower() for token in ("datamodel", "model", "dataset")) for name in names)
    profile["metadata_member_count"] = sum("metadata" in name.lower() for name in names)
    checks.append(check("pbix_has_members", bool(names), f"{len(names)} members"))
    checks.append(check("pbix_crc_integrity", bad_member is None, "all member CRC checks pass" if bad_member is None else f"corrupt member: {bad_member}"))

    sensitive_hits = [name for name in names if any(pattern.search(name) for pattern in SENSITIVE_MEMBER_PATTERNS)]
    profile["sensitive_member_name_hits"] = sensitive_hits
    checks.append(check("no_obvious_secret_or_cache_members", not sensitive_hits, "none" if not sensitive_hits else ", ".join(sensitive_hits[:8])))
    # Internal PBIX layouts vary by Desktop build. This is a descriptive
    # signature, not a claim that the semantic model rendered successfully.
    profile["container_signature"] = {
        "has_report_named_member": profile["report_member_count"] > 0,
        "has_model_or_metadata_named_member": profile["model_member_count"] > 0 or profile["metadata_member_count"] > 0,
    }
    checks.append(check("pbix_container_has_report_and_model_signal", profile["container_signature"]["has_report_named_member"] and profile["container_signature"]["has_model_or_metadata_named_member"], "report plus model/metadata members detected" if profile["container_signature"]["has_report_named_member"] and profile["container_signature"]["has_model_or_metadata_named_member"] else "expected report/model signals not detected"))
    return checks, profile


def validate_qa_csv(path: Path | None) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    if path is None:
        return {"status": "PENDING", "reason": "No QA evidence CSV supplied"}, []
    if not path.is_file():
        return {"status": "FAIL", "reason": f"QA CSV not found: {path}"}, []
    required = {"id", "observed_value", "evidence_reference", "reviewer", "executed_at", "status"}
    rows: list[dict[str, Any]] = []
    failures: list[str] = []
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        fields = set(reader.fieldnames or [])
        missing = sorted(required - fields)
        if missing:
            return {"status": "FAIL", "reason": f"QA CSV missing columns: {missing}"}, []
        rows = list(reader)
    by_id = {row.get("id", "").strip(): row for row in rows}
    if len(by_id) != len(rows):
        failures.append("duplicate or blank QA ids")
    for qa_id in EXPECTED_QA_IDS:
        row = by_id.get(qa_id)
        if row is None:
            failures.append(f"missing {qa_id}")
            continue
        if row.get("status", "").strip().upper() != "PASS":
            failures.append(f"{qa_id} status is not PASS")
        for field in ("observed_value", "evidence_reference", "reviewer", "executed_at"):
            if not row.get(field, "").strip():
                failures.append(f"{qa_id} missing {field}")
    extra = sorted(set(by_id) - set(EXPECTED_QA_IDS))
    if extra:
        failures.append(f"unexpected QA ids: {extra}")
    return {"status": "PASS" if not failures else "FAIL", "rows": len(rows), "expected_rows": len(EXPECTED_QA_IDS), "failures": failures, "path": str(path.resolve())}, rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pbix", type=Path, required=True)
    parser.add_argument("--qa-csv", type=Path, default=None, help="observed QA-01..QA-18 CSV")
    parser.add_argument("--pbit-reference", type=Path, default=None)
    parser.add_argument("--desktop-version", default="")
    parser.add_argument("--data-root", default="")
    parser.add_argument("--refresh-timestamp", default="")
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()

    started = datetime.now(timezone.utc).isoformat()
    pbit_reference = args.pbit_reference
    if pbit_reference is None:
        candidate = Path(__file__).resolve().parents[1] / "powerbi" / "releases" / "Commercial_Finance_Profitability_Analytics.pbit"
        pbit_reference = candidate if candidate.is_file() else None
    artifact_checks, profile = inspect_pbix(args.pbix, pbit_reference)
    qa, _ = validate_qa_csv(args.qa_csv)
    metadata = {
        "desktop_version": args.desktop_version.strip(),
        "data_root": args.data_root.strip(),
        "refresh_timestamp": args.refresh_timestamp.strip(),
    }
    metadata_checks = [
        check("desktop_version_recorded", bool(metadata["desktop_version"]), metadata["desktop_version"] or "missing"),
        check("data_root_recorded", bool(metadata["data_root"]), metadata["data_root"] or "missing"),
        check("refresh_timestamp_recorded", bool(metadata["refresh_timestamp"]), metadata["refresh_timestamp"] or "missing"),
    ]
    artifact_failures = [item for item in artifact_checks if item["status"] != "PASS"]
    qa_ready = qa.get("status") == "PASS"
    metadata_ready = all(item["status"] == "PASS" for item in metadata_checks)
    if artifact_failures:
        status = "FAIL"
        exit_code = 1
    elif qa_ready and metadata_ready:
        status = "READY_TO_CLAIM"
        exit_code = 0
    else:
        status = "PENDING_EXTERNAL_EVIDENCE"
        exit_code = 2
    result = {
        "status": status,
        "started_at_utc": started,
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "artifact": profile,
        "artifact_checks": artifact_checks,
        "qa_evidence": qa,
        "desktop_metadata": metadata,
        "metadata_checks": metadata_checks,
        "claim_boundary": "This validator does not prove that Desktop rendered the report; READY_TO_CLAIM is allowed only when the supplied QA CSV and observed Desktop metadata are complete.",
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
