#requires -Version 7.4
param(
    [string]$OutputDirectory = (Join-Path $PSScriptRoot '..\backups'),
    [string]$Container = 'culinaryblog-db',
    [string]$Database = 'CulinaryBlogDb',
    [string]$User = 'postgres',
    [ValidateRange(1,3650)][int]$RetentionDays = 30
)

$ErrorActionPreference = 'Stop'

$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$outputFile = Join-Path $resolvedOutput "culinary-blog-$stamp.dump"

docker exec $Container pg_dump --format=custom --no-owner --username=$User $Database > $outputFile
if ($LASTEXITCODE -ne 0) {
    Remove-Item -LiteralPath $outputFile -ErrorAction SilentlyContinue
    throw 'PostgreSQL backup failed.'
}

Write-Host "Backup created: $outputFile"
Get-ChildItem -LiteralPath $resolvedOutput -File -Filter 'culinary-blog-*.dump' |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) } |
    ForEach-Object { Remove-Item -LiteralPath $_.FullName }

