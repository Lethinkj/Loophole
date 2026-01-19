#!/bin/bash
# Startup script that runs auto-commit immediately when service starts
set -e

echo "🚀 Service starting - running initial auto-commit..."
python auto-commit.py

if [ $? -eq 0 ]; then
    echo "✅ Initial startup commit successful"
else
    echo "⚠️ Initial startup commit failed, but continuing with scheduled jobs..."
fi

# Keep the process alive (for Render web service)
tail -f /dev/null
