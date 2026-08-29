import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "work";
const workbook = Workbook.create();
const instructions = workbook.worksheets.add("Instructions");
const input = workbook.worksheets.add("Forecast_Snapshot_Input");
const output = workbook.worksheets.add("Backtest_Output");

instructions.getRange("A1:F1").merge();
instructions.getRange("A1").values = [["Forecast Snapshot Capture & Bias/WAPE Backtest"]];
instructions.getRange("A3:B11").values = [
  ["Purpose", "Capture frozen forecast snapshots before actual close and evaluate Bias/WAPE without future leakage."],
  ["Evidence class", "SIMULATED unit-test rows are included only to demonstrate the template; replace them with frozen snapshots."],
  ["Input grain", "One row per forecast version × target month × company × brand × channel."],
  ["Freeze rule", "Never overwrite a frozen version; create a new Forecast_Version ID."],
  ["Eligibility", "Actual_Available_Date must be on or before As_Of_Date; forecast creation must precede actual availability."],
  ["Bias", "(Sum Forecast − Sum Actual) / Sum Actual; positive means over-forecasting."],
  ["WAPE", "Sum absolute error / absolute sum actual; lower is better."],
  ["Release gate", "Do not publish live Bias/WAPE until real pre-close snapshots populate the input tab."],
  ["Remote archive", "GitHub and Google Drive are authoritative; local workbook is staging only and must be deleted after import."],
];
instructions.getRange("A13:F16").values = [
  ["Workflow", "1. Paste frozen snapshots", "2. Set As_Of_Date", "3. Review eligibility", "4. Review Backtest_Output", "5. Archive remote"],
  ["Required columns", "forecast_version", "forecast_created_date", "target_month", "company / brand / channel", "forecast + actual + availability date"],
  ["Important", "Rows marked FUTURE_LEAKAGE or NOT_ELIGIBLE are excluded", "Do not filter them away", "Fix source timing", "Document owner", "Retest"],
  ["Source", "compute_forecast_accuracy.mjs", "FORECAST_ACCURACY_BACKTEST.md", "QA matrix", "Validation report", "Drive archive"],
];

input.getRange("A1:M1").values = [["Forecast_Version","Forecast_Created_Date","Target_Month","Company","Brand","Channel","Forecast_Revenue_VND","Actual_Revenue_VND","Actual_Available_Date","As_Of_Date","Eligibility_Status","Error_VND","Abs_Error_VND"]];
input.getRange("A2:J5").values = [
  ["FE-2025-01", new Date("2024-12-15"), "2025-01", "VietNova", "NovaDaily", "Marketplace", 110, 100, new Date("2025-02-10"), new Date("2025-03-31")],
  ["FE-2025-01", new Date("2024-12-15"), "2025-01", "VietNova", "NovaDaily", "Marketplace", 90, 100, new Date("2025-02-10"), new Date("2025-03-31")],
  ["FE-2025-02", new Date("2025-01-20"), "2025-02", "VietNova", "NovaDaily", "Marketplace", 120, 100, new Date("2025-03-10"), new Date("2025-03-31")],
  ["FE-2025-03", new Date("2025-04-01"), "2025-03", "VietNova", "NovaDaily", "Marketplace", 130, 100, new Date("2025-03-10"), new Date("2025-03-31")],
];
input.getRange("K2").formulas = [["=IF(A2=\"\",\"\",IF(I2>J2,\"NOT_ELIGIBLE\",IF(B2>I2,\"FUTURE_LEAKAGE\",\"ELIGIBLE\")))"]];
input.getRange("K2:K250").fillDown();
input.getRange("L2").formulas = [["=IF(A2=\"\",\"\",G2-H2)"]]; input.getRange("L2:L250").fillDown();
input.getRange("M2").formulas = [["=IF(A2=\"\",\"\",ABS(L2))"]]; input.getRange("M2:M250").fillDown();

output.getRange("A1:K1").values = [["Forecast_Version","Company","Brand","Channel","Eligible_Rows","Forecast_VND","Actual_VND","Bias","WAPE","As_Of_Date","Release_Status"]];
output.getRange("A2:D3").values = [
  ["FE-2025-01", "VietNova", "NovaDaily", "Marketplace"],
  ["FE-2025-02", "VietNova", "NovaDaily", "Marketplace"],
];
output.getRange("E2").formulas = [["=IF(A2=\"\",\"\",COUNTIFS(Forecast_Snapshot_Input!$A$2:$A$250,A2,Forecast_Snapshot_Input!$D$2:$D$250,B2,Forecast_Snapshot_Input!$E$2:$E$250,C2,Forecast_Snapshot_Input!$F$2:$F$250,D2,Forecast_Snapshot_Input!$K$2:$K$250,\"ELIGIBLE\"))"]]; output.getRange("E2:E20").fillDown();
output.getRange("F2").formulas = [["=IF(A2=\"\",\"\",SUMIFS(Forecast_Snapshot_Input!$G$2:$G$250,Forecast_Snapshot_Input!$A$2:$A$250,A2,Forecast_Snapshot_Input!$D$2:$D$250,B2,Forecast_Snapshot_Input!$E$2:$E$250,C2,Forecast_Snapshot_Input!$F$2:$F$250,D2,Forecast_Snapshot_Input!$K$2:$K$250,\"ELIGIBLE\"))"]]; output.getRange("F2:F20").fillDown();
output.getRange("G2").formulas = [["=IF(A2=\"\",\"\",SUMIFS(Forecast_Snapshot_Input!$H$2:$H$250,Forecast_Snapshot_Input!$A$2:$A$250,A2,Forecast_Snapshot_Input!$D$2:$D$250,B2,Forecast_Snapshot_Input!$E$2:$E$250,C2,Forecast_Snapshot_Input!$F$2:$F$250,D2,Forecast_Snapshot_Input!$K$2:$K$250,\"ELIGIBLE\"))"]]; output.getRange("G2:G20").fillDown();
output.getRange("H2").formulas = [["=IF(A2=\"\",\"\",IFERROR((F2-G2)/G2,\"\"))"]]; output.getRange("H2:H20").fillDown();
output.getRange("I2").formulas = [["=IF(A2=\"\",\"\",IFERROR(SUMIFS(Forecast_Snapshot_Input!$M$2:$M$250,Forecast_Snapshot_Input!$A$2:$A$250,A2,Forecast_Snapshot_Input!$D$2:$D$250,B2,Forecast_Snapshot_Input!$E$2:$E$250,C2,Forecast_Snapshot_Input!$F$2:$F$250,D2,Forecast_Snapshot_Input!$K$2:$K$250,\"ELIGIBLE\")/ABS(G2),\"\"))"]]; output.getRange("I2:I20").fillDown();
output.getRange("J2").formulas = [["=IF(A2=\"\",\"\",MAXIFS(Forecast_Snapshot_Input!$J$2:$J$250,Forecast_Snapshot_Input!$A$2:$A$250,A2,Forecast_Snapshot_Input!$D$2:$D$250,B2,Forecast_Snapshot_Input!$E$2:$E$250,C2,Forecast_Snapshot_Input!$F$2:$F$250,D2))"]]; output.getRange("J2:J20").fillDown();
output.getRange("K2").formulas = [["=IF(A2=\"\",\"\",IF(E2=0,\"WAITING_FOR_SNAPSHOT\",IF(COUNTIFS(Forecast_Snapshot_Input!$A$2:$A$250,A2,Forecast_Snapshot_Input!$K$2:$K$250,\"FUTURE_LEAKAGE\")>0,\"REVIEW\",\"READY\")))"]]; output.getRange("K2:K20").fillDown();

for (const sheet of [instructions, input, output]) { sheet.showGridLines = false; sheet.getUsedRange().format.wrapText = true; sheet.getUsedRange().format.font = { name: "Aptos", size: 10, color: "#1F2937" }; }
instructions.getRange("A1:F1").format = { fill: "#17365D", font: { bold: true, color: "#FFFFFF", size: 14 }, horizontalAlignment: "center" };
instructions.getRange("A3:A11").format = { fill: "#D9EAF7", font: { bold: true, color: "#17365D" } };
instructions.getRange("A13:F13").format = { fill: "#5B9BD5", font: { bold: true, color: "#FFFFFF" } };
input.getRange("A1:M1").format = { fill: "#5B9BD5", font: { bold: true, color: "#FFFFFF" } };
output.getRange("A1:K1").format = { fill: "#5B9BD5", font: { bold: true, color: "#FFFFFF" } };
input.getRange("B2:B1000").format.numberFormat = "yyyy-mm-dd"; input.getRange("I2:J1000").format.numberFormat = "yyyy-mm-dd";
input.getRange("G2:H1000").format.numberFormat = "#,##0.0"; input.getRange("L2:M1000").format.numberFormat = "#,##0.0";
output.getRange("F2:G20").format.numberFormat = "#,##0.0"; output.getRange("H2:I20").format.numberFormat = "0.0%"; output.getRange("J2:J20").format.numberFormat = "yyyy-mm-dd";
for (const sheet of [instructions, input, output]) { sheet.freezePanes.freezeRows(1); sheet.getUsedRange().format.borders = { preset: "all", style: "thin", color: "#D9E2F3" }; }
instructions.getRange("A:A").format.columnWidth = 22; instructions.getRange("B:F").format.columnWidth = 28;
input.getRange("A:M").format.columnWidth = 18; output.getRange("A:K").format.columnWidth = 19;

const errorScan = await workbook.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "forecast capture formula error scan" });
console.log("ERROR_SCAN\n" + errorScan.ndjson);
const check = await workbook.inspect({ kind: "region", sheetId: "Backtest_Output", range: "A1:K5", include: "values,formulas", maxChars: 6000, tableMaxRows: 5, tableMaxCols: 11 });
console.log("OUTPUT_CHECK\n" + check.ndjson);
const preview = await workbook.render({ sheetName: "Backtest_Output", range: "A1:K8", scale: 1.5, format: "png" });
await fs.writeFile(`${outputDir}/forecast_capture_preview.png`, new Uint8Array(await preview.arrayBuffer()));
for (const [name, file, range] of [["Instructions", "forecast_capture_instructions.png", "A1:F16"], ["Forecast_Snapshot_Input", "forecast_capture_input.png", "A1:M10"]]) {
  const img = await workbook.render({ sheetName: name, range, scale: 1.25, format: "png" });
  await fs.writeFile(`${outputDir}/${file}`, new Uint8Array(await img.arrayBuffer()));
}
const xlsx = await SpreadsheetFile.exportXlsx(workbook); await xlsx.save(`${outputDir}/forecast_capture_template.xlsx`);
console.log("EXPORTED work/forecast_capture_template.xlsx");

