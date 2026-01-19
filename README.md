# Auto-Commit Setup Guide

## Overview
This repository uses Render to automatically commit to GitHub 4 times daily (12 AM, 9 AM, 12 PM, 9 PM UTC) without using GitHub Actions minutes.

## Files Included
- **auto-commit.py** - Python script that adds entries to commits.txt and pushes to GitHub
- **commits.txt** - Log file that records each auto-commit
- **render.yaml** - Render cron configuration for scheduling jobs
- **requirements.txt** - Python dependencies

## Setup Instructions

### Step 1: Prepare Your Repository
1. Push this repo to GitHub with the above files
2. Make sure you have a `main` or `master` branch

### Step 2: Create a GitHub Personal Access Token (PAT)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name like "render-auto-commit"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token" and copy the token (⚠️ Save it, you won't see it again)

### Step 3: Set Up Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (connect your account)
3. Create a new service → Blueprint (from render.yaml)

### Step 4: Connect Render to Your Repository
1. Click "New +" → "Blueprint"
2. Connect your GitHub account and select this repository
3. Render will automatically read `render.yaml` and create 4 cron jobs

### Step 5: Add GitHub Token to Render
1. In Render dashboard, go to Environment
2. Add environment variable: `GITHUB_TOKEN` = (paste your PAT from Step 2)
3. Deploy the blueprint

### Step 6: Verify It's Working
1. Check Render dashboard - you should see 4 cron services
2. Wait for the next scheduled time or manually trigger one
3. Check your GitHub repo's commits - you should see new commits appearing
4. Check the graph at github.com/yourusername/your-repo/commits - it will show commits from "lethin"

## How It Works
- **auto-commit.py** clones/pulls latest, adds a timestamped line to commits.txt, commits with author "lethin", and pushes
- **render.yaml** schedules this script 4 times daily using cron syntax
- Commits appear on GitHub's contribution graph with your custom message

## Timezone Note
The schedule times (0, 9, 12, 21) are in UTC. Adjust if needed:
- 12 AM UTC = `0 0 * * *`
- 9 AM UTC = `0 9 * * *`
- 12 PM UTC = `0 12 * * *`
- 9 PM UTC = `0 21 * * *`

[Convert to your timezone here](https://www.epochconverter.com/)

## Troubleshooting
- **Commits not showing?** Check that GITHUB_TOKEN is set in Render environment
- **Authentication failed?** Verify the PAT has `repo` scope and is not expired
- **Wrong author?** The script sets git user to "lethin" automatically
- **Check logs:** View logs in Render dashboard for each cron job

## Free Tier Considerations
- Render's free tier includes limited free cron job runs
- This uses 4 jobs daily (240/month)
- Upgrade to paid if you hit limits

---
Created for: **lethin**
