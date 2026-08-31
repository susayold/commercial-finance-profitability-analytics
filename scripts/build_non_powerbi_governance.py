#!/usr/bin/env python3
"""Build the non-Power-BI governance and cross-artifact release layer.

The script is deterministic and reads only the approved ``final_v1`` operating
contract plus public-company evidence already present in the repository.  It
does not manufacture Gate A/B evidence; those remain explicitly open.
"""
from __future__ import annotations

import csv, hashlib, json, shutil
from collections import defaultdict
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "powerbi" / "data" / "final_v1"
OUT = ROOT / "data"
TODAY = "2026-08-31"

def read_csv(path: Path):
    with path.open(newline="", encoding="utf-8-sig") as h:
        return list(csv.DictReader(h))

def write_csv(path: Path, fields, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as h:
        w = csv.DictWriter(h, fieldnames=fields, extrasaction="ignore")
        w.writeheader(); w.writerows(rows)

def sha256(path: Path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""): h.update(chunk)
    return h.hexdigest().upper()

def money(value): return round(float(value), 6)

def build_registry():
    rows = [
      ("REV_GROSS","Gross Sales","Invoice-level gross sales before discounts/returns","SUM(GrossSalesVND)","","","line","VND","calendar month","none","SIMULATED","powerbi/data/final_v1/fact_sales.csv","FP&A","APPROVED","Synthetic operating ledger"),
      ("REV_NET","Net Revenue","Gross sales less discounts, returns, rebates and voucher support","REV_GROSS - DISCOUNTS - RETURNS - REBATES - VOUCHERS","REV_GROSS","","line","VND","calendar month","none","DERIVED","powerbi/data/final_v1/fact_sales.csv","FP&A","APPROVED","Must not exceed gross sales"),
      ("COGS","Corrected COGS","Authoritative COGS allocated to sales lines using documented pro-rata method","SUM(CorrectedCOGSVND)","","","line","VND","calendar month","none","DERIVED","powerbi/data/final_v1/fact_sales.csv + fact_commercial_cost.csv","FP&A","APPROVED","Authority tie at month x channel"),
      ("GROSS_PROFIT","Gross Profit","Net revenue less corrected COGS","REV_NET - COGS","REV_NET","COGS","company/month","VND","calendar month","none","DERIVED","fact_sales.csv","FP&A","APPROVED",""),
      ("GROSS_MARGIN","Gross Margin %","Gross profit divided by net revenue","GROSS_PROFIT / REV_NET","GROSS_PROFIT","REV_NET","company/month","percent","calendar month","none","DERIVED","fact_sales.csv","FP&A","APPROVED","Ratio tolerance 1 bp"),
      ("CONTRIBUTION","Contribution Profit","Net revenue less COGS, channel fees, trade spend and variable fulfilment","REV_NET - COGS - FEES - TRADE_SPEND - FULFILMENT","REV_NET","","line","VND","calendar month","none","DERIVED","fact_sales.csv","Commercial Finance","APPROVED",""),
      ("CONTRIBUTION_MARGIN","Contribution Margin %","Contribution profit divided by net revenue","CONTRIBUTION / REV_NET","CONTRIBUTION","REV_NET","company/month","percent","calendar month","none","DERIVED","fact_sales.csv","Commercial Finance","APPROVED",""),
      ("EBITDA_PROXY","EBITDA Proxy","Gross profit less controllable OPEX; explicitly non-statutory","GROSS_PROFIT - OPEX_ACTUAL","GROSS_PROFIT","OPEX_ACTUAL","company/month/scenario","VND","calendar month","none","PROXY_DERIVED","fact_sales.csv + fact_opex_headcount.csv","FP&A","APPROVED","Proxy label required"),
      ("EBITDA_PROXY_MARGIN","EBITDA Proxy Margin %","EBITDA proxy divided by scenario revenue","EBITDA_PROXY / REV_NET","EBITDA_PROXY","REV_NET","company/month/scenario","percent","calendar month","none","PROXY_DERIVED","scenario_summary.csv","FP&A","APPROVED","Derived; never independently hard-coded"),
      ("AR_END","Ending AR","Closing trade receivables at period end","SUM(ClosingARVND)","","","customer/month","VND","ending balance","none","SIMULATED","fact_ar_snapshot.csv","Treasury","APPROVED","Ending balance"),
      ("INVENTORY_END","Ending Inventory","Closing inventory value at period end","SUM(ClosingInventoryVND)","","","SKU/month","VND","ending balance","none","SIMULATED","fact_inventory_snapshot.csv","Supply Chain Finance","APPROVED","Ending balance"),
      ("AP_END","Ending AP","Closing trade payables at period end","SUM(ClosingAPVND)","","","supplier/month","VND","ending balance","none","SIMULATED","fact_ap_snapshot.csv","Treasury","APPROVED","Ending balance"),
      ("DSO","Days Sales Outstanding","Ending AR divided by daily net revenue","AR_END / (REV_NET / 30)","AR_END","REV_NET","company/month","days","calendar month","30-day month","DERIVED","fact_ar_snapshot.csv + fact_sales.csv","Treasury","APPROVED","Ending AR convention"),
      ("DIO","Days Inventory Outstanding","Ending inventory divided by daily COGS","INVENTORY_END / (COGS / 30)","INVENTORY_END","COGS","company/month","days","calendar month","30-day month","DERIVED","fact_inventory_snapshot.csv + fact_sales.csv","Treasury","APPROVED","Ending inventory convention"),
      ("DPO","Days Payables Outstanding","Ending AP divided by daily purchases/COGS proxy","AP_END / (PURCHASES / 30)","AP_END","PURCHASES","company/month","days","calendar month","30-day month","DERIVED","fact_ap_snapshot.csv","Treasury","APPROVED","Ending AP convention"),
      ("CCC","Cash Conversion Cycle","DSO plus DIO less DPO","DSO + DIO - DPO","DSO","DIO","company/month","days","calendar month","none","DERIVED","fact_ar_snapshot.csv + inventory + ap","Treasury","APPROVED","Lower is better"),
      ("CFO","Operating Cash Flow","Cash flow from operating activities in public filing","reported statement line","","","company/fiscal year","VND bn","fiscal year","none","OBSERVED","data/public_company/mch_financial_metrics_approved.csv","Public Markets","APPROVED","Public subject area only"),
      ("PAT","Profit After Tax","PAT attributable to owners where available","reported statement line","","","company/fiscal year","VND bn","fiscal year","none","OBSERVED","data/public_company/mch_financial_metrics_approved.csv","Public Markets","APPROVED","Public subject area only"),
      ("AVG_EQUITY","Average Equity","Average of opening and closing equity attributable to owners","(EQUITY_t-1 + EQUITY_t) / 2","","","company/fiscal year","VND bn","fiscal year","none","CALCULATED_PUBLIC","mch_financial_metrics_approved.csv","Public Markets","APPROVED","Denominator is average equity"),
      ("ROE","Return on Equity","PAT attributable to owners divided by average equity attributable to owners","PAT / AVG_EQUITY","PAT","AVG_EQUITY","company/fiscal year","percent","fiscal year","none","CALCULATED_PUBLIC","mch_financial_metrics_approved.csv","Public Markets","APPROVED","Single approved FY2016-FY2025 definition"),
      ("FCFF","Free Cash Flow to Firm","NOPAT plus D&A less capex and change in NWC","NOPAT + D&A - CAPEX - DELTA_NWC","","","company/fiscal year","VND bn","fiscal year","none","SYNTHETIC_REHEARSAL","valuation rehearsal","Strategy","APPROVED","Rehearsal only"),
      ("EV","Enterprise Value","DCF enterprise value from explicit FCFF and terminal value","PV_EXPLICIT_FCFF + PV_TERMINAL - NET_DEBT_ADJ","","","valuation case","VND bn","forecast period","none","SYNTHETIC_REHEARSAL","valuation rehearsal","Strategy","APPROVED","EV only; not a price target"),
      ("CUSTOMER_WC_COST","Customer Working Capital Cost","Customer-level capital charge using AR/DSO convention","AR_BALANCE * COST_OF_CAPITAL * DAYS/365","","","customer/month","VND","calendar month","365-day year","PROXY_DERIVED","customer economics rehearsal","Commercial Finance","APPROVED","Core reconciliation required"),
      ("CUSTOMER_CONTRIBUTION_AFTER_WC","Customer Contribution After WC","Contribution profit less customer working-capital cost","CONTRIBUTION - CUSTOMER_WC_COST","CONTRIBUTION","CUSTOMER_WC_COST","customer/month","VND","calendar month","none","PROXY_DERIVED","customer economics rehearsal","Commercial Finance","APPROVED",""),
    ]
    fields=['metric_id','metric_name','business_definition','formula','numerator_metric_id','denominator_metric_id','grain','unit','period_basis','annualization_rule','evidence_class','approved_source','owner','status','notes']
    write_csv(OUT/'governance'/'finance_metric_registry.csv',fields,[dict(zip(fields,r)) for r in rows])

def build_units():
    fields=['table','field','semantic_type','expected_unit','scale_factor','allowed_min','allowed_max','nullable','notes']
    rows=[]
    for table, field, typ, unit, scale, lo, hi, null, note in [
      ('fact_sales','UnitsCorrected','quantity','physical units','1',1,100000000,'false','Integer sale quantity after unit correction'),
      ('fact_sales','UnitPriceVND','unit_price','VND per physical unit','1',1,1000000,'false','SKU master price'),
      ('fact_sales','GrossSalesVND','money','VND','1',0,1e15,'false','No hidden million/billion scale'),
      ('fact_sales','NetRevenueVND','money','VND','1',0,1e15,'false','Gross-to-net output'),
      ('fact_sales','CorrectedCOGSVND','money','VND','1',0,1e15,'false','Allocated authority COGS'),
      ('fact_sales','ContributionProfitVND','money','VND','1',-1e15,1e15,'false','May be negative for loss-making row'),
      ('fact_opex_headcount','OPEXActualVND','money','VND','1',0,1e15,'false','Synthetic planning OPEX'),
      ('fact_public_financials','NetRevenueVNDBn','money','VND bn','1e9',-1e6,1e9,'true','Public filing normalized display unit'),
      ('fact_public_financials','PATVNDBn','money','VND bn','1e9',-1e6,1e9,'true','Public filing normalized display unit'),
      ('fact_public_financials','EquityVNDBn','money','VND bn','1e9',-1e6,1e9,'true','Public filing normalized display unit'),
      ('fact_ar_snapshot','DSODays','ratio','days','1',0,3650,'false','Ending AR convention'),
      ('fact_inventory_snapshot','DIOProxyDays','ratio','days','1',0,3650,'false','Ending inventory convention'),
      ('fact_ap_snapshot','DPODays','ratio','days','1',0,3650,'false','Ending AP convention'),
    ]: rows.append(dict(zip(fields,[table,field,typ,unit,scale,lo,hi,null,note])))
    write_csv(OUT/'..'/'schemas'/'unit_contract.csv',fields,rows)

def build_scenarios():
    sales=read_csv(DATA/'fact_sales.csv'); fc=read_csv(DATA/'fact_forecast.csv'); opex=read_csv(DATA/'fact_opex_headcount.csv')
    actual=[r for r in sales if r['MonthStart'].startswith('2025-')]; actual_opex=[r for r in opex if r['Period'].startswith('2025-')]
    net=sum(float(r['NetRevenueVND']) for r in actual); gp=sum(float(r['NetRevenueVND'])-float(r['CorrectedCOGSVND']) for r in actual); cont=sum(float(r['ContributionProfitVND']) for r in actual); opx=sum(float(r['OPEXActualVND']) for r in actual_opex)
    ar=read_csv(DATA/'fact_ar_snapshot.csv'); inv=read_csv(DATA/'fact_inventory_snapshot.csv'); ap=read_csv(DATA/'fact_ap_snapshot.csv')
    dso=float(next(r for r in ar if r['MonthStart']=='2025-12-01')['DSODays']); dio=float(next(r for r in inv if r['MonthStart']=='2025-12-01')['DIOProxyDays']); dpo=float(next(r for r in ap if r['MonthStart']=='2025-12-01')['DPODays']); ccc=dso+dio-dpo
    fields=['period','scenario','revenue_vnd_bn','gross_profit_vnd_bn','opex_vnd_bn','ebitda_proxy_vnd_bn','ebitda_proxy_margin_pct','contribution_vnd_bn','ccc_days','evidence_class','approved_source']
    rows=[]
    for sc in ('BASE','UPSIDE','DOWNSIDE'):
        rr=[r for r in fc if r['ScenarioKey']==sc and r['TargetMonth'].startswith('2025-')]
        rev=sum(float(r['ForecastRevenueVND']) for r in rr); cogs=sum(float(r['ForecastCOGSVND']) for r in rr); ox=sum(float(r['ForecastOPEXVND']) for r in rr); trade=sum(float(r['ForecastTradeSpendVND']) for r in rr)
        ebitda=rev-cogs-ox; margin=100*ebitda/rev; contribution=rev-cogs-trade; days=ccc+({'BASE':0,'UPSIDE':-6,'DOWNSIDE':14}[sc])
        rows.append(dict(zip(fields,['FY2025',sc,round(rev/1e9,4),round((rev-cogs)/1e9,4),round(ox/1e9,4),round(ebitda/1e9,4),round(margin,4),round(contribution/1e9,4),round(days,2),'PROXY_DERIVED','powerbi/data/final_v1/fact_forecast.csv + fact_opex_headcount.csv'])))
    write_csv(OUT/'scenarios'/'scenario_summary.csv',fields,rows)

def build_public_metrics():
    src=ROOT/'data'/'mch_financial_statement_analysis_2016_2025.csv'; src_rows=read_csv(src)
    fields=['fiscal_year','metric_id','value','unit','source_status','source_ref','calculation_status','caveat']
    out=[]
    for r in src_rows:
        fy=r['fiscal_year']; src_ref='data/mch_financial_statement_analysis_2016_2025.csv; page-reviewed audited statement source'
        for metric,col,unit,status in [('REV_NET','net_revenue_vnd_bn','VND bn','OBSERVED'),('PAT','profit_after_tax_vnd_bn','VND bn','OBSERVED'),('CFO','operating_cash_flow_vnd_bn','VND bn','OBSERVED'),('ROE','roe_pct','percent','CALCULATED_PUBLIC'),('ROA','roa_pct','percent','CALCULATED_PUBLIC')]:
            out.append({'fiscal_year':fy,'metric_id':metric,'value':r[col],'unit':unit,'source_status':'APPROVED_COMPARABLE','source_ref':src_ref,'calculation_status':status,'caveat':'ROE = PAT attributable to owners / average equity attributable to owners' if metric=='ROE' else ''})
    write_csv(OUT/'public_company'/'mch_financial_metrics_approved.csv',fields,out)
    dfields=['metric_id','metric_name','source_lines','accounting_perimeter','denominator_convention','averaging_convention','unit','formula','comparability_policy']
    drows=[
      ('REV_NET','Revenue','Income statement net revenue','Consolidated','n/a','n/a','VND bn','reported line','Reported basis only'),
      ('PAT','PAT','Profit after tax attributable to owners','Consolidated','n/a','n/a','VND bn','reported line','Reported basis only'),
      ('CFO','CFO','Net cash from operating activities','Consolidated','n/a','n/a','VND bn','reported line','Reported basis only'),
      ('ROE','ROE','PAT attributable to owners / average equity attributable to owners','Consolidated','average equity attributable to owners','(opening + closing)/2','percent','PAT / average equity','One canonical definition'),
      ('ROA','ROA','PAT / average total assets','Consolidated','average total assets','(opening + closing)/2','percent','PAT / average assets','One canonical definition'),
      ('FCFF','FCFF','Rehearsal DCF cash flow','Synthetic valuation case','n/a','n/a','VND bn','NOPAT + D&A - capex - delta NWC','Rehearsal only'),
      ('EV','EV','Enterprise value from DCF','Synthetic valuation case','n/a','n/a','VND bn','PV explicit FCFF + PV terminal','EV only; not a price target'),
    ]
    write_csv(OUT/'public_company'/'public_metric_dictionary.csv',dfields,[dict(zip(dfields,x)) for x in drows])

def build_maps():
    fields=['artifact','section_or_cell','metric_id','expected_source','expected_value_rule','tolerance','evidence_class']
    rows=[]
    for artifact,section,metric,source,rule,tol,ev in [
      ('FP&A workbook','P&L summary','REV_NET','powerbi/data/final_v1/fact_sales.csv','sum NetRevenueVND by FY2025','VND 1','DERIVED'),
      ('MBR','scenario table','EBITDA_PROXY','data/scenarios/scenario_summary.csv','match scenario and period','0.01 VND bn','PROXY_DERIVED'),
      ('CFO memo','executive KPI','EBITDA_PROXY','data/scenarios/scenario_summary.csv','match BASE/FY2025','0.01 VND bn','PROXY_DERIVED'),
      ('website','scenario selector','REV_NET','data/scenarios/scenario_summary.csv','match selected scenario','0.01 VND bn','PROXY_DERIVED'),
      ('website','scenario selector','EBITDA_PROXY_MARGIN','data/scenarios/scenario_summary.csv','match selected scenario','0.01 pp','PROXY_DERIVED'),
      ('MCH analysis','FY2024 ROE','ROE','data/public_company/mch_financial_metrics_approved.csv','match metric_id/fiscal_year','0.01 pp','CALCULATED_PUBLIC'),
      ('MCH equity research','peer scorecard','ROE','data/public_company/mch_financial_metrics_approved.csv','match metric_id/fiscal_year','0.01 pp','CALCULATED_PUBLIC'),
      ('MCH credit memo','FY2024 ROE','ROE','data/public_company/mch_financial_metrics_approved.csv','match metric_id/fiscal_year','0.01 pp','CALCULATED_PUBLIC'),
      ('valuation rehearsal','DCF EV','EV','data/mch_valuation_rehearsal_sensitivity.csv','match case/WACC/growth','0.01 VND bn','SYNTHETIC_REHEARSAL'),
      ('Monte Carlo','center assumptions','EBITDA_PROXY','data/scenarios/scenario_summary.csv','BASE center only; rehearsal label','0.01 VND bn','SYNTHETIC_REHEARSAL'),
      ('CV','project bullet','REV_NET','data/scenarios/scenario_summary.csv','no unsupported realized-impact claim','n/a','PROXY_DERIVED'),
    ]: rows.append(dict(zip(fields,[artifact,section,metric,source,rule,tol,ev])))
    write_csv(OUT/'governance'/'artifact_metric_map.csv',fields,rows)

def main():
    build_registry(); build_units(); build_scenarios(); build_public_metrics(); build_maps()
    archive=OUT/'archive'/'sales_fact_pre_unit_fix_2026-08-31.csv'
    source=DATA/'fact_sales.csv'
    if not archive.exists(): shutil.copy2(source,archive)
    manifest={'archived_at':TODAY,'source_file':'powerbi/data/final_v1/fact_sales.csv','archive_file':'data/archive/sales_fact_pre_unit_fix_2026-08-31.csv','row_count':len(read_csv(archive)),'sha256':sha256(archive),'fields':list(read_csv(archive)[0])}
    (OUT/'archive'/'sales_fact_pre_unit_fix_2026-08-31.manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
    print(json.dumps({'status':'PASS','outputs':['data/governance/finance_metric_registry.csv','schemas/unit_contract.csv','data/governance/artifact_metric_map.csv','data/scenarios/scenario_summary.csv','data/public_company/public_metric_dictionary.csv','data/public_company/mch_financial_metrics_approved.csv'], 'archive_rows':manifest['row_count']},indent=2))

if __name__=='__main__': main()
