# Installation & Verification Guide

Complete step-by-step guide to install and verify the Zoho Attendance Scheduler.

## Prerequisites Check

Before starting, verify you have the required software:

```bash
# Check Node.js installation
node --version     # Should be 14.0.0 or higher
# Output example: v18.17.0

# Check npm installation
npm --version      # Should be 6.0.0 or higher
# Output example: 9.6.7

# Check Git (optional but recommended)
git --version      # Optional
# Output example: git version 2.40.0
```

If any are missing, install them:
- **Node.js & npm:** Download from https://nodejs.org/ (LTS version recommended)
- **Git:** Download from https://git-scm.com/

---

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd /Users/jimmeeygondaa/zoho-automate-attendance
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected Output:**
```
added 45 packages, and audited 46 packages in 5s

found 0 vulnerabilities
```

**What Gets Installed:**
- `node-cron@3.0.3` - For scheduling cron jobs
- `node-fetch@2.7.0` - For making HTTP requests

**If Installation Fails:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Try again: `npm install`

### Step 3: Verify Installation

```bash
# Check if packages are installed
ls node_modules | grep -E "node-cron|node-fetch"

# Should output:
# node-cron
# node-fetch
```

### Step 4: Verify Configuration

Ensure your credentials are properly set in `attendance-scheduler.js`:

```bash
# Check if file exists
ls -la attendance-scheduler.js

# Verify credentials are present (don't display them)
grep "CLIENT_ID" attendance-scheduler.js
grep "REFRESH_TOKEN" attendance-scheduler.js
```

---

## Verification Tests

### Test 1: Check Help Command

```bash
node attendance-scheduler.js help
```

**Expected Result:** Should display help menu with available commands

**Troubleshooting:**
- If `command not found`: Verify Node.js is installed
- If `file not found`: Verify file path is correct

---

### Test 2: Check System Status

```bash
npm run status
```

Or directly:

```bash
node attendance-scheduler.js status
```

**Expected Output:**
```json
{
  "token_valid": true,
  "token_expires_in": 3540,
  "active_schedules": 0,
  "schedules": []
}
```

**What It Shows:**
- `token_valid`: Is your access token currently valid?
- `token_expires_in`: How many seconds until it expires?
- `active_schedules`: Number of active schedules
- `schedules`: Details of each schedule

**Troubleshooting:**
- If `token_valid` is false: Token may have expired, will auto-refresh
- If 0 schedules: Normal on first run

---

### Test 3: Manual Check-In Test

```bash
npm run checkin
```

Or directly:

```bash
node attendance-scheduler.js checkin
```

**Expected Output (Success):**
```
[ISO-TIMESTAMP] [SUCCESS] Manual check-in triggered
[ISO-TIMESTAMP] [SUCCESS] Check-in successful for schedule manual
```

**Expected Output (Failure - Normal outside work hours):**
```
[ISO-TIMESTAMP] [INFO] Executing CHECK-IN for schedule manual
[ISO-TIMESTAMP] [ERROR] CHECK-IN failed: <response><error>Attendance not allowed...
```

**Troubleshooting:**
- Outside work hours: Zoho may reject attendance outside configured times
- Token error: Token needs refresh (automatic)
- API error: Check internet connection and API domain

---

### Test 4: Create Test Schedule

```bash
npm run add -- --checkin 09:00 --checkout 18:00
```

Or directly:

```bash
node attendance-scheduler.js add --checkin 09:00 --checkout 18:00
```

**Expected Output:**
```
✅ Schedule added successfully!

{
  "id": "schedule_1701700800000",
  "checkinTime": "09:00",
  "checkoutTime": "18:00",
  "workingDays": [1,2,3,4,5],
  "enabled": true,
  "timezone": "Asia/Kolkata",
  "description": "Schedule at 09:00-18:00",
  "createdAt": "2025-12-04T10:00:00.000Z"
}
```

**Troubleshooting:**
- If validation error: Check time format (must be HH:MM)
- If file not found error: Ensure schedule.json exists or let script create it

---

### Test 5: List Schedules

```bash
npm run list
```

Or directly:

```bash
node attendance-scheduler.js list
```

**Expected Output (with schedules):**
```
📋 Active Schedules:

  1. schedule_1701700800000
     Check-in: 09:00 | Check-out: 18:00
     Days: 1, 2, 3, 4, 5 | Timezone: Asia/Kolkata
     Status: ✅ Enabled
```

**Expected Output (no schedules):**
```
No active schedules.
```

---

### Test 6: Run Examples

```bash
# Show available examples
node examples.js

# Run specific example
node examples.js 1    # Simple schedule
node examples.js 6    # View schedules
node examples.js 10   # System status
```

**Expected Result:** Each example should complete without errors

---

### Test 7: Check Logs

```bash
# View recent logs
tail -n 20 attendance.log

# View in real-time
tail -f attendance.log
```

**Expected Content:**
```
[2025-12-04T14:35:12.789Z] [INFO] Zoho Attendance Automation Script Starting...
[2025-12-04T14:35:13.000Z] [SUCCESS] Token refreshed successfully
[2025-12-04T14:35:14.123Z] [SUCCESS] Schedule added: schedule_1701700800000
```

---

## Full Installation Verification Script

Create a verification script to test everything:

```bash
#!/bin/bash

echo "🔍 Zoho Attendance Scheduler - Installation Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1: Node.js
echo -n "✓ Node.js: "
node --version || echo "❌ NOT INSTALLED"

# Test 2: npm
echo -n "✓ npm: "
npm --version || echo "❌ NOT INSTALLED"

# Test 3: node_modules
echo -n "✓ Dependencies: "
if [ -d "node_modules" ]; then
    echo "✅ Installed"
else
    echo "❌ NOT INSTALLED"
fi

# Test 4: Files exist
echo -n "✓ attendance-scheduler.js: "
[ -f "attendance-scheduler.js" ] && echo "✅ Found" || echo "❌ NOT FOUND"

echo -n "✓ package.json: "
[ -f "package.json" ] && echo "✅ Found" || echo "❌ NOT FOUND"

# Test 5: Run help
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Testing scheduler..."
node attendance-scheduler.js status | head -10

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Verification complete!"
```

Save this as `verify.sh` and run:

```bash
chmod +x verify.sh
./verify.sh
```

---

## Troubleshooting Installation Issues

### Issue: `npm: command not found`

**Cause:** Node.js/npm not installed or not in PATH

**Solution:**
```bash
# Verify installation
which node
which npm

# If empty, reinstall Node.js from https://nodejs.org/
# After installation, restart terminal
```

---

### Issue: `ENOENT: no such file or directory`

**Cause:** Script file not in correct path

**Solution:**
```bash
# Verify you're in correct directory
pwd
# Should output: /Users/jimmeeygondaa/zoho-automate-attendance

# List files
ls attendance-scheduler.js
# Should show the file
```

---

### Issue: `Cannot find module 'node-cron'`

**Cause:** Dependencies not installed

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify installation
npm list node-cron node-fetch
```

---

### Issue: Token errors

**Cause:** Invalid or expired credentials

**Solution:**
```bash
# Check if tokens are set
grep "1000" attendance-scheduler.js | head -3

# If needed, get new tokens from Zoho console
# Then update attendance-scheduler.js
```

---

### Issue: `permission denied`

**Cause:** Missing execute permissions on script files

**Solution:**
```bash
# Make scripts executable
chmod +x attendance-scheduler.js
chmod +x setup.sh
chmod +x examples.js

# Run again
node attendance-scheduler.js help
```

---

## Post-Installation Setup

### 1. Configure Credentials (Optional)

If you want to use environment variables instead of hardcoded credentials:

```bash
# Create .env file
cat > .env << EOF
ZOHO_CLIENT_ID=1000.D5RD137IYSRA5SBMBP000XORKT423B
ZOHO_CLIENT_SECRET=d1a79031982c7dae82d562d8bd912b7acc678302aa
ZOHO_REFRESH_TOKEN=1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f
EOF

# Secure the file
chmod 600 .env
```

See `ENV-SETUP.md` for more details.

---

### 2. Create Initial Schedule

```bash
# Interactive setup
./setup.sh

# Or manual setup
npm run add -- --checkin 09:00 --checkout 18:00 --days 1,2,3,4,5
```

---

### 3. Verify Schedule Creation

```bash
npm run list
npm run status
```

---

### 4. Start the Scheduler

```bash
npm start
```

Should output:
```
Zoho Attendance Scheduler Starting...
Scheduler is running. Press Ctrl+C to stop.
```

---

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Node.js | 14.0.0 | 18.0.0+ |
| npm | 6.0.0 | 9.0.0+ |
| RAM | 100 MB | 512 MB |
| Disk | 50 MB | 500 MB |
| Network | HTTPS | HTTPS |

---

## First-Time Setup Checklist

- [ ] Node.js 14+ installed
- [ ] npm installed
- [ ] Credentials verified in code
- [ ] `npm install` completed successfully
- [ ] `npm run status` shows valid token
- [ ] Manual checkin/checkout tested
- [ ] Test schedule created
- [ ] Scheduler started successfully
- [ ] Logs showing activity
- [ ] No errors in attendance.log

---

## Next Steps

After successful installation:

1. **Read Documentation:** Start with `README.md`
2. **Create Schedules:** Use `npm run add` or interactive setup
3. **Monitor Activity:** Watch `attendance.log` or use `npm run status`
4. **Set to Auto-Start:** Configure to start on system boot
5. **Customize:** Modify schedules as needed

---

## Support

If you encounter issues:

1. **Check logs:** `tail -f attendance.log`
2. **Review status:** `npm run status`
3. **Test manually:** `npm run checkin`
4. **Read documentation:** Check README.md and ENV-SETUP.md
5. **Run examples:** `node examples.js`

---

**Installation & Verification Guide v1.0** | Last Updated: 2025-12-04
