param(
    [double]$MinimumLineCoverage = 80
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$resultsDirectory = Join-Path $repositoryRoot ".artifacts\coverage-application-$timestamp"
$testProject = Join-Path $repositoryRoot 'tests\CulinaryBlog.API.Tests\CulinaryBlog.API.Tests.csproj'
$settings = Join-Path $repositoryRoot 'tests\ApplicationCoverage.runsettings'

Push-Location $repositoryRoot
try {
    dotnet test $testProject -c Release --settings $settings --collect:'XPlat Code Coverage' --results-directory $resultsDirectory
    if ($LASTEXITCODE -ne 0) {
        throw "Application coverage test run failed with exit code $LASTEXITCODE."
    }
}
finally {
    Pop-Location
}

$coverageFile = Get-ChildItem $resultsDirectory -Recurse -Filter 'coverage.cobertura.xml' |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1
if (-not $coverageFile) {
    throw 'The coverage run did not produce coverage.cobertura.xml.'
}

[xml]$coverage = Get-Content $coverageFile.FullName
$lineCoverage = [math]::Round(100 * [double]$coverage.coverage.'line-rate', 2)
$branchCoverage = [math]::Round(100 * [double]$coverage.coverage.'branch-rate', 2)
$coveredLines = [int]$coverage.coverage.'lines-covered'
$validLines = [int]$coverage.coverage.'lines-valid'

Write-Host "Application line coverage: $lineCoverage% ($coveredLines/$validLines lines)"
Write-Host "Application branch coverage: $branchCoverage%"
Write-Host "Cobertura report: $($coverageFile.FullName)"

if ($lineCoverage -lt $MinimumLineCoverage) {
    throw "Application line coverage $lineCoverage% is below the required $MinimumLineCoverage%."
}

Write-Host "PASS: Application line coverage meets the $MinimumLineCoverage% requirement."
