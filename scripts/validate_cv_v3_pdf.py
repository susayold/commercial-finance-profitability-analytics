#!/usr/bin/env python3
"""Validate the rendered CV PDF's structural content and one-page constraint."""

from pathlib import Path
import re

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
pdf_path = ROOT / "output" / "pdf" / "FINANCE_ANALYST_CV_ONE_PAGE_V3.pdf"
reader = PdfReader(str(pdf_path))
text = "\n".join(page.extract_text() or "" for page in reader.pages)
required = [
    "FINANCE ANALYST",
    "PROFILE",
    "CORE SKILLS",
    "SELECTED PROJECT",
    "28-tab FP&A model",
    "2,160 invoice lines",
    "9.24%",
    "10.34%",
    "22/22 QA",
    "EVIDENCE DISCIPLINE",
]
normalised = re.sub(r"\s+", " ", text)
checks = [
    ("file_exists", pdf_path.exists(), str(pdf_path)),
    ("one_page", len(reader.pages) == 1, f"pages={len(reader.pages)}"),
    ("text_extractable", len(text) >= 2500, f"characters={len(text)}"),
    ("required_sections", all(term in text for term in required), "sections and evidence terms present"),
    ("ascii_dash_policy", all(ch not in text for ch in "‐‑‒–—―"), "no non-ASCII dash glyphs in extracted text"),
    ("claim_boundary", "Do not claim internal forecast accuracy" in normalised and "price target" in normalised, "evidence boundary visible"),
]
passed = sum(1 for _, ok, _ in checks if ok)
status = "PASS" if passed == len(checks) else "FAIL"
print({"status": status, "checks": len(checks), "passed": passed, "details": [{"name": n, "pass": ok, "detail": d} for n, ok, d in checks]})
if status != "PASS":
    raise SystemExit(1)
