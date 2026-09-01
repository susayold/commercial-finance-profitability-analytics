#!/usr/bin/env python3
"""Validate the one-page FP&A case summary PDF."""
from pathlib import Path
import re
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "output" / "pdf" / "VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf"
reader = PdfReader(str(PDF))
text = "\n".join(page.extract_text() or "" for page in reader.pages)
normalised = re.sub(r"\s+", " ", text)
required = ["VIETNOVA FP&A CASE", "FINANCE ANALYST", "WHAT WAS BUILT", "SCENARIO ENVELOPE", "EVIDENCE DISCIPLINE", "51/51 QA PASS", "SIMULATED / DERIVED", "Power BI is archived"]
checks = [
    ("file_exists", PDF.exists(), str(PDF)),
    ("one_page", len(reader.pages) == 1, f"pages={len(reader.pages)}"),
    ("text_extractable", len(text) >= 1800, f"characters={len(text)}"),
    ("required_sections", all(term in text for term in required), "required sections and values present"),
    ("ascii_dash_policy", all(ch not in text for ch in "‐‑‒–—―"), "no non-ASCII dash glyphs"),
    ("claim_boundary", "not statutory" in normalised and "Remaining external inputs" in normalised, "proxy and external-input caveats visible"),
]
passed = sum(1 for _, ok, _ in checks if ok)
status = "PASS" if passed == len(checks) else "FAIL"
print({"status": status, "checks": len(checks), "passed": passed, "details": [{"name": n, "pass": ok, "detail": d} for n, ok, d in checks]})
if status != "PASS":
    raise SystemExit(1)
