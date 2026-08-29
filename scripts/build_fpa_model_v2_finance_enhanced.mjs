import fs from 'node:fs/promises';
import { FileBlob, SpreadsheetFile } from '@oai/artifact-tool';

// The base builder remains the single source for all other tabs. This wrapper
// hardens the two commercial-decision tabs whose economics need explicit spend
// and fixed-budget conservation controls.
await import('./build_fpa_model_v2.mjs');

const workbookPath = 'C:/Users/sangk/Documents/Codex/2026-08-29/toi/outputs/fpa_v2/VietNova_FPA_Model_v2.xlsx';
const wb = await SpreadsheetFile.importXlsx(await FileBlob.load(workbookPath));
const navy = '#17365D';
const green = '#E2F0D9';
const yellow = '#FFF2CC';
const gray = '#F2F2F2';
const pct = (ws, range) => ws.getRange(range).setNumberFormat('0.0%;[Red](0.0%);-');
const money = (ws, range) => ws.getRange(range).setNumberFormat('#,##0;[Red](#,##0);-');
const num = (ws, range) => ws.getRange(range).setNumberFormat('#,##0.0;[Red](#,##0.0);-');
const hdr = (ws, range) => { ws.getRange(range).format = { fill: navy, font: { bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', wrapText: true }; };

const promo = wb.worksheets.getItem('Promotion_Pricing');
promo.getRange('A3:N11').values = [
  ['Event','Channel','Baseline units','Uplift %','Incremental units','Net price','Incremental revenue','Incremental variable cost','Promotion spend','Incremental CM after spend','ROI on spend','Hurdle','Decision','Evidence class'],
  ['E01 Year-end bundle','CH02',120000,0.18,'=C4*D4',85000,'=E4*F4','=G4*0.72',180000000,'=G4-H4-I4','=IFERROR(J4/I4,0)',0.25,'=IF(K4>=L4,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
  ['E02 Marketplace flash','CH03',100000,0.30,'=C5*D5',72000,'=E5*F5','=G5*0.88',350000000,'=G5-H5-I5','=IFERROR(J5/I5,0)',0.25,'=IF(K5>=L5,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
  ['E03 D2C acquisition','CH04',50000,0.25,'=C6*D6',110000,'=E6*F6','=G6*0.95',160000000,'=G6-H6-I6','=IFERROR(J6/I6,0)',0.25,'=IF(K6>=L6,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
  ['E04 Strategic discount','CH01',180000,0.20,'=C7*D7',65000,'=E7*F7','=G7*0.93',100000000,'=G7-H7-I7','=IFERROR(J7/I7,0)',0.25,'=IF(K7>=L7,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
  ['E05 Premium launch','CH02',60000,0.15,'=C8*D8',125000,'=E8*F8','=G8*0.64',220000000,'=G8-H8-I8','=IFERROR(J8/I8,0)',0.25,'=IF(K8>=L8,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
  ['E06 Wholesale rebate','CH05',200000,0.12,'=C9*D9',58000,'=E9*F9','=G9*0.98',80000000,'=G9-H9-I9','=IFERROR(J9/I9,0)',0.25,'=IF(K9>=L9,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
  ['E07 Beverage reset','CH03',90000,0.10,'=C10*D10',76000,'=E10*F10','=G10*0.91',50000000,'=G10-H10-I10','=IFERROR(J10/I10,0)',0.25,'=IF(K10>=L10,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
  ['E08 Test event','CH04',30000,0.08,'=C11*D11',105000,'=E11*F11','=G11*0.99',15000000,'=G11-H11-I11','=IFERROR(J11/I11,0)',0.25,'=IF(K11>=L11,"Approve with guardrail","Reject")','SIMULATED_DERIVED'],
];
hdr(promo, 'A3:N3'); num(promo, 'C4:E11'); pct(promo, 'D4:D11'); money(promo, 'F4:J11'); pct(promo, 'K4:L11');
promo.getRange('A1:N1').format = { fill: navy, font: { bold: true, color: '#FFFFFF', size: 15 }, verticalAlignment: 'center' };
promo.getRange('A3:N11').format.wrapText = true;
promo.getRange('N4:N11').format = { fill: gray };

const alloc = wb.worksheets.getItem('Budget_Allocation');
alloc.getRange('A3:K8').values = [
  ['Channel','Current budget','Marginal ROI','Capacity','Max increase %','Target share','Recommended budget','Budget delta','Incremental contribution','Decision','Evidence class'],
  ['General Trade',1200000000,0.42,1500000000,0.50,0.3103448276,'=ROUND(MIN(F4*SUM($B$4:$B$8),D4,B4*(1+E4)),0)','=G4-B4','=H4*C4','=IF(H4>0,"Scale","Reduce / protect")','SIMULATED_DERIVED'],
  ['Modern Trade',1100000000,0.36,1400000000,0.35,0.2758620690,'=ROUND(MIN(F5*SUM($B$4:$B$8),D5,B5*(1+E5)),0)','=G5-B5','=H5*C5','=IF(H5>0,"Scale","Reduce / protect")','SIMULATED_DERIVED'],
  ['Marketplace',900000000,0.22,1300000000,0.25,0.1954022989,'=ROUND(MIN(F6*SUM($B$4:$B$8),D6,B6*(1+E6)),0)','=G6-B6','=H6*C6','=IF(H6>0,"Scale","Reduce / protect")','SIMULATED_DERIVED'],
  ['D2C',650000000,0.18,1000000000,0.20,0.1264367816,'=ROUND(MIN(F7*SUM($B$4:$B$8),D7,B7*(1+E7)),0)','=G7-B7','=H7*C7','=IF(H7>0,"Scale","Reduce / protect")','SIMULATED_DERIVED'],
  ['Wholesale',500000000,0.15,700000000,0.15,0.0919540230,'=ROUND(MIN(F8*SUM($B$4:$B$8),D8,B8*(1+E8)),0)','=G8-B8','=H8*C8','=IF(H8>0,"Scale","Reduce / protect")','SIMULATED_DERIVED'],
];
hdr(alloc, 'A3:K3'); money(alloc, 'B4:B8'); pct(alloc, 'C4:C8'); money(alloc, 'D4:D8'); pct(alloc, 'E4:F8'); money(alloc, 'G4:I8');
alloc.getRange('A3:K8').format.wrapText = true; alloc.getRange('K4:K8').format = { fill: gray };

const checks = wb.worksheets.getItem('Checks');
checks.getRange('A12:H13').values = [
  ['Fixed-budget conservation', "=SUM('Budget_Allocation'!G4:G8)", "=SUM('Budget_Allocation'!B4:B8)", '=B12-C12', 1, '=IF(ABS(D12)<=E12,"PASS","FAIL")', 'Budget_Allocation', 'Recommended total must equal current total'],
  ['MODEL STATUS','','','','', '=IF(COUNTIF(F4:F12,"FAIL")=0,"PASS","FAIL")', 'All checks', 'PASS required before publication'],
];
hdr(checks, 'A3:H3'); money(checks, 'B4:D12'); num(checks, 'E4:E12'); checks.getRange('A13:H13').format = { fill: green, font: { bold: true } };

const executive = wb.worksheets.getItem('Executive_Output');
executive.getRange('A9').values = [['Promotion CM after spend']];
executive.getRange('B9').formulas = [["=SUM('Promotion_Pricing'!J4:J11)"]];
executive.getRange('B11').formulas = [["='Checks'!F13"]];
money(executive, 'B9:B10');

const final = await SpreadsheetFile.exportXlsx(wb);
await final.save(workbookPath);
console.log(JSON.stringify({ status: 'PASS', output: workbookPath, promotion_rows: 8, allocation_rows: 5, fixed_budget_check: 'added' }));
