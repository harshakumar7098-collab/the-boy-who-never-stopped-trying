param(
  [string]$Message = "Update memoir website"
)

Set-Location -LiteralPath $PSScriptRoot

$Git = (Get-Command git -ErrorAction SilentlyContinue).Source
if (-not $Git) {
  $Git = Get-ChildItem -Path "$env:LOCALAPPDATA\GitHubDesktop" -Filter git.exe -Recurse -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -like "*\resources\app\git\mingw64\bin\git.exe" } |
    Select-Object -ExpandProperty FullName -First 1
  if ($Git) {
    $GitRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $Git))
    $env:GIT_EXEC_PATH = Join-Path $GitRoot "mingw64\bin"
    $env:PATH = "$(Join-Path $GitRoot "mingw64\bin");$(Join-Path $GitRoot "cmd");$(Join-Path $GitRoot "usr\bin");$env:PATH"
  }
}
if (-not $Git) {
  Write-Host "Git was not found. Install Git for Windows or GitHub Desktop, then run this again."
  exit 1
}

& $Git add .
& $Git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host "No changes to publish."
  exit 0
}

& $Git commit -m $Message
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& $Git push
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Published. GitHub Pages will update automatically."
