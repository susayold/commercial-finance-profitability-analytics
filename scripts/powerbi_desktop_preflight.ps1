[CmdletBinding()]
param(
    [Parameter()]
    [string]$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")),
    [Parameter()]
    [string]$DataRoot = ""
)

$ErrorActionPreference = "Stop"
$checks = New-Object System.Collections.Generic.List[object]

function Add-Check {
    param([string]$Name, [bool]$Pass, [string]$Detail)
    $checks.Add([pscustomobject]@{ name = $Name; pass = $Pass; detail = $Detail })
}

function Resolve-ExistingPath {
    param([string]$Path)
    if (Test-Path -LiteralPath $Path) { return (Resolve-Path -LiteralPath $Path).Path }
    return $null
}

$root = Resolve-ExistingPath $ProjectRoot
if (-not $root) { throw "ProjectRoot does not exist: $ProjectRoot" }

# Prefer the committed, reproducible fixture when the caller does not pass a
# replacement folder explicitly. An explicit DataRoot always wins.
if (-not $DataRoot) {
    $defaultDataRoot = Join-Path $root "powerbi\data\current"
    if (Test-Path -LiteralPath $defaultDataRoot -PathType Container) { $DataRoot = $defaultDataRoot }
}

$desktopCandidates = @(
    "C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe",
    "C:\Program Files (x86)\Microsoft Power BI Desktop\bin\PBIDesktop.exe"
)
$desktopPath = $desktopCandidates | ForEach-Object { Resolve-ExistingPath $_ } | Where-Object { $_ } | Select-Object -First 1
if ($desktopPath) {
    $desktopVersion = (Get-Item $desktopPath).VersionInfo.ProductVersion
    Add-Check "PBIDesktop.exe" $true "$desktopPath (version $desktopVersion)"
} else {
    Add-Check "PBIDesktop.exe" $false "PENDING: install/repair Power BI Desktop with Administrator rights; see https://learn.microsoft.com/power-bi/fundamentals/desktop-getting-started"
}

$requiredFiles = @(
    "powerbi\native\VNFinance_PBIP\VNFinance_Commercial_Finance.pbip",
    "powerbi\releases\Commercial_Finance_Profitability_Analytics.pbit",
    "powerbi\native\VNFinance_PbixProj\.pbixproj.json",
    "powerbi\PBIP_SOURCE_MANIFEST.json",
    "powerbi\DIRECTQUERY_READINESS.json",
    "powerbi\directquery\VNFinance_DirectQuery_Schema.sql",
    "scripts\validate_powerbi_input_contract.py",
    "scripts\validate_powerbi_refreshable_project.py"
)
foreach ($relative in $requiredFiles) {
    $absolute = Join-Path $root $relative
    Add-Check "Artifact $relative" ([bool](Test-Path -LiteralPath $absolute -PathType Leaf)) $(if (Test-Path -LiteralPath $absolute -PathType Leaf) { "present" } else { "missing" })
}

if ($DataRoot) {
    $dataPath = Resolve-ExistingPath $DataRoot
    Add-Check "DataRoot folder" ([bool]$dataPath) $(if ($dataPath) { $dataPath } else { "missing: $DataRoot" })
    if ($dataPath) {
        $csvCount = @(Get-ChildItem -LiteralPath $dataPath -Filter "*.csv" -File).Count
        Add-Check "DataRoot CSV count" ($csvCount -eq 14) "$csvCount found; expected 14"
        $requiredDataFiles = @(
            "sales_fact.csv", "commercial_costs.csv", "inventory.csv", "receivables.csv",
            "payables.csv", "debt.csv", "budget.csv", "forecast.csv", "marketing_spend.csv",
            "promotions.csv", "product_master.csv", "customer_master.csv", "channel_master.csv",
            "source_control.csv"
        )
        $missingDataFiles = @($requiredDataFiles | Where-Object { -not (Test-Path -LiteralPath (Join-Path $dataPath $_) -PathType Leaf) })
        Add-Check "DataRoot required filenames" ($missingDataFiles.Count -eq 0) $(if ($missingDataFiles.Count -eq 0) { "all 14 present" } else { "missing: " + ($missingDataFiles -join ", ") })
        $validator = Join-Path $root "scripts\validate_powerbi_input_contract.py"
        $python = Get-Command python -ErrorAction SilentlyContinue
        Add-Check "Python runtime" ([bool]$python) $(if ($python) { $python.Source } else { "python not found" })
        if ($python -and (Test-Path -LiteralPath $validator)) {
            & $python.Source $validator --input-dir $dataPath
            Add-Check "Input contract validator" ($LASTEXITCODE -eq 0) "exit code $LASTEXITCODE"
        }
    }
} else {
    Add-Check "DataRoot folder" $false "PENDING: pass -DataRoot <folder containing the 14 contract CSVs>"
}

$failed = @($checks | Where-Object { -not $_.pass })
$result = [pscustomobject]@{
    status = if ($failed.Count -eq 0) { "PASS" } else { "PENDING" }
    project_root = $root
    desktop = $desktopPath
    checks = $checks.Count
    passed = $checks.Count - $failed.Count
    failed = $failed.Count
    details = $checks
}
$result | ConvertTo-Json -Depth 6
if ($failed.Count -gt 0) { exit 2 }
