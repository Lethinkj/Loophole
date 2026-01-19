# Deploy to Replit (No Credit Card - Easiest)

## Overview
**Replit** is the **easiest card-free option**:
- ✅ No credit card required
- ✅ Completely free tier
- ✅ 100 hours/month always-on
- ✅ Web IDE (no terminal needed)
- ✅ Deploy in 5 minutes

---

## Step 1: Create GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. **Name**: `replit-auto-commit`
4. **Scopes**: Select `repo`
5. **Generate** and copy the token

---

## Step 2: Create Replit Account

1. Go to [replit.com](https://replit.com)
2. Click **"Sign up"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Replit to access GitHub
5. You're logged in!

---

## Step 3: Create New Replit Project

1. Click **"Create Repl"** (top left)
2. **Choose template**: Node.js
3. **Title**: `censored-auto-commit`
4. Click **"Create Repl"**
5. Wait for it to load (30 seconds)

---

## Step 4: Write the Code

In the **Files** panel on the left, you'll see `index.js`. Replace it with:

### **index.js** (Full code)
```javascript
const express = require('express');
const cron = require('node-cron');
const { execSync } = require('child_process');

const app = express();
const PORT = 3000;

// Function to run auto-commit
function runAutoCommit() {
  try {
    const timestamp = new Date().toISOString();
    console.log(`\n[${timestamp}] Running auto-commit...`);
    
    // Configure git
    execSync('git config user.name "lethin"');
    execSync('git config user.email "lethin@auto-commit.local"');
    
    // Get timestamp
    const now = new Date();
    const ts = now.toISOString().split('T')[0] + ' ' + 
               now.toTimeString().split(' ')[0];
    
    // Create line
    const line = `[${ts}] this is auto comited by lethin for any further assistance contact lethin\n`;
    
    // Append to commits.txt
    const fs = require('fs');
    if (!fs.existsSync('commits.txt')) {
      fs.writeFileSync('commits.txt', line);
    } else {
      fs.appendFileSync('commits.txt', line);
    }
    
    // Stage, commit, push
    execSync('git add commits.txt');
    const msg = `Auto-commit by lethin - ${ts}`;
    execSync(`git commit -m "${msg}"`);
    
    try {
      execSync('git push origin main');
    } catch (e) {
      execSync('git push origin master');
    }
    
    console.log(`✅ Commit successful: ${msg}\n`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}\n`);
  }
}

// Setup scheduler
console.log('⏰ Setting up auto-commit scheduler...');

cron.schedule('0 0 * * *', () => {
  console.log('⏰ Scheduled task: Midnight (12 AM UTC)');
  runAutoCommit();
});

cron.schedule('0 9 * * *', () => {
  console.log('⏰ Scheduled task: Morning (9 AM UTC)');
  runAutoCommit();
});

cron.schedule('0 12 * * *', () => {
  console.log('⏰ Scheduled task: Noon (12 PM UTC)');
  runAutoCommit();
});

cron.schedule('0 21 * * *', () => {
  console.log('⏰ Scheduled task: Evening (9 PM UTC)');
  runAutoCommit();
});

console.log('✅ Scheduler active - running 4x daily\n');

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'auto-commit',
    timestamp: new Date().toISOString()
  });
});

// Manual trigger
app.get('/commit-now', (req, res) => {
  runAutoCommit();
  res.json({ status: 'commit initiated' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});
```

---

## Step 5: Update package.json

Click on **package.json** and replace with:

```json
{
  "name": "censored-auto-commit",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "node-cron": "^3.0.2"
  }
}
```

---

## Step 6: Set Up Environment Variables

1. Click the **Secrets** icon (lock icon) on the left
2. Click **"New Secret"**
3. **Key**: `GITHUB_TOKEN`
4. **Value**: (paste your PAT)
5. Click **"Add Secret"**

---

## Step 7: Add GitHub Clone Setup

Create a **`.env`** file for git setup:

1. Click **Files** → **Add file** → Create `.env`
2. Add:
```
GITHUB_REPO=https://<your-token>@github.com/Lethinkj/censored.git
```

Replace `<your-token>` with your PAT

---

## Step 8: Run It

1. Click the **"Run"** button (top)
2. You should see output:
```
⏰ Setting up auto-commit scheduler...
✅ Scheduler active - running 4x daily
🚀 Server running on port 3000
```

3. You'll get a **live URL** at the top (like `https://censored-auto-commit.replit.dev`)
4. Click it to verify it's running

---

## Step 9: Set Up Always-On

To keep your Repl running 24/7 on free tier:

1. Click **"Tools"** (bottom left)
2. Click **"UPtimer"** (keep it running)
3. This keeps your Repl alive when not in use

---

## Step 10: Verify It Works

1. Wait for the scheduled time (next 12 AM, 9 AM, 12 PM, or 9 PM UTC)
2. Or manually trigger: Visit `https://your-repl-url/commit-now`
3. Go to [github.com/Lethinkj/censored/commits](https://github.com/Lethinkj/censored/commits)
4. You should see new commits from "lethin"

---

## Advantages of Replit

✅ **No credit card** ever
✅ **Completely free**
✅ **Easiest setup** (no terminal)
✅ **Built-in Git** support
✅ **UPtimer keeps it running**
✅ **Instant deployment**

---

## Disadvantages

⚠️ Slower than cloud platforms
⚠️ Free tier limited to 100 hours/month always-on
⚠️ Less reliable than enterprise options

---

## Replit vs Alternatives

| Feature | Replit | Oracle | Deta |
|---------|--------|--------|------|
| No card | ✅ | ✅ | ✅ |
| Easiest | ✅ | ❌ | ✅ |
| Fastest | ❌ | ✅ | ✅ |
| 24/7 free | Limited | ✅ | ✅ |
| Setup time | 5 min | 30 min | 15 min |

---

## Your Setup Complete! 🚀

Replit is now running your auto-commits completely FREE!

**Next steps:**
- Verify your Repl is running
- Check auto-commits on GitHub
- Enjoy hassle-free commits! 🎉
