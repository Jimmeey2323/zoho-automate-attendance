# Railway Deployment Guide - Complete Setup

This guide will help you deploy the Zoho Attendance Automation to Railway with automatic check-in at **10:30 AM** and check-out at **7:00 PM**.

## 🚀 Quick Deploy to Railway

### Step 1: Prepare Your Repository

1. Ensure all changes are committed to your Git repository
2. Push to GitHub (or any Git provider supported by Railway)

### Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `zoho-automate-attendance`
5. Railway will automatically detect the configuration from `railway.json` and `Procfile`

### Step 3: Set Environment Variables

After deployment, you **MUST** add these environment variables in Railway:

1. Go to your Railway project dashboard
2. Click on your service
3. Navigate to the **"Variables"** tab
4. Add the following variables:

```bash
# Required: Zoho OAuth Credentials
ZOHO_CLIENT_ID=your_client_id_here
ZOHO_CLIENT_SECRET=your_client_secret_here
ZOHO_REFRESH_TOKEN=your_refresh_token_here

# Required: Employee Identification
EMPLOYEE_ID=your_employee_record_id
EMPLOYEE_EMAIL=your_email@company.com
EMPLOYEE_API_ID=your_api_employee_id

# Optional: If you have a mapper ID
MAPPER_ID=your_mapper_id
```

### Step 4: Verify Deployment

1. Check the **Deploy Logs** in Railway dashboard
2. Look for these success messages:
   - `[SUCCESS] Scheduler running`
   - `[SUCCESS] Health server listening on port XXXX`
   - `[SUCCESS] Restored X schedules from configuration`

3. Visit your app's health endpoint: `https://your-app.railway.app/health`
   - You should see: `{"status":"ok","schedules":1,"uptime":xxx}`

## ⚙️ Configuration Files

The following files configure Railway deployment:

### `railway.json` (NEW)
- Defines build and deployment settings
- Configures health check endpoint
- Sets restart policy

### `Procfile`
- Tells Railway to start the scheduler with `node attendance-scheduler.js start`

### `package.json`
- Specifies Node.js version requirement (>=14.0.0)

## 🕐 Schedule Configuration

The scheduler is pre-configured with:
- **Check-in**: 10:30 AM IST
- **Check-out**: 7:00 PM IST
- **Working Days**: Monday to Friday (1-5)
- **Timezone**: Asia/Kolkata
- **Geo-location**: Enabled by default

### Default Schedule File

A default schedule is created automatically on first run. You can verify it in the logs:

```
[SUCCESS] Restored 1 schedule(s) from configuration
```

## 📊 Monitoring Your Deployment

### View Logs
1. Go to Railway dashboard → Your Project → Service
2. Click on **"Deployments"** tab
3. Click on the active deployment to view logs
4. Look for:
   - `[CRON] Check-in task triggered`
   - `[SUCCESS] Check-in successful`
   - `[CRON] Check-out task triggered`
   - `[SUCCESS] Check-out successful`

### Health Check
Railway automatically monitors the health endpoint (`/health`). If the app crashes, it will restart automatically (up to 10 retries).

### View Schedule Status
To see active schedules, check the logs for startup messages:
```
[INFO] Restored 1 schedules from configuration
```

## 🔧 Manual Testing (Optional)

If you want to test manually using Railway CLI:

### Install Railway CLI
```bash
npm install -g @railway/cli
railway login
railway link
```

### Test Commands
```bash
# View logs
railway logs

# Check status
railway run node attendance-scheduler.js status

# List schedules
railway run node attendance-scheduler.js list

# Manual check-in (for testing)
railway run node attendance-scheduler.js checkin

# Manual check-out (for testing)
railway run node attendance-scheduler.js checkout
```

## 🎯 Key Features

### Automatic Execution
- ✅ No validation checks - Commands execute regardless of previous entries
- ✅ Check-in at 10:30 AM IST on weekdays
- ✅ Check-out at 7:00 PM IST on weekdays
- ✅ Includes geo-location data
- ✅ Automatic token refresh

### Reliability
- ✅ Health check endpoint for monitoring
- ✅ Automatic restart on failure (up to 10 retries)
- ✅ Persistent schedule configuration
- ✅ Detailed logging for troubleshooting

## 🛠️ Troubleshooting

### Deployment Failed
- Check that all environment variables are set correctly
- Verify your `ZOHO_REFRESH_TOKEN` is valid
- Check Railway logs for specific error messages

### Scheduler Not Running
- Ensure the health endpoint responds: `https://your-app.railway.app/health`
- Check if schedules are loaded in the logs
- Verify the `schedule.json` file exists (check logs)

### Token Errors
- The app automatically refreshes tokens 5 minutes before expiry
- If you see token errors, verify your OAuth credentials
- Generate a new refresh token if needed

### Commands Not Executing at Scheduled Time
- Railway uses UTC internally, but the app converts to Asia/Kolkata timezone
- Check logs at the scheduled times to see execution
- Verify the `schedule.json` has the correct times (10:30 and 19:00)

## 💡 Important Notes

### Free Tier Limits
- Railway free tier: 500 hours/month ($5 credit)
- This app runs 24/7, consuming ~744 hours/month
- **Recommended**: Upgrade to Railway Pro ($5/month) for unlimited hours

### Geo-Location
- Coordinates are included in all check-in/check-out requests
- Default locations:
  - Check-in: Godrej Chowk, Mumbai
  - Check-out: China Garden, Mumbai

### Timezone
- All schedules use `Asia/Kolkata` timezone
- Railway platform runs in UTC but the app handles conversion

### Logs
- Logs are stored in `attendance.log` within the container
- Access via Railway dashboard or CLI
- Important events (SUCCESS/ERROR) are always logged

## 📝 Next Steps

1. ✅ Deploy to Railway
2. ✅ Set environment variables
3. ✅ Verify health endpoint
4. ✅ Check logs for successful deployment
5. ✅ Wait for scheduled execution (10:30 AM or 7:00 PM)
6. ✅ Monitor logs to confirm attendance actions

## 🔗 Useful Links

- [Railway Documentation](https://docs.railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Zoho People API](https://www.zoho.com/people/api/)

## ⚠️ Security

- Never commit `.env` file or credentials to Git
- Use Railway's environment variables for secrets
- Regularly rotate your refresh token
- Keep your repository private

---

**Need Help?** Check the logs first - they contain detailed information about what's happening with your scheduler.
