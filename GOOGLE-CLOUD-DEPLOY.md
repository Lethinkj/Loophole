# Deploy to Google Cloud Functions (FREE)

## Overview
**Google Cloud Functions** is a **completely free serverless platform** for auto-commits:
- ✅ 2M invocations/month (plenty for 4x daily)
- ✅ 400,000 GB-seconds/month of compute (generous)
- ✅ **No cost** for auto-commits (well within free tier)
- ✅ Cloud Scheduler for cron jobs
- ✅ Auto-scaling, no maintenance needed

---

## Prerequisites
- Google account (free)
- GitHub repository (`censored`) already created
- GitHub Personal Access Token (PAT) with `repo` scope

---

## Step 1: Create GitHub Personal Access Token (if not done)

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. **Name**: `google-cloud-auto-commit`
4. **Scopes**: Select `repo` (full control of private repositories)
5. **Generate** and copy the token
6. **⚠️ SAVE IT** - You won't see it again

---

## Step 2: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the **Project dropdown** (top left)
3. Click **"NEW PROJECT"**
4. **Project name**: `censored-auto-commit`
5. **Organization**: (leave as default)
6. Click **"CREATE"**
7. Wait 1-2 minutes for project to be created

---

## Step 3: Enable Required APIs

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for and **enable these APIs**:
   - **Cloud Functions API**
   - **Cloud Build API**
   - **Cloud Logging API**
   - **Cloud Scheduler API**

**How to enable:**
- Search for API name
- Click the API
- Click **"ENABLE"**
- Repeat for all 4 APIs

---

## Step 4: Create Cloud Function

1. Go to **"Cloud Functions"** in the sidebar
2. Click **"CREATE FUNCTION"**
3. Fill in the form:

| Field | Value |
|-------|-------|
| **Environment** | 2nd gen |
| **Function name** | `censored-auto-commit` |
| **Region** | `us-central1` |
| **Trigger type** | Cloud Pub/Sub (we'll use scheduler) |
| **Create a new topic** | `auto-commit-trigger` |
| **Runtime** | Node.js 20 |
| **Memory** | 256 MB |
| **Timeout** | 60 seconds |
| **Autoscaling** | Max 1 instance |

4. Click **"SAVE"** then **"NEXT"**

---

## Step 5: Write Function Code

In the **Source code** section:

### **runtime.txt** (or just use default)
```
nodejs20
```

### **package.json**
```json
{
  "name": "censored-auto-commit",
  "version": "1.0.0",
  "dependencies": {
    "child_process": "^1.0.2"
  }
}
```

### **index.js** (Replace the entire content)
```javascript
const { execSync } = require('child_process');

exports.autoCommit = async (req, res) => {
  try {
    console.log('🤖 Starting auto-commit...');
    
    // Setup git config
    process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
    
    execSync('git config user.name "lethin"');
    execSync('git config user.email "lethin@auto-commit.local"');
    
    // Get current timestamp
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + 
                      now.toTimeString().split(' ')[0];
    
    // Add commit line
    const fs = require('fs');
    const line = `[${timestamp}] this is auto comited by lethin for any further assistance contact lethin\n`;
    
    // Ensure commits.txt exists and append
    if (!fs.existsSync('commits.txt')) {
      fs.writeFileSync('commits.txt', line);
    } else {
      fs.appendFileSync('commits.txt', line);
    }
    
    // Stage, commit, and push
    execSync('git add commits.txt');
    const commitMsg = `Auto-commit by lethin - ${timestamp}`;
    execSync(`git commit -m "${commitMsg}"`);
    
    try {
      execSync('git push origin main');
    } catch (e) {
      execSync('git push origin master');
    }
    
    console.log(`✅ Commit successful: ${commitMsg}`);
    res.status(200).json({
      status: 'success',
      message: 'Auto-commit completed',
      timestamp: timestamp
    });
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};
```

4. Click **"DEPLOY"** and wait 3-5 minutes

---

## Step 6: Add GitHub Token to Environment Variables

1. Go back to **Cloud Functions** → Select your function
2. Click the **"RUNTIME, CONNECTIONS, SECURITY, ETC."** tab
3. Under **"Runtime environment variables"**, add:
   - **NAME**: `GITHUB_TOKEN`
   - **VALUE**: (paste your PAT from Step 1)
4. Click **"DEPLOY"** again

---

## Step 7: Set Up Cloud Scheduler (Cron Jobs)

1. Go to **"Cloud Scheduler"** in the sidebar
2. Click **"CREATE JOB"**
3. Create 4 jobs (repeat for each time):

### Job 1: Midnight (12 AM UTC)
- **Name**: `auto-commit-midnight`
- **Frequency**: `0 0 * * *` (12 AM UTC)
- **Timezone**: UTC
- **Execution type**: Pub/Sub
- **Topic**: `auto-commit-trigger`
- **Message body**: `{"triggerTime": "midnight"}`
- Click **"CREATE"**

### Job 2: Morning (9 AM UTC)
- **Name**: `auto-commit-morning`
- **Frequency**: `0 9 * * *`
- **Timezone**: UTC
- (Same Pub/Sub setup as above)

### Job 3: Noon (12 PM UTC)
- **Name**: `auto-commit-noon`
- **Frequency**: `0 12 * * *`
- (Same setup)

### Job 4: Evening (9 PM UTC)
- **Name**: `auto-commit-evening`
- **Frequency**: `0 21 * * *`
- (Same setup)

---

## Step 8: Verify It Works

1. In **Cloud Scheduler**, click **"FORCE RUN"** on one of your jobs
2. Go to **Cloud Functions** → Your function → **"LOGS"** tab
3. You should see execution logs showing the commit succeeded
4. Go to [github.com/Lethinkj/censored/commits](https://github.com/Lethinkj/censored/commits)
5. You should see a new commit from "lethin"

---

## Step 9: Monitor & Adjust

### Check Logs
- **Cloud Functions** → Function name → **"LOGS"** tab
- See all execution history and any errors

### View Metrics
- **Cloud Functions** → Function name → **"METRICS"** tab
- Monitor invocations, errors, and execution time

### Adjust Schedule Times
Edit times in **Cloud Scheduler** jobs if needed:
- `0 0 * * *` = 12 AM (midnight)
- `0 9 * * *` = 9 AM
- `0 12 * * *` = 12 PM (noon)
- `0 21 * * *` = 9 PM

[Cron converter](https://crontab.guru/) for other times

---

## Cost Analysis

| Item | Cost |
|------|------|
| 4 daily commits (4,380/year) | **$0** (free tier) |
| Cloud Scheduler | **$0.10** per job/month = **$0.40/month** (4 jobs) |
| **Total Monthly** | **~$0.40** (if over free tier) |

**Reality**: You'll stay in the free tier. Cloud Scheduler's free tier includes some executions.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Function times out | Increase timeout in Cloud Functions settings |
| Git permission denied | Verify GITHUB_TOKEN is set and has `repo` scope |
| Commits not appearing | Check Cloud Logs for error messages |
| Scheduler not triggering | Verify Cloud Scheduler jobs exist and show "ACTIVE" |
| Function test fails | Click "TESTING" tab and test manually |

---

## Important Notes

✅ **No credit card required** (Google Cloud free tier)
✅ **2M free invocations/month** (you use ~150)
✅ **400,000 GB-seconds/month** (you use ~100)
✅ **Auto-scales** - never worry about capacity
✅ **Logs retained** - see all execution history

---

## Quick Cleanup (if needed)

To delete everything and stop charges:
1. **Cloud Scheduler** → Delete all 4 jobs
2. **Cloud Functions** → Delete the function
3. **Cloud Pub/Sub** → Delete `auto-commit-trigger` topic

---

## Your Setup Complete! 🚀

Google Cloud is now running your auto-commits completely FREE!

**Next steps:**
- Monitor logs in Cloud Console
- Verify commits appear on GitHub
- Celebrate being 100% free! 🎉
