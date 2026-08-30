#!/usr/bin/env python3
"""Render the finance-first CV V3 template as a recruiter-ready one-page A4 PDF."""

from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "FINANCE_ANALYST_CV_ONE_PAGE_V3.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = colors.HexColor("#102B46")
TEAL = colors.HexColor("#12B8A6")
INK = colors.HexColor("#172534")
MUTED = colors.HexColor("#5C6B78")
LINE = colors.HexColor("#D9E2E4")
PALE = colors.HexColor("#F2F7F6")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="Name", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=22,
    leading=24, textColor=NAVY, spaceAfter=2, alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name="Contact", parent=styles["Normal"], fontName="Helvetica", fontSize=7.3,
    leading=9.5, textColor=MUTED, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="CVTitle", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8.5,
    leading=10, textColor=TEAL, spaceBefore=2, spaceAfter=3,
))
styles.add(ParagraphStyle(
    name="Section", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=7.3,
    leading=8.8, textColor=NAVY, spaceBefore=5, spaceAfter=2,
    uppercase=True, tracking=0.9,
))
styles.add(ParagraphStyle(
    name="Body", parent=styles["Normal"], fontName="Helvetica", fontSize=7.8,
    leading=10.2, textColor=INK, spaceAfter=3,
))
styles.add(ParagraphStyle(
    name="Small", parent=styles["Normal"], fontName="Helvetica", fontSize=7.0,
    leading=8.6, textColor=MUTED, spaceAfter=1,
))
styles.add(ParagraphStyle(
    name="CVBullet", parent=styles["Normal"], fontName="Helvetica", fontSize=7.45,
    leading=9.35, leftIndent=9, firstLineIndent=-7, textColor=INK, spaceAfter=2.5,
))
styles.add(ParagraphStyle(
    name="Skill", parent=styles["Normal"], fontName="Helvetica", fontSize=7.15,
    leading=9.3, textColor=INK,
))
styles.add(ParagraphStyle(
    name="Footer", parent=styles["Normal"], fontName="Helvetica", fontSize=6.4,
    leading=7.6, textColor=MUTED,
))


def p(text: str, style: str) -> Paragraph:
    return Paragraph(text, styles[style])


def bullet(text: str) -> Paragraph:
    return p(f"<font color='#12B8A6'><b>-</b></font> {text}", "CVBullet")


def section(title: str) -> list:
    return [p(title, "Section"), HRFlowable(width="100%", thickness=0.45, color=LINE, spaceAfter=4)]


doc = SimpleDocTemplate(
    str(OUT), pagesize=A4, rightMargin=16 * mm, leftMargin=16 * mm,
    topMargin=13 * mm, bottomMargin=11 * mm, title="Finance Analyst CV V3",
    author="[CANDIDATE NAME]",
)

story = []
story.append(p("[CANDIDATE NAME]", "Name"))
story.append(p("[City, Country]  |  [email]  |  [phone]  |  [LinkedIn]  |  [GitHub]", "Contact"))
story.append(p("FINANCE ANALYST  /  JUNIOR FP&A  /  BUSINESS FINANCE", "CVTitle"))
story.append(HRFlowable(width="100%", thickness=1.4, color=TEAL, spaceBefore=1, spaceAfter=5))

story.extend(section("PROFILE"))
story.append(p(
    "Finance Analyst / Junior FP&A candidate focused on management P&L, budgeting, rolling forecast, "
    "variance/PVM, profitability, working capital and decision support. Builds auditable models, challenges "
    "financial drivers and converts analysis into owner-backed actions for commercial, sales and operations stakeholders.",
    "Body",
))

story.extend(section("CORE SKILLS"))
skills = (
    "FP&A  |  Annual budgeting  |  Rolling forecast  |  Management reporting  |  Variance / PVM  |  "
    "Gross-to-net  |  Product/channel/customer profitability  |  Promotion and pricing ROI  |  "
    "OPEX/headcount  |  CAPEX  |  DSO/DIO/DPO/CCC  |  Liquidity stress testing  |  Financial statement analysis  |  "
    "DCF / EV framing  |  Excel financial modelling  |  Power BI-ready semantic modelling  |  Finance business partnering"
)
story.append(p(skills, "Skill"))

story.extend(section("SELECTED PROJECT"))
story.append(p("<b>Commercial Finance &amp; Profitability Analytics - VietNova Consumer JSC / Vietnam FMCG case</b>", "Body"))
story.append(p(
    "GitHub: github.com/susayold/commercial-finance-profitability-analytics  |  "
    "Portfolio: vn-finance-fpa-case.sangkenny200.chatgpt.site",
    "Small",
))

bullets = [
    "Built a formula-driven <b>28-tab FP&amp;A model</b> over <b>36 months / 2,160 invoice lines</b>, connecting management P&amp;L, FY2025 budget, forecast versions, PVM, product/channel/customer profitability, working capital, liquidity and scenarios; nine visible controls passed and the formula-error scan returned zero matches (<b>SIMULATED operating case</b>).",
    "Converted commercial drivers into decisions by mapping discounts, rebates, platform fees, trade spend and cost-to-serve; tested promotion/pricing cases against a <b>25% contribution hurdle</b> and documented owner, guardrail, timing and stop/scale actions (<b>SIMULATED / DERIVED</b>).",
    "Built the operating-finance layer beyond the P&amp;L: MBR/KPI dictionary, recommendation register, battle cards, WD-5 to WD+5 close/forecast cadence, OPEX/headcount and CAPEX/fixed-asset bridges; validators cover design controls without claiming realised company impact (<b>SIMULATED / DERIVED</b>).",
    "Analysed <b>Masan Consumer FY2016-FY2025 public statements</b>: revenue CAGR <b>9.24%</b>, PAT CAGR <b>10.34%</b>, FY2025 operating margin <b>25.41%</b> and CFO/PAT <b>31.52%</b>; produced a credit memo and equity-research rehearsal with <b>22/22 QA</b>, thesis/scorecard and FY2017 provenance caveat (<b>PUBLIC / CALCULATED</b>).",
    "Built an EV-only FCFF/DCF rehearsal across Base/Upside/Downside cases (<b>VND 40,673.8bn-101,614.9bn EV</b>) and a synthetic M&amp;A accretion/dilution screen; kept net debt, diluted shares, approved forecasts and native PBIX as explicit evidence gates rather than publishing a price target (<b>ANALYST_ASSUMPTION_REHEARSAL / SYNTHETIC</b>).",
]
for item in bullets:
    story.append(bullet(item))

story.extend(section("EDUCATION & ADDITIONAL"))
education = p("<b>[Degree, Major]</b> - [University], [City] | [Year]<br/>Relevant coursework: Corporate Finance | Financial Statement Analysis | Management Accounting | Statistics | [CFA / other credential]", "Small")
additional = p("<b>Languages:</b> [Vietnamese] | [English level]<br/><b>Certifications:</b> [CFA / FMVA / other] | <b>Availability:</b> [date]", "Small")
table = Table([[education, additional]], colWidths=[88 * mm, 88 * mm])
table.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ("RIGHTPADDING", (0, 0), (-1, -1), 7),
    ("TOPPADDING", (0, 0), (-1, -1), 0),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
]))
story.append(table)

story.extend(section("EVIDENCE DISCIPLINE"))
story.append(p(
    "VietNova operating detail is synthetic; MCH/VNM figures are source-linked public evidence; valuation forecasts are analyst-assumption rehearsals. Do not claim internal forecast accuracy, native Power BI completion or realised business impact until Gate A/B evidence is supplied.",
    "Footer",
))
story.append(Spacer(1, 2))
story.append(HRFlowable(width="100%", thickness=0.5, color=LINE, spaceAfter=2))
story.append(p(
    "Portfolio: https://vn-finance-fpa-case.sangkenny200.chatgpt.site  |  GitHub: https://github.com/susayold/commercial-finance-profitability-analytics  |  Replace bracketed fields before sending.",
    "Footer",
))

doc.build(story)
print(OUT)
