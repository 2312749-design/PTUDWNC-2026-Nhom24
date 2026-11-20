#requires -Version 7.4
param(
    [Parameter(Mandatory)][string]$Container,
    [string]$Database = 'CulinaryBlogSubmission',
    [string]$OutputDirectory = (Join-Path $PSScriptRoot '../../artifacts/backup-verification')
)
$ErrorActionPreference = 'Stop'
$directory = [IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $directory -Force | Out-Null
$run = [DateTime]::UtcNow.ToString('yyyyMMddHHmmss')
$dump = Join-Path $directory "verification-$run.dump"
$restoreDatabase = "restore_check_$run"
docker exec $Container pg_dump -U postgres --format=custom --no-owner $Database > $dump
if ($LASTEXITCODE -ne 0) { throw 'Backup failed.' }
docker cp $dump "${Container}:/tmp/verification-$run.dump"
if ($LASTEXITCODE -ne 0) { throw 'Copy backup failed.' }
docker exec $Container createdb -U postgres $restoreDatabase
if ($LASTEXITCODE -ne 0) { throw 'Create isolated restore database failed.' }
docker exec $Container pg_restore -U postgres --no-owner --exit-on-error -d $restoreDatabase "/tmp/verification-$run.dump"
if ($LASTEXITCODE -ne 0) { throw 'Restore failed.' }
$sql = 'SELECT (SELECT count(*) FROM "Recipes"), (SELECT count(*) FROM "Categories"), (SELECT count(*) FROM "Users"), (SELECT count(*) FROM "RecipeIngredients"), (SELECT count(*) FROM "RecipeSteps");'
$before = docker exec $Container psql -U postgres -d $Database -At -c $sql
$after = docker exec $Container psql -U postgres -d $restoreDatabase -At -c $sql
if ($LASTEXITCODE -ne 0 -or $before -ne $after) { throw 'Restored row counts do not match source.' }
$result = @{ passed = $true; checkedAt = [DateTime]::UtcNow.ToString('o'); sourceDatabase = $Database; restoredDatabase = $restoreDatabase; counts = $after; dumpBytes = (Get-Item -LiteralPath $dump).Length }
$result | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $directory 'summary.json') -Encoding utf8
Write-Host "PASS: restored into $restoreDatabase; matching recipes/categories/users/ingredients/steps: $after"
