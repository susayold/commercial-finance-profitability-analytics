import fs from "node:fs";

const [inputPath = "data/vnm_public_guidance_proxy_2018_2025.csv"] = process.argv.slice(2);
const lines = fs.readFileSync(inputPath, "utf8").trim().split(/\r?\n/);
const header = lines.shift().split(",");
const rows = lines.map((line) => {
  const values = line.split(",");
  return Object.fromEntries(header.map((key, i) => [key, values[i]]));
});
const failures = [];
const years = Array.from(new Set(rows.map((r) => Number(r.fiscal_year)))).sort((a,b) => a-b);
if (rows.length !== 16) failures.push("expected 16 rows, found " + rows.length);
if (years.join(",") !== "2018,2019,2020,2021,2022,2023,2024,2025") failures.push("year coverage mismatch");
for (const year of years) {
  for (const metric of ["revenue", "pbt"]) {
    const row = rows.find((r) => Number(r.fiscal_year) === year && r.metric === metric);
    if (!row) failures.push("missing " + year + " " + metric);
    else {
      const guidance = Number(row.guidance_vnd_bn);
      const actual = Number(row.actual_vnd_bn);
      const error = Number(row.error_vnd_bn);
      const absError = Number(row.abs_error_vnd_bn);
      const attainment = Number(row.attainment_pct);
      if (Math.abs((actual - guidance) - error) > 0.001) failures.push("error arithmetic mismatch: " + year + " " + metric);
      if (Math.abs(Math.abs(error) - absError) > 0.001) failures.push("absolute error mismatch: " + year + " " + metric);
      if (Math.abs((actual / guidance * 100) - attainment) > 0.02) failures.push("attainment mismatch: " + year + " " + metric);
      if (row.forecast_class !== "PUBLIC_GUIDANCE_PROXY") failures.push("forecast class mismatch: " + year + " " + metric);
      if (row.gate_a_eligible !== "NO") failures.push("Gate A exclusion missing: " + year + " " + metric);
      if (row.evidence_class !== "OBSERVED") failures.push("evidence class mismatch: " + year + " " + metric);
    }
  }
}
const sum = (field) => rows.reduce((total, r) => total + Number(r[field]), 0);
const bias = sum("error_vnd_bn") / sum("actual_vnd_bn");
const wape = sum("abs_error_vnd_bn") / sum("actual_vnd_bn");
if (Math.abs(bias - (-0.02634)) > 0.0001) failures.push("aggregate bias mismatch: " + bias);
if (Math.abs(wape - 0.03139) > 0.0001) failures.push("aggregate WAPE mismatch: " + wape);
const status = failures.length ? "FAIL" : "PASS";
console.log(JSON.stringify({status, rows: rows.length, years, bias: Number(bias.toFixed(6)), wape: Number(wape.toFixed(6)), checks: 10, failures}, null, 2));
if (failures.length) process.exit(1);
