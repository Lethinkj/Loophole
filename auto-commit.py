#!/usr/bin/env python3
"""
Auto-commit script for daily automated commits
Adds a timestamp entry to commits.txt file
"""

import os
import subprocess
from datetime import datetime
import sys

def setup_git_config():
    """Configure git with user details"""
    subprocess.run(['git', 'config', 'user.name', 'lethin'], check=True)
    subprocess.run(['git', 'config', 'user.email', 'lethin@auto-commit.local'], check=True)

def add_commit_line():
    """Add a new line to commits.txt"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    line = f"[{timestamp}] this is auto comited by lethin for any further assistance contact lethin\n"
    
    # Ensure commits.txt exists
    if not os.path.exists('commits.txt'):
        with open('commits.txt', 'w') as f:
            f.write("")
    
    # Append the line
    with open('commits.txt', 'a') as f:
        f.write(line)
    
    return line.strip()

def commit_and_push():
    """Commit and push changes"""
    try:
        # Add the file
        subprocess.run(['git', 'add', 'commits.txt'], check=True)
        
        # Commit with timestamp
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        commit_msg = f"Auto-commit by lethin - {timestamp}"
        subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
        
        # Push to main/master branch
        try:
            subprocess.run(['git', 'push', 'origin', 'main'], check=True)
        except subprocess.CalledProcessError:
            # Try master if main doesn't exist
            subprocess.run(['git', 'push', 'origin', 'master'], check=True)
        
        print(f"✅ Commit successful: {commit_msg}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Commit failed: {e}")
        return False

def main():
    """Main execution"""
    print("🤖 Starting auto-commit process...")
    
    try:
        # Setup git configuration
        setup_git_config()
        print("✓ Git configured")
        
        # Add commit line
        line = add_commit_line()
        print(f"✓ Added line: {line}")
        
        # Commit and push
        if commit_and_push():
            print("✅ Auto-commit completed successfully!")
            sys.exit(0)
        else:
            print("❌ Auto-commit failed!")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
