# Samodejno opravilo: vsak dan ustvari nova ozadja (kolikor dovoli kvota Hugging Face) in jih objavi.
# Ko so narejene vse slike iz slike.json, se opravilo »Mahjong ozadja« samo odstrani.
$ErrorActionPreference = "Continue"
$koren = Split-Path -Parent $PSScriptRoot
Set-Location $koren
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
$env:HF_TOKEN = [Environment]::GetEnvironmentVariable("HF_TOKEN", "User")
$dnevnik = Join-Path $koren "orodja\dnevna-ozadja.log"
function Zapisi($t) { Add-Content -Path $dnevnik -Value $t -Encoding UTF8 }

Zapisi "=== $(Get-Date -Format 'yyyy-MM-dd HH:mm') ==="
$izhod = & node orodja/slike-vse.mjs 2>&1 | Out-String
Zapisi $izhod.Trim()

$nove = git status --porcelain -- public/ozadja
if ($nove) {
  git add public/ozadja
  git commit -q -m "Nova ozadja (samodejno)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
  $push = git push -q 2>&1 | Out-String
  Zapisi "Objavljeno. $($push.Trim())"
} else {
  Zapisi "Danes ni novih slik."
}

$vseh = (Get-Content (Join-Path $koren "orodja\slike.json") -Raw -Encoding UTF8 | ConvertFrom-Json).slike.Count
$narejenih = (Get-ChildItem (Join-Path $koren "public\ozadja") -Filter *.webp).Count
Zapisi "Ozadij: $narejenih od $vseh"
if ($narejenih -ge $vseh) {
  Unregister-ScheduledTask -TaskName "Mahjong ozadja" -Confirm:$false
  Zapisi "Vse slike so narejene, opravilo je odstranjeno."
}
