param([int]$TargetCount = 100)

$ErrorActionPreference = 'Stop'
$headers = @{ 'User-Agent' = 'Mozilla/5.0 (compatible; CulinaryBlogEducationalImporter/1.0)' }
$root = 'https://www.dienmayxanh.com'
$recipePattern = '(?:https://www\.dienmayxanh\.com)?/vao-bep/[a-z0-9-]+-\d{4,6}'
$categoryMap = @{
  'Món canh'='Món canh'; 'Món bánh'='Bánh ngọt'; 'Món chè'='Món tráng miệng'; 'Món kem'='Món tráng miệng'
  'Món nước'='Món Việt'; 'Món nướng'='Món nướng'; 'Món cháo'='Món Việt'; 'Món xào'='Món xào'
  'Món kho'='Món kho'; 'Món chiên'='Món chiên'; 'Món hấp'='Món hấp'; 'Món lẩu'='Món lẩu'
  'Món gỏi - salad'='Món gỏi'; 'Món từ gà'='Món từ thịt'; 'Món từ bò'='Món từ thịt'; 'Món chay'='Món chay'
  'Ăn vặt'='Món ăn nhanh'; 'Thức uống'='Đồ uống'; 'Sinh tố'='Đồ uống'; 'Trà sữa'='Đồ uống'
  'Nước ép'='Đồ uống'; 'Món tráng miệng'='Món tráng miệng'; 'Món cuốn - trộn'='Món gỏi'
}

function Add-Links([string]$html, [System.Collections.Generic.Queue[string]]$queue, [System.Collections.Generic.HashSet[string]]$known) {
  foreach ($match in [regex]::Matches($html, $recipePattern, 'IgnoreCase')) {
    $url = [System.Net.WebUtility]::HtmlDecode($match.Value).Split('?')[0]
    if ($url.StartsWith('/')) { $url = "$root$url" }
    if ($known.Add($url)) { $queue.Enqueue($url) }
  }
}

function Read-Recipe([string]$url, [string]$html) {
  $scripts = [regex]::Matches($html, '<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', 'Singleline')
  foreach ($match in $scripts) {
    if ($match.Groups[1].Value -notmatch 'recipeIngredient') { continue }
    try { $data = [System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value.Trim()) | ConvertFrom-Json } catch { continue }
    if ($data.'@type' -ne 'Recipe') { continue }
    $ingredients = @($data.recipeIngredient | ForEach-Object { ([string]$_).Trim() } | Where-Object { $_ }) | Select-Object -Unique
    $steps = @($data.recipeInstructions | ForEach-Object {
      $title = ([string]$_.name).Trim(); $text = ([string]$_.text).Trim()
      if ($text) { [pscustomobject]@{ Title=if($title){$title}else{'Bước thực hiện'}; Text=$text } }
    })
    if ($ingredients.Count -lt 10 -or $steps.Count -lt 5) { return $null }
    $sourceCategory = ([string]$data.recipeCategory).Trim()
    $targetCategory = if ($categoryMap.ContainsKey($sourceCategory)) { $categoryMap[$sourceCategory] } else { 'Món Việt' }
    $image = if ($data.image -is [array]) { [string]$data.image[0] } elseif ($data.image.url) { [string]$data.image.url } else { [string]$data.image }
    if (-not $image) { return $null }
    $idMatch = [regex]::Match($url, '-(\d{4,6})$')
    if (-not $idMatch.Success) { return $null }
    return [pscustomobject]@{
      SourceId=$idMatch.Groups[1].Value; SourceUrl=$url; Title=([string]$data.name).Trim(); ImageUrl=$image.Trim()
      Description=([string]$data.description).Trim(); SourceCategory=$sourceCategory; Category=$targetCategory
      Ingredients=$ingredients; Steps=$steps; PrepTime=([string]$data.prepTime); CookTime=([string]$data.cookTime)
      Yield=([string]$data.recipeYield)
    }
  }
  return $null
}

function Sql([string]$value) { return "'" + (($value -replace "`0", '').Replace("'", "''")) + "'" }
function PgArray($values) { return 'ARRAY[' + (($values | ForEach-Object { Sql ([string]$_) }) -join ',') + ']::text[]' }
function Minutes([string]$duration, [int]$fallback) {
  if (-not $duration) { return $fallback }
  try { return [Math]::Max(0, [int][System.Xml.XmlConvert]::ToTimeSpan($duration).TotalMinutes) } catch { return $fallback }
}

$queue = [System.Collections.Generic.Queue[string]]::new()
$known = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$visited = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$acceptedIds = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$acceptedTitles = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$acceptedImages = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$categoryCounts = @{}
$recipes = [System.Collections.Generic.List[object]]::new()

$landingHtml = (Invoke-WebRequest -Uri "$root/vao-bep" -UseBasicParsing -TimeoutSec 40 -Headers $headers).Content
Add-Links $landingHtml $queue $known

while ($queue.Count -gt 0 -and $recipes.Count -lt $TargetCount -and $visited.Count -lt 900) {
  $url = $queue.Dequeue()
  if (-not $visited.Add($url)) { continue }
  try {
    $html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 35 -Headers $headers).Content
    Add-Links $html $queue $known
    $recipe = Read-Recipe $url $html
    if ($null -eq $recipe) { continue }
    if (-not $acceptedIds.Add($recipe.SourceId)) { continue }
    if (-not $acceptedTitles.Add($recipe.Title)) { $acceptedIds.Remove($recipe.SourceId) | Out-Null; continue }
    if (-not $acceptedImages.Add($recipe.ImageUrl)) { $acceptedIds.Remove($recipe.SourceId) | Out-Null; $acceptedTitles.Remove($recipe.Title) | Out-Null; continue }
    $count = if ($categoryCounts.ContainsKey($recipe.Category)) { [int]$categoryCounts[$recipe.Category] } else { 0 }
    if ($count -ge 15) { $acceptedIds.Remove($recipe.SourceId) | Out-Null; $acceptedTitles.Remove($recipe.Title) | Out-Null; $acceptedImages.Remove($recipe.ImageUrl) | Out-Null; continue }
    $categoryCounts[$recipe.Category] = $count + 1
    $recipes.Add($recipe)
    if ($recipes.Count % 10 -eq 0) { Write-Output "Collected $($recipes.Count)/$TargetCount valid recipes (visited $($visited.Count))." }
  } catch { }
  Start-Sleep -Milliseconds 80
}

if ($recipes.Count -lt $TargetCount) { throw "Only collected $($recipes.Count)/$TargetCount valid recipes; database was not changed." }

$categoryCsv = docker exec culinaryblog-db psql -U postgres -d CulinaryBlogDb -At -F '|' -c 'SELECT "Name", "Id" FROM "Categories" WHERE NOT "IsDeleted";'
$categoryIds = @{}
foreach ($line in $categoryCsv) { $parts=$line -split '\|',2; if($parts.Count -eq 2){$categoryIds[$parts[0]]=$parts[1]} }
$authorId = (docker exec culinaryblog-db psql -U postgres -d CulinaryBlogDb -At -c 'SELECT "Id" FROM "Users" WHERE "UserName"=''chefdemo'' LIMIT 1;').Trim()
if (-not $authorId) { throw 'Admin seed account was not found.' }
$existingCsv = docker exec culinaryblog-db psql -U postgres -d CulinaryBlogDb -At -F '|' -c 'SELECT "CategoryId",COUNT(*) FROM "Recipes" WHERE NOT "IsDeleted" AND "Slug" LIKE ''dmx-%'' GROUP BY "CategoryId";'
$existingByCategory = @{}
foreach ($line in $existingCsv) { $parts=$line -split '\|',2; if($parts.Count -eq 2){$existingByCategory[$parts[0]]=[int]$parts[1]} }

$sql = [System.Collections.Generic.List[string]]::new()
$sql.Add('BEGIN;')
$sql.Add('DELETE FROM "Recipes" WHERE "Slug" LIKE ''dmx-%'';')
foreach ($group in $recipes | Group-Object Category) {
  $categoryId = $categoryIds[$group.Name]
  if (-not $categoryId) { throw "Category not found: $($group.Name)" }
  $alreadyImported = if ($existingByCategory.ContainsKey($categoryId)) { [int]$existingByCategory[$categoryId] } else { 0 }
  $take = [Math]::Max(0, $group.Count - $alreadyImported)
  if ($take -gt 0) { $sql.Add(('WITH old AS (SELECT "Id" FROM "Recipes" WHERE "CategoryId"=''{0}'' AND NOT "IsDeleted" AND "Slug" NOT LIKE ''dmx-%'' ORDER BY "CreatedAt", "Id" LIMIT {1}) UPDATE "Recipes" r SET "IsDeleted"=true, "DeletedAt"=NOW(), "UpdatedAt"=NOW() FROM old WHERE r."Id"=old."Id";' -f $categoryId,$take)) }
}

foreach ($recipe in $recipes) {
  $id = [guid]::NewGuid().ToString(); $categoryId=$categoryIds[$recipe.Category]
  $prep=Minutes $recipe.PrepTime 15; $cook=Minutes $recipe.CookTime 30; $total=[Math]::Max(1,$prep+$cook)
  $servingsMatch=[regex]::Match($recipe.Yield,'\d+'); $servings=if($servingsMatch.Success){[int]$servingsMatch.Value}else{4}
  $description = $recipe.Description
  $instructionTexts=@($recipe.Steps | ForEach-Object {$_.Text})
  $vegetarian = if ($recipe.SourceCategory -eq 'Món chay') { 'true' } else { 'false' }
  $sql.Add(('INSERT INTO "Recipes" ("Id","Title","Slug","Description","CategoryId","AuthorId","Status","Instructions","Ingredients","ImageUrl","CookingTimeMinutes","Difficulty","IsVegetarian","CreatedAt","IsDeleted","UpdatedAt","CookTimeMinutes","PrepTimeMinutes","Servings","ReviewStatus","ReviewNote","ReviewRequestedAt","ReviewedAt","ReviewedById") VALUES (''{0}'',{1},''dmx-{2}'',{3},''{4}'',''{5}'',1,{6},{7},{8},{9},''Medium'',{10},NOW(),false,NOW(),{11},{12},{13},''Approved'',NULL,NOW(),NOW(),''{5}'');' -f $id,(Sql $recipe.Title),$recipe.SourceId,(Sql $description),$categoryId,$authorId,(PgArray $instructionTexts),(PgArray $recipe.Ingredients),(Sql $recipe.ImageUrl),$total,$vegetarian,$cook,([Math]::Max(1,$prep)),([Math]::Max(1,$servings))))
  for($i=0;$i -lt $recipe.Ingredients.Count;$i++){
    $ingredientId=[guid]::NewGuid().ToString(); $name=[string]$recipe.Ingredients[$i]
    $sql.Add(('INSERT INTO "RecipeIngredients" ("Id","RecipeId","Name","Quantity","Unit","Notes","OrderIndex") VALUES (''{0}'',''{1}'',{2},NULL,NULL,NULL,{3});' -f $ingredientId,$id,(Sql $name),($i+1)))
  }
  for($i=0;$i -lt $recipe.Steps.Count;$i++){
    $stepId=[guid]::NewGuid().ToString(); $step=$recipe.Steps[$i]
    $sql.Add(('INSERT INTO "RecipeSteps" ("Id","RecipeId","Title","Description","StepNumber","TimerMinutes","ImageUrl") VALUES (''{0}'',''{1}'',{2},{3},{4},NULL,NULL);' -f $stepId,$id,(Sql ([string]$step.Title)),(Sql ([string]$step.Text)),($i+1)))
  }
}
$difficultySql = Get-Content -LiteralPath (Join-Path $PSScriptRoot '..\docker\postgres-init\04-classify-recipe-difficulty.sql') -Raw
$sql.Add($difficultySql)
$strictVegetarianSql = Get-Content -LiteralPath (Join-Path $PSScriptRoot '..\docker\postgres-init\05-strict-vegetarian-catalog.sql') -Raw
$sql.Add($strictVegetarianSql)
$sql.Add('COMMIT;')
$sqlText = $sql -join "`n"
$sqlText | docker exec -i culinaryblog-db psql -v ON_ERROR_STOP=1 -U postgres -d CulinaryBlogDb
if ($LASTEXITCODE -ne 0) { throw 'Database import failed and transaction was rolled back.' }
Write-Output "Imported $($recipes.Count) real Dien May Xanh recipes."
