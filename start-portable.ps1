[CmdletBinding()]
param(
    [switch]$NoBuild
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
    throw "Docker Desktop chua san sang. Hay mo Docker Desktop va doi den khi engine khoi dong xong."
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

$composeArgs = @("compose", "up", "-d")
if (-not $NoBuild) {
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
