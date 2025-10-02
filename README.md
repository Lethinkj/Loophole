# Loophole - Daily Auto Commit

This repository automatically commits daily updates to the `loop` file using GitHub Actions.

## How it works

1. The `loop` file contains the text "there is nothing to see here" followed by lines of dots
2. Every day at 12:00 UTC, a GitHub Action runs automatically
3. The action adds a new line with one more dot than the previous maximum
4. The pattern progresses like this:
   ```
   there is nothing to see here
   .
   ..
   ...
   ....
   .....
   ```

## Files

- `loop` - The main file that gets updated daily
- `.github/workflows/daily-commit.yml` - GitHub Actions workflow for automation

## Configuration

### Changing the Schedule
To modify when the daily commit happens, edit the cron schedule in `.github/workflows/daily-commit.yml`:

```yaml
schedule:
  - cron: '0 12 * * *'  # Currently set to 12:00 UTC
```

Common cron examples:
- `'0 0 * * *'` - Midnight UTC
- `'0 9 * * *'` - 9:00 AM UTC
- `'30 14 * * *'` - 2:30 PM UTC

### Manual Trigger
You can also manually trigger the workflow:
1. Go to the "Actions" tab in your GitHub repository
2. Click on "Daily Auto Commit" workflow
3. Click "Run workflow"

## Status

The workflow runs automatically every day. You can check the status in the "Actions" tab of your repository.

## Notes

- The workflow uses GitHub's built-in `GITHUB_TOKEN` for authentication
- No additional setup or secrets are required
- The action will only commit if there are actual changes to the file