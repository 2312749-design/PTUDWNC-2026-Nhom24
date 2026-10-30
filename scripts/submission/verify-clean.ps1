#requires -Version 7.0
<#
.SYNOPSIS
Build and start the committed application in a new, isolated Docker project.
.DESCRIPTION
Exports git HEAD, creates disposable local credentials and new Docker volumes,
then checks HTTP readiness, database seed requirements and restart idempotence.
Existing containers, volumes, .env files and working-tree changes are untouched.
The private .env and resolved Compose file stay under the ignored artifacts folder.
No resources are deleted. Use -StopAfterVerification to stop only this test stack.
.EXAMPLE
pwsh -File scripts/submission/verify-clean.ps1
.EXAMPLE
pwsh -File scripts/submission/verify-clean.ps1 -StopAfterVerification
#>
[CmdletBinding()]
param(
    [string]$RepositoryDirectory = (Join-Path $PSScriptRoot '../..'),
    [string]$OutputDirectory,
    [ValidatePattern('^[a-z0-9][a-z0-9_-]{5,62}$')]
    [string]$ProjectName,
    [ValidateRange(1024, 65535)][int]$WebPort = 28080,
    [ValidateRange(1024, 65535)][int]$ApiPort = 25152,
    [ValidateRange(1024, 65535)][int]$PostgresPort = 25432,
    [ValidateRange(1024, 65535)][int]$RedisPort = 26379,
    [ValidateRange(1024, 65535)][int]$MinioPort = 29000,
    [ValidateRange(1024, 65535)][int]$MinioConsolePort = 29001,
    [ValidateRange(30, 1800)][int]$StartupTimeoutSeconds = 900,
    [switch]$SkipBuild,
    [switch]$StopAfterVerification
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $false
$startedAt = [DateTimeOffset]::UtcNow
$runId = $startedAt.ToString('yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0, 6)
$repositoryRoot = [IO.Path]::GetFullPath((Resolve-Path -LiteralPath $RepositoryDirectory).Path)
$artifactsRoot = [IO.Path]::GetFullPath((Join-Path $repositoryRoot 'artifacts'))
$privateValues = [Collections.Generic.List[string]]::new()
$savedEnvironment = @{}
$composeArguments = @()
$stackStarted = $false
$report = [ordered]@{
    runId = $runId
    startedAt = $startedAt.ToString('o')
    completedAt = $null
    status = 'preparing'
    sourceCommit = $null
    sourceSnapshot = $null
    workingTreeChangesExcluded = $false
    dockerProject = $null
    buildPerformed = -not $SkipBuild
    stoppedAfterVerification = $false
    endpoints = [ordered]@{
        website = "http://localhost:$WebPort"
        api = "http://localhost:$ApiPort"
        minio = "http://localhost:$MinioPort"
    }
    checks = [Collections.Generic.List[object]]::new()
    initialSeed = $null
    seedAfterRestart = $null
    schema = $null
    resources = $null
    services = $null
    error = $null
}

function Test-WithinDirectory([string]$Candidate, [string]$Parent) {
    $candidatePath = [IO.Path]::GetFullPath($Candidate)
    $parentPath = [IO.Path]::GetFullPath($Parent).TrimEnd([IO.Path]::DirectorySeparatorChar, [IO.Path]::AltDirectorySeparatorChar)
    return $candidatePath.Equals($parentPath, [StringComparison]::OrdinalIgnoreCase) -or
        $candidatePath.StartsWith($parentPath + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)
}

function Protect-Output([string]$Value) {
    $safe = $Value
    foreach ($privateValue in $privateValues) {
        if (-not [string]::IsNullOrWhiteSpace($privateValue)) {
            $safe = $safe.Replace($privateValue, '[REDACTED]')
        }
    }
    $safe = $safe -replace '(?i)(Authorization:\s*Bearer\s+)\S+', '$1[REDACTED]'
    $safe = $safe -replace '(?i)(Set-Cookie:\s*).+', '$1[REDACTED]'
    $safe = $safe -replace '(?i)(Password\s*=\s*)[^;\s]+', '$1[REDACTED]'
    return $safe
}

function Save-Report {
    $report.completedAt = [DateTimeOffset]::UtcNow.ToString('o')
    $report | ConvertTo-Json -Depth 15 | Set-Content -LiteralPath (Join-Path $runDirectory 'summary.json') -Encoding utf8
}

function Add-Check([string]$Name, [bool]$Passed, [string]$Detail) {
    $report.checks.Add([ordered]@{ name = $Name; passed = $Passed; detail = $Detail })
    Save-Report
    $mark = if ($Passed) { 'PASS' } else { 'FAIL' }
    Write-Host "[$mark] $Name - $(Protect-Output $Detail)"
    if (-not $Passed) { throw $Detail }
}

function Invoke-DockerChecked {
    param(
        [Parameter(Mandatory)][string[]]$Arguments,
        [string]$LogName = 'docker.log',
        [switch]$Capture,
        [switch]$Quiet
    )
    $captured = [Collections.Generic.List[string]]::new()
    $logPath = Join-Path $runDirectory $LogName
    & docker @Arguments 2>&1 | ForEach-Object {
        $line = [string]$_
        $captured.Add($line)
        $safeLine = Protect-Output $line
        Add-Content -LiteralPath $logPath -Value $safeLine -Encoding utf8
        if (-not $Capture -and -not $Quiet) { Write-Host $safeLine }
    }
    $commandExit = $LASTEXITCODE
    if ($commandExit -ne 0) {
        throw "Docker command failed (exit $commandExit). See $logPath."
    }
    if ($Capture) { return ($captured -join "`n") }
}

function Invoke-ComposeChecked {
    param([string[]]$Arguments, [string]$LogName = 'docker.log', [switch]$Capture, [switch]$Quiet)
    Invoke-DockerChecked -Arguments ($composeArguments + $Arguments) -LogName $LogName -Capture:$Capture -Quiet:$Quiet
}

function Wait-ForHttp {
    $deadline = [DateTimeOffset]::UtcNow.AddSeconds($StartupTimeoutSeconds)
    $lastProgress = [DateTimeOffset]::MinValue
    $apiResponse = $null
    $webResponse = $null
    do {
        try {
            $apiResponse = Invoke-WebRequest -Uri "$($report.endpoints.api)/health/ready" -TimeoutSec 5 -SkipHttpErrorCheck
        } catch { $apiResponse = $null }
        try {
            $webResponse = Invoke-WebRequest -Uri $report.endpoints.website -TimeoutSec 5 -SkipHttpErrorCheck
        } catch { $webResponse = $null }
        if ($null -ne $apiResponse -and $apiResponse.StatusCode -eq 200 -and
            $null -ne $webResponse -and $webResponse.StatusCode -eq 200) {
            $apiResponse.Content | Set-Content -LiteralPath (Join-Path $runDirectory 'health-ready.json') -Encoding utf8
            return
        }
        if (([DateTimeOffset]::UtcNow - $lastProgress).TotalSeconds -ge 30) {
            $apiStatus = if ($null -eq $apiResponse) { 'not ready' } else { [string]$apiResponse.StatusCode }
            $webStatus = if ($null -eq $webResponse) { 'not ready' } else { [string]$webResponse.StatusCode }
            Write-Host "Waiting for isolated stack: API=$apiStatus, website=$webStatus"
            $lastProgress = [DateTimeOffset]::UtcNow
        }
        Start-Sleep -Seconds 2
    } while ([DateTimeOffset]::UtcNow -lt $deadline)
    throw "The isolated stack did not become HTTP-ready within $StartupTimeoutSeconds seconds."
}

function Get-SeedStatistics {
    $query = @'
WITH counts AS (
    SELECT r."Id", r."Status",
        COALESCE(cardinality(r."Ingredients"), 0) AS ingredients,
        COALESCE(cardinality(r."Instructions"), 0) AS steps,
        (SELECT count(*) FROM "RecipeIngredients" i WHERE i."RecipeId" = r."Id") AS structured_ingredients,
        (SELECT count(*) FROM "RecipeSteps" s WHERE s."RecipeId" = r."Id") AS structured_steps
    FROM "Recipes" r WHERE NOT r."IsDeleted"
)
SELECT json_build_object(
    'categories', (SELECT count(*) FROM "Categories" WHERE NOT "IsDeleted"),
    'recipes', count(*),
    'publishedRecipes', count(*) FILTER (WHERE "Status" = 1),
    'users', (SELECT count(*) FROM "Users"),
    'communityPosts', (SELECT count(*) FROM "CommunityPosts"),
    'articles', (SELECT count(*) FROM "BlogArticles"),
    'migrations', (SELECT count(*) FROM "__EFMigrationsHistory"),
    'minimumIngredients', COALESCE(min(ingredients), 0),
    'minimumSteps', COALESCE(min(steps), 0),
    'minimumStructuredIngredients', COALESCE(min(structured_ingredients), 0),
    'minimumStructuredSteps', COALESCE(min(structured_steps), 0),
    'recipesBelowMinimum', count(*) FILTER (
        WHERE ingredients < 10 OR steps < 5 OR structured_ingredients < 10 OR structured_steps < 5)
) FROM counts;
'@
    $json = Invoke-ComposeChecked -Arguments @('exec', '-T', 'db', 'psql', '-U', 'postgres', '-d', 'CulinaryBlogSubmission', '-X', '-A', '-t', '-v', 'ON_ERROR_STOP=1', '-c', $query) -LogName 'database-check.log' -Capture
    return ($json | ConvertFrom-Json -AsHashtable)
}

try {
    foreach ($requiredCommand in @('git', 'docker', 'dotnet')) {
        if (-not (Get-Command $requiredCommand -ErrorAction SilentlyContinue)) {
            throw "Required command is missing: $requiredCommand"
        }
    }
    if ([string]::IsNullOrWhiteSpace($ProjectName)) { $ProjectName = "cbsubmission$($runId.Replace('-', ''))" }
    $report.dockerProject = $ProjectName
    if ([string]::IsNullOrWhiteSpace($OutputDirectory)) { $OutputDirectory = Join-Path $artifactsRoot "submission-$runId" }
    $runDirectory = [IO.Path]::GetFullPath($OutputDirectory)
    if (-not (Test-WithinDirectory $runDirectory $artifactsRoot) -or $runDirectory -eq $artifactsRoot) {
        throw 'OutputDirectory must be a child directory of this repository artifacts folder.'
    }
    if (Test-Path -LiteralPath $runDirectory) {
        if (@(Get-ChildItem -LiteralPath $runDirectory -Force).Count -gt 0) {
            throw 'OutputDirectory must be new or empty; an existing verification run will not be overwritten.'
        }
    }
    New-Item -ItemType Directory -Path $runDirectory -Force | Out-Null
    Save-Report
    $dockerVersion = Invoke-DockerChecked -Arguments @('version', '--format', '{{.Server.Version}}') -Capture -LogName 'preflight.log'
    Add-Check 'Docker engine' (-not [string]::IsNullOrWhiteSpace($dockerVersion)) "Server $dockerVersion"

    $existingProjectContainers = Invoke-DockerChecked -Arguments @('ps', '-a', '--filter', "label=com.docker.compose.project=$ProjectName", '--format', '{{.ID}}') -Capture -LogName 'preflight.log'
    if (-not [string]::IsNullOrWhiteSpace($existingProjectContainers)) { throw "Docker project already exists: $ProjectName" }

    $gitCommit = (& git -C $repositoryRoot rev-parse HEAD) -join ''
    if ($LASTEXITCODE -ne 0) { throw 'RepositoryDirectory must be an existing Git checkout.' }
    $report.sourceCommit = $gitCommit.Trim()
    $workingChanges = (& git -C $repositoryRoot status --porcelain) -join "`n"
    if ($LASTEXITCODE -ne 0) { throw 'Unable to inspect the Git working tree.' }
    $report.workingTreeChangesExcluded = -not [string]::IsNullOrWhiteSpace($workingChanges)
    if ($report.workingTreeChangesExcluded) { Write-Host 'Working-tree changes exist; this run intentionally exports committed HEAD only.' }

    $archivePath = Join-Path $runDirectory 'source.zip'
    $sourceDirectory = Join-Path $runDirectory 'source'
    & git -C $repositoryRoot archive --format=zip "--output=$archivePath" HEAD
    if ($LASTEXITCODE -ne 0) { throw 'git archive failed.' }
    Expand-Archive -LiteralPath $archivePath -DestinationPath $sourceDirectory
    $report.sourceSnapshot = $sourceDirectory
    Add-Check 'Clean source snapshot' $true "Exported committed source $($report.sourceCommit)."

    $localPassword = 'Local-' + [Guid]::NewGuid().ToString('N') + '-9a!'
    $localMinioUser = 'submission-' + [Guid]::NewGuid().ToString('N').Substring(0, 10)
    $localMinioPassword = 'Minio-' + [Guid]::NewGuid().ToString('N') + '-5b!'
    $localJwtSecret = [Guid]::NewGuid().ToString('N') + [Guid]::NewGuid().ToString('N')
    $localGrafanaPassword = 'Grafana-' + [Guid]::NewGuid().ToString('N') + '-2c!'
    foreach ($value in @($localPassword, $localMinioUser, $localMinioPassword, $localJwtSecret, $localGrafanaPassword)) { $privateValues.Add($value) }
    $testEnvironment = [ordered]@{
        PUBLIC_SITE_URL = $report.endpoints.website
        NEXT_PUBLIC_API_URL = "$($report.endpoints.website)/api"
        CORS_ALLOWED_ORIGIN = $report.endpoints.website
        API_INTERNAL_URL = 'http://api:8080/api/v1'
        POSTGRES_DB = 'CulinaryBlogSubmission'
        POSTGRES_USER = 'postgres'
        POSTGRES_PASSWORD = $localPassword
        POSTGRES_PORT = [string]$PostgresPort
        REDIS_PORT = [string]$RedisPort
        MINIO_RELEASE = 'RELEASE.2025-10-15T17-29-55Z'
        MINIO_ROOT_USER = $localMinioUser
        MINIO_ROOT_PASSWORD = $localMinioPassword
        MINIO_API_PORT = [string]$MinioPort
        MINIO_CONSOLE_PORT = [string]$MinioConsolePort
        MINIO_PUBLIC_BASE_URL = $report.endpoints.minio
        GRAFANA_ADMIN_USER = 'submission'
        GRAFANA_ADMIN_PASSWORD = $localGrafanaPassword
        API_PORT = [string]$ApiPort
        WEB_PORT = [string]$WebPort
        JWT_SECRET = $localJwtSecret
        JWT_ISSUER = 'CulinaryBlog'
        JWT_AUDIENCE = 'CulinaryBlogFrontend'
        AUTH_COOKIES_SECURE = 'false'
        AUTH_COOKIE_SAME_SITE = 'Lax'
        GOOGLE_CLIENT_ID = ''
        SMTP_ENABLED = 'false'
        SMTP_HOST = ''
        SMTP_PORT = '587'
        SMTP_ENABLE_SSL = 'true'
        SMTP_USERNAME = ''
        SMTP_PASSWORD = ''
        SMTP_FROM_ADDRESS = ''
        SMTP_FROM_NAME = 'Bep Nha Submission'
        OTLP_ENDPOINT = 'http://otel-collector:4317'
        OTLP_HEADERS = ''
        APPLY_MIGRATIONS_ON_STARTUP = 'true'
        SEED_DEMO_DATA_ON_STARTUP = 'true'
        COMPOSE_PARALLEL_LIMIT = '1'
    }
    $envFile = Join-Path $runDirectory '.env'
    $testEnvironment.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" } | Set-Content -LiteralPath $envFile -Encoding utf8
    foreach ($entry in $testEnvironment.GetEnumerator()) {
        $savedEnvironment[$entry.Key] = [Environment]::GetEnvironmentVariable($entry.Key, 'Process')
        [Environment]::SetEnvironmentVariable($entry.Key, $entry.Value, 'Process')
    }

    $originalCompose = Join-Path $sourceDirectory 'docker-compose.yml'
    $configText = & docker compose --project-name $ProjectName --project-directory $sourceDirectory --env-file $envFile --file $originalCompose config --format json 2> (Join-Path $runDirectory 'compose-config.stderr.log')
    if ($LASTEXITCODE -ne 0) { throw 'The committed Docker Compose configuration is invalid. See compose-config.stderr.log.' }
    $configuration = ($configText -join "`n") | ConvertFrom-Json -AsHashtable
    $configuration['name'] = $ProjectName
    $publishedPorts = [Collections.Generic.List[int]]::new()

    foreach ($serviceEntry in $configuration['services'].GetEnumerator()) {
        $serviceName = $serviceEntry.Key
        $service = $serviceEntry.Value
        $service['container_name'] = "$ProjectName-$serviceName"
        if ($service['volumes_from']) { throw "Borrowing another container's volumes is not permitted: $serviceName" }
        if ($service['build']) {
            if (-not (Test-WithinDirectory $service['build']['context'] $sourceDirectory)) { throw "Build context escapes the source snapshot: $serviceName" }
        }
        foreach ($port in @($service['ports'])) {
            if ($null -eq $port) { continue }
            if ([string]$port['published'] -notmatch '^\d+$') { throw "A single explicit published port is required: $serviceName" }
            $newPort = switch ($serviceName) {
                'db' { $PostgresPort }
                'redis' { $RedisPort }
                'api' { $ApiPort }
                'nginx' { $WebPort }
                'minio' { if ([int]$port['target'] -eq 9001) { $MinioConsolePort } else { $MinioPort } }
                default { [int]$port['published'] + 20000 }
            }
            if ($newPort -gt 65535 -or $publishedPorts.Contains($newPort)) { throw "Invalid or duplicated isolated port: $newPort" }
            $port['host_ip'] = '127.0.0.1'
            $port['published'] = [string]$newPort
            $publishedPorts.Add($newPort)
        }
        foreach ($mount in @($service['volumes'])) {
            if ($null -eq $mount) { continue }
            if ($mount['type'] -eq 'bind') {
                if (-not (Test-WithinDirectory $mount['source'] $sourceDirectory)) { throw "Bind mount escapes the source snapshot: $serviceName" }
                if (-not $mount['read_only']) { throw "Only read-only source bind mounts are permitted: $serviceName" }
            } elseif ($mount['type'] -eq 'volume') {
                if (-not $configuration['volumes'].Contains($mount['source'])) { throw "Undeclared volume mount: $serviceName" }
            } else { throw "Unsupported mount type in isolated verification: $serviceName" }
        }
    }
    foreach ($volumeEntry in $configuration['volumes'].GetEnumerator()) {
        if ($volumeEntry.Value['external']) { throw 'External Docker volumes are not permitted in clean verification.' }
        if ($volumeEntry.Value['driver_opts']) { throw 'Host-backed/custom volume driver options are not permitted in clean verification.' }
        $volumeEntry.Value['name'] = "$($ProjectName)_$($volumeEntry.Key)"
    }
    foreach ($networkEntry in $configuration['networks'].GetEnumerator()) {
        if ($networkEntry.Value['external']) { throw 'External Docker networks are not permitted in clean verification.' }
        $networkEntry.Value['name'] = "$($ProjectName)_$($networkEntry.Key)"
    }
    $existingVolumes = (Invoke-DockerChecked -Arguments @('volume', 'ls', '--format', '{{.Name}}') -Capture -LogName 'preflight.log') -split "`n"
    foreach ($volume in $configuration['volumes'].Values) {
        if ($existingVolumes -contains $volume['name']) { throw "A verification volume already exists: $($volume['name'])" }
    }
    $existingNetworks = (Invoke-DockerChecked -Arguments @('network', 'ls', '--format', '{{.Name}}') -Capture -LogName 'preflight.log') -split "`n"
    foreach ($network in $configuration['networks'].Values) {
        if ($existingNetworks -contains $network['name']) { throw "A verification network already exists: $($network['name'])" }
    }
    foreach ($portNumber in $publishedPorts) {
        $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $portNumber)
        try { $listener.Start() } catch { throw "Isolated port is already in use: $portNumber" } finally { $listener.Stop() }
    }
    $configuration['services']['api']['environment']['Email__Enabled'] = 'false'
    $configuration['services']['api']['environment']['Google__ClientId'] = ''
    $resolvedCompose = Join-Path $runDirectory 'compose.private.json'
    $configuration | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $resolvedCompose -Encoding utf8
    $composeArguments = @('compose', '--project-name', $ProjectName, '--project-directory', $sourceDirectory, '--env-file', $envFile, '--file', $resolvedCompose)
    Invoke-ComposeChecked -Arguments @('config', '--quiet') -LogName 'compose-validation.log' -Quiet
    $report.resources = [ordered]@{
        containers = @($configuration['services'].Values | ForEach-Object { $_['container_name'] })
        volumes = @($configuration['volumes'].Values | ForEach-Object { $_['name'] })
        networks = @($configuration['networks'].Values | ForEach-Object { $_['name'] })
        localhostPorts = @($publishedPorts)
    }
    Add-Check 'Isolated Compose configuration' $true 'Unique containers, new named volumes, source-only read-only binds and localhost-only ports.'

    if (-not $SkipBuild) {
        $report.status = 'building'
        Save-Report
        foreach ($serviceEntry in $configuration['services'].GetEnumerator()) {
            if ($serviceEntry.Value['build']) {
                Write-Host "Building committed $($serviceEntry.Key) Dockerfile from the clean source snapshot."
                Invoke-ComposeChecked -Arguments @('--progress', 'plain', 'build', $serviceEntry.Key) -LogName 'build.log'
            }
        }
        Add-Check 'Docker build from committed source' $true 'All buildable services built successfully; Docker layer cache may be reused.'
    }
    $report.status = 'starting'
    Save-Report
    $stackStarted = $true
    Invoke-ComposeChecked -Arguments @('up', '-d', '--no-build') -LogName 'startup.log'
    Wait-ForHttp
    Add-Check 'HTTP readiness' $true 'API /health/ready and Nginx website both returned HTTP 200.'
    $redisPing = Invoke-ComposeChecked -Arguments @('exec', '-T', 'redis', 'redis-cli', 'ping') -LogName 'redis-check.log' -Capture
    Add-Check 'Redis service' ($redisPing.Trim() -eq 'PONG') 'redis-cli ping returned PONG.'
    $minioResponse = Invoke-WebRequest -Uri "$($report.endpoints.minio)/minio/health/live" -TimeoutSec 10 -SkipHttpErrorCheck
    Add-Check 'MinIO service' ($minioResponse.StatusCode -eq 200) 'MinIO liveness returned HTTP 200; upload/read verification is a separate runtime check.'

    $savedEnvironment['SCHEMA_CHECK_CONNECTION_STRING'] = [Environment]::GetEnvironmentVariable('SCHEMA_CHECK_CONNECTION_STRING', 'Process')
    [Environment]::SetEnvironmentVariable('SCHEMA_CHECK_CONNECTION_STRING',
        "Host=127.0.0.1;Port=$PostgresPort;Database=CulinaryBlogSubmission;Username=postgres;Password=$localPassword;SSL Mode=Disable", 'Process')
    $schemaLines = [Collections.Generic.List[string]]::new()
    & dotnet run --project (Join-Path $sourceDirectory 'tests/CulinaryBlog.SchemaCheck/CulinaryBlog.SchemaCheck.csproj') --configuration Release --artifacts-path (Join-Path $runDirectory 'schema-build') 2>&1 | ForEach-Object {
        $safeLine = Protect-Output ([string]$_)
        $schemaLines.Add($safeLine)
        Add-Content -LiteralPath (Join-Path $runDirectory 'schema-check.log') -Value $safeLine -Encoding utf8
        Write-Host $safeLine
    }
    $schemaExitCode = $LASTEXITCODE
    $schemaResult = $schemaLines | Where-Object { $_.StartsWith('SCHEMA_CHECK_RESULT=') } | Select-Object -Last 1
    if ($schemaResult) { $report.schema = $schemaResult.Substring('SCHEMA_CHECK_RESULT='.Length) | ConvertFrom-Json -AsHashtable }
    Add-Check 'Migrated schema contains every mapped table and column' ($schemaExitCode -eq 0 -and $null -ne $report.schema -and $report.schema.passed) 'The read-only schema checker compares the EF relational model with PostgreSQL information_schema; see schema-check.log.'

    $report.initialSeed = Get-SeedStatistics
    $seed = $report.initialSeed
    $seedPassed = $seed.categories -ge 20 -and $seed.recipes -ge 100 -and $seed.recipesBelowMinimum -eq 0
    Add-Check 'Clean migration and Lab 2 seed' $seedPassed "Categories=$($seed.categories), recipes=$($seed.recipes), below-minimum recipes=$($seed.recipesBelowMinimum); both arrays and structured children require 10 ingredients / 5 steps."
    Invoke-ComposeChecked -Arguments @('restart', 'api') -LogName 'restart.log'
    Wait-ForHttp
    $report.seedAfterRestart = Get-SeedStatistics
    $sameSeed = $true
    foreach ($key in @('categories', 'recipes', 'users', 'communityPosts', 'articles', 'migrations', 'recipesBelowMinimum')) {
        if ($report.initialSeed[$key] -ne $report.seedAfterRestart[$key]) { $sameSeed = $false }
    }
    Add-Check 'Restart without duplicate seed data' $sameSeed 'Category, recipe, user, community, article and migration counts remain unchanged after API restart.'
    $serviceDeadline = [DateTimeOffset]::UtcNow.AddSeconds(60)
    do {
        $serviceJson = Invoke-ComposeChecked -Arguments @('ps', '--all', '--format', 'json') -LogName 'services.log' -Capture
        $parsedServices = if ($serviceJson.Trim().StartsWith('[')) {
            @($serviceJson | ConvertFrom-Json)
        } else {
            @($serviceJson -split "`n" | Where-Object { $_.Trim() } | ForEach-Object { $_ | ConvertFrom-Json })
        }
        $report.services = @($parsedServices | ForEach-Object {
            $serviceStatus = $_
            [ordered]@{ name = $serviceStatus.Name; service = $serviceStatus.Service; state = $serviceStatus.State; health = $serviceStatus.Health; exitCode = $serviceStatus.ExitCode }
        })
        $servicesNotReady = [Collections.Generic.List[string]]::new()
        foreach ($expectedService in $configuration['services'].Keys) {
            $matchingServices = @($report.services | Where-Object { $_.service -eq $expectedService })
            if ($matchingServices.Count -ne 1) {
                $servicesNotReady.Add("$expectedService missing or duplicated")
                continue
            }
            $state = $matchingServices[0]
            if ($expectedService -eq 'jaeger-init') {
                if ($state.state -ne 'exited' -or [int]$state.exitCode -ne 0) {
                    $servicesNotReady.Add("$expectedService state=$($state.state), exit=$($state.exitCode)")
                }
            } elseif ($state.state -ne 'running' -or
                (-not [string]::IsNullOrWhiteSpace($state.health) -and $state.health -ne 'healthy')) {
                $servicesNotReady.Add("$expectedService state=$($state.state), health=$($state.health)")
            }
        }
        if ($servicesNotReady.Count -eq 0 -or [DateTimeOffset]::UtcNow -ge $serviceDeadline) { break }
        Start-Sleep -Seconds 2
    } while ($true)
    $serviceDetail = if ($servicesNotReady.Count -eq 0) {
        'Every long-running Compose service is running and all configured health checks are healthy; jaeger-init completed with exit code 0.'
    } else {
        'Compose services did not become ready: ' + ($servicesNotReady -join '; ')
    }
    Add-Check 'All Docker services remain running' ($servicesNotReady.Count -eq 0) $serviceDetail
    $report.status = 'passed'
} catch {
    $report.status = 'failed'
    $report.error = Protect-Output $_.Exception.Message
    if ($stackStarted -and $composeArguments.Count -gt 0) {
        try { Invoke-ComposeChecked -Arguments @('logs', '--no-color', '--tail', '150') -LogName 'failure-services.log' -Quiet } catch { }
    }
    if ($null -ne (Get-Variable runDirectory -ErrorAction SilentlyContinue) -and (Test-Path -LiteralPath $runDirectory)) {
        Save-Report
        Write-Host "Verification failed. Sanitized evidence: $(Join-Path $runDirectory 'summary.json')"
    }
    throw $report.error
} finally {
    if ($StopAfterVerification -and $stackStarted -and $composeArguments.Count -gt 0) {
        try {
            Invoke-ComposeChecked -Arguments @('stop') -LogName 'stop.log' -Quiet
            $report.stoppedAfterVerification = $true
        } catch { Write-Warning 'Unable to stop the isolated test stack; its resources were not deleted.' }
    }
    foreach ($entry in $savedEnvironment.GetEnumerator()) { [Environment]::SetEnvironmentVariable($entry.Key, $entry.Value, 'Process') }
    if ($null -ne (Get-Variable runDirectory -ErrorAction SilentlyContinue) -and (Test-Path -LiteralPath $runDirectory)) { Save-Report }
}

Write-Host "Verification passed. Evidence: $(Join-Path $runDirectory 'summary.json')"
Write-Host "Isolated website: $($report.endpoints.website) | API: $($report.endpoints.api)"
Write-Host 'Existing application data was not changed. Private .env/Compose files must not be published.'
