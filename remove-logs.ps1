$files = Get-ChildItem -Path "c:\ProyectoFin4to\Proyecto\src\app" -Filter "*.ts" -Recurse
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "console\.(log|error|warn|info)") {
        $newContent = $content -replace '([ \t]*)console\.(log|error|warn|info)\(', '$1// console.$2('
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    }
}
