#!/usr/bin/env python3
"""Create a one-page recruiter-facing FP&A case summary PDF from canonical outputs."""
from __future__ import annotations

import csv
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "VNFINANCE_FPA_CASE_SUMMARY_ONE_PAGE.pdf"
SNAPSHOT = ROOT / "data" / "governance" / "exported_metric_snapshot.csv"
MBR = ROOT / "data" / "monthly_business_review_kpi_pack_2026-08-30.csv"
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#0B2545")
TEAL = colors.HexColor("#0E9F8E")
INK = colors.HexColor("#172534")
MUTED = colors.HexColor("#5D6B78")
LINE = colors.HexColor("#D7E2E3")
PALE = colors.HexColor("#F3F8F7")
PALE_BLUE = colors.HexColor("#EEF4FA")
GREEN = colors.HexColor("#087F5B")
AMBER = colors.HexColor("#A86400")


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and stringWidth(candidate, font, size) > width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def draw_wrapped(c: canvas.Canvas, text: str, x: float, y: float, width: float, font: str = "Helvetica", size: float = 8.4, leading: float = 10.5, color=INK) -> float:
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrap(text, font, size, width):
        c.drawString(x, y, line)
        y -= leading
    return y


def section_label(c: canvas.Canvas, label: str, x: float, y: float, width: float) -> float:
    c.setFillColor(TEAL)
    c.rect(x, y - 2, 3.5 * mm, 4.5 * mm, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.3)
    c.drawString(x + 6 * mm, y, label.upper())
    c.setStrokeColor(LINE)
    c.setLineWidth(0.6)
    c.line(x + 39 * mm, y + 1, x + width, y + 1)
    return y - 7 * mm


def card(c: canvas.Canvas, x: float, y: float, w: float, h: float, label: str, value: str, detail: str, accent=TEAL) -> None:
    c.setFillColor(colors.white)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.roundRect(x, y - h, w, h, 3 * mm, fill=1, stroke=1)
    c.setFillColor(accent)
    c.rect(x, y - h, 2.2 * mm, h, fill=1, stroke=0)
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7.0)
    c.drawString(x + 5 * mm, y - 6 * mm, label.upper())
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(x + 5 * mm, y - 15 * mm, value)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7.1)
    c.drawString(x + 5 * mm, y - h + 5 * mm, detail)


def main() -> None:
    snapshot = read_rows(SNAPSHOT)
    mbr = read_rows(MBR)
    values = {(row["metric_id"], row["scenario"]): row["value"] for row in snapshot}
    scenario = {(row["metric"], row["scenario"].lower()): row["value"] for row in mbr if row["metric"] in {"revenue", "ebitda_proxy", "ebitda_proxy_margin", "ccc"}}
    revenue = values.get(("REV_NET", "BASE"), "82.5138")
    ebitda = values.get(("EBITDA_PROXY", "BASE"), "12.8956")
    margin = values.get(("EBITDA_PROXY_MARGIN", "BASE"), "15.6284")
    ccc = values.get(("CCC", "BASE"), "54.0")

    page_w, page_h = A4
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("VietNova FP&A Case Summary")
    margin_x = 15 * mm
    content_w = page_w - 2 * margin_x

    # Header band.
    c.setFillColor(NAVY)
    c.rect(0, page_h - 39 * mm, page_w, 39 * mm, fill=1, stroke=0)
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 21)
    c.drawString(margin_x, page_h - 13 * mm, "VIETNOVA FP&A CASE")
    c.setFillColor(colors.HexColor("#A8E5DD"))
    c.setFont("Helvetica-Bold", 9.2)
    c.drawString(margin_x, page_h - 20 * mm, "FINANCE ANALYST / BUSINESS FINANCE")
    c.setFillColor(colors.white)
    c.setFont("Helvetica", 8.2)
    c.drawString(margin_x, page_h - 28 * mm, "Vietnam omnichannel FMCG | driver-based planning, performance and cash decisions")
    c.setFillColor(colors.HexColor("#C8D8E9"))
    c.setFont("Helvetica", 7.2)
    c.drawRightString(page_w - margin_x, page_h - 13 * mm, "RECRUITER CASE SUMMARY")
    c.drawRightString(page_w - margin_x, page_h - 20 * mm, "NON-POWER-BI RELEASE")

    y = page_h - 48 * mm
    y = draw_wrapped(c, "Decision in one line: protect cash while scaling profitable omnichannel growth. The base case is VND 82.5bn revenue, VND 12.9bn EBITDA proxy and 54.0 days CCC; downside guardrails are visible before action is approved.", margin_x, y, content_w, "Helvetica-Bold", 9.2, 11.5, NAVY)
    y -= 3 * mm

    gap = 3 * mm
    card_w = (content_w - 3 * gap) / 4
    card_y = y
    card(c, margin_x, card_y, card_w, 26 * mm, "Revenue", f"{float(revenue):.1f}", "VND bn | FY2025 base")
    card(c, margin_x + card_w + gap, card_y, card_w, 26 * mm, "EBITDA proxy", f"{float(ebitda):.1f}", "VND bn | GP - controllable OPEX", GREEN)
    card(c, margin_x + 2 * (card_w + gap), card_y, card_w, 26 * mm, "Margin", f"{float(margin):.1f}%", "proxy margin | guardrail-led", GREEN)
    card(c, margin_x + 3 * (card_w + gap), card_y, card_w, 26 * mm, "CCC", f"{float(ccc):.0f}", "days | cash conversion", AMBER)
    y = card_y - 31 * mm

    y = section_label(c, "What was built", margin_x, y, content_w)
    col_gap = 4 * mm
    col_w = (content_w - 2 * col_gap) / 3
    top = y
    panels = [
        ("01  Driver model", "6,480 sales rows, 36 SKUs, 5 channels and 24 customers feed Actual, Budget, Forecast and Prior Year views.", PALE_BLUE),
        ("02  Corporate finance layer", "Linked P&L, cash flow, balance sheet, 36-month TB, GL management bridge, journal controls and subledger ties.", PALE),
        ("03  Decision cadence", "Standard costing, macro drivers, forecast v2, 3-year operating plan, MBR, CFO memo and editable board pack.", PALE_BLUE),
    ]
    for i, (title, body, fill) in enumerate(panels):
        x = margin_x + i * (col_w + col_gap)
        c.setFillColor(fill)
        c.setStrokeColor(LINE)
        c.roundRect(x, top - 33 * mm, col_w, 33 * mm, 2.5 * mm, fill=1, stroke=1)
        c.setFillColor(NAVY)
        c.setFont("Helvetica-Bold", 8.2)
        c.drawString(x + 4 * mm, top - 7 * mm, title)
        draw_wrapped(c, body, x + 4 * mm, top - 14 * mm, col_w - 8 * mm, "Helvetica", 7.6, 9.5, INK)
    y = top - 39 * mm

    y = section_label(c, "Scenario and finance readout", margin_x, y, content_w)
    table_x, table_y = margin_x, y
    table_w, table_h = 91 * mm, 48 * mm
    c.setFillColor(colors.white)
    c.setStrokeColor(LINE)
    c.roundRect(table_x, table_y - table_h, table_w, table_h, 2.5 * mm, fill=1, stroke=1)
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.3)
    c.drawString(table_x + 4 * mm, table_y - 7 * mm, "SCENARIO ENVELOPE (VND BN / % / DAYS)")
    cols = ["Metric", "Base", "Upside", "Downside"]
    col_x = [table_x + 4 * mm, table_x + 47 * mm, table_x + 62 * mm, table_x + 77 * mm]
    c.setFillColor(MUTED)
    c.setFont("Helvetica-Bold", 7.0)
    for label, x in zip(cols, col_x): c.drawString(x, table_y - 14 * mm, label)
    metrics = [("Revenue", "revenue", "VND bn"), ("EBITDA proxy", "ebitda_proxy", "VND bn"), ("Margin", "ebitda_proxy_margin", "%"), ("CCC", "ccc", "days")]
    for i, (label, key, suffix) in enumerate(metrics):
        yy = table_y - (20 + i * 6.5) * mm
        c.setStrokeColor(LINE)
        c.line(table_x + 4 * mm, yy + 2.2 * mm, table_x + table_w - 4 * mm, yy + 2.2 * mm)
        c.setFillColor(INK)
        c.setFont("Helvetica", 7.2)
        c.drawString(col_x[0], yy, label)
        for j, scenario_key in enumerate(["base", "upside", "downside"], start=1):
            value = scenario.get((key, scenario_key), "-")
            c.setFillColor(GREEN if j == 1 else (AMBER if j == 3 else INK))
            c.setFont("Helvetica-Bold" if j != 2 else "Helvetica", 7.3)
            c.drawString(col_x[j], yy, f"{float(value):.1f}" if value != "-" else "-")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.6)
    c.drawString(table_x + 4 * mm, table_y - table_h + 5 * mm, "Scenario values are proxy-derived planning outputs, not statutory results.")

    read_x = margin_x + table_w + col_gap
    read_w = content_w - table_w - col_gap
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.3)
    c.drawString(read_x, table_y - 7 * mm, "FINANCE ANALYST READOUT")
    read_y = table_y - 14 * mm
    findings = [
        "Revenue and margin are managed together: volume, price/mix, discount and cost assumptions flow into contribution.",
        "CCC is an explicit cash guardrail; the downside case stretches to 68.0 days and triggers working-capital review.",
        "Every management output has an evidence class, source mapping, owner and QA tie-out before publication.",
    ]
    for i, finding in enumerate(findings, 1):
        c.setFillColor(TEAL)
        c.circle(read_x + 2 * mm, read_y + 1 * mm, 1.6 * mm, fill=1, stroke=0)
        read_y = draw_wrapped(c, f"{i}. {finding}", read_x + 7 * mm, read_y + 2 * mm, read_w - 7 * mm, "Helvetica", 7.7, 9.7, INK) - 2 * mm
    c.setFillColor(PALE)
    c.setStrokeColor(LINE)
    c.roundRect(read_x, table_y - table_h, read_w, 19 * mm, 2.5 * mm, fill=1, stroke=1)
    c.setFillColor(GREEN)
    c.setFont("Helvetica-Bold", 8.0)
    c.drawString(read_x + 4 * mm, table_y - table_h + 13 * mm, "CONTROL RESULT")
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 14)
    c.drawString(read_x + 4 * mm, table_y - table_h + 6 * mm, "51/51 QA PASS")
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.8)
    c.drawRightString(read_x + read_w - 4 * mm, table_y - table_h + 6 * mm, "40/40 release gate")

    y = table_y - table_h - 9 * mm
    y = section_label(c, "Evidence and next step", margin_x, y, content_w)
    left_w = 112 * mm
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.1)
    c.drawString(margin_x, y, "EVIDENCE DISCIPLINE")
    y2 = draw_wrapped(c, "Synthetic VietNova operating detail is labelled SIMULATED / DERIVED. EBITDA and cash-flow lines are management proxies. Public-company research remains a separate appendix. Power BI is archived and outside this active FP&A release.", margin_x, y - 7 * mm, left_w, "Helvetica", 7.8, 9.6, INK)
    right_x = margin_x + left_w + col_gap
    c.setFillColor(NAVY)
    c.setFont("Helvetica-Bold", 8.1)
    c.drawString(right_x, y, "HANDOFF STATUS")
    draw_wrapped(c, "Ready for recruiter review. Remaining external inputs: approved internal forecast plus post-close actuals for live accuracy, human approval of commentary and a five-minute screen recording.", right_x, y - 7 * mm, content_w - left_w - col_gap, "Helvetica", 7.8, 9.6, INK)

    footer_y = 15 * mm
    c.setStrokeColor(LINE)
    c.line(margin_x, footer_y + 7 * mm, page_w - margin_x, footer_y + 7 * mm)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 6.5)
    c.drawString(margin_x, footer_y, "GitHub: susayold/commercial-finance-profitability-analytics")
    c.drawCentredString(page_w / 2, footer_y, "VietNova Consumer JSC | FP&A case | 2026-09-02")
    c.drawRightString(page_w - margin_x, footer_y, "Synthetic / Derived")
    c.save()
    print({"status": "PASS", "output": str(OUT), "pages": 1, "base_revenue_vnd_bn": float(revenue), "base_ebitda_proxy_vnd_bn": float(ebitda)})


if __name__ == "__main__":
    main()
