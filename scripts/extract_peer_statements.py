#!/usr/bin/env python3
"""Extract a conservative normalized peer panel from public company reports.

The parser intentionally emits machine_checked rows only. It never converts a
missing value to zero and never merges separate and consolidated statements.
Human review is required before a row becomes approved.
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
import unicodedata
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

from pypdf import PdfReader


METRIC_PATTERNS: dict[str, tuple[str, ...]] = {
    "revenue": (
        r"net\s+revenue",
        r"net\s+sales",
        r"revenue\s+from\s+sale",
        r"doanh\s+thu\s+thuần",
        r"doanh\s+thu",
    ),
    "gross_profit": (
        r"gross\s+profit",
        r"lợi\s+nhuận\s+gộp",
    ),
    "operating_profit": (
        r"operating\s+profit",
        r"profit\s+from\s+operating\s+activities",
        r"lợi\s+nhuận\s+thuần\s+từ\s+hoạt\s+động\s+kinh\s+doanh",
    ),
    "npat": (
        r"profit\s+after\s+tax",
        r"net\s+profit",
        r"lợi\s+nhuận\s+sau\s+thuế",
    ),
    "total_assets": (
        r"total\s+assets",
        r"tổng\s+cộng\s+tài\s+sản",
    ),
    "cash": (
        r"cash\s+and\s+cash\s+equivalents",
        r"cash\s+and\s+short[-\s]?term\s+investments",
        r"tiền\s+và\s+các\s+khoản\s+tương\s+đương\s+tiền",
    ),
    "inventory": (
        r"inventor(?:y|ies)",
        r"hàng\s+tồn\s+kho",
    ),
    "trade_receivables": (
        r"trade\s+and\s+other\s+receivables",
        r"trade\s+receivables",
        r"phải\s+thu\s+khách\s+hàng",
    ),
    "trade_payables": (
        r"trade\s+and\s+other\s+payables",
        r"trade\s+payables",
        r"phải\s+trả\s+người\s+bán",
    ),
    "operating_cash_flow": (
        r"net\s+cash\s+flows?\s+from\s+operating\s+activities",
        r"net\s+cash\s+from\s+operating\s+activities",
        r"lưu\s+chuyển\s+tiền\s+thuần\s+từ\s+hoạt\s+động\s+kinh\s+doanh",
    ),
    "total_debt": (
        r"borrowings",
        r"loans",
        r"interest[-\s]?bearing\s+debt",
        r"vay\s+và\s+nợ\s+thuê\s+tài\s+chính",
    ),
    "capex": (
        r"purchases?\s+of\s+property",
        r"additions?\s+to\s+(?:fixed\s+assets|property)",
        r"mua\s+sắm\s+tài\s+sản\s+cố\s+định",
    ),
}

# The first number after a label is usually the current period; the second is
# comparative. Keep both because period order must be reviewed against the page.
NUMBER_RE = re.compile(
    r"(?<![A-Za-z])"
    r"(?:\(?\s*-?\s*)?"
    r"\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?"
    r"\s*\)?"
    r"(?![A-Za-z])"
)

YEAR_RE = re.compile(r"\b(20\d{2})\b")
UNIT_RE = re.compile(
    r"(?:in|đơn vị tính|currency|vnd|VND|USD)\s*[:\-]?\s*"
    r"(VND\s*(?:million|billion|mn|bn)?|USD\s*(?:million|billion|mn|bn)?|tr\.?\s*đ|tỷ\s*đồng)",
    re.I,
)


@dataclass
class PanelRow:
    company_id: str
    ticker: str
    report_year: int
    period_type: str
    scope: str
    metric: str
    metric_original_label: str
    value: float | None
    comparative_value: float | None
    unit: str
    reported_or_calculated: str
    source_file: str
    source_page: int
    source_url: str
    extraction_method: str
    confidence: str
    review_status: str
    extraction_timestamp_utc: str
    note: str = ""


def fold_text(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).replace("\u00a0", " ")
    return re.sub(r"\s+", " ", value).strip()


def parse_number(raw: str) -> float | None:
    value = raw.strip().replace(" ", "")
    negative = value.startswith("(") and value.endswith(")")
    value = value.strip("()")
    if "," in value and "." in value:
        # Assume the right-most separator is decimal only when its suffix is
        # not three digits; otherwise treat separators as thousands.
        last_comma, last_dot = value.rfind(","), value.rfind(".")
        if len(value) - max(last_comma, last_dot) - 1 == 3:
            value = value.replace(",", "").replace(".", "")
        elif last_comma > last_dot:
            value = value.replace(".", "").replace(",", ".")
        else:
            value = value.replace(",", "")
    elif "," in value:
        suffix = value.rsplit(",", 1)[-1]
        value = value.replace(",", "." if len(suffix) != 3 else "")
    elif "." in value:
        suffix = value.rsplit(".", 1)[-1]
        if len(suffix) == 3:
            value = value.replace(".", "")
    try:
        parsed = float(value)
    except ValueError:
        return None
    return -parsed if negative else parsed


def line_metric(line: str) -> tuple[str, str] | None:
    normalized = fold_text(line).lower()
    # More specific patterns win over broad revenue/debt patterns.
    ranked = sorted(
        ((metric, pattern) for metric, patterns in METRIC_PATTERNS.items() for pattern in patterns),
        key=lambda item: len(item[1]),
        reverse=True,
    )
    for metric, pattern in ranked:
        match = re.search(pattern, normalized, re.I)
        if match:
            label = fold_text(line[: max(match.end(), 1)])
            return metric, label
    return None


def infer_scope(page_text: str) -> str:
    lowered = page_text.lower()
    separate = re.search(r"\bseparate\b|riêng lẻ", lowered)
    consolidated = re.search(r"\bconsolidated\b|hợp nhất", lowered)
    if consolidated and not separate:
        return "consolidated"
    if separate and not consolidated:
        return "separate"
    if consolidated and separate:
        return "ambiguous"
    return "unknown"


def infer_period_type(page_text: str, report_year: int) -> str:
    lowered = page_text.lower()
    if re.search(r"\b1h\b|six months|half[-\s]?year|bán niên", lowered):
        return "1H"
    if re.search(r"\bq1\b|first quarter|quý i\b", lowered):
        return "Q1"
    if re.search(r"\bq2\b|second quarter|quý ii\b", lowered):
        return "Q2"
    if re.search(r"\bq3\b|third quarter|quý iii\b", lowered):
        return "Q3"
    if re.search(r"\bq4\b|fourth quarter|quý iv\b", lowered):
        return "Q4"
    return "FY"


def unit_for(page_text: str, registry_row: dict[str, str]) -> str:
    match = UNIT_RE.search(page_text)
    if match:
        return fold_text(match.group(1))
    # Registry may carry a normalized reporting currency/scale in future runs.
    return registry_row.get("unit", "reported_scale_unknown")


def extract_line_values(line: str) -> tuple[float | None, float | None]:
    numbers = [parse_number(x.group(0)) for x in NUMBER_RE.finditer(line)]
    numbers = [x for x in numbers if x is not None]
    if not numbers:
        return None, None
    return numbers[0], (numbers[1] if len(numbers) > 1 else None)


def registry_index(registry_path: Path) -> dict[str, dict[str, str]]:
    with registry_path.open(encoding="utf-8-sig", newline="") as handle:
        rows = csv.DictReader(handle)
        return {
            (row["ticker"], row["report_year"], row.get("document_type", "")): row
            for row in rows
        }


def report_metadata(pdf_path: Path, registry: dict[str, dict[str, str]]) -> dict[str, str]:
    match = re.search(r"(?P<ticker>MCH|VNM|QNS|KDC).*?(?P<year>20\d{2})", pdf_path.name, re.I)
    if not match:
        raise ValueError(f"Cannot infer ticker/year from filename: {pdf_path.name}")
    ticker = match.group("ticker").upper()
    year = match.group("year")
    candidates = [
        row for (row_ticker, row_year, _), row in registry.items()
        if row_ticker == ticker and row_year == year
    ]
    # Prefer audited consolidated statement registry row when multiple rows exist.
    candidates.sort(key=lambda row: "Audited Consolidated" not in row.get("document_type", ""))
    if not candidates:
        raise ValueError(f"No registry row for {ticker} {year}")
    row = candidates[0].copy()
    row["ticker"] = ticker
    row["report_year"] = year
    return row


def extract_pdf(pdf_path: Path, registry: dict[str, dict[str, str]]) -> list[PanelRow]:
    metadata = report_metadata(pdf_path, registry)
    reader = PdfReader(str(pdf_path))
    timestamp = datetime.now(timezone.utc).isoformat()
    rows: list[PanelRow] = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        if not text.strip():
            continue
        scope = infer_scope(text)
        period_type = infer_period_type(text, int(metadata["report_year"]))
        unit = unit_for(text, metadata)
        for raw_line in text.splitlines():
            line = fold_text(raw_line)
            match = line_metric(line)
            if not match:
                continue
            metric, label = match
            current, comparative = extract_line_values(line)
            if current is None:
                continue
            confidence = "medium"
            note = ""
            if scope in {"unknown", "ambiguous"}:
                confidence = "low"
                note = "Scope not uniquely identified on page; human review required."
            if comparative is None:
                note = (note + " " if note else "") + "No comparative value parsed."
            rows.append(
                PanelRow(
                    company_id=metadata.get("company", metadata["ticker"]),
                    ticker=metadata["ticker"],
                    report_year=int(metadata["report_year"]),
                    period_type=period_type,
                    scope=scope,
                    metric=metric,
                    metric_original_label=label,
                    value=current,
                    comparative_value=comparative,
                    unit=unit,
                    reported_or_calculated="reported",
                    source_file=pdf_path.name,
                    source_page=page_number,
                    source_url=metadata.get("official_index_url", ""),
                    extraction_method="text",
                    confidence=confidence,
                    review_status="machine_checked",
                    extraction_timestamp_utc=timestamp,
                    note=note,
                )
            )
    return rows


def qa_rows(rows: Iterable[PanelRow]) -> list[str]:
    errors: list[str] = []
    seen: dict[tuple[str, int, str, str, str], list[PanelRow]] = {}
    for row in rows:
        key = (row.ticker, row.report_year, row.period_type, row.scope, row.metric)
        seen.setdefault(key, []).append(row)
        if row.value is None:
            errors.append(f"NULL_VALUE {key}")
        if row.scope == "ambiguous":
            errors.append(f"AMBIGUOUS_SCOPE {key} page={row.source_page}")
    for key, matches in seen.items():
        if len(matches) > 1:
            pages = ",".join(str(x.source_page) for x in matches)
            errors.append(f"DUPLICATE_METRIC {key} pages={pages}")
    return errors


def write_csv(path: Path, rows: list[PanelRow]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fields = list(asdict(rows[0]).keys()) if rows else list(PanelRow.__annotations__.keys())
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(asdict(row) for row in rows)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-root", type=Path, required=True)
    parser.add_argument("--registry", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--qa-json", type=Path, required=True)
    args = parser.parse_args()

    registry = registry_index(args.registry)
    pdfs = sorted(args.input_root.rglob("*.pdf"))
    if not pdfs:
        print("No PDFs found", file=sys.stderr)
        return 2

    all_rows: list[PanelRow] = []
    failures: list[dict[str, str]] = []
    for pdf_path in pdfs:
        try:
            all_rows.extend(extract_pdf(pdf_path, registry))
        except Exception as exc:  # keep batch progress and expose failure
            failures.append({"file": str(pdf_path), "error": str(exc)})

    qa_errors = qa_rows(all_rows)
    summary = {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "input_pdf_count": len(pdfs),
        "successful_pdf_count": len(pdfs) - len(failures),
        "failure_count": len(failures),
        "row_count": len(all_rows),
        "qa_error_count": len(qa_errors),
        "failures": failures,
        "qa_errors": qa_errors,
        "next_gate": "human_review" if (failures or qa_errors) else "human_review_required",
    }
    write_csv(args.output, all_rows)
    args.qa_json.parent.mkdir(parents=True, exist_ok=True)
    args.qa_json.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 1 if failures or qa_errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
