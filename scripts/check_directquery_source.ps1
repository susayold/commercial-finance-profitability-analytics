[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$Server,
    [Parameter(Mandatory = $true)]
    [string]$Database,
    [switch]$IntegratedSecurity,
    [string]$Username,
    [string]$QueryPath = (Join-Path $PSScriptRoot '..\powerbi\directquery\VNFinance_DirectQuery_Health.sql'),
    [switch]$TrustServerCertificate
)

$ErrorActionPreference = 'Stop'
$sqlcmd = Get-Command sqlcmd -ErrorAction SilentlyContinue
if (-not $sqlcmd) {
    Write-Error 'sqlcmd was not found. Install the SQL Server command-line tools on the controlled health-check host.'
    exit 2
}
if (-not (Test-Path -LiteralPath $QueryPath)) {
    Write-Error "Health query not found: $QueryPath"
    exit 2
}

$resolvedUser = if ($Username) { $Username } else { $env:SQLCMDUSER }
if (-not $IntegratedSecurity -and [string]::IsNullOrWhiteSpace($resolvedUser)) {
    Write-Error 'Provide -IntegratedSecurity or -Username; for SQL authentication set SQLCMDPASSWORD in the process environment. Passwords are never accepted as script arguments.'
    exit 2
}

$sqlArgs = @('-S', $Server, '-d', $Database, '-b', '-W', '-s', '|', '-i', (Resolve-Path -LiteralPath $QueryPath).Path)
if ($IntegratedSecurity) {
    $sqlArgs += '-E'
} else {
    $sqlArgs += @('-U', $resolvedUser)
}
if ($TrustServerCertificate) {
    $sqlArgs += '-C'
}

& $sqlcmd.Source @sqlArgs
$exitCode = $LASTEXITCODE
if ($exitCode -ne 0) {
    exit $exitCode
}
