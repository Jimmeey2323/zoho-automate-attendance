# Zoho People Plus Attendance Scheduler

An advanced Node.js script for automating check-ins and check-outs on Zoho People Plus with powerful scheduling capabilities.

## Features

✨ **Advanced Scheduling**
- Schedule check-ins and check-outs at specific times
- Configure working days (Monday-Friday or custom)
- Timezone support for global teams
- Multiple concurrent schedules

⚙️ **Smart Token Management**
- Automatic token refresh before expiration
- Seamless OAuth2 integration with Zoho
- 5-minute early refresh buffer

📊 **Comprehensive Logging**
- Detailed activity logs with timestamps
- Persistent schedule configuration
- Error tracking and debugging

🎯 **Manual Execution**
- Trigger check-in/check-out on demand
- Perfect for overrides or testing

🔧 **Full CRUD Operations**
- Create, read, update, delete schedules
- List all active schedules
- Get detailed schedule information

## Prerequisites

- Node.js 14+ with ES modules support
- `node-fetch` package (HTTP requests)
- `node-cron` package (Task scheduling)
- Zoho People Plus account with API credentials

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd /Users/jimmeeygondaa/zoho-automate-attendance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify your credentials in the script:**
   Open `attendance-scheduler.js` and ensure these values are set in the `CONFIG` object:
   - `CLIENT_ID`: Your Zoho OAuth client ID
   - `CLIENT_SECRET`: Your Zoho OAuth client secret
   - `REFRESH_TOKEN`: Your refresh token
   - `ZOHO_ACCOUNT_DOMAIN`: Account API domain
   - `ZOHO_PEOPLE_API_DOMAIN`: People API domain

## Quick Start

### 1. Add Your First Schedule

Schedule automatic check-in at 9:00 AM and check-out at 6:00 PM on weekdays:

```bash
node attendance-scheduler.js add --checkin 09:00 --checkout 18:00 --days 1,2,3,4,5
```

### 2. Start the Scheduler

Keep the scheduler running in the background:

```bash
node attendance-scheduler.js start
```

The script will automatically execute check-ins and check-outs at the specified times.

### 3. View Active Schedules

```bash
node attendance-scheduler.js list
```

### 4. Check System Status

```bash
node attendance-scheduler.js status
```

## Command Reference

### Schedule Management

#### Create a New Schedule
```bash
node attendance-scheduler.js add [OPTIONS]
```

**Options:**
- `--checkin <HH:MM>` - Check-in time (24-hour format, default: 09:00)
- `--checkout <HH:MM>` - Check-out time (24-hour format, default: 18:00)
- `--days <0,1,2,3,4,5,6>` - Working days (default: 1,2,3,4,5 = Mon-Fri)
  - 0 = Sunday, 1 = Monday, 2 = Tuesday, ..., 6 = Saturday
- `--tz <timezone>` - Timezone (default: Asia/Kolkata)
  - Examples: `America/New_York`, `Europe/London`, `Asia/Tokyo`
- `--desc <description>` - Schedule description

**Examples:**
```bash
# Basic schedule
node attendance-scheduler.js add

# Specific times
node attendance-scheduler.js add --checkin 08:30 --checkout 17:30

# Include Saturdays
node attendance-scheduler.js add --days 1,2,3,4,5,6

# US timezone
node attendance-scheduler.js add --tz America/New_York

# With description
node attendance-scheduler.js add --desc "Main office schedule"
```

#### List All Schedules
```bash
node attendance-scheduler.js list
```

Shows all active schedules with their configuration.

#### Get Schedule Details
```bash
node attendance-scheduler.js get <schedule_id>
```

Displays detailed information about a specific schedule.

**Example:**
```bash
node attendance-scheduler.js get schedule_1701700800000
```

#### Update a Schedule
```bash
node attendance-scheduler.js update <schedule_id> [OPTIONS]
```

Modify check-in time, check-out time, or working days for an existing schedule.

**Example:**
```bash
node attendance-scheduler.js update schedule_1701700800000 --checkin 09:30 --checkout 18:30
```

#### Delete a Schedule
```bash
node attendance-scheduler.js delete <schedule_id>
```

Removes a schedule and stops its execution.

### Manual Attendance

#### Manual Check-In
```bash
node attendance-scheduler.js checkin
```

Immediately registers a check-in, regardless of schedule.

#### Manual Check-Out
```bash
node attendance-scheduler.js checkout
```

Immediately registers a check-out, regardless of schedule.

### System Commands

#### Check System Status
```bash
node attendance-scheduler.js status
```

Displays:
- Token validity and expiration time
- Number of active schedules
- Details of each schedule

#### View Help
```bash
node attendance-scheduler.js help
```

Shows this command reference.

#### Start the Scheduler
```bash
node attendance-scheduler.js start
```

Starts the scheduler service and keeps it running. The process will:
- Load all saved schedules
- Activate cron jobs for each schedule
- Run indefinitely until stopped (Ctrl+C)

## Configuration Details

### Default Configuration

Edit the `CONFIG` object in `attendance-scheduler.js` to customize:

```javascript
const CONFIG = {
    CHECKIN_TIME: '09:00',           // Default check-in time
    CHECKOUT_TIME: '18:00',          // Default check-out time
    WORKING_DAYS: [1, 2, 3, 4, 5],  // Monday to Friday
    LOG_FILE: './attendance.log',    // Log file path
    SCHEDULE_FILE: './schedule.json', // Schedule persistence
};
```

### Timezone Support

The scheduler supports any valid IANA timezone. Common examples:

- `Asia/Kolkata` (India)
- `Asia/Singapore`
- `Asia/Tokyo` (Japan)
- `Europe/London` (UK)
- `America/New_York` (US Eastern)
- `America/Los_Angeles` (US Pacific)
- `Australia/Sydney` (Australia)

## Logging

All activities are logged to `attendance.log` with timestamps and severity levels:

- **INFO**: General informational messages
- **SUCCESS**: Successful operations
- **WARN**: Warning messages (e.g., token expiring)
- **ERROR**: Error messages

Example log entry:
```
[2025-12-04T14:35:12.789Z] [SUCCESS] Check-in successful for schedule_1701700800000
[2025-12-04T14:35:13.123Z] [INFO] Schedule updated: schedule_1701700800000
```

## Schedule Persistence

Schedules are automatically saved to `schedule.json` and restored when the scheduler starts. This ensures your configuration persists across restarts.

Example `schedule.json`:
```json
[
  {
    "id": "schedule_1701700800000",
    "checkinTime": "09:00",
    "checkoutTime": "18:00",
    "workingDays": [1, 2, 3, 4, 5],
    "enabled": true,
    "timezone": "Asia/Kolkata",
    "description": "Main office schedule",
    "createdAt": "2025-12-04T10:00:00.000Z"
  }
]
```

## Running in the Background

### On macOS/Linux

Use `nohup` to run the scheduler in the background:

```bash
nohup node attendance-scheduler.js start > scheduler.log 2>&1 &
```

Or use `screen`:
```bash
screen -S zoho-attendance node attendance-scheduler.js start
```

To detach from screen: Press `Ctrl+A`, then `D`
To reattach: `screen -r zoho-attendance`

### On Windows

Use `start` command:
```bash
start node attendance-scheduler.js start
```

Or create a batch file `run-scheduler.bat`:
```batch
@echo off
node attendance-scheduler.js start
pause
```

### Using PM2 (Recommended)

Install PM2 globally:
```bash
npm install -g pm2
```

Start the scheduler with PM2:
```bash
pm2 start attendance-scheduler.js --name "zoho-attendance" -- start
```

View status:
```bash
pm2 status
pm2 logs zoho-attendance
```

Auto-restart on system boot:
```bash
pm2 startup
pm2 save
```

## Environment Variables (Optional)

You can also use environment variables to configure credentials. Create a `.env` file:

```env
ZOHO_CLIENT_ID=your_client_id_here
ZOHO_CLIENT_SECRET=your_client_secret_here
ZOHO_REFRESH_TOKEN=your_refresh_token_here
EMPLOYEE_ID=your_employee_id
EMPLOYEE_EMAIL=your_email@company.com
ZOHO_ACCOUNT_DOMAIN=https://accounts.zoho.in
ZOHO_PEOPLE_API_DOMAIN=https://people.zoho.in
```

Then load them in the script using the `dotenv` package.

## Troubleshooting

### Issue: "Token refresh failed"
- Verify your `CLIENT_ID` and `CLIENT_SECRET` are correct
- Check your internet connection
- Ensure your refresh token is valid

### Issue: "Cron job not executing"
- Verify the server's timezone matches your expectations
- Check `attendance.log` for errors
- Ensure Node.js process is still running

### Issue: "Schedule not found"
- Use `node attendance-scheduler.js list` to see all schedule IDs
- Copy the correct schedule ID and retry

### Issue: "API Response error"
- Check if your Zoho People Plus account is active
- Verify API domain is correct for your region
- Check your internet connection

## API Integration Details

The scheduler uses Zoho People Plus APIs:

- **Token Refresh Endpoint**: `https://accounts.zoho.in/oauth/v2/token`
- **Attendance Endpoint**: `https://people.zoho.in/people/api/attendance/insert`

### OAuth2 Flow

1. Scheduler checks token expiration
2. If expiring within 5 minutes, initiates refresh
3. Sends refresh token with client credentials
4. Receives new access token
5. Uses new token for subsequent API calls

### Attendance Operation

1. Retrieves valid access token
2. Sends check-in or check-out request
3. Zoho API registers attendance
4. Logs response and status

## Security Best Practices

⚠️ **Important:** Keep your credentials secure!

- Never commit `.env` file or credentials to version control
- Use a `.gitignore` file:
  ```
  .env
  attendance.log
  schedule.json
  node_modules/
  ```
- Consider using a secrets manager for production
- Rotate your client secret periodically
- Use strong, unique refresh tokens

## Examples

### Example 1: Simple Daily Schedule

```bash
# Add a basic 9-to-5 schedule
node attendance-scheduler.js add --checkin 09:00 --checkout 17:00

# Start the scheduler
node attendance-scheduler.js start
```

### Example 2: Multiple Schedules

```bash
# Morning shift
node attendance-scheduler.js add --checkin 06:00 --checkout 14:00 --desc "Morning shift"

# Afternoon shift
node attendance-scheduler.js add --checkin 14:00 --checkout 22:00 --desc "Afternoon shift"

# View all
node attendance-scheduler.js list
```

### Example 3: Weekend Support

```bash
# Include weekends (0=Sunday, 6=Saturday)
node attendance-scheduler.js add --days 0,1,2,3,4,5,6 --desc "7-day schedule"
```

### Example 4: Different Timezone

```bash
# For US-based team
node attendance-scheduler.js add \
  --checkin 09:00 \
  --checkout 17:00 \
  --tz America/New_York \
  --desc "US office"
```

### Example 5: Manual Adjustments

```bash
# Check in manually
node attendance-scheduler.js checkin

# Check out manually
node attendance-scheduler.js checkout
```

## Support & Debugging

1. **Check logs**: `tail -f attendance.log`
2. **View configuration**: `node attendance-scheduler.js status`
3. **Test manually**: `node attendance-scheduler.js checkin`
4. **Verify credentials**: Ensure tokens haven't expired
5. **Check connectivity**: Verify internet and API endpoints

## License

This project is provided as-is for use with Zoho People Plus.

## Changelog

### v1.0.0 (2025-12-04)
- Initial release
- Schedule creation, update, delete operations
- Automatic token refresh
- Persistent schedule storage
- Comprehensive logging
- Multiple concurrent schedules
- Timezone support
- Manual check-in/check-out

---

**Happy scheduling! 🚀**
