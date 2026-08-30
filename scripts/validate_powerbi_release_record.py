#!/usr/bin/env python3
"""Check that the recruiter-facing Power BI release record matches HEAD."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from pathlib import Path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--record", type=Path, default=Path("reports/POWER_BI_CURRENT_RELEASE_STATUS_2026-08-31.md"))
    args = parser.parse_args()
    record = args.record.read_text(encoding="utf-8")
    current = subprocess.run(["git", "rev-parse", "--short=7", "HEAD"], capture_output=True, text=True, check=False).stdout.strip()
    checks: list[tuple[str, bool, str]] = []

    def add(name: str, ok: bool, detail: str = "") -> None:
        checks.append((name, bool(ok), detail))

    handoff_match = re.search(r"\|\s*Handoff commit\s*\|.*?`([0-9a-f]{7,40})`", record, flags=re.I)
    add("record has a handoff commit", bool(handoff_match), handoff_match.group(1) if handoff_match else "missing")
    handoff_commit = handoff_match.group(1) if handoff_match else ""
    # The record intentionally points to the last fully validated handoff. A
    # later documentation-only commit may update the validator itself, so the
    # handoff must be an ancestor of HEAD rather than an impossible self-hash.
    ancestor_ok = False
    if handoff_commit:
        ancestor_ok = subprocess.run(
            ["git", "merge-base", "--is-ancestor", handoff_commit, "HEAD"],
            capture_output=True,
        ).returncode == 0
    add("handoff commit is an ancestor of HEAD", ancestor_ok, f"handoff={handoff_commit}; head={current}")
    add("Drive bundle link is present", "drive.google.com/file/d/1PAOAS0D60Ueh20b26i9MqBaZB9st3tiX" in record)
    add("operating mode is explicit Import", "Import_replace_and_refresh" in record)
    add("local release gate is recorded", bool(re.search(r"Latest local release gate.*PASS", record)))
    add("native PBIX remains pending", bool(re.search(r"\| Native PBIX \|.*PENDING", record)))
    add("production realtime remains pending", bool(re.search(r"\| Production realtime \|.*PENDING", record)))
    add("DirectQuery local-only boundary is visible", "PASS — local only" in record)
    add("latest replacement delta is visible", "1,256,859" in record and "1,256,860" in record)
    add("health reason field is documented", "control_reason" in record)
    add("native gate instructions are linked", "POWER_BI_NATIVE_DESKTOP_HANDOFF_2026-08-31.md" in record)
    add("DirectQuery acceptance matrix is linked", "PRODUCTION_ACCEPTANCE_MATRIX.md" in record)

    failed = [name for name, ok, _ in checks if not ok]
    result = {"status": "PASS" if not failed else "FAIL", "checks": len(checks), "passed": len(checks) - len(failed), "failed": failed, "head_short": current, "evidence_boundary": "Record consistency only; it does not prove native Desktop or production Service execution."}
    print(json.dumps(result, indent=2))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
