param([int]$PerCategory = 20)

$ErrorActionPreference = 'Stop'
$root = 'https://www.dienmayxanh.com'
$headers = @{ 'User-Agent' = 'Mozilla/5.0 (compatible; CulinaryBlogEducationalImporter/2.0)' }
$recipePattern = '(?:https://www\.dienmayxanh\.com)?/vao-bep/[a-z0-9-]+-\d{4,6}'
$catalog = @(
  @{ Name='Món canh'; Slug='mon-canh'; Source='mon-canh' },
  @{ Name='Món bánh'; Slug='mon-banh'; Source='mon-banh' },
  @{ Name='Món chè'; Slug='mon-che'; Source='mon-che' },
  @{ Name='Món nước'; Slug='mon-nuoc'; Source='mon-nuoc' },
  @{ Name='Món kem'; Slug='mon-kem'; Source='mon-kem' },
  @{ Name='Món nướng'; Slug='mon-nuong'; Source='mon-nuong' },
  @{ Name='Món cháo'; Slug='mon-chao'; Source='mon-chao' },
  @{ Name='Món xào'; Slug='mon-xao'; Source='mon-xao' },
  @{ Name='Món kho'; Slug='mon-kho'; Source='mon-kho' },
  @{ Name='Món chiên'; Slug='mon-chien'; Source='mon-chien' },
  @{ Name='Món hấp'; Slug='mon-hap'; Source='mon-hap' },
  @{ Name='Món lẩu'; Slug='mon-lau'; Source='mon-lau' },
  @{ Name='Món gỏi - salad'; Slug='mon-goi-salad'; Source='mon-goi-tron' },
  @{ Name='Món từ gà'; Slug='mon-tu-ga'; Source='mon-tu-ga' },
  @{ Name='Món từ bò'; Slug='mon-tu-bo'; Source='mon-tu-bo' },
  @{ Name='Món chay'; Slug='mon-chay'; Source='mon-chay' },
  @{ Name='Ăn vặt'; Slug='an-vat'; Source='an-vat' },
  @{ Name='Ngày lễ Tết'; Slug='ngay-le-tet'; Source='ngay-le-tet' },
  @{ Name='Thức uống'; Slug='thuc-uong'; Source='thuc-uong' },
  @{ Name='Sinh tố'; Slug='sinh-to'; Source='sinh-to' },
  @{ Name='Trà sữa'; Slug='tra-sua'; Source='tra-sua' },
  @{ Name='Nước ép'; Slug='nuoc-ep'; Source='nuoc-ep' },
  @{ Name='Món tráng miệng'; Slug='mon-trang-mieng'; Source='mon-trang-mieng' },
  @{ Name='Món khô - mắm'; Slug='mon-kho-mam'; Source='mon-kho-mam' },
  @{ Name='Món cuốn - trộn'; Slug='mon-cuon-tron'; Source='mon-cuon-tron' }
)

function Sql([string]$value) { return "'" + (($value -replace "`0", '').Replace("'", "''")) + "'" }
function PgArray($values) { return 'ARRAY[' + (($values | ForEach-Object { Sql ([string]$_) }) -join ',') + ']::text[]' }
function Limit([string]$value, [int]$length) { if (-not $value) { return '' }; if ($value.Length -le $length) { return $value }; return $value.Substring(0,$length) }
function Minutes([string]$duration, [int]$fallback) { try { return [Math]::Max(0,[int][System.Xml.XmlConvert]::ToTimeSpan($duration).TotalMinutes) } catch { return $fallback } }
function Add-Step($node, [System.Collections.Generic.List[object]]$steps) {
  if ($null -eq $node) { return }
  if ($node -is [array]) { foreach($item in $node){ Add-Step $item $steps }; return }
  if ($node.itemListElement) { Add-Step $node.itemListElement $steps; return }
  $text = Limit (([string]$node.text).Trim()) 1900
  if ($text) { $title=Limit (([string]$node.name).Trim()) 190; if(-not $title){$title='Bước thực hiện'}; $steps.Add([pscustomobject]@{Title=$title;Text=$text}) }
}
function Read-Recipe([string]$url,[string]$html) {
  foreach($match in [regex]::Matches($html,'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>','Singleline')) {
    if($match.Groups[1].Value -notmatch 'recipeIngredient'){continue}
    try{$data=[System.Net.WebUtility]::HtmlDecode($match.Groups[1].Value.Trim())|ConvertFrom-Json}catch{continue}
    if($data.'@type' -ne 'Recipe'){continue}
    $ingredients=@($data.recipeIngredient|ForEach-Object{Limit (([string]$_).Trim()) 190}|Where-Object{$_})|Select-Object -Unique
    $steps=[System.Collections.Generic.List[object]]::new(); Add-Step $data.recipeInstructions $steps
    $image=if($data.image -is [array]){[string]$data.image[0]}elseif($data.image.url){[string]$data.image.url}else{[string]$data.image}
    $idMatch=[regex]::Match($url,'-(\d{4,6})$')
    if(-not $idMatch.Success -or -not $image -or $ingredients.Count -lt 2 -or $steps.Count -lt 3){continue}
    return [pscustomobject]@{ SourceId=$idMatch.Groups[1].Value; SourceUrl=$url; Title=Limit (([string]$data.name).Trim()) 190; ImageUrl=Limit $image.Trim() 2000; Description=Limit (([string]$data.description).Trim()) 1200; Ingredients=$ingredients; Steps=$steps; PrepTime=[string]$data.prepTime; CookTime=[string]$data.cookTime; Yield=[string]$data.recipeYield; SourceCategory=[string]$data.recipeCategory }
  }
  return $null
}

$allRecipes=[System.Collections.Generic.List[object]]::new()
$globalIds=[System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$globalTitles=[System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
foreach($category in $catalog){
  $links=[System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
  $categoryUrl="$root/vao-bep/$($category.Source)"
  try{$html=(Invoke-WebRequest -Uri $categoryUrl -UseBasicParsing -TimeoutSec 40 -Headers $headers).Content}catch{throw "Không tải được danh mục $($category.Name)."}
  foreach($match in [regex]::Matches($html,$recipePattern,'IgnoreCase')){ $url=[System.Net.WebUtility]::HtmlDecode($match.Value).Split('?')[0]; if($url.StartsWith('/')){$url="$root$url"}; $links.Add($url)|Out-Null }
  $categoryId=[regex]::Match($html,'id="categoryId"[^>]*value="(\d+)"','IgnoreCase').Groups[1].Value
  if(-not $categoryId){throw "Không tìm thấy mã nguồn cho danh mục $($category.Name)."}
  foreach($pageIndex in 1..8){
    try{$more=(Invoke-WebRequest -Uri "$root/vao-bep/aj/Category/ViewMoreDish" -Method Post -Body @{pageIndex=$pageIndex;cateId=$categoryId;isVideo=0} -UseBasicParsing -TimeoutSec 40 -Headers ($headers + @{'X-Requested-With'='XMLHttpRequest'})).Content}catch{continue}
    foreach($match in [regex]::Matches($more,$recipePattern,'IgnoreCase')){ $url=[System.Net.WebUtility]::HtmlDecode($match.Value).Split('?')[0]; if($url.StartsWith('/')){$url="$root$url"}; $links.Add($url)|Out-Null }
  }
  $accepted=[System.Collections.Generic.List[object]]::new()
  foreach($url in $links){
    if($accepted.Count -ge $PerCategory){break}
    try{$html=(Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 35 -Headers $headers).Content; $recipe=Read-Recipe $url $html}catch{continue}
    if($null -eq $recipe -or $globalIds.Contains($recipe.SourceId) -or $globalTitles.Contains($recipe.Title)){continue}
    $recipe|Add-Member -NotePropertyName CategoryName -NotePropertyValue $category.Name
    $recipe|Add-Member -NotePropertyName CategorySlug -NotePropertyValue $category.Slug
    $accepted.Add($recipe); $globalIds.Add($recipe.SourceId)|Out-Null; $globalTitles.Add($recipe.Title)|Out-Null
  }
  if($accepted.Count -lt $PerCategory){throw "Danh mục '$($category.Name)' chỉ thu được $($accepted.Count)/$PerCategory món hợp lệ. Database chưa bị thay đổi."}
  foreach($recipe in $accepted){$allRecipes.Add($recipe)}
  Write-Output "Collected $($category.Name): $($accepted.Count)/$PerCategory (total $($allRecipes.Count))."
}

# Use an actual recipe photo as each category's cover instead of leaving the
# gallery with an empty placeholder.
$categoryImages=@{}
foreach($recipe in $allRecipes){
  if(-not $categoryImages.ContainsKey($recipe.CategoryName)){$categoryImages[$recipe.CategoryName]=$recipe.ImageUrl}
}

$authorId=('SELECT "Id" FROM "Users" WHERE "UserName"=''chefdemo'' LIMIT 1;' | docker exec -i culinaryblog-db psql -U postgres -d CulinaryBlogDb -At).Trim()
if(-not $authorId){throw 'Không tìm thấy tài khoản chefdemo.'}
$existingCsv='SELECT "Slug","Id" FROM "Categories";' | docker exec -i culinaryblog-db psql -U postgres -d CulinaryBlogDb -At -F '|'
$existing=@{}; foreach($line in $existingCsv){$parts=$line -split '\|',2;if($parts.Count -eq 2){$existing[$parts[0]]=$parts[1]}}
$categoryIds=@{}; $sql=[System.Collections.Generic.List[string]]::new(); $sql.Add('BEGIN;')
$sql.Add('DELETE FROM "Recipes" WHERE "Slug" LIKE ''real-%'';')
$sql.Add('UPDATE "Recipes" SET "IsDeleted"=true,"DeletedAt"=NOW(),"UpdatedAt"=NOW() WHERE NOT "IsDeleted";')
$order=0
foreach($category in $catalog){
  $order++
  $cover=$categoryImages[$category.Name]
  if($existing.ContainsKey($category.Slug)){$id=$existing[$category.Slug];$sql.Add(('UPDATE "Categories" SET "Name"={0},"Slug"={1},"Description"={2},"ImageUrl"={3},"IsDeleted"=false,"DeletedAt"=NULL,"IsVisible"=true,"DisplayOrder"={4},"UpdatedAt"=NOW() WHERE "Id"=''{5}'';' -f (Sql $category.Name),(Sql $category.Slug),(Sql "Công thức $($category.Name.ToLower()) được tuyển chọn từ Điện Máy Xanh."),(Sql $cover),$order,$id))}
  else{$id=[guid]::NewGuid().ToString();$sql.Add(('INSERT INTO "Categories" ("Id","Name","Slug","Description","ImageUrl","CreatedAt","UpdatedAt","IsDeleted","IsVisible","DisplayOrder") VALUES (''{0}'',{1},{2},{3},{4},NOW(),NOW(),false,true,{5});' -f $id,(Sql $category.Name),(Sql $category.Slug),(Sql "Công thức $($category.Name.ToLower()) được tuyển chọn từ Điện Máy Xanh."),(Sql $cover),$order))}
  $categoryIds[$category.Name]=$id
}
$activeIds=($categoryIds.Values|ForEach-Object{"'$_'"}) -join ','
$sql.Add(('UPDATE "Categories" SET "IsDeleted"=true,"DeletedAt"=NOW(),"IsVisible"=false,"UpdatedAt"=NOW() WHERE "Id" NOT IN ({0}) AND NOT "IsDeleted";' -f $activeIds))
foreach($recipe in $allRecipes){
  $id=[guid]::NewGuid().ToString();$categoryId=$categoryIds[$recipe.CategoryName];$prep=Minutes $recipe.PrepTime 15;$cook=Minutes $recipe.CookTime 30;$total=[Math]::Max(1,$prep+$cook);$yieldMatch=[regex]::Match($recipe.Yield,'\d+');$servings=if($yieldMatch.Success){[Math]::Max(1,[int]$yieldMatch.Value)}else{4};$description=Limit ("Công thức dữ liệu thật được biên soạn từ Điện Máy Xanh. $($recipe.Description) Nguồn: $($recipe.SourceUrl)") 1900;$instructions=@($recipe.Steps|ForEach-Object{$_.Text});$vegetarian=if($recipe.CategoryName -eq 'Món chay'){'true'}else{'false'}
  $slug="real-$($recipe.CategorySlug)-$($recipe.SourceId)"
  $sql.Add(('INSERT INTO "Recipes" ("Id","Title","Slug","Description","CategoryId","AuthorId","Status","Instructions","Ingredients","ImageUrl","CookingTimeMinutes","Difficulty","IsVegetarian","CreatedAt","IsDeleted","UpdatedAt","CookTimeMinutes","PrepTimeMinutes","Servings","ReviewStatus","ReviewNote","ReviewRequestedAt","ReviewedAt","ReviewedById") VALUES (''{0}'',{1},{2},{3},''{4}'',''{5}'',1,{6},{7},{8},{9},''Medium'',{10},NOW(),false,NOW(),{11},{12},{13},''Approved'',''Dữ liệu thật từ Điện Máy Xanh.'',NOW(),NOW(),''{5}'');' -f $id,(Sql $recipe.Title),(Sql $slug),(Sql $description),$categoryId,$authorId,(PgArray $instructions),(PgArray $recipe.Ingredients),(Sql $recipe.ImageUrl),$total,$vegetarian,$cook,([Math]::Max(1,$prep)),$servings))
  for($i=0;$i -lt $recipe.Ingredients.Count;$i++){$sql.Add(('INSERT INTO "RecipeIngredients" ("Id","RecipeId","Name","Quantity","Unit","Notes","OrderIndex") VALUES (''{0}'',''{1}'',{2},NULL,NULL,''Nguồn Điện Máy Xanh'',{3});' -f ([guid]::NewGuid()),$id,(Sql ([string]$recipe.Ingredients[$i])),($i+1)))}
  for($i=0;$i -lt $recipe.Steps.Count;$i++){$step=$recipe.Steps[$i];$sql.Add(('INSERT INTO "RecipeSteps" ("Id","RecipeId","Title","Description","StepNumber","TimerMinutes","ImageUrl") VALUES (''{0}'',''{1}'',{2},{3},{4},NULL,NULL);' -f ([guid]::NewGuid()),$id,(Sql ([string]$step.Title)),(Sql ([string]$step.Text)),($i+1)))}
}
$sql.Add('COMMIT;'); ($sql -join "`n")|docker exec -i culinaryblog-db psql -q -v ON_ERROR_STOP=1 -U postgres -d CulinaryBlogDb
if($LASTEXITCODE -ne 0){throw 'Nhập dữ liệu thất bại; transaction đã được hoàn tác.'}
Write-Output "Imported $($allRecipes.Count) real recipes into $($catalog.Count) categories."
