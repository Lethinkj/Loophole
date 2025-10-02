@echo off
echo Starting Auto-Commit Loop...
echo This will commit changes every 5 minutes alternating between adding 5 lines and removing 4 lines.
echo Press Ctrl+C to stop.
echo.

cd /d "%~dp0"
node auto-commit.js

pause