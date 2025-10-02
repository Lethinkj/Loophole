# Auto-Commit Loop PowerShell Script
Write-Host "Starting Auto-Commit Loop..." -ForegroundColor Green
Write-Host "This will commit changes every 5 minutes alternating between adding 5 lines and removing 4 lines." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop." -ForegroundColor Red
Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Start the Node.js auto-commit loop
try {
    node auto-commit.js
} catch {
    Write-Host "Error starting auto-commit: $_" -ForegroundColor Red
    Read-Host "Press Enter to exit"
}