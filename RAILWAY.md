# Railway Deployment Guide

## Quick Deploy to Railway

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready attendance scheduler"
git push origin main
```

### 2. Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `zoho-automate-attendance` repository
5. Railway will automatically detect and deploy

### 3. Configure Environment (Optional)

If you want to use environment variables instead of hardcoded values:

1. In Railway dashboard, go to your project
2. Click **"Variables"** tab
3. Add these variables:
   - `ZOHO_CLIENT_ID`
   - `ZOHO_CLIENT_SECRET`
   - `ZOHO_REFRESH_TOKEN`
   - `EMPLOYEE_ID`
   - `EMPLOYEE_EMAIL`

### 4. Verify Deployment

- Check Railway logs to see: `[SUCCESS] Scheduler running`
- Check Railway logs to see: `[SUCCESS] Loaded 1 schedule(s)`

## What's Deployed

✅ **Schedule**: Monday-Friday, 9:00 AM check-in, 7:00 PM check-out
✅ **Timezone**: Asia/Kolkata (India)
✅ **Geo-location**: Automatic (Mumbai office)
✅ **Logs**: Only errors and success messages (production optimized)

## Monitoring

### View Logs
In Railway dashboard:
1. Click on your deployment
2. View **"Deployments"** tab
3. Click **"View Logs"**

You'll see:
```
[2025-12-04T09:00:00.000Z] [SUCCESS] CHECKIN successful for schedule_xxx
[2025-12-04T19:00:00.000Z] [SUCCESS] CHECKOUT successful for schedule_xxx
```

## Files for Railway

- ✅ `Procfile` - Tells Railway how to start the app
- ✅ `package.json` - Dependencies and start script
- ✅ `attendance-scheduler.js` - Main application
- ✅ `schedule.json` - Your active schedule (auto-created)

## Cost

- Railway free tier: 500 hours/month
- This app uses: ~720 hours/month (24/7 running)
- **Recommended**: Use Railway Pro ($5/month for unlimited hours)

## Troubleshooting

### Schedule not running
Check Railway logs for errors. Ensure schedule.json was created with:
```bash
npm run list
```

### Token expired
Railway will automatically refresh tokens before they expire (5-minute buffer)

### Wrong timezone
Railway uses UTC. The scheduler handles timezone conversion automatically using `Asia/Kolkata`

## Manual Commands (via Railway CLI)

Install Railway CLI:
```bash
npm install -g @railway/cli
railway login
```

Run commands:
```bash
railway run npm run checkin   # Manual check-in
railway run npm run checkout  # Manual check-out
railway run npm run status    # Check status
railway run npm run list      # List schedules
```

## Support

- Logs saved to `attendance.log`
- Only errors and success messages shown
- Automatic token refresh
- Persistent schedules across restarts

---

**Deployment Status: Production Ready** 🚀
