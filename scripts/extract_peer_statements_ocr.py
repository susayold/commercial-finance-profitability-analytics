#!/usr/bin/env python3
"""OCR fallback for image-only audited reports.

Renders only requested page ranges and feeds grouped RapidOCR lines into the
same conservative metric mapping used by extract_peer_statements.py.
"""
from __future__ import annotations
import argparse, json, sys
from pathlib import Path
import fitz
import numpy as np
from rapidocr_onnxruntime import RapidOCR

def grouped_lines(page, engine, scale=1.35, y_tolerance=8):
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    image = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
    detected, _ = engine(image)
    if not detected:
        return []
    boxes = []
    for item in detected:
        box, text, score = item
        xs = [point[0] for point in box]
        ys = [point[1] for point in box]
        boxes.append((min(ys), min(xs), str(text), float(score)))
    boxes.sort(key=lambda x: (x[0], x[1]))
    groups = []
    for y, x, text, score in boxes:
        target = None
        for group in reversed(groups[-3:]):
            if abs(y - group["y"]) <= y_tolerance:
                target = group
                break
        if target is None:
            target = {"y": y, "items": []}
            groups.append(target)
        target["items"].append((x, text, score))
    lines = []
    for group in groups:
        parts = sorted(group["items"], key=lambda x: x[0])
        lines.append((" ".join(item[1] for item in parts), min(item[2] for item in parts)))
    return lines


def accept_candidate(metric, label):
    lowered = label.lower()
    if metric == "inventory" and "change in inventory" in lowered:
        return False
    if metric == "cash" and ("effect of exchange" in lowered or "change in cash" in lowered):
        return False
    if metric == "total_debt":
        if "receivable" in lowered:
            return False
        if not any(token in lowered for token in ("borrowings", "short-term loan", "long-term loan")):
            return False
        if any(token in lowered for token in ("proceeds", "payments", "receipts", "settle", "cash flow")):
            return False
    if metric == "revenue" and "revenue deductions" in lowered:
        return False
    return True

def ocr_extract_pdf(pdf_path, registry, parser, engine, page_start, page_end, scale):
    metadata = parser.report_metadata(pdf_path, registry)
    document = fitz.open(pdf_path)
    rows = []
    for page_number in range(page_start, min(page_end, len(document)) + 1):
        lines = grouped_lines(document[page_number - 1], engine, scale=scale)
        page_text = "\\n".join(text for text, _ in lines)
        if not page_text.strip():
            continue
        scope = parser.infer_scope(page_text)
        if scope == "unknown" and "Audited Consolidated" in metadata.get("document_type", ""):
            scope = "consolidated"
        period_type = parser.infer_period_type(page_text, int(metadata["report_year"]))
        unit = parser.unit_for(page_text, metadata)
        if unit == "reported_scale_unknown" and "VND" in page_text:
            unit = "VND"
        for raw_line, score in lines:
            match = parser.line_metric(raw_line)
            if not match:
                continue
            metric, label = match
            if not accept_candidate(metric, label):
                continue
            # OCR statement rows often include code/note/year before the values.
            candidates = [parser.parse_number(x.group(0)) for x in parser.NUMBER_RE.finditer(raw_line)]
            candidates = [x for x in candidates if x is not None and abs(x) >= 1000]
            if not candidates:
                continue
            current = candidates[-2] if len(candidates) >= 2 else candidates[-1]
            comparative = candidates[-1] if len(candidates) >= 2 else None
            confidence = "high" if score >= 0.80 and scope == "consolidated" else "medium"
            note = "RapidOCR grouped line; code/note/year values filtered before amount selection."
            if scope in {"unknown", "ambiguous"}:
                confidence = "low"
                note += " Scope requires human review."
            rows.append(parser.PanelRow(
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
                extraction_method="ocr_rapidocr",
                confidence=confidence,
                review_status="ocr_machine_checked",
                extraction_timestamp_utc="",
                note=note,
            ))
    return rows

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--input-root",type=Path,required=True)
    ap.add_argument("--registry",type=Path,required=True)
    ap.add_argument("--output",type=Path,required=True)
    ap.add_argument("--qa-json",type=Path,required=True)
    ap.add_argument("--page-start",type=int,default=6)
    ap.add_argument("--page-end",type=int,default=13)
    ap.add_argument("--scale",type=float,default=1.35)
    args=ap.parse_args()
    ns={"__name__":"extract_peer_statements"}
    parser_source=(Path(__file__).parent/"extract_peer_statements.py").read_text(encoding="utf-8")
    import types
    module=types.ModuleType("extract_peer_statements")
    sys.modules["extract_peer_statements"]=module
    exec(compile(parser_source,"extract_peer_statements.py","exec"),module.__dict__)
    registry=module.registry_index(args.registry)
    engine=RapidOCR()
    rows=[]; failures=[]
    pdfs=sorted(args.input_root.rglob("*.pdf"))
    for pdf in pdfs:
        try:
            rows.extend(ocr_extract_pdf(pdf,registry,module,engine,args.page_start,args.page_end,args.scale))
        except Exception as exc:
            failures.append({"file":pdf.name,"error":str(exc)})
    qa=module.qa_rows(rows)
    module.write_csv(args.output,rows)
    summary={"input_pdf_count":len(pdfs),"row_count":len(rows),"failure_count":len(failures),"failures":failures,"qa_error_count":len(qa),"qa_errors":qa[:500],"extraction_method":"ocr_rapidocr","page_range":[args.page_start,args.page_end],"scale":args.scale}
    args.qa_json.write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps(summary,ensure_ascii=False,indent=2))
    return 1 if failures or qa else 0
if __name__=="__main__":
    raise SystemExit(main())
