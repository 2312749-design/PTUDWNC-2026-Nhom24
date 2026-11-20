[CmdletBinding()]
param(
    [switch]$NoBuild,
    [switch]$SkipBrowser
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $projectRoot

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Khong tim thay Docker. Hay cai va mo Docker Desktop truoc khi chay script."
}

try {
    docker info *> $null
} catch {
    $dockerDesktop = Join-Path $env:ProgramFiles "Docker\Docker\Docker Desktop.exe"
    if (Test-Path -LiteralPath $dockerDesktop) {
        Write-Host "Dang mo Docker Desktop..." -ForegroundColor Yellow
        Start-Process -FilePath $dockerDesktop -WindowStyle Hidden
        $ready = $false
        for ($attempt = 0; $attempt -lt 90; $attempt++) {
            Start-Sleep -Seconds 2
            docker info *> $null
            if ($LASTEXITCODE -eq 0) {
                $ready = $true
                break
            }
        }
        if (-not $ready) {
            throw "Docker Desktop khong khoi dong sau 3 phut. Hay mo Docker Desktop va chay lai START.bat."
        }
    } else {
        throw "Chua cai Docker Desktop. Hay cai Docker Desktop truoc khi chay bai."
    }
}

$envPath = Join-Path $projectRoot ".env"
$examplePath = Join-Path $projectRoot ".env.example"

if (-not (Test-Path -LiteralPath $envPath)) {
    $randomBytes = [byte[]]::new(48)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($randomBytes)
    $secret = [Convert]::ToBase64String($randomBytes).Replace("+", "A").Replace("/", "B").TrimEnd("=")

    $content = Get-Content -LiteralPath $examplePath -Raw
    $content = $content.Replace("change-me-postgres-password", "culinary-local-postgres-2026")
    $content = $content.Replace("change-me-minio-root-user", "culinaryadmin")
    $content = $content.Replace("change-me-minio-root-password", "culinary-local-minio-2026")
    $content = $content.Replace("change-me-grafana-admin-password", "culinary-local-grafana-2026")
    $content = $content.Replace("change-me-with-a-unique-random-secret-of-at-least-32-characters", $secret)
    Set-Content -LiteralPath $envPath -Value $content -Encoding utf8NoBOM
    Write-Host "Da tao file .env cho may nay." -ForegroundColor Green
}

$imageBundle = Join-Path $projectRoot "docker-images.tar"
$requiredImages = @(
    "culinaryblog-api:portable",
    "culinaryblog-frontend:portable",
    "culinaryblog-minio:portable",
    "postgres:16-alpine",
    "redis:7-alpine",
    "busybox:1.36",
    "otel/opentelemetry-collector-contrib:0.123.0",
    "jaegertracing/all-in-one:1.76.0",
    "prom/prometheus:v3.2.1",
    "grafana/grafana:11.6.0",
    "nginx:1.27-alpine"
)

$missingImages = @()
foreach ($requiredImage in $requiredImages) {
    docker image inspect $requiredImage *> $null
    if ($LASTEXITCODE -ne 0) {
        $missingImages += $requiredImage
    }
}

if ($missingImages.Count -gt 0 -and (Test-Path -LiteralPath $imageBundle)) {
    Write-Host "Dang nap Docker image dong goi san. Buoc nay chi chay o lan dau..." -ForegroundColor Yellow
    docker load --input $imageBundle
    if ($LASTEXITCODE -ne 0) {
        throw "Khong nap duoc Docker image dong goi san."
    }
    $missingImages = @()
}

$composeArgs = @("compose", "up", "-d")
if ($missingImages.Count -eq 0) {
    $composeArgs += "--no-build"
} elseif (-not $NoBuild) {
    Write-Host "Khong co goi image dung san; Docker se build source o lan dau." -ForegroundColor Yellow
    $composeArgs += "--build"
}

& docker @composeArgs
if ($LASTEXITCODE -ne 0) {
    throw "Docker Compose khoi dong that bai. Chay 'docker compose logs --tail 200' de xem chi tiet."
}

Write-Host ""
Write-Host "Culinary Blog da duoc khoi dong." -ForegroundColor Green
Write-Host "Website:  http://localhost:3000"
Write-Host "Swagger:  http://localhost:8080/swagger/index.html"
Write-Host "Health:   http://localhost:8080/health/ready"
Write-Host "MinIO:    http://localhost:9001"
Write-Host "Jaeger:   http://localhost:16686"
Write-Host "Grafana:  http://localhost:3001"
Write-Host ""
Write-Host "Tai khoan Admin: admin@culinaryblog.com / chefdemo" -ForegroundColor Yellow
Write-Host "Lan khoi dong dau co the mat vai phut de build image va phuc hoi database."

if (-not $SkipBrowser) {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000"
}
