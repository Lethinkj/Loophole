# Simplified Setup for Render Auto-Commit

## Quick Start (5 minutes)

### 1. Create GitHub Token
- Go to [github.com/settings/tokens](https://github.com/settings/tokens)
- Click "Generate new token (classic)"
- Select `repo` scope → Generate → Copy token

### 2. Deploy to Render
- Go to [render.com](https://render.com)
- Sign up/login with GitHub
- Click "New +" → "Blueprint"
- Connect this repository
- In Environment tab, add: `GITHUB_TOKEN = <your-token>`
- Click "Deploy Blueprint"

### 3. Done! ✅
Render will auto-commit:
- **Immediately on startup** - When service starts/deploys
- **12:00 AM UTC** - Midnight
- **09:00 AM UTC** - Morning
- **12:00 PM UTC** - Noon  
- **09:00 PM UTC** - Evening

Each commit:
- Adds a line to `commits.txt`
- Shows author as "lethin"
- Appears in your GitHub contribution graph
- Contains message: "this is auto comited by lethin for any further assistance contact lethin"

---

## Need to Adjust Times?
Edit `render.yaml` line with `schedule:` and change the cron time:
- `0 0` = 12 AM (midnight)
- `0 9` = 9 AM
- `0 12` = 12 PM (noon)
- `0 21` = 9 PM

Then push changes and Render will auto-update.

## Questions?
All logs visible in Render dashboard → Cron jobs → Logs tab
