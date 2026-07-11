$files = Get-ChildItem -Path "C:\Tesis\Proyecto2.0\src" -Recurse -Filter "*.css"
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Text colors
    $content = $content -replace '#1f2937', 'var(--text-color)'
    $content = $content -replace '#2c3e50', 'var(--text-color)'
    $content = $content -replace '#374151', 'var(--text-color-muted)'
    $content = $content -replace '#4b5563', 'var(--text-color-muted)'
    $content = $content -replace '#6b7280', 'var(--text-color-muted)'
    $content = $content -replace '#757575', 'var(--text-color-muted)'
    $content = $content -replace '#888;', 'var(--text-color-muted);'
    $content = $content -replace '#999;', 'var(--text-color-muted);'
    $content = $content -replace '#7f8c8d', 'var(--text-color-muted)'
    $content = $content -replace '#9ca3af', 'var(--text-color-muted)'

    # Background colors
    $content = $content -replace '#f5f5f5', 'var(--app-bg)'
    $content = $content -replace '#f9f9f9', 'var(--app-bg)'
    $content = $content -replace '#f9fafb', 'var(--app-bg)'
    $content = $content -replace '#f5f7fa', 'var(--app-bg)'

    Set-Content -Path $file.FullName -Value $content
}
