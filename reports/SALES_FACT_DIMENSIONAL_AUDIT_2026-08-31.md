# Sales_Fact Dimensional & Economic Audit — 2026-08-31

**Status:** `PASS`  
**Input:** `powerbi/data/final_v1/fact_sales.csv`  
**Rows:** 2160  
**Tolerance:** VND 1 for monetary identities

| ID | Check | Status | Detail |
|---|---|---|---|
| SF-01 | Gross Sales = Units × Unit Price | **PASS** | bad_rows=0; tolerance=VND 1 |
| SF-02 | Net Revenue <= Gross Sales and gross-to-net identity | **PASS** | bad_rows=0 |
| SF-03 | Non-negative sale quantities and money fields | **PASS** | bad_rows=0 |
| SF-04 | COGS <= Net Revenue unless loss-making row is documented | **PASS** | bad_rows=0 |
| SF-05 | Units and unit price are positive on sale rows | **PASS** | bad_rows=0 |
| SF-06 | Gross margin lies in [0,100%] | **PASS** | bad_rows=0 |
| SF-07 | All SKU keys resolve to product master | **PASS** | orphan_rows=0 |
| SF-08 | LineID unique | **PASS** | rows=2160 |

## Distribution summary

- Implied units (gross / unit price): p50 **3000.00**, min **1000.00**, max **12000.00**.
- Corrected COGS per unit: p50 **VND 17465.14**, min **VND 13367.92**, max **VND 20668.06**.
- Gross margin: p50 **35.39%**, min **0.74%**, max **59.96%**.
- Rows failing gross-sales identity: **0 / 2160 (0.000%)**.
- Mixed money scales: **not detected**; all fact money columns are VND with explicit scale factor 1.

## Top anomaly review (50 rows; ranked by absolute identity gap)

| LineID | SKU | Channel | Month | Identity gap (VND) | Gross margin | COGS/unit |
|---|---|---|---|---:|---:|---:|
| VN000000001 | SKU001 | CH01 | 2023-01-01 | 0.00 | 41.48% | 17306.43 |
| VN000000002 | SKU002 | CH01 | 2023-01-01 | 0.00 | 47.33% | 18088.01 |
| VN000000003 | SKU003 | CH01 | 2023-01-01 | 0.00 | 44.41% | 16971.47 |
| VN000000004 | SKU004 | CH01 | 2023-01-01 | 0.00 | 35.63% | 17194.78 |
| VN000000005 | SKU005 | CH01 | 2023-01-01 | 0.00 | 32.70% | 17334.34 |
| VN000000006 | SKU006 | CH01 | 2023-01-01 | 0.00 | 38.55% | 17585.57 |
| VN000000007 | SKU007 | CH01 | 2023-01-01 | 0.00 | 19.54% | 17655.35 |
| VN000000008 | SKU008 | CH01 | 2023-01-01 | 0.00 | 23.93% | 18143.84 |
| VN000000009 | SKU009 | CH01 | 2023-01-01 | 0.00 | 15.15% | 16999.38 |
| VN000000010 | SKU010 | CH01 | 2023-01-01 | 0.00 | 26.85% | 16748.16 |
| VN000000011 | SKU011 | CH01 | 2023-01-01 | 0.00 | 56.11% | 14654.64 |
| VN000000012 | SKU012 | CH01 | 2023-01-01 | 0.00 | 42.94% | 15785.14 |
| VN000000013 | SKU001 | CH02 | 2023-01-01 | 0.00 | 41.35% | 17343.86 |
| VN000000014 | SKU002 | CH02 | 2023-01-01 | 0.00 | 47.22% | 18127.13 |
| VN000000015 | SKU003 | CH02 | 2023-01-01 | 0.00 | 44.29% | 17008.17 |
| VN000000016 | SKU004 | CH02 | 2023-01-01 | 0.00 | 35.49% | 17231.97 |
| VN000000017 | SKU005 | CH02 | 2023-01-01 | 0.00 | 32.56% | 17371.84 |
| VN000000018 | SKU006 | CH02 | 2023-01-01 | 0.00 | 38.42% | 17623.60 |
| VN000000019 | SKU007 | CH02 | 2023-01-01 | 0.00 | 19.36% | 17693.54 |
| VN000000020 | SKU008 | CH02 | 2023-01-01 | 0.00 | 23.76% | 18183.08 |
| VN000000021 | SKU009 | CH02 | 2023-01-01 | 0.00 | 14.96% | 17036.15 |
| VN000000022 | SKU010 | CH02 | 2023-01-01 | 0.00 | 26.69% | 16784.38 |
| VN000000023 | SKU011 | CH02 | 2023-01-01 | 0.00 | 56.02% | 14686.33 |
| VN000000024 | SKU012 | CH02 | 2023-01-01 | 0.00 | 42.82% | 15819.28 |
| VN000000025 | SKU001 | CH03 | 2023-01-01 | 0.00 | 34.05% | 18993.17 |
| VN000000026 | SKU002 | CH03 | 2023-01-01 | 0.00 | 40.64% | 19850.93 |
| VN000000027 | SKU003 | CH03 | 2023-01-01 | 0.00 | 37.35% | 18625.56 |
| VN000000028 | SKU004 | CH03 | 2023-01-01 | 0.00 | 27.45% | 18870.64 |
| VN000000029 | SKU005 | CH03 | 2023-01-01 | 0.00 | 24.16% | 19023.81 |
| VN000000030 | SKU006 | CH03 | 2023-01-01 | 0.00 | 30.75% | 19299.52 |
| VN000000031 | SKU007 | CH03 | 2023-01-01 | 0.00 | 9.32% | 19376.10 |
| VN000000032 | SKU008 | CH03 | 2023-01-01 | 0.00 | 14.26% | 19912.20 |
| VN000000033 | SKU009 | CH03 | 2023-01-01 | 0.00 | 4.37% | 18656.20 |
| VN000000034 | SKU010 | CH03 | 2023-01-01 | 0.00 | 17.56% | 18380.49 |
| VN000000035 | SKU011 | CH03 | 2023-01-01 | 0.00 | 50.54% | 16082.93 |
| VN000000036 | SKU012 | CH03 | 2023-01-01 | 0.00 | 35.70% | 17323.61 |
| VN000000037 | SKU001 | CH04 | 2023-01-01 | 0.00 | 39.55% | 17652.43 |
| VN000000038 | SKU002 | CH04 | 2023-01-01 | 0.00 | 45.60% | 18449.63 |
| VN000000039 | SKU003 | CH04 | 2023-01-01 | 0.00 | 42.57% | 17310.77 |
| VN000000040 | SKU004 | CH04 | 2023-01-01 | 0.00 | 33.51% | 17538.54 |
| VN000000041 | SKU005 | CH04 | 2023-01-01 | 0.00 | 30.48% | 17680.90 |
| VN000000042 | SKU006 | CH04 | 2023-01-01 | 0.00 | 36.53% | 17937.14 |
| VN000000043 | SKU007 | CH04 | 2023-01-01 | 0.00 | 16.88% | 18008.32 |
| VN000000044 | SKU008 | CH04 | 2023-01-01 | 0.00 | 21.42% | 18506.58 |
| VN000000045 | SKU009 | CH04 | 2023-01-01 | 0.00 | 12.35% | 17339.24 |
| VN000000046 | SKU010 | CH04 | 2023-01-01 | 0.00 | 24.44% | 17082.99 |
| VN000000047 | SKU011 | CH04 | 2023-01-01 | 0.00 | 54.66% | 14947.62 |
| VN000000048 | SKU012 | CH04 | 2023-01-01 | 0.00 | 41.06% | 16100.72 |
| VN000000049 | SKU001 | CH05 | 2023-01-01 | 0.00 | 39.24% | 17969.76 |
| VN000000050 | SKU002 | CH05 | 2023-01-01 | 0.00 | 45.31% | 18781.30 |

## Correction decision

The canonical correction is **Option 3 — rebuild the source ledger from generator assumptions**. `UnitsCorrected` is recalculated as `GrossSalesVND / UnitPriceVND`, COGS is allocated from the authoritative month × channel COGS bucket, and no row-specific patches are used. The pre-fix extract is preserved at `data/archive/sales_fact_pre_unit_fix_2026-08-31.csv`.

All operating values remain synthetic/rehearsal evidence; this audit proves arithmetic integrity, not real-company performance.
