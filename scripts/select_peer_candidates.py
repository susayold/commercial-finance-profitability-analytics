#!/usr/bin/env python3
"""Select canonical peer-panel candidates from OCR/text extraction output.

This step never hides ambiguity: selected rows remain needs_human_review and a
review queue records missing/duplicate/incomplete metrics.
"""
from __future__ import annotations
import argparse, csv, json
from collections import defaultdict
from pathlib import Path

CORE = ["revenue","gross_profit","operating_profit","npat","total_assets","cash","inventory","trade_receivables","trade_payables","operating_cash_flow","total_debt","capex"]

def num(row,key):
    try: return float(row.get(key) or 0)
    except (TypeError,ValueError): return 0.0

def score(metric,row):
    page=int(row.get("source_page") or 999)
    label=row.get("metric_original_label","").lower()
    if metric=="revenue":
        return (0 if "net revenue" in label else 1 if "net sales" in label else 2, abs(page-9))
    if metric in {"gross_profit","npat"}:
        return (0 if label.strip() in {"gross profit","net profit after tax"} else 1, abs(page-(10 if metric=="npat" else 9)))
    if metric=="operating_profit":
        return (0 if page in (9,10) else 1, abs(page-9))
    if metric in {"cash","inventory","total_assets","trade_receivables","trade_payables"}:
        return (0 if page<=8 else 1, page)
    if metric=="operating_cash_flow":
        return (0 if "operating activities" in label else 1, abs(page-11))
    if metric=="capex":
        return (0 if "additions to fixed assets" in label else 1, abs(page-12))
    if metric=="total_debt":
        return (0 if "borrowings" in label and page<=8 else 1, page)
    return (1,page)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--input",type=Path,required=True); ap.add_argument("--output",type=Path,required=True); ap.add_argument("--queue",type=Path,required=True); args=ap.parse_args()
    with args.input.open(encoding="utf-8",newline="") as f: rows=list(csv.DictReader(f))
    groups=defaultdict(list)
    for row in rows: groups[(row.get("ticker"),row.get("report_year"),row.get("period_type"),row.get("scope"),row.get("metric"))].append(row)
    selected=[]; queue=[]
    years=sorted({(r.get("ticker"),r.get("report_year"),r.get("period_type"),r.get("scope")) for r in rows})
    for ticker,year,period,scope in years:
        for metric in CORE:
            candidates=groups.get((ticker,year,period,scope,metric),[])
            if metric=="total_debt":
                debt=[r for r in candidates if "borrowings" in r.get("metric_original_label","").lower() and int(r.get("source_page") or 999)<=8]
                if len(debt)>=2:
                    base=sorted(debt,key=lambda r:int(r.get("source_page") or 999))[0].copy()
                    base["value"]=str(sum(num(r,"value") for r in debt))
                    base["comparative_value"]=str(sum(num(r,"comparative_value") for r in debt))
                    base["metric_original_label"]="Calculated total debt = short-term borrowings + long-term borrowings"
                    base["reported_or_calculated"]="calculated"
                    base["review_status"]="needs_human_review"
                    base["note"]="OCR components aggregated; verify both borrowings rows against balance sheet."
                    selected.append(base); queue.append({"ticker":ticker,"report_year":year,"metric":metric,"status":"candidate_aggregated","candidate_count":len(debt)})
                    continue
            if not candidates:
                queue.append({"ticker":ticker,"report_year":year,"metric":metric,"status":"missing_candidate","candidate_count":0}); continue
            ordered=sorted(candidates,key=lambda r:score(metric,r))
            chosen=ordered[0].copy(); chosen["review_status"]="needs_human_review"
            chosen["note"]=(chosen.get("note","")+" Canonical candidate selected by metric/page rule; independent review required.").strip()
            selected.append(chosen)
            queue.append({"ticker":ticker,"report_year":year,"metric":metric,"status":"candidate_selected","candidate_count":len(candidates)})
    args.output.parent.mkdir(parents=True,exist_ok=True); args.queue.parent.mkdir(parents=True,exist_ok=True)
    fields=list(selected[0].keys()) if selected else []
    with args.output.open("w",encoding="utf-8",newline="") as f:
        w=csv.DictWriter(f,fieldnames=fields); w.writeheader(); w.writerows(selected)
    with args.queue.open("w",encoding="utf-8",newline="") as f:
        fields=["ticker","report_year","metric","status","candidate_count"]; w=csv.DictWriter(f,fieldnames=fields); w.writeheader(); w.writerows(queue)
    summary={"input_rows":len(rows),"selected_rows":len(selected),"queue_rows":len(queue),"missing_count":sum(x["status"]=="missing_candidate" for x in queue),"status":"REVIEW_REQUIRED"}
    print(json.dumps(summary,indent=2))
if __name__=="__main__": main()
