# Commands & Operations Reference

Quick reference for all available commands in the Zoho Attendance Scheduler.

## Main Commands

### Scheduler Control

```bash
# Start the scheduler (runs continuously)
npm start
node attendance-scheduler.js start

# Show help menu
npm run help
node attendance-scheduler.js help
```

### Schedule Management

```bash
# Add a new schedule
npm run add
node attendance-scheduler.js add [OPTIONS]

# List all active schedules
npm run list
node attendance-scheduler.js list

# Get details of specific schedule
node attendance-scheduler.js get <schedule-id>

# Update a schedule
node attendance-scheduler.js update <schedule-id> [OPTIONS]

# Delete a schedule
node attendance-scheduler.js delete <schedule-id>
```

### Manual Attendance

```bash
# Manually check in
npm run checkin
node attendance-scheduler.js checkin

# Manually check out
npm run checkout
node attendance-scheduler.js checkout
```

### System Information

```bash
# Check system status and token validity
npm run status
node attendance-scheduler.js status
```

---

## Add Schedule - Option Flags

### Basic
```bash
# Default times (09:00 - 18:00)
npm run add

# Custom times
npm run add -- --checkin 09:00 --checkout 18:00
npm run add -- --checkin 08:30 --checkout 17:30
```

### Working Days
```bash
# Monday to Friday (default)
npm run add -- --days 1,2,3,4,5

# All days
npm run add -- --days 0,1,2,3,4,5,6

# Weekends only
npm run add -- --days 0,6

# Specific days: Tue, Wed, Thu
npm run add -- --days 2,3,4
```

### Timezone
```bash
# Asia/Kolkata (default)
npm run add -- --tz Asia/Kolkata

# US Timezones
npm run add -- --tz America/New_York
npm run add -- --tz America/Los_Angeles
npm run add -- --tz America/Chicago

# European Timezones
npm run add -- --tz Europe/London
npm run add -- --tz Europe/Paris
npm run add -- --tz Europe/Berlin

# Other
npm run add -- --tz Asia/Tokyo
npm run add -- --tz Australia/Sydney
```

### Description
```bash
# Add schedule description
npm run add -- --desc "Main office schedule"
npm run add -- --desc "Remote work hours"
npm run add -- --desc "Sales team"
```

### Combined Options
```bash
# Example 1: US office, 8-5, weekdays
npm run add -- \
  --checkin 08:00 \
  --checkout 17:00 \
  --days 1,2,3,4,5 \
  --tz America/New_York \
  --desc "US Office"

# Example 2: Weekend support, 9-6
npm run add -- \
  --checkin 09:00 \
  --checkout 18:00 \
  --days 0,6 \
  --desc "Weekend Support"

# Example 3: Flexible hours, all days
npm run add -- \
  --checkin 10:00 \
  --checkout 18:00 \
  --days 0,1,2,3,4,5,6 \
  --tz Asia/Kolkata \
  --desc "Flexible 24/7 Operations"
```

---

## Update Schedule - Option Flags

```bash
# Update check-in time
node attendance-scheduler.js update <schedule-id> --checkin 09:30

# Update check-out time
node attendance-scheduler.js update <schedule-id> --checkout 18:30

# Update working days
node attendance-scheduler.js update <schedule-id> --days 1,2,3,4,5,6

# Combined update
node attendance-scheduler.js update <schedule-id> \
  --checkin 09:30 \
  --checkout 18:30
```

---

## Day Numbers Reference

| Day | Number |
|-----|--------|
| Sunday | 0 |
| Monday | 1 |
| Tuesday | 2 |
| Wednesday | 3 |
| Thursday | 4 |
| Friday | 5 |
| Saturday | 6 |

### Common Combinations

```bash
# Weekdays (Mon-Fri)
--days 1,2,3,4,5

# All days
--days 0,1,2,3,4,5,6

# Weekends (Sat-Sun)
--days 0,6

# Specific days
--days 1,3,5          # Mon, Wed, Fri
--days 2,4            # Tue, Thu
--days 1,2,3,4,5      # Mon-Fri
--days 0,1,2,3,4,5,6  # All days
--days 5,6            # Fri-Sat
```

---

## Timezone Reference

### Common Timezones

**Asia:**
- `Asia/Kolkata` - India
- `Asia/Singapore` - Singapore
- `Asia/Tokyo` - Japan
- `Asia/Shanghai` - China
- `Asia/Dubai` - UAE
- `Asia/Bangkok` - Thailand
- `Asia/Hong_Kong` - Hong Kong

**Americas:**
- `America/New_York` - US Eastern
- `America/Chicago` - US Central
- `America/Denver` - US Mountain
- `America/Los_Angeles` - US Pacific
- `America/Toronto` - Canada (Eastern)
- `America/Vancouver` - Canada (Pacific)
- `America/Mexico_City` - Mexico
- `America/Buenos_Aires` - Argentina
- `America/Sao_Paulo` - Brazil

**Europe:**
- `Europe/London` - UK
- `Europe/Paris` - France
- `Europe/Berlin` - Germany
- `Europe/Amsterdam` - Netherlands
- `Europe/Madrid` - Spain
- `Europe/Rome` - Italy
- `Europe/Istanbul` - Turkey
- `Europe/Moscow` - Russia

**Africa:**
- `Africa/Cairo` - Egypt
- `Africa/Johannesburg` - South Africa
- `Africa/Lagos` - Nigeria

**Pacific:**
- `Australia/Sydney` - Australia (Eastern)
- `Australia/Melbourne` - Australia (Victoria)
- `Pacific/Auckland` - New Zealand
- `Pacific/Fiji` - Fiji
- `Pacific/Honolulu` - Hawaii

---

## Workflow Examples

### Workflow 1: Setup New Office

```bash
# 1. Install dependencies
npm install

# 2. Add office schedule
npm run add -- \
  --checkin 09:00 \
  --checkout 18:00 \
  --days 1,2,3,4,5 \
  --tz America/New_York \
  --desc "New York Office"

# 3. Verify setup
npm run list
npm run status

# 4. Start scheduler
npm start
```

### Workflow 2: Multiple Shifts

```bash
# Morning shift (6 AM - 2 PM)
npm run add -- \
  --checkin 06:00 \
  --checkout 14:00 \
  --desc "Morning Shift"

# Afternoon shift (2 PM - 10 PM)
npm run add -- \
  --checkin 14:00 \
  --checkout 22:00 \
  --desc "Afternoon Shift"

# Night shift (10 PM - 6 AM)
npm run add -- \
  --checkin 22:00 \
  --checkout 06:00 \
  --desc "Night Shift"

# View all
npm run list

# Start
npm start
```

### Workflow 3: Modify Schedule

```bash
# List to get schedule ID
npm run list

# Get ID: schedule_1701700800000

# Update schedule
node attendance-scheduler.js update schedule_1701700800000 \
  --checkin 09:30 \
  --checkout 18:30

# Verify
npm run list
```

### Workflow 4: Manual Attendance

```bash
# Check current status
npm run status

# Manual check-in
npm run checkin

# Wait/work
# ...

# Manual check-out
npm run checkout

# View in logs
tail -n 10 attendance.log
```

---

## System Commands

### Monitor Scheduler

```bash
# Check if running
ps aux | grep "node attendance"

# View resource usage
top -p $(pgrep -f "node attendance")

# Check recent logs
tail -n 50 attendance.log

# Real-time logs
tail -f attendance.log
```

### Manage Background Process

```bash
# Using nohup
nohup npm start > scheduler.log 2>&1 &

# Using screen
screen -S zoho-scheduler npm start
# Detach: Ctrl+A, then D
# Reattach: screen -r zoho-scheduler

# Using PM2
pm2 start attendance-scheduler.js --name "zoho"
pm2 logs zoho
pm2 stop zoho
pm2 restart zoho
```

### Log Management

```bash
# View logs
tail -f attendance.log

# Search logs
grep SUCCESS attendance.log
grep ERROR attendance.log
grep "2025-12-04" attendance.log

# Count entries
wc -l attendance.log
grep -c SUCCESS attendance.log
grep -c ERROR attendance.log

# Backup logs
cp attendance.log attendance.log.$(date +%Y%m%d)

# Archive and clear
gzip attendance.log
touch attendance.log
```

---

## Environment Variables

If using environment variable configuration:

```bash
# Set temporarily (current session only)
export ZOHO_CLIENT_ID="1000.D5RD137I..."
export ZOHO_CLIENT_SECRET="d1a79031..."
export ZOHO_REFRESH_TOKEN="1000.7c8573..."

# Set permanently (macOS/Linux)
echo 'export ZOHO_CLIENT_ID="..."' >> ~/.zshrc
source ~/.zshrc

# Load from .env file
export $(cat .env | xargs)

# Verify
echo $ZOHO_CLIENT_ID
```

---

## File Operations

### Backup & Restore

```bash
# Backup schedules
cp schedule.json schedule.json.backup

# Backup logs
cp attendance.log attendance.log.backup

# Restore schedules
cp schedule.json.backup schedule.json

# Clear logs (after backup)
rm attendance.log
touch attendance.log
```

### Cleanup

```bash
# Remove old logs
rm attendance.log.old

# Clean backup files
rm *.backup

# Clear node_modules (if needed)
rm -rf node_modules
npm install
```

---

## Debugging Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check installed packages
npm list

# Check for vulnerabilities
npm audit

# Test script syntax
node -c attendance-scheduler.js

# Run with debugging
NODE_DEBUG=* node attendance-scheduler.js status

# Check file permissions
ls -la attendance-scheduler.js
ls -la schedule.json
ls -la attendance.log
```

---

## Quick Copy-Paste Commands

### For Different Scenarios

**Standard Office:**
```bash
npm run add -- --checkin 09:00 --checkout 18:00
```

**US Office:**
```bash
npm run add -- --checkin 09:00 --checkout 17:00 --tz America/New_York
```

**Flexible Hours:**
```bash
npm run add -- --checkin 10:00 --checkout 18:00 --days 0,1,2,3,4,5,6
```

**Weekend Support:**
```bash
npm run add -- --checkin 09:00 --checkout 18:00 --days 0,6
```

**Early Shift:**
```bash
npm run add -- --checkin 06:00 --checkout 14:00
```

**Late Shift:**
```bash
npm run add -- --checkin 14:00 --checkout 22:00
```

---

## Status Codes & Meanings

### Token Status
- ✅ `token_valid: true` - Token is current
- ⚠️ `token_valid: false` - Will be refreshed automatically
- ❌ Token error - Check credentials

### Schedule Status
- ✅ `enabled: true` - Schedule is active
- ⚠️ `enabled: false` - Schedule is disabled (not running)

### API Status
- ✅ `success: true` - Attendance recorded
- ❌ `success: false` - Attendance failed (outside work hours, etc.)

---

## Common Issues & Quick Fixes

```bash
# Token expired
npm run status              # Will auto-refresh

# Schedule not running
npm run list               # Verify it exists
npm run status             # Check if enabled

# Wrong time
date                       # Check system time
npm run list               # Check schedule timezone

# Can't find schedule
npm run list               # Copy correct ID
node attendance-scheduler.js get <id>

# Logs not appearing
tail -f attendance.log     # View in real-time

# Clear old logs
> attendance.log           # Truncate file
npm run status             # Trigger new entry
```

---

## Tips & Tricks

### Create Alias for Easy Access
```bash
alias zoho='node /Users/jimmeeygondaa/zoho-automate-attendance/attendance-scheduler.js'
alias zoho-add='zoho add'
alias zoho-list='zoho list'
alias zoho-status='zoho status'
```

### Monitor Multiple Things
```bash
# Terminal 1: Monitor logs
tail -f attendance.log

# Terminal 2: Monitor status every 30 seconds
watch -n 30 'npm run status'

# Terminal 3: Run scheduler
npm start
```

### Automated Backups
```bash
# Backup schedules daily
(crontab -l 2>/dev/null; echo "0 2 * * * cp /path/to/schedule.json /path/to/schedule.json.\$(date +\\%Y\\%m\\%d)") | crontab -
```

---

**Commands & Operations Reference v1.0** | Last Updated: December 4, 2025
