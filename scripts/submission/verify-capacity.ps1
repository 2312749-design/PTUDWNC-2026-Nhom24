#requires -Version 7.4
param([Parameter(Mandatory)][string]$RunDirectory)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$run = [IO.Path]::GetFullPath($RunDirectory)
if (-not $run.StartsWith((Join-Path $root 'artifacts') + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Expected isolated verification run.' }
$config = Join-Path $run 'compose.private.json'
$compose = Get-Content -LiteralPath $config -Raw | ConvertFrom-Json -AsHashtable
$redisContainer = $compose.services.redis.container_name
$override = Join-Path $run 'capacity.override.json'
@{ services = @{ api = @{ environment = @{ RateLimiting__DefaultPermitLimit = '20000' } } } } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $override
function Wait-Ready {
    for ($attempt=0; $attempt -lt 90; $attempt++) {
        try { if ((Invoke-WebRequest http://localhost:25152/health/ready -TimeoutSec 5 -SkipHttpErrorCheck).StatusCode -eq 200) { return } } catch { }
        Start-Sleep -Seconds 1
    }
    throw 'API readiness timed out.'
}
function Redis-Stats {
    $lines = docker exec $redisContainer redis-cli INFO stats
    $result=@{}
    foreach ($line in $lines) { if ($line -match '^(keyspace_hits|keyspace_misses):(\d+)') { $result[$Matches[1]]=[long]$Matches[2] } }
    return $result
}
try {
    docker compose -f $config -f $override up -d --no-deps api
    if ($LASTEXITCODE -ne 0) { throw 'Cannot start isolated capacity configuration.' }
    Wait-Ready
    for ($i=0; $i -lt 5; $i++) { Invoke-WebRequest 'http://localhost:25152/api/v1/recipes?page=1&pageSize=12' | Out-Null }
    $before=Redis-Stats
    docker run --rm --name cb-capacity-k6 -e BASE_URL=http://host.docker.internal:25152 -e VUS=100 -e DURATION=30s -v "${root}/tests/performance:/scripts:ro" -v "${root}/artifacts:/results" grafana/k6 run --summary-trend-stats 'avg,min,med,max,p(50),p(95),p(99)' --summary-export /results/k6-capacity-100vu.json /scripts/srs-smoke.js
    $k6Exit=$LASTEXITCODE
    $after=Redis-Stats
    $hits=$after.keyspace_hits-$before.keyspace_hits; $misses=$after.keyspace_misses-$before.keyspace_misses
    @{ k6ExitCode=$k6Exit; users=100; durationSeconds=30; rateLimitPermitsForThisRunOnly=20000; cacheHits=$hits; cacheMisses=$misses; cacheHitPercent= $(if(($hits+$misses)-gt 0){[Math]::Round(100*$hits/($hits+$misses),2)}else{$null}); limitation='Local GET workload only; rate limit isolated from capacity. Not production hardware or complete API SLA.' } |
        ConvertTo-Json | Set-Content -LiteralPath (Join-Path $root 'artifacts/capacity-evidence.json')
} finally {
    docker compose -f $config up -d --no-deps api
    if ($LASTEXITCODE -ne 0) { throw 'Failed to restore default rate limit configuration.' }
    Wait-Ready
}
