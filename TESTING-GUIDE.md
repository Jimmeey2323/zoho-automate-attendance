# Railway Deployment Guide - Complete Setup

## ✅ Step-by-Step Deployment

### Step 1: Set Up Environment Variables in Railway

After deploying to Railway, you **MUST** add these environment variables:

1. Go to your Railway project dashboard
2. Click **"Variables"** tab
3. Click **"+ New Variable"**
4. Add each of these:

```
ZOHO_CLIENT_ID=1000.D5RD137IYSRA5SBMBP000XORKT423B
ZOHO_CLIENT_SECRET=d1a79031982c7dae82d562d8bd912b7acc678302aa
ZOHO_REFRESH_TOKEN=1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f
EMPLOYEE_ID=60028527882
EMPLOYEE_EMAIL=jimmeey@physique57india.com
```

5. Click **"Deploy"** to restart with new variables

---

## 🧪 Testing Railway Schedule

### Method 1: Check Railway Logs (Easiest)

1. **Go to Railway Dashboard** → Your Project
2. Click **"Deployments"** tab
3. Click **"View Logs"**

**What to look for:**
```
[2025-12-04T09:00:00.000Z] [SUCCESS] CHECKIN successful for schedule_xxx
[2025-12-04T19:00:00.000Z] [SUCCESS] CHECKOUT successful for schedule_xxx
```

### Method 2: Use Railway CLI

Install Railway CLI:
```bash
npm install -g @railway/cli
```

Login and link project:
```bash
railway login
railway link
```

**Test commands:**
```bash
# Check if scheduler is running
railway logs

# View current status
railway run npm run status

# List active schedules
railway run npm run list

# Manual test check-in
railway run npm run checkin

# Manual test check-out
railway run npm run checkout
```

### Method 3: Check Zoho Dashboard

1. Go to your Zoho People Plus attendance page
2. Look for today's date
3. Refresh the page
4. You should see:
   - **Check-in at 9:00 AM** (Mon-Fri)
   - **Check-out at 7:00 PM** (Mon-Fri)

---

## 📊 What Should Happen

### Daily Schedule (Monday-Friday):
- **9:00 AM IST**: Automatic check-in with geo-location (Godrej Chowk, Mumbai)
- **7:00 PM IST**: Automatic check-out with geo-location (China Garden, Mumbai)

### Weekends (Saturday-Sunday):
- No automatic check-ins/check-outs

---

## 🔍 Verification Checklist

### ✅ Railway Deployment Checklist:

- [ ] Repository pushed to GitHub
- [ ] Railway project created
- [ ] All 5 environment variables added
- [ ] Deployment successful (green checkmark)
- [ ] Logs show: `[SUCCESS] Scheduler running`
- [ ] Logs show: `[SUCCESS] Loaded 1 schedule(s)`

### ✅ Schedule Verification:

Run this on Railway:
```bash
railway run npm run list
```

Should show:
```
schedule_1764852895954
Check-in: 09:00 | Check-out: 19:00
Days: 1, 2, 3, 4, 5 | Timezone: Asia/Kolkata
Status: ✅ Enabled
```

### ✅ Manual Test (Optional):

Force a check-in right now:
```bash
railway run npm run checkin
```

Expected output:
```
[SUCCESS] Manual check-in triggered
[SUCCESS] CHECKIN successful for schedule manual
✓ Check-in successful
```

Then check your Zoho dashboard - you should see the check-in appear immediately.

---

## 🐛 Troubleshooting

### Issue: "Deployment Failed"
- **Fix**: Check Railway logs for errors
- **Common**: Missing environment variables

### Issue: "No schedules found"
- **Fix**: The schedule.json file needs to be created
- **Solution**: Run `railway run npm run list` - Railway will auto-create it

### Issue: "Token invalid" error
- **Fix**: Your OAuth token may have expired
- **Solution**: Generate new tokens in Zoho Developer Console

### Issue: Schedule not running at correct time
- **Fix**: Railway uses UTC timezone
- **Solution**: The code handles this automatically with `Asia/Kolkata` timezone

### Issue: Check-in shows in logs but not in Zoho
- **Fix**: Refresh your Zoho dashboard (Ctrl+F5)
- **Wait**: Sometimes Zoho UI takes 1-2 minutes to update

---

## 🎯 Expected Log Output

### When scheduler starts:
```
[2025-12-04T12:00:00.000Z] [SUCCESS] Scheduler running
[2025-12-04T12:00:00.000Z] [SUCCESS] Loaded 1 schedule(s)
```

### At 9:00 AM (Mon-Fri):
```
[2025-12-04T03:30:00.000Z] [SUCCESS] CHECKIN successful for schedule_1764852895954
```
*(Note: Shows UTC time, but executes at 9:00 AM IST)*

### At 7:00 PM (Mon-Fri):
```
[2025-12-04T13:30:00.000Z] [SUCCESS] CHECKOUT successful for schedule_1764852895954
```
*(Note: Shows UTC time, but executes at 7:00 PM IST)*

---

## 📝 Important Notes

1. **Timezone Handling**: 
   - Railway server is in UTC
   - Code converts to Asia/Kolkata automatically
   - Check-ins happen at correct local time

2. **Geo-Location**:
   - Automatically included with every check-in/out
   - Uses your verified Mumbai office coordinates

3. **Token Refresh**:
   - Automatic before expiration
   - No manual intervention needed

4. **Persistent Schedules**:
   - Saved in `schedule.json`
   - Survives Railway restarts
   - Don't delete this file

---

## 🚀 Quick Test Right Now

```bash
# Deploy to Railway
git push origin main

# Wait 2 minutes for deployment

# Test immediately
railway run npm run checkin

# Check logs
railway logs --tail

# Check Zoho dashboard
# Should see check-in appear within 30 seconds
```

---

## 📞 Success Indicators

✅ **Deployment Successful** if you see:
- Green checkmark in Railway dashboard
- Logs show "Scheduler running"
- `railway run npm run status` shows valid token

✅ **Schedule Working** if you see:
- Logs show check-ins at 9:00 AM
- Logs show check-outs at 7:00 PM  
- Zoho dashboard reflects attendance

✅ **Everything Perfect** if:
- No errors in Railway logs for 24+ hours
- Zoho shows complete attendance records
- Monday-Friday automatic attendance works

---

**Need Help?** Check Railway logs first - they show exactly what's happening!

