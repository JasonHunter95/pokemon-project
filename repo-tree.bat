@echo off
setlocal
set "OUT=repo-tree.txt"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ignore=@('node_modules','.git','dist','build','coverage');" ^
  "function Show-Tree([string]$path='.',[string]$prefix=''){" ^
  "  $dirs  = Get-ChildItem -LiteralPath $path -Directory | Where-Object { $ignore -notcontains $_.Name };" ^
  "  $files = Get-ChildItem -LiteralPath $path -File;" ^
  "  foreach ($d in $dirs) { Write-Output ($prefix + '+---' + $d.Name); Show-Tree -path $d.FullName -prefix ($prefix + '|   ') }" ^
  "  foreach ($f in $files) { Write-Output ($prefix + $f.Name) }" ^
  "}" ^
  "@((Get-Item .).FullName) + (Show-Tree .) | Out-File -Encoding utf8 '%OUT%'"

echo Wrote tree to "%OUT%"
endlocal