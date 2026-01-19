# Deploy to Render FREE (No Subscription)

## How It Works
Instead of Render's paid cron jobs, we use a **Flask web service** with **APScheduler** to handle scheduling. This works on Render's **free tier**.

---

## Step 1: Create GitHub Personal Access Token

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. **Name**: `render-auto-commit`
4. **Scopes**: Select `repo` (full control)
5. **Generate** and copy the token

---

## Step 2: Deploy on Render (Free)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your **censored** repository
5. Fill in the form:

| Field | Value |
|-------|-------|
| **Name** | censored |
| **Language** | Python 3 |
| **Branch** | main |
| **Root Directory** | (leave empty) |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `python app.py` |
| **Instance Type** | **Free** |

6. Click **"Advanced"** and add:
   - **NAME**: `GITHUB_TOKEN`
   - **VALUE**: (paste your PAT)

7. Click **"Create Web Service"** ✅

---

## Step 3: Verify It Works

- Wait 2-3 minutes for deployment
- Check status: Should say **"Live"**
- Visit your service URL (Render gives you one)
- You should see: `{"status": "healthy", ...}`

---

## Schedule Times (Automatic)

The service automatically runs auto-commits at:
- **12:00 AM UTC** (Midnight)
- **09:00 AM UTC** 
- **12:00 PM UTC** (Noon)
- **09:00 PM UTC**

---

## Manual Commit Trigger

You can also manually trigger a commit:
```bash
curl -X POST https://your-render-service-url/commit-now
```

---

## Free Tier Limitations ⚠️

- Free web services **spin down after 15 minutes of inactivity**
- Scheduler runs while service is **active**
- If you need 24/7 commits, upgrade to **Starter ($7/month)**

---

## Check Your Commits

1. Go to [github.com/Lethinkj/censored/commits](https://github.com/Lethinkj/censored/commits)
2. New commits should appear at scheduled times
3. Check contribution graph for green dots

---

## Files Updated

- ✅ **app.py** - Flask web service with APScheduler
- ✅ **requirements.txt** - Updated with Flask & APScheduler
- ✅ **render.yaml** - No longer needed (use web service instead)

---

## Your Free Setup is Ready! 🚀

Everything is configured for Render's **free tier**. Just deploy the web service and watch the commits happen!
