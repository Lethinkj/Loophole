# Deploy to Render - Complete Guide

## Prerequisites
✅ GitHub repo created: https://github.com/Lethinkj/censored
✅ Local setup complete and tested
✅ render.yaml configured in repo

---

## Step 1: Create GitHub Personal Access Token (PAT)

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. **Token name**: `render-auto-commit`
4. **Select scopes**:
   - ✅ `repo` (Full control of private repositories)
5. Click **"Generate token"**
6. **⚠️ COPY THE TOKEN** (you won't see it again)
7. Keep it safe for Step 3

---

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Sign up"**
3. **Sign up with GitHub** (connect your account)
4. Authorize Render to access your GitHub repos

---

## Step 3: Deploy Blueprint

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Select your **censored** repository
3. Click **"Connect"**
4. Render will auto-read `render.yaml`
5. In **Environment** tab, add:
   - **Key**: `GITHUB_TOKEN`
   - **Value**: (paste your PAT from Step 1)
6. Click **"Deploy Blueprint"**

---

## Step 4: Verify Deployment

After 2-3 minutes, you should see:
- ✅ **4 cron services** listed (auto-commit-midnight, 9am, noon, 9pm)
- ✅ **1 web service** (auto-commit-startup)
- ✅ All showing **"Live"** status

**First commit happens immediately** (on startup)

---

## Step 5: Check GitHub

1. Go to [github.com/Lethinkj/censored/commits](https://github.com/Lethinkj/censored/commits)
2. You should see a new commit from "lethin"
3. Check your contribution graph: [github.com/Lethinkj](https://github.com/Lethinkj)

---

## Schedule Times (UTC)
- **12:00 AM** (Midnight) - `0 0 * * *`
- **09:00 AM** - `0 9 * * *`
- **12:00 PM** (Noon) - `0 12 * * *`
- **09:00 PM** - `0 21 * * *`

**To adjust times**: Edit `render.yaml` → change `schedule:` values → git push → Render auto-updates

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Services not deploying | Check GITHUB_TOKEN is set in Render |
| Commits not appearing | Verify PAT has `repo` scope and isn't expired |
| Wrong author name | Script auto-sets "lethin" ✓ |
| Logs not visible | Check Render dashboard → Cron jobs → Logs |
| Service fails | View error logs in Render dashboard |

---

## Your Commands Were

```bash
# Test script locally (already done ✓)
python auto-commit.py

# Push to GitHub (already done ✓)
git push -u origin main
```

---

## Ready! 🚀

Everything is set up and tested. Deploy on Render now using the steps above!

**Questions?** Check Render's docs: [render.com/docs](https://render.com/docs)
