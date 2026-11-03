#requires -Version 7.2
[CmdletBinding()]
param(
    [string]$OutputDirectory = (Join-Path $PSScriptRoot '../../artifacts/lab8-admin'),
    [switch]$RunRuntime
)
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../..'))
$OutputDirectory = [IO.Path]::GetFullPath($OutputDirectory)
if (-not $OutputDirectory.StartsWith((Join-Path $root 'artifacts') + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Admin evidence must stay under ignored artifacts.' }
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$username = 'lab8admin' + [DateTime]::UtcNow.ToString('yyyyMMddHHmmss') + [guid]::NewGuid().ToString('N').Substring(0, 6)
$password = 'Fixture!' + [guid]::NewGuid().ToString('N') + 'A9'
$fixtureId = $null
$fixtureGranted = $false
$cleanupPassed = $false
$failure = $null
$runtimePassed = $false
$adminPassed = $false
$started = [DateTime]::UtcNow

function Invoke-FixtureSql([string]$Sql) {
    $sqlResult = $Sql | & docker exec -i culinaryblog-db sh -c 'psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -A'
    if ($LASTEXITCODE -ne 0) { throw 'Temporary fixture database setup/cleanup failed.' }
    return $sqlResult
}

try {
    $body = @{ displayName = "Admin verification $username"; username = $username; email = "$username@example.invalid"; password = $password; confirmPassword = $password; captchaQuestion = '8 + 5'; captchaAnswer = '13' } | ConvertTo-Json -Compress
    $response = $null
    for ($attempt = 0; $attempt -lt 3; $attempt++) {
        $response = Invoke-WebRequest -Uri 'http://localhost:5152/api/v1/auth/register' -Method POST -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($body)) -SkipHttpErrorCheck -TimeoutSec 45
        if ($response.StatusCode -ne 429) { break }
        $retry = 61
        $rawRetry = [string]($response.Headers['Retry-After'] | Select-Object -First 1)
        $parsed = 0
        if ([int]::TryParse($rawRetry, [ref]$parsed)) { $retry = [Math]::Clamp($parsed + 1, 1, 75) }
        Write-Host "Register rate limit: waiting $retry seconds."
        for ($remaining = $retry; $remaining -gt 0; $remaining -= 5) { Start-Sleep -Seconds ([Math]::Min(5, $remaining)) }
    }
    if ($response.StatusCode -notin @(200, 201)) { throw "Temporary account registration returned HTTP $($response.StatusCode)." }
    $registered = ($response.Content | ConvertFrom-Json).data
    $fixtureId = [string]$registered.user.id
    if ($username -notmatch '^lab8admin\d{14}[a-f0-9]{6}$' -or $fixtureId -notmatch '^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$') { throw 'Generated fixture identity did not pass strict safety validation.' }
    $grantSql = @"
UPDATE "Users" SET "Role"='Admin' WHERE "Id"='$fixtureId' AND "UserName"='$username' AND "Role"='User' RETURNING "Id";
"@
    $granted = @(Invoke-FixtureSql $grantSql)
    if (($granted -join "`n") -notmatch [regex]::Escape($fixtureId)) { throw 'Only the newly generated fixture may receive temporary administrator access.' }
    $fixtureGranted = $true
    Write-Host 'Created temporary administrator fixture; existing accounts are unchanged.'
    $env:CULINARY_ADMIN_USERNAME = $username
    $env:CULINARY_ADMIN_PASSWORD = $password
    $env:CULINARY_ADMIN_ID = $fixtureId
    $env:CULINARY_ADMIN_OUTPUT = $OutputDirectory
    & node (Join-Path $PSScriptRoot 'verify-admin.mjs')
    $adminPassed = $LASTEXITCODE -eq 0
    if ($RunRuntime) {
        $credential = [PSCredential]::new($username, (ConvertTo-SecureString $password -AsPlainText -Force))
        $runtime = & (Join-Path $PSScriptRoot 'verify-runtime.ps1') -BaseUrl 'http://localhost:5152' -OutputDirectory (Join-Path $OutputDirectory 'runtime') -AdminCredential $credential
        $runtimePassed = $runtime.Passed -eq $true
    }
    if (-not $adminPassed) { throw 'One or more administrator verification checks failed; see admin-result.json.' }
} catch {
    $failure = if ($_.Exception.Message -match '(registration returned HTTP|Generated fixture|Only the newly|verification checks failed|Check failed:)') { $_.Exception.Message } else { "Admin fixture verification failed ($($_.Exception.GetType().Name), line $($_.InvocationInfo.ScriptLineNumber))." }
} finally {
    foreach ($name in @('CULINARY_ADMIN_USERNAME', 'CULINARY_ADMIN_PASSWORD', 'CULINARY_ADMIN_ID', 'CULINARY_ADMIN_OUTPUT')) { [Environment]::SetEnvironmentVariable($name, $null, 'Process') }
    if ($fixtureId -match '^[a-f0-9-]{36}$' -and $username -match '^lab8admin\d{14}[a-f0-9]{6}$') {
        try {
            $cleanupSql = @"
BEGIN;
UPDATE "Users" SET "Role"='User', "SecurityStamp"=md5(random()::text) WHERE "Id"='$fixtureId' AND "UserName"='$username';
DELETE FROM "RefreshTokens" WHERE "UserId" IN (SELECT "Id" FROM "Users" WHERE "Id"='$fixtureId' AND "UserName"='$username');
SELECT "Role" FROM "Users" WHERE "Id"='$fixtureId' AND "UserName"='$username';
COMMIT;
"@
            $demoted = @(Invoke-FixtureSql $cleanupSql)
            $cleanupPassed = @($demoted | Where-Object { $_.Trim() -eq 'User' }).Count -eq 1
        } catch { $cleanupPassed = $false }
    }
    $summary = @{ startedAt = $started.ToString('o'); finishedAt = [DateTime]::UtcNow.ToString('o'); fixtureId = $fixtureId; fixtureInitiallyGranted = $fixtureGranted; fixtureDemotedAndRefreshTokensDeleted = $cleanupPassed; adminPassed = $adminPassed; runtimeRequested = [bool]$RunRuntime; runtimePassed = $runtimePassed; failure = $failure; note = 'Only the unique account generated by this run was temporarily promoted. No existing account was changed. Account and private audit records remain; credentials are not persisted.' }
    $summary | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'fixture-result.json') -Encoding utf8
    $password = $null
    Write-Host "Fixture cleanup completed: $cleanupPassed"
}
if ($failure -or -not $cleanupPassed) { throw ($failure ?? 'Temporary administrator cleanup could not be verified.') }
[PSCustomObject]@{ AdminPassed = $adminPassed; RuntimePassed = $runtimePassed; FixtureCleanupPassed = $cleanupPassed; EvidenceDirectory = $OutputDirectory }
