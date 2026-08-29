#!/usr/bin/env python3
"""Validate VietNova generated CSVs using finance control equations."""
from __future__ import annotations
import argparse, csv, json
from collections import defaultdict
from pathlib import Path

def read(path):
    with path.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))

def n(row, key):
    return float(row.get(key, 0) or 0)

def main():
    ap=argparse.ArgumentParser(); ap.add_argument("--input-dir",type=Path,required=True); args=ap.parse_args()
    checks=[]; errors=[]
    sales=read(args.input_dir/"sales_fact.csv")
    for i,r in enumerate(sales,1):
        checks.append("sales_net")
        if abs(n(r,"net_sales")-(n(r,"gross_sales")-n(r,"discount")-n(r,"returns")))>0.5: errors.append(f"sales_net row {i}")
        if abs(n(r,"contribution_margin")-(n(r,"net_sales")-n(r,"cogs")-n(r,"freight")-n(r,"payment_fee")-n(r,"commission")-n(r,"trade_spend")))>0.5: errors.append(f"contribution_margin row {i}")
    for table,keys in [("inventory.csv",("warehouse_id","sku_id")),("receivables.csv",("customer_id",)),("payables.csv",("supplier_id",)),("debt.csv",("facility_id",))]:
        rows=read(args.input_dir/table); prior={}
        for i,r in enumerate(rows,1):
            k=tuple(r[x] for x in keys); opening=n(r,{"inventory.csv":"opening_units","receivables.csv":"opening_ar","payables.csv":"opening_ap","debt.csv":"opening_balance"}[table])
            if k in prior and abs(opening-prior[k])>0.5: errors.append(f"{table} opening continuity row {i}")
            if table=="inventory.csv": close=opening+n(r,"receipts_units")-n(r,"sales_units")-n(r,"expiry_writeoff")/max(n(r,"unit_cost"),1)
            elif table=="receivables.csv": close=opening+n(r,"invoiced")-n(r,"cash_collected")-n(r,"credit_note")
            elif table=="payables.csv": close=opening+n(r,"purchases")-n(r,"cash_paid")
            else: close=opening+n(r,"drawdown")-n(r,"repayment")
            if abs(close-n(r,{"inventory.csv":"closing_units","receivables.csv":"closing_ar","payables.csv":"closing_ap","debt.csv":"closing_balance"}[table]))>1.5: errors.append(f"{table} rollforward row {i}")
            prior[k]=n(r,{"inventory.csv":"closing_units","receivables.csv":"closing_ar","payables.csv":"closing_ap","debt.csv":"closing_balance"}[table])
            checks.append(table)
    manifest=json.loads((args.input_dir/"manifest.json").read_text(encoding="utf-8"))
    if len(sales)!=manifest["sales_fact_rows"]: errors.append("manifest sales_fact_rows mismatch")
    result={"dataset_version":manifest["dataset_version"],"seed":manifest["seed"],"sales_rows":len(sales),"checks":len(checks),"error_count":len(errors),"errors":errors[:100],"status":"PASS" if not errors else "FAIL"}
    print(json.dumps(result,indent=2))
    return 0 if not errors else 1
if __name__=="__main__": raise SystemExit(main())
