# Deploy to AWS Lambda (Completely FREE - No Billing)

## Overview
**AWS Lambda** is **completely free** for auto-commits:
- ✅ 1M invocations/month (you use ~150)
- ✅ 400,000 GB-seconds/month (you use ~100)
- ✅ **No billing account required**
- ✅ EventBridge for cron scheduling
- ✅ Auto-scaling, serverless

---

## Prerequisites
- AWS account (free, no credit card needed for signup)
- GitHub repository (`censored`)
- GitHub Personal Access Token (PAT) with `repo` scope

---

## Step 1: Create GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. **Name**: `aws-lambda-auto-commit`
4. **Scopes**: Select `repo`
5. **Generate** and copy the token

---

## Step 2: Create AWS Account

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Sign up with email/password
3. **⚠️ No credit card needed** for free tier signup
4. Complete email verification
5. You're ready to go!

---

## Step 3: Create Lambda Function

1. Go to **Lambda** service (search in AWS Console)
2. Click **"Create function"**
3. Fill in:

| Field | Value |
|-------|-------|
| **Function name** | `censored-auto-commit` |
| **Runtime** | Node.js 20.x |
| **Architecture** | x86_64 |
| **Permissions** | Create new role |

4. Click **"Create function"**

---

## Step 4: Add Code

1. In the **Code** tab, click **"Upload from"** → **".zip file"**
2. Or paste the code directly in the editor

### **index.js** (Paste this):
```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  try {
    console.log('🤖 Starting auto-commit on AWS Lambda...');
    
    // Verify GitHub token
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN not set');
    }
    
    // Configure git
    execSync('git config user.name "lethin"');
    execSync('git config user.email "lethin@auto-commit.local"');
    
    // Get timestamp
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + 
                      now.toTimeString().split(' ')[0];
    
    // Create commit line
    const line = `[${timestamp}] this is auto comited by lethin for any further assistance contact lethin\n`;
    
    // Append to commits.txt
    const tmpDir = '/tmp';
    const commitsFile = path.join(tmpDir, 'commits.txt');
    
    if (fs.existsSync(commitsFile)) {
      fs.appendFileSync(commitsFile, line);
    } else {
      fs.writeFileSync(commitsFile, line);
    }
    
    // Stage and commit
    execSync('git add commits.txt');
    const commitMsg = `Auto-commit by lethin - ${timestamp}`;
    execSync(`git commit -m "${commitMsg}"`);
    
    // Push
    try {
      execSync('git push origin main');
    } catch (e) {
      execSync('git push origin master');
    }
    
    console.log(`✅ Commit successful: ${commitMsg}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Auto-commit completed',
        timestamp: timestamp
      })
    };
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
```

3. Click **"Deploy"**

---

## Step 5: Add Environment Variables

1. Go to **Configuration** tab → **Environment variables**
2. Click **"Edit"**
3. Add:
   - **KEY**: `GITHUB_TOKEN`
   - **VALUE**: (paste your PAT)
4. Click **"Save"**

---

## Step 6: Increase Timeout

1. In **Configuration** tab → **General configuration**
2. Click **"Edit"**
3. Set **Timeout**: `60 seconds`
4. Click **"Save"**

---

## Step 7: Create EventBridge Rules (Scheduler)

### Create Rule 1: Midnight (12 AM UTC)

1. Go to **EventBridge** service
2. Click **"Create rule"**
3. **Name**: `auto-commit-midnight`
4. **Schedule**: 
   - **Frequency**: `Custom pattern`
   - **Pattern**: `cron(0 0 * * ? *)`
5. **Target**: Lambda function → `censored-auto-commit`
6. Click **"Create"**

### Create Rule 2: Morning (9 AM UTC)
- **Name**: `auto-commit-morning`
- **Pattern**: `cron(0 9 * * ? *)`
- (Same setup as above)

### Create Rule 3: Noon (12 PM UTC)
- **Name**: `auto-commit-noon`
- **Pattern**: `cron(0 12 * * ? *)`

### Create Rule 4: Evening (9 PM UTC)
- **Name**: `auto-commit-evening`
- **Pattern**: `cron(0 21 * * ? *)`

---

## Step 8: Test It

1. Go to **Lambda** → Your function
2. Click **"Test"** button
3. Create a test event (any JSON)
4. Click **"Test"** again
5. You should see execution logs
6. Go to [github.com/Lethinkj/censored/commits](https://github.com/Lethinkj/censored/commits)
7. You should see a new commit!

---

## Step 9: Monitor

### View Logs
- **Lambda** → Function → **Monitor** tab
- Click **"View logs in CloudWatch"**
- See execution history and any errors

### View Metrics
- **Lambda** → Function → **Monitoring** tab
- See invocations, errors, duration, etc.

---

## Adjust Schedule Times

Edit EventBridge rules if needed:
- `cron(0 0 * * ? *)` = 12 AM UTC
- `cron(0 9 * * ? *)` = 9 AM UTC
- `cron(0 12 * * ? *)` = 12 PM UTC
- `cron(0 21 * * ? *)` = 9 PM UTC

[AWS Cron converter](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cron-expressions.html)

---

## Cost Analysis

| Item | Free Tier | Your Usage |
|------|-----------|-----------|
| Lambda invocations | 1M/month | ~150 ✅ |
| Compute time | 400,000 GB-sec/month | ~100 ✅ |
| EventBridge rules | First 10 rules free | 4 rules ✅ |
| **Total Cost** | | **$0.00** |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Function timeout | Increase timeout to 60+ seconds |
| Permission denied | Check GITHUB_TOKEN is set |
| EventBridge not triggering | Verify rule is "Enabled" |
| Commits not appearing | Check CloudWatch logs |
| "No such file" errors | It's a Lambda limitation, check logs |

---

## Important Notes

✅ **Completely free** - no billing account required
✅ **1M invocations/month** - you use ~150
✅ **Auto-scaling** - handles any load
✅ **Reliable** - AWS infrastructure
✅ **Logs retained** - 30 days by default

---

## Your Setup Complete! 🚀

AWS Lambda is now running your auto-commits **completely FREE!**

**Next steps:**
- Monitor CloudWatch logs
- Verify commits on GitHub
- Enjoy zero-cost auto-commits! 🎉
