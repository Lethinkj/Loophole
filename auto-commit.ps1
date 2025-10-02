# Auto-commit script for daily loop updates
# This script adds a new line with increasing dots to the loop file

# Get the current directory (should be the repo directory)
$repoPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $repoPath

# Read the current content of the loop file
$loopFile = "loop"
$content = Get-Content $loopFile

# Find the last line that contains only dots
$lastDotLine = ""
$maxDots = 0

foreach ($line in $content) {
    if ($line -match "^\.+$") {
        $dotCount = $line.Length
        if ($dotCount -gt $maxDots) {
            $maxDots = $dotCount
            $lastDotLine = $line
        }
    }
}

# Create the new line with one more dot
$newDotLine = "." * ($maxDots + 1)

# Add the new line to the file
Add-Content -Path $loopFile -Value $newDotLine

# Git operations
try {
    # Add the file to git
    git add $loopFile
    
    # Get current date for commit message
    $currentDate = Get-Date -Format "yyyy-MM-dd"
    $commitMessage = "Daily update: Added $newDotLine on $currentDate"
    
    # Commit the changes
    git commit -m $commitMessage
    
    # Push to remote (assuming main branch)
    git push origin main
    
    Write-Host "Successfully committed daily update: $newDotLine"
    
    # Log the action
    $logFile = "commit-log.txt"
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): Added $newDotLine"
    Add-Content -Path $logFile -Value $logEntry
    
} catch {
    Write-Error "Failed to commit changes: $_"
    # Log the error
    $logFile = "commit-log.txt"
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss'): ERROR - $_"
    Add-Content -Path $logFile -Value $logEntry
}