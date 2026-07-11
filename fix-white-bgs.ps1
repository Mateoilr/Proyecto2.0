$files = Get-ChildItem -Path "C:\Tesis\Proyecto2.0\src\app" -Recurse -Filter "*.css"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace white backgrounds
    $content = $content -replace 'background(-color)?:\s*white\b', 'background$1: var(--card-bg)'
    $content = $content -replace 'background(-color)?:\s*#fff\b', 'background$1: var(--card-bg)'
    $content = $content -replace 'background(-color)?:\s*#ffffff\b', 'background$1: var(--card-bg)'

    Set-Content -Path $file.FullName -Value $content
}
