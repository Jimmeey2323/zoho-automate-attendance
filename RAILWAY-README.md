# 🚂 Railway Deployment - Quick Start

This project is configured for one-click deployment to Railway with automatic attendance scheduling.

## ⚡ Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Schedule Configuration
- ✅ **Check-in**: 10:30 AM IST (Monday-Friday)
- ✅ **Check-out**: 7:00 PM IST (Monday-Friday)
- ✅ **No validation checks** - Commands execute regardless of previous entries
- ✅ **Geo-location included** - Automatic location tracking

## 📋 Setup Steps

### 1. Deploy to Railway
1. Click the "Deploy on Railway" button above (or manually connect your repo)
2. Railway will automatically detect and use `railway.json` configuration
3. Wait for initial deployment to complete

### 2. Configure Environment Variables
Go to Railway Dashboard → Variables tab and add:

```bash
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
EMPLOYEE_ID=your_employee_id
EMPLOYEE_EMAIL=your_email@company.com
EMPLOYEE_API_ID=your_api_employee_id
```

See `RAILWAY.env.example` for detailed instructions.

### 3. Verify Deployment
- Health check: `https://your-app.railway.app/health`
- Expected response: `{"status":"ok","schedules":1,"uptime":xxx}`

### 4. Monitor Logs
Check Railway logs for:
```
[SUCCESS] Scheduler running
[SUCCESS] Health server listening on port XXXX
[SUCCESS] Restored 1 schedule(s) from configuration
```

## 📁 Configuration Files

| File | Purpose |
|------|---------|
| `railway.json` | Railway platform configuration |
| `Procfile` | Start command for Railway |
| `schedule.json` | Pre-configured schedule (10:30 AM / 7:00 PM) |
| `RAILWAY.env.example` | Environment variables guide |
| `RAILWAY-SETUP.md` | Complete deployment documentation |

## 🔧 Key Changes

This deployment includes the following modifications:

1. **Removed validation checks** - Attendance commands execute immediately without checking previous entries
2. **Updated default times** - Check-in: 10:30 AM, Check-out: 7:00 PM
3. **Health endpoint** - Added `/health` for Railway monitoring
4. **Auto-restart** - Railway restarts the app if it crashes (up to 10 retries)

## 📊 Monitoring

### View Execution Logs
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login
railway link

# View logs
railway logs

# Check status
railway run node attendance-scheduler.js status
```

### Expected Cron Logs
At 10:30 AM IST:
```
[CRON] Check-in task triggered for schedule_default
[INFO] Performing checkin without validation check
[SUCCESS] Check-in successful
```

At 7:00 PM IST:
```
[CRON] Check-out task triggered for schedule_default
[INFO] Performing checkout without validation check
[SUCCESS] Check-out successful
```

## 🛠️ Troubleshooting

### Scheduler Not Running
- Verify all environment variables are set
- Check Railway logs for errors
- Ensure `schedule.json` exists and is valid

### Health Check Failing
- Verify the app is listening on the PORT provided by Railway
- Check if the health endpoint responds: `/health`

### Commands Not Executing
- Verify timezone is `Asia/Kolkata` in `schedule.json`
- Check if working days (1-5) match your schedule
- Review Railway logs at scheduled times (10:30 AM / 7:00 PM IST)

### Token Errors
- Verify your refresh token is valid
- App auto-refreshes tokens 5 minutes before expiry
- Generate a new refresh token if needed

## 💰 Railway Pricing

- **Free Tier**: $5 credit (~500 hours/month)
- **This App**: Runs 24/7 (~744 hours/month)
- **Recommendation**: Upgrade to Railway Pro ($5/month) for unlimited hours

## 📚 Full Documentation

For complete setup instructions and troubleshooting, see:
- 📖 [RAILWAY-SETUP.md](RAILWAY-SETUP.md) - Complete deployment guide
- 🔐 [RAILWAY.env.example](RAILWAY.env.example) - Environment variables
- 📝 [README.md](README.md) - General project documentation

## 🎯 Features

✅ Automatic check-in at 10:30 AM (Mon-Fri)  
✅ Automatic check-out at 7:00 PM (Mon-Fri)  
✅ No validation - Direct execution  
✅ Geo-location tracking included  
✅ Auto token refresh  
✅ Health monitoring  
✅ Auto-restart on failure  
✅ Detailed logging  

---

**Ready to deploy?** Click the Railway button above or follow the setup steps! 🚀
