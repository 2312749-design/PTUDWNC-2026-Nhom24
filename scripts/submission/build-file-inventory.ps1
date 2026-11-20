$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$output = Join-Path $root 'docs/submission/FILE-CHANGE-INVENTORY.md'
$status = git -C $root -c core.quotePath=false status --short
$lines = [System.Collections.Generic.List[string]]::new()
$lines.Add('# Danh sách file thay đổi trước khi nộp')
$lines.Add('')
$lines.Add('Danh sách này được tạo từ `git status --short`. Trạng thái M/D/?? lần lượt là sửa, xóa và file mới chưa được Git theo dõi. Kho làm việc đã có thay đổi trước phiên rà soát; nhóm cần xem diff và chia commit theo chức năng, không gán toàn bộ cho một thành viên.')
$lines.Add('')
$lines.Add('| Trạng thái | Đường dẫn |')
$lines.Add('| --- | --- |')
foreach ($entry in $status) {
    if ($entry.Length -lt 4) { continue }
    $state = $entry.Substring(0, 2).Trim()
    if (-not $state) { $state = 'M' }
    $path = $entry.Substring(3).Replace('|', '\|')
    $lines.Add("| $state | $path |")
}
$lines.Add('')
$lines.Add('## Cách chia commit đề xuất')
$lines.Add('')
$lines.Add('1. Backend architecture, CQRS, validation và security.')
$lines.Add('2. Migration, seed data, cache, upload và vận hành Docker.')
$lines.Add('3. Next.js rendering, giao diện lõi và frontend tests.')
$lines.Add('4. Backend tests, coverage và các script nghiệm thu.')
$lines.Add('5. Báo cáo, ADR, ma trận SRS và hướng dẫn bảo vệ.')
$lines.Add('')
$lines.Add('Không commit `.env`, compose.private.json, database dump, token, mật khẩu hoặc thư mục artifacts/.artifacts. Chạy lại `git diff --check`, test và coverage sau khi chia commit.')
[IO.File]::WriteAllLines($output, $lines, [Text.UTF8Encoding]::new($false))
Write-Host $output
