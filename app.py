#!/usr/bin/env python3
"""
Web service with built-in scheduler for auto-commits
Runs on Render's free tier without needing paid cron jobs
"""

from flask import Flask
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import subprocess
import os

app = Flask(__name__)

def run_auto_commit():
    """Execute the auto-commit script"""
    try:
        result = subprocess.run(['python', 'auto-commit.py'], 
                              capture_output=True, 
                              text=True, 
                              timeout=60)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] Auto-commit executed")
        print(result.stdout)
        if result.stderr:
            print(f"Errors: {result.stderr}")
    except Exception as e:
        print(f"Error running auto-commit: {e}")

def setup_scheduler():
    """Setup background scheduler for auto-commits"""
    scheduler = BackgroundScheduler()
    
    # Schedule 4 times daily (UTC times)
    scheduler.add_job(run_auto_commit, 'cron', hour=0, minute=0, id='midnight')     # 12 AM
    scheduler.add_job(run_auto_commit, 'cron', hour=9, minute=0, id='morning')       # 9 AM
    scheduler.add_job(run_auto_commit, 'cron', hour=12, minute=0, id='noon')         # 12 PM
    scheduler.add_job(run_auto_commit, 'cron', hour=21, minute=0, id='evening')      # 9 PM
    
    scheduler.start()
    print("✅ Scheduler started - auto-commits scheduled 4x daily")

@app.route('/')
def health_check():
    """Health check endpoint (required by Render)"""
    return {
        'status': 'healthy',
        'service': 'auto-commit',
        'timestamp': datetime.now().isoformat()
    }, 200

@app.route('/commit-now', methods=['POST'])
def commit_now():
    """Manual trigger endpoint"""
    run_auto_commit()
    return {'status': 'commit initiated'}, 200

if __name__ == '__main__':
    setup_scheduler()
    # Run on port 10000 (Render's default)
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 10000)))
