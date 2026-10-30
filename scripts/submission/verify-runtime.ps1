#requires -Version 7.2
[CmdletBinding()]
param(
    [uri]$BaseUrl = 'http://127.0.0.1:15152',
    [string]$OutputDirectory = (Join-Path $PSScriptRoot '../../artifacts/submission/runtime'),
    [PSCredential]$AdminCredential,
    [switch]$AllowNonLocalTarget
)

$ErrorActionPreference = 'Stop'
if (-not $AllowNonLocalTarget -and $BaseUrl.Host -notin @('localhost', '127.0.0.1', '[::1]', '::1')) {
    throw 'This script creates test accounts and a recipe. Use an isolated local stack, or explicitly pass -AllowNonLocalTarget.'
}

$apiRoot = $BaseUrl.AbsoluteUri.TrimEnd('/')
$runId = 'submission' + [DateTime]::UtcNow.ToString('yyyyMMddHHmmss') + [guid]::NewGuid().ToString('N').Substring(0, 6)
$OutputDirectory = [IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$checks = [Collections.Generic.List[object]]::new()
$rateLimitWaits = [Collections.Generic.List[object]]::new()
$created = [ordered]@{ userIds = @(); recipeId = $null; imageId = $null; categoryId = $null; recipeSoftDeleted = $false }
$startedAt = [DateTime]::UtcNow
$currentCheck = 'Initial setup'
$testPassword = 'Submission!' + [guid]::NewGuid().ToString('N') + 'a9'
$nextPassword = 'Submission!' + [guid]::NewGuid().ToString('N') + 'b8'
$owner = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
$other = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
$guest = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
$admin = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
$owner.UserAgent = 'CulinaryBlog-Submission-Smoke/1.0'
$other.UserAgent = $owner.UserAgent
$guest.UserAgent = $owner.UserAgent
$admin.UserAgent = $owner.UserAgent

function Request-Api {
    param(
        [string]$Method,
        [string]$Path,
        [Microsoft.PowerShell.Commands.WebRequestSession]$Session = $guest,
        [object]$Body,
        [hashtable]$Form
    )
    $uri = if ($Path -match '^https?://') { $Path } else { "$apiRoot$Path" }
    $arguments = @{
        Uri = $uri; Method = $Method; WebSession = $Session
        SkipHttpErrorCheck = $true; TimeoutSec = 45
        Headers = @{ Accept = 'application/json' }
    }
    if ($null -ne $Form) {
        $arguments.Form = $Form
    } elseif ($PSBoundParameters.ContainsKey('Body')) {
        $arguments.Body = [Text.Encoding]::UTF8.GetBytes(($Body | ConvertTo-Json -Depth 12 -Compress))
        $arguments.ContentType = 'application/json; charset=utf-8'
    }
    $response = Invoke-WebRequest @arguments
    # A complete verification legitimately performs more auth operations than
    # the normal five-per-minute policy. Honor the real policy instead of
    # weakening application configuration for a green test result.
    if ([int]$response.StatusCode -eq 429 -and ([uri]$uri).AbsolutePath -match '/auth/(login|refresh|register|signup)$') {
        for ($attempt = 1; $attempt -le 2 -and [int]$response.StatusCode -eq 429; $attempt++) {
            $waitSeconds = 61
            $retryAfter = [string]($response.Headers['Retry-After'] | Select-Object -First 1)
            $numericDelay = 0
            if ([int]::TryParse($retryAfter, [ref]$numericDelay)) {
                $waitSeconds = [Math]::Clamp($numericDelay + 1, 1, 75)
            } elseif ($retryAfter) {
                $retryDate = [DateTimeOffset]::MinValue
                if ([DateTimeOffset]::TryParse($retryAfter, [ref]$retryDate)) {
                    $waitSeconds = [Math]::Clamp([int][Math]::Ceiling(($retryDate - [DateTimeOffset]::UtcNow).TotalSeconds) + 1, 1, 75)
                }
            }
            $rateLimitWaits.Add([PSCustomObject]@{ path = ([uri]$uri).AbsolutePath; waitSeconds = $waitSeconds; attempt = $attempt })
            Write-Host "Auth rate limit returned 429; respecting a $waitSeconds second retry window."
            for ($remaining = $waitSeconds; $remaining -gt 0; $remaining -= 5) {
                Start-Sleep -Seconds ([Math]::Min(5, $remaining))
            }
            $response = Invoke-WebRequest @arguments
        }
    }
    $json = $null
    if ($response.Content -and $response.Headers['Content-Type'] -match '(json|problem)') {
        $content = if ($response.Content -is [byte[]]) { [Text.Encoding]::UTF8.GetString($response.Content) } else { [string]$response.Content }
        $json = $content | ConvertFrom-Json -Depth 30
    }
    [PSCustomObject]@{ Status = [int]$response.StatusCode; Json = $json; Headers = $response.Headers; Content = $response.Content }
}

function Payload {
    param($Response)
    if ($null -ne $Response.Json -and $Response.Json.PSObject.Properties.Name -contains 'data') {
        return $Response.Json.data
    }
    return $Response.Json
}

function Check {
    param([string]$Name, [bool]$Condition, [string]$Detail = '')
    $script:currentCheck = $Name
    $checks.Add([PSCustomObject]@{ name = $Name; passed = $Condition; detail = $Detail })
    if (-not $Condition) { throw "Check failed: $Name. $Detail" }
    Write-Host "PASS $Name"
}

function Expect-Status {
    param([string]$Name, $Response, [int[]]$Expected)
    Check $Name ($Response.Status -in $Expected) "HTTP $($Response.Status); expected $($Expected -join '/')."
}

function Read-Recipe {
    param([Microsoft.PowerShell.Commands.WebRequestSession]$Session = $owner)
    $response = Request-Api GET "/api/v1/recipes/$($created.recipeId)" $Session
    Expect-Status 'Read recipe' $response @(200)
    return Payload $response
}

function Is-Status {
    param($Value, [string]$Name, [int]$Number)
    return "$Value" -eq $Name -or "$Value" -eq "$Number"
}

$failure = $null
try {
    $health = Request-Api GET '/health'
    Expect-Status 'API health endpoint' $health @(200)
    foreach ($service in @('database', 'redis', 'minio')) {
        $entry = $health.Json.checks.$service
        Check "Real $service readiness" ($null -ne $entry -and $entry.status -eq 'Healthy' -and $entry.description -notmatch '(disabled|local storage is active)')
    }

    $categoriesResponse = Request-Api GET '/api/v1/categories'
    Expect-Status 'Public category list' $categoriesResponse @(200)
    $categories = @(Payload $categoriesResponse)
    Check 'Seed has at least 20 visible categories' ($categories.Count -ge 20) "Visible categories: $($categories.Count)."
    $created.categoryId = $categories[0].id
    $categoryBefore = Payload (Request-Api GET "/api/v1/categories/$($created.categoryId)")
    $beforeCount = [int]$categoryBefore.recipeCount

    $anonymousProfile = Request-Api GET '/api/v1/auth/me'
    Expect-Status 'Anonymous cannot read private profile' $anonymousProfile @(401)
    foreach ($account in @(@{ suffix = 'owner'; session = $owner }, @{ suffix = 'other'; session = $other })) {
        $username = $runId + $account.suffix
        $registration = Request-Api POST '/api/v1/auth/register' $account.session @{
            displayName = "Submission $($account.suffix)"; username = $username
            email = "$username@example.invalid"; password = $testPassword; confirmPassword = $testPassword
            captchaQuestion = '8 + 5'; captchaAnswer = '13'
        }
        Expect-Status "Register $($account.suffix) test account" $registration @(200, 201)
        $registered = Payload $registration
        $created.userIds += $registered.user.id
        $cookies = $account.session.Cookies.GetCookies([uri]$apiRoot)
        Check "HttpOnly session cookies for $($account.suffix)" ($cookies['culinary_access_token'].HttpOnly -and $cookies['culinary_refresh_token'].HttpOnly)
        $login = Request-Api POST '/api/v1/auth/login' $account.session @{ username = $username; password = $testPassword }
        Expect-Status "Login $($account.suffix) using password" $login @(200)
    }

    $profile = Payload (Request-Api GET '/api/v1/auth/me' $owner)
    Check 'Cookie authentication identifies owner' ($profile.id -eq $created.userIds[0])
    $profileUpdate = Request-Api PATCH '/api/v1/auth/me' $owner @{
        displayName = "Submission verified $runId"; bio = 'Isolated final-submission runtime verification.'
    }
    Expect-Status 'Update profile with cookie authentication' $profileUpdate @(200)
    $profileReload = Payload (Request-Api GET '/api/v1/auth/me' $owner)
    Check 'Profile survives a new HTTP request' ($profileReload.displayName -eq "Submission verified $runId")
    $accountProfile = Payload (Request-Api GET '/api/v1/account/me' $owner)
    Check 'Account settings API identifies the same owner' ($accountProfile.id -eq $created.userIds[0])
    Expect-Status 'Save account settings profile' (Request-Api PUT '/api/v1/account/profile' $owner @{
        username = $accountProfile.username; email = $accountProfile.email; fullName = "Submission profile $runId"
        bio = 'Verified account settings endpoint.'; phoneNumber = '0900000000'; birthDate = '2000-01-01'
    }) @(200)
    $accountReload = Payload (Request-Api GET '/api/v1/account/me' $owner)
    Check 'Account settings persist after reload' ($accountReload.fullName -eq "Submission profile $runId" -and $accountReload.phoneNumber -eq '0900000000')
    $privateAdmin = Request-Api GET '/api/v1/admin/overview' $owner
    Expect-Status 'Ordinary account cannot access admin overview' $privateAdmin @(403)

    $ingredients = @(1..10 | ForEach-Object { @{ name = "Nguyên liệu kiểm thử $_"; quantity = "$_"; unit = 'g'; orderIndex = $_ } })
    $steps = @(1..5 | ForEach-Object { @{ title = "Bước $_"; description = "Sơ chế và nấu nguyên liệu kiểm thử ở bước $_."; timerMinutes = $_ } })
    $recipeBody = @{
        title = "Canh rau củ kiểm thử $runId"; description = 'Công thức dùng riêng để kiểm tra bản nộp, không thay đổi dữ liệu cũ.'
        categoryId = $created.categoryId; prepTimeMinutes = 10; cookTimeMinutes = 15; servings = 4
        difficulty = 'Easy'; isVegetarian = $true; recipeIngredients = $ingredients; recipeSteps = $steps
        nutrition = @{ calories = 120; protein = 4; carbohydrates = 18; fat = 3; fiber = 5; sodium = 200 }
    }
    $create = Request-Api POST '/api/v1/recipes' $owner $recipeBody
    Expect-Status 'Create recipe with 10 ingredients and 5 steps' $create @(201)
    $recipe = Payload $create
    $created.recipeId = $recipe.id
    Check 'Created recipe has an identifier' (-not [string]::IsNullOrWhiteSpace($created.recipeId))
    Check 'New recipe starts as Draft' (Is-Status $recipe.status 'Draft' 0)
    Check 'Structured content persisted at creation' (@($recipe.recipeIngredients).Count -eq 10 -and @($recipe.recipeSteps).Count -eq 5)
    Expect-Status 'Guest cannot read another author draft' (Request-Api GET "/api/v1/recipes/$($created.recipeId)") @(404)
    Expect-Status 'Other account cannot read owner draft' (Request-Api GET "/api/v1/recipes/$($created.recipeId)" $other) @(404)
    Expect-Status 'Other account cannot modify owner recipe' (Request-Api PUT "/api/v1/recipes/$($created.recipeId)" $other $recipeBody) @(403)
    Expect-Status 'Other account cannot delete owner recipe' (Request-Api DELETE "/api/v1/recipes/$($created.recipeId)" $other) @(403)
    $invalid = Request-Api POST '/api/v1/recipes' $owner @{ title = 'x'; categoryId = $created.categoryId; prepTimeMinutes = -1; servings = 0 }
    Expect-Status 'Invalid recipe is rejected' $invalid @(400, 422)
    Check 'Invalid input uses Problem Details' ($invalid.Json.status -in @(400, 422) -and $null -ne $invalid.Json.errors)

    $ingredient = Payload (Request-Api POST "/api/v1/recipes/$($created.recipeId)/ingredients" $owner @{ name = 'Hành lá kiểm thử'; quantity = '5'; unit = 'g' })
    Check 'Add ingredient' (-not [string]::IsNullOrWhiteSpace($ingredient.id))
    Expect-Status 'Update ingredient' (Request-Api PUT "/api/v1/recipes/$($created.recipeId)/ingredients/$($ingredient.id)" $owner @{ name = 'Hành lá đã sửa'; quantity = '8'; unit = 'g'; orderIndex = 1 }) @(200)
    $ingredientRows = @(Payload (Request-Api GET "/api/v1/recipes/$($created.recipeId)/ingredients" $owner))
    Check 'Ingredient update and reorder persist' ($ingredientRows[0].id -eq $ingredient.id -and $ingredientRows[0].quantity -eq '8')
    Expect-Status 'Delete own added ingredient' (Request-Api DELETE "/api/v1/recipes/$($created.recipeId)/ingredients/$($ingredient.id)" $owner) @(200, 204)
    $ingredientRows = @(Payload (Request-Api GET "/api/v1/recipes/$($created.recipeId)/ingredients" $owner))
    Check 'Ingredient order is contiguous after delete' (($ingredientRows.orderIndex -join ',') -eq '1,2,3,4,5,6,7,8,9,10')

    $step = Payload (Request-Api POST "/api/v1/recipes/$($created.recipeId)/steps" $owner @{ title = 'Bước kiểm tra'; description = 'Nếm lại trước khi phục vụ.'; timerMinutes = 2 })
    Check 'Add step' (-not [string]::IsNullOrWhiteSpace($step.id))
    Expect-Status 'Update step' (Request-Api PUT "/api/v1/recipes/$($created.recipeId)/steps/$($step.id)" $owner @{ title = 'Bước đã sửa'; description = 'Nếm lại và trình bày món ăn.'; timerMinutes = 3 }) @(200)
    $stepRows = @(Payload (Request-Api GET "/api/v1/recipes/$($created.recipeId)/steps" $owner))
    Check 'Step update persists' (@($stepRows | Where-Object { $_.id -eq $step.id -and $_.timerMinutes -eq 3 }).Count -eq 1)
    Expect-Status 'Delete own added step' (Request-Api DELETE "/api/v1/recipes/$($created.recipeId)/steps/$($step.id)" $owner) @(200, 204)
    $stepRows = @(Payload (Request-Api GET "/api/v1/recipes/$($created.recipeId)/steps" $owner))
    Check 'Step sequence is contiguous after delete' (($stepRows.stepNumber -join ',') -eq '1,2,3,4,5')

    $fixturePath = Join-Path $OutputDirectory "$runId.png"
    [IO.File]::WriteAllBytes($fixturePath, [Convert]::FromBase64String('iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACLSURBVHhe7dAxAQAgEIDAL2RNo3xN3akAwy2MzNn7zIbBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYNIDBpgEMNg1gsGkAg00DGGwawGDTAAabBjDYfCmcgizyrqgyAAAAAElFTkSuQmCC'))
    $upload = Request-Api POST "/api/v1/recipes/$($created.recipeId)/images" $owner -Form @{ file = Get-Item -LiteralPath $fixturePath }
    Expect-Status 'Upload actual PNG to configured storage' $upload @(201)
    $image = Payload $upload
    $created.imageId = $image.id
    Check 'Upload returns original and resized image URLs' ($image.url -and $image.thumbnailUrl -and $image.mediumUrl)
    Expect-Status 'Original image is publicly readable' (Request-Api GET $image.url) @(200)
    $variantsReady = $false
    $variantDeadline = [DateTime]::UtcNow.AddSeconds(30)
    do {
        $thumbnail = Request-Api GET $image.thumbnailUrl
        $medium = Request-Api GET $image.mediumUrl
        $variantsReady = $thumbnail.Status -eq 200 -and $medium.Status -eq 200
        if (-not $variantsReady) { Start-Sleep -Milliseconds 500 }
    } while (-not $variantsReady -and [DateTime]::UtcNow -lt $variantDeadline)
    Check 'Hangfire creates readable thumbnail and medium variants' $variantsReady
    $avatarUpload = Request-Api POST '/api/v1/account/avatar' $owner -Form @{ file = Get-Item -LiteralPath $fixturePath }
    Expect-Status 'Upload avatar to real storage' $avatarUpload @(200)
    $avatar = Payload $avatarUpload
    Expect-Status 'Avatar image is publicly readable' (Request-Api GET $avatar.avatarUrl) @(200)
    $avatarProfile = Payload (Request-Api GET '/api/v1/account/me' $owner)
    Check 'Avatar URL survives profile reload' ($avatarProfile.avatarUrl -eq $avatar.avatarUrl)
    $recipe = Read-Recipe
    Check 'Recipe main image survives reload' ($recipe.imageUrl -eq $image.url)
    $recipeBody.title = "Canh rau củ đã cập nhật $runId"
    $recipeBody.imageUrl = $image.url
    Expect-Status 'Update recipe while preserving uploaded image' (Request-Api PUT "/api/v1/recipes/$($created.recipeId)" $owner $recipeBody) @(200)
    $recipe = Read-Recipe
    Check 'Updated recipe and image both persist' ($recipe.title -eq $recipeBody.title -and $recipe.imageUrl -eq $image.url)

    Expect-Status 'Submit recipe for review' (Request-Api POST "/api/v1/recipes/$($created.recipeId)/submit-review" $owner) @(200)
    Expect-Status 'Publish recipe' (Request-Api POST "/api/v1/recipes/$($created.recipeId)/publish" $owner) @(200)
    $publicRecipe = Read-Recipe $guest
    Check 'Published recipe is visible to guests' (Is-Status $publicRecipe.status 'Published' 1)
    $search = Request-Api GET ('/api/v1/search/recipes?q=' + [uri]::EscapeDataString($runId) + '&page=1&pageSize=12')
    Expect-Status 'PostgreSQL full-text search request' $search @(200)
    Check 'Search finds published recipe and reports pagination' (@((Payload $search) | Where-Object id -eq $created.recipeId).Count -eq 1 -and $search.Json.meta.total -ge 1)
    $categoryAfter = Payload (Request-Api GET "/api/v1/categories/$($created.categoryId)")
    Check 'Category automatically includes published recipe' (@($categoryAfter.recipes | Where-Object id -eq $created.recipeId).Count -eq 1 -and [int]$categoryAfter.recipeCount -eq $beforeCount + 1)

    Expect-Status 'Unpublish recipe' (Request-Api POST "/api/v1/recipes/$($created.recipeId)/unpublish" $owner) @(200)
    Expect-Status 'Unpublished recipe leaves public detail cache' (Request-Api GET "/api/v1/recipes/$($created.recipeId)") @(404)
    Expect-Status 'Archive recipe' (Request-Api POST "/api/v1/recipes/$($created.recipeId)/archive" $owner) @(200)
    Check 'Archive status persists' (Is-Status (Read-Recipe).status 'Archived' 2)
    Expect-Status 'Restore archived recipe' (Request-Api POST "/api/v1/recipes/$($created.recipeId)/restore" $owner) @(200)
    Check 'Restored recipe returns to Draft' (Is-Status (Read-Recipe).status 'Draft' 0)
    Expect-Status 'Delete own uploaded image' (Request-Api DELETE "/api/v1/recipes/$($created.recipeId)/images/$($created.imageId)" $owner) @(200, 204)
    $recipeAfterImageDelete = Read-Recipe
    Check 'Deleting main image clears its recipe reference' ([string]::IsNullOrEmpty($recipeAfterImageDelete.imageUrl))
    Expect-Status 'Soft delete only smoke-created recipe' (Request-Api DELETE "/api/v1/recipes/$($created.recipeId)" $owner) @(200, 204)
    $created.recipeSoftDeleted = $true
    Expect-Status 'Deleted recipe is hidden from owner detail' (Request-Api GET "/api/v1/recipes/$($created.recipeId)" $owner) @(404)

    Expect-Status 'Refresh session using HttpOnly cookie' (Request-Api POST '/api/v1/auth/refresh' $owner @{}) @(200)
    Expect-Status 'Profile remains accessible after refresh' (Request-Api GET '/api/v1/auth/me' $owner) @(200)
    Expect-Status 'Change password on smoke account' (Request-Api PUT '/api/v1/account/password' $owner @{ currentPassword = $testPassword; newPassword = $nextPassword }) @(200)
    $relogin = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
    Expect-Status 'Old password no longer logs in' (Request-Api POST '/api/v1/auth/login' $relogin @{ username = $runId + 'owner'; password = $testPassword }) @(401)
    Expect-Status 'New password logs in' (Request-Api POST '/api/v1/auth/login' $relogin @{ username = $runId + 'owner'; password = $nextPassword }) @(200)
    Expect-Status 'Logout new session' (Request-Api POST '/api/v1/auth/logout' $relogin @{}) @(200, 204)
    Expect-Status 'Profile is private after logout' (Request-Api GET '/api/v1/auth/me' $relogin) @(401)
    Expect-Status 'Logged-out session cannot refresh' (Request-Api POST '/api/v1/auth/refresh' $relogin @{}) @(400, 401)

    if ($AdminCredential) {
        $adminLogin = Request-Api POST '/api/v1/auth/login' $admin @{ username = $AdminCredential.UserName; password = $AdminCredential.GetNetworkCredential().Password }
        Expect-Status 'Admin logs in' $adminLogin @(200)
        foreach ($route in @('overview', 'users', 'recipes', 'categories', 'audit-logs')) {
            Expect-Status "Admin reads $route" (Request-Api GET "/api/v1/admin/$route" $admin) @(200)
        }
        Expect-Status 'Admin logs out' (Request-Api POST '/api/v1/auth/logout' $admin @{}) @(200, 204)
    }
} catch {
    # Never persist raw HTTP responses, credentials, authentication headers or cookies.
    $failure = if ($_.Exception.Message -like 'Check failed:*') { $_.Exception.Message } else { "Runtime request failed during '$currentCheck' ($($_.Exception.GetType().Name), script line $($_.InvocationInfo.ScriptLineNumber))." }
    if ($checks.Count -eq 0 -or $checks[$checks.Count - 1].passed) {
        $checks.Add([PSCustomObject]@{ name = $currentCheck; passed = $false; detail = $failure })
    }
} finally {
    foreach ($session in @($owner, $other)) {
        try { $null = Request-Api POST '/api/v1/auth/logout' $session @{} } catch { }
    }
    $summary = [ordered]@{
        runId = $runId; target = $apiRoot; startedAtUtc = $startedAt.ToString('o'); finishedAtUtc = [DateTime]::UtcNow.ToString('o')
        passed = ($null -eq $failure); checksPassed = @($checks | Where-Object passed).Count; checksTotal = $checks.Count
        created = $created; checks = @($checks.ToArray()); rateLimitWaits = @($rateLimitWaits.ToArray()); failure = $failure
        limits = @('Only smoke-created records are changed; test accounts remain in the isolated database.', 'Browser UI, actual Google OAuth and external SMTP delivery are not covered.', 'A healthy service check does not prove resilience to that service failing later.')
    }
    $summaryPath = Join-Path $OutputDirectory "$runId.json"
    $summary | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath $summaryPath -Encoding utf8
    Write-Host "Evidence: $summaryPath"
}

if ($failure) { throw $failure }
[PSCustomObject]@{ Passed = $true; Checks = $checks.Count; Evidence = $summaryPath }
