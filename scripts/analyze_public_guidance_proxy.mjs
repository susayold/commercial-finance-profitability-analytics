import fs from "node:fs";

const [inputPath = "data/vnm_public_guidance_proxy_2018_2025.csv", outputPath = "data/vnm_public_guidance_proxy_analysis.json"] = process.argv.slice(2);
const lines = fs.readFileSync(inputPath, "utf8").trim().split(/\r?\n/);
const header = lines.shift().split(",");
const rows = lines.map((line) => {
  const values = line.split(",");
  return Object.fromEntries(header.map((key, i) => [key, values[i]]));
});

const stat = (arr) => {
  const n = arr.length;
  const actual = arr.reduce((s, r) => s + Number(r.actual_vnd_bn), 0);
  const error = arr.reduce((s, r) => s + Number(r.error_vnd_bn), 0);
  const absError = arr.reduce((s, r) => s + Math.abs(Number(r.error_vnd_bn)), 0);
  const errorPct = arr.map((r) => Number(r.error_vnd_bn) / Number(r.guidance_vnd_bn) * 100);
  const meanErrorPct = errorPct.reduce((s, x) => s + x, 0) / n;
  const stdErrorPct = n > 1 ? Math.sqrt(errorPct.reduce((s, x) => s + (x - meanErrorPct) ** 2, 0) / (n - 1)) : 0;
  const within2 = errorPct.filter((x) => Math.abs(x) <= 2).length;
  const under = errorPct.filter((x) => x > 0).length;
  const over = errorPct.filter((x) => x < 0).length;
  return {
    n,
    actual_vnd_bn: actual,
    error_vnd_bn: error,
    abs_error_vnd_bn: absError,
    bias_pct_of_actual: 100 * error / actual,
    wape_pct_of_actual: 100 * absError / actual,
    mape_pct_of_guidance: errorPct.reduce((s, x) => s + Math.abs(x), 0) / n,
    mean_error_pct_of_guidance: meanErrorPct,
    sample_std_error_pct: stdErrorPct,
    descriptive_95pct_band_lower: meanErrorPct - 1.96 * stdErrorPct,
    descriptive_95pct_band_upper: meanErrorPct + 1.96 * stdErrorPct,
    within_2pct_rate: 100 * within2 / n,
    underforecast_rate: 100 * under / n,
    overforecast_rate: 100 * over / n,
    attainment_min_pct: Math.min(...arr.map((r) => Number(r.attainment_pct))),
    attainment_max_pct: Math.max(...arr.map((r) => Number(r.attainment_pct)))
  };
};

const years = Array.from(new Set(rows.map((r) => Number(r.fiscal_year)))).sort((a, b) => a - b);
const groups = {
  overall: rows,
  revenue: rows.filter((r) => r.metric === "revenue"),
  pbt: rows.filter((r) => r.metric === "pbt"),
  "2018-2020": rows.filter((r) => Number(r.fiscal_year) <= 2020),
  "2021-2025": rows.filter((r) => Number(r.fiscal_year) >= 2021),
  revenue_2018_2020: rows.filter((r) => r.metric === "revenue" && Number(r.fiscal_year) <= 2020),
  revenue_2021_2025: rows.filter((r) => r.metric === "revenue" && Number(r.fiscal_year) >= 2021),
  pbt_2018_2020: rows.filter((r) => r.metric === "pbt" && Number(r.fiscal_year) <= 2020),
  pbt_2021_2025: rows.filter((r) => r.metric === "pbt" && Number(r.fiscal_year) >= 2021)
};

const byYear = years.map((year) => {
  const revenue = rows.find((r) => Number(r.fiscal_year) === year && r.metric === "revenue");
  const pbt = rows.find((r) => Number(r.fiscal_year) === year && r.metric === "pbt");
  return {
    fiscal_year: year,
    revenue_attainment_pct: Number(revenue.attainment_pct),
    pbt_attainment_pct: Number(pbt.attainment_pct),
    pbt_minus_revenue_attainment_pp: Number((Number(pbt.attainment_pct) - Number(revenue.attainment_pct)).toFixed(2)),
    revenue_error_pct_of_guidance: Number((Number(revenue.error_vnd_bn) / Number(revenue.guidance_vnd_bn) * 100).toFixed(3)),
    pbt_error_pct_of_guidance: Number((Number(pbt.error_vnd_bn) / Number(pbt.guidance_vnd_bn) * 100).toFixed(3))
  };
});

const worstMisses = [...rows]
  .sort((a, b) => Math.abs(Number(b.error_vnd_bn) / Number(b.guidance_vnd_bn)) - Math.abs(Number(a.error_vnd_bn) / Number(a.guidance_vnd_bn)))
  .slice(0, 5)
  .map((r) => ({
    fiscal_year: Number(r.fiscal_year),
    metric: r.metric,
    guidance_vnd_bn: Number(r.guidance_vnd_bn),
    actual_vnd_bn: Number(r.actual_vnd_bn),
    error_vnd_bn: Number(r.error_vnd_bn),
    error_pct_of_guidance: Number((Number(r.error_vnd_bn) / Number(r.guidance_vnd_bn) * 100).toFixed(3))
  }));

const result = {
  analysis_version: "1.0.0",
  generated_from: inputPath,
  evidence_class: "OBSERVED_PUBLIC_GUIDANCE_PROXY",
  gate_a_eligible: false,
  methodology: {
    error: "actual - guidance",
    bias: "sum(error) / sum(actual)",
    wape: "sum(abs(error)) / sum(actual)",
    mape: "mean(abs(error / guidance))",
    confidence_band_note: "Descriptive mean +/- 1.96 sample standard deviations; not a calibrated probabilistic forecast interval."
  },
  groups: Object.fromEntries(Object.entries(groups).map(([name, arr]) => [name, stat(arr)])),
  by_year: byYear,
  worst_misses: worstMisses
};

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({status: "PASS", outputPath, groups: Object.keys(result.groups).length, years: years.length}));
