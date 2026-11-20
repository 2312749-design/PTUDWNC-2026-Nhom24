#requires -Version 7.4
param(
    [string]$DocumentPath = (Join-Path $PSScriptRoot '../../docs/submission/Bao_cao_do_an_Culinary_Blog.docx'),
    [string]$OutputDirectory = (Join-Path $PSScriptRoot '../../artifacts/report-render')
)
$ErrorActionPreference='Stop'
$source=[IO.Path]::GetFullPath($DocumentPath)
$output=[IO.Path]::GetFullPath($OutputDirectory)
New-Item -ItemType Directory -Path $output -Force | Out-Null
$word=$null; $document=$null
try {
    $word=New-Object -ComObject Word.Application
    $word.Visible=$false
    $word.DisplayAlerts=0
    $document=$word.Documents.Open($source,$false,$false)
    $document.Fields.Update() | Out-Null
    foreach($toc in $document.TablesOfContents){$toc.Update()}
    $document.Save()
    $pdf=Join-Path $output 'report.pdf'
    $document.ExportAsFixedFormat($pdf,17)
    Write-Output $pdf
} finally {
    if($document){$document.Close($false); [Runtime.InteropServices.Marshal]::FinalReleaseComObject($document)|Out-Null}
    if($word){$word.Quit(); [Runtime.InteropServices.Marshal]::FinalReleaseComObject($word)|Out-Null}
}
