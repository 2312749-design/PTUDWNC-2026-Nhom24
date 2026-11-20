#requires -Version 7.4
param([Parameter(Mandatory)][string]$RunDirectory,
    [ValidateSet('api','frontend')][string[]]$Services = @('api','frontend'))
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$run = [IO.Path]::GetFullPath($RunDirectory)
if (-not $run.StartsWith((Join-Path $root 'artifacts') + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Run must be inside artifacts.' }
$snapshot = Join-Path $run 'source'
$config = Join-Path $run 'compose.private.json'
if (-not (Test-Path -LiteralPath $config)) { throw 'No isolated stack configuration.' }
$files = & git -C $root -c core.quotePath=false ls-files --cached --others --exclude-standard
foreach ($file in ($files | Sort-Object -Unique)) {
    if ($file -match '^(artifacts|\.artifacts|tmp|node_modules|backups)/' -or $file -match '(^|/)\.env($|\.(?!example$))') { continue }
    $source = Join-Path $root $file
    $target = [IO.Path]::GetFullPath((Join-Path $snapshot $file))
    if (-not $target.StartsWith($snapshot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Unsafe destination.' }
    if (Test-Path -LiteralPath $source -PathType Leaf) {
        New-Item -ItemType Directory -Path (Split-Path $target -Parent) -Force | Out-Null
        Copy-Item -LiteralPath $source -Destination $target
    }
}
# Only adjust build-time public configuration; never print the private config.
$compose = Get-Content -LiteralPath $config -Raw | ConvertFrom-Json -AsHashtable
$compose.services.frontend.build.args.NEXT_PUBLIC_MEDIA_ORIGIN = $compose.services.api.environment.Minio__PublicBaseUrl
$compose | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $config -Encoding utf8
docker compose -f $config build @Services
if ($LASTEXITCODE -ne 0) { throw 'Rebuild failed.' }
docker compose -f $config up -d --no-build api frontend nginx
if ($LASTEXITCODE -ne 0) { throw 'Restart failed.' }
@{ refreshedAt = [DateTime]::UtcNow.ToString('o'); source = 'working tree'; completed = $true } | ConvertTo-Json |
    Set-Content -LiteralPath (Join-Path $run 'refresh-summary.json') -Encoding utf8
