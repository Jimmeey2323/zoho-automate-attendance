# Zoho Attendance Scheduler - API Reference

This document provides comprehensive API documentation for the Zoho Attendance Scheduler module.

## Table of Contents

1. [Token Management](#token-management)
2. [Attendance Operations](#attendance-operations)
3. [Schedule Management](#schedule-management)
4. [Utilities](#utilities)
5. [Error Handling](#error-handling)

---

## Token Management

### `getValidAccessToken()`

Retrieves a valid access token, refreshing it if necessary.

**Syntax:**
```javascript
const token = await getValidAccessToken();
```

**Returns:**
- `string` - Valid Zoho OAuth access token

**Description:**
Checks if the current token is expiring within the next 5 minutes. If so, automatically initiates a refresh. This ensures your API calls always use a valid token.

**Example:**
```javascript
import { getValidAccessToken } from './attendance-scheduler.js';

const token = await getValidAccessToken();
console.log('Current token:', token);
```

---

### `refreshAccessToken()`

Refreshes the access token using the refresh token and client credentials.

**Syntax:**
```javascript
await refreshAccessToken();
```

**Returns:**
- `Promise<void>` - Resolves when token is successfully refreshed

**Throws:**
- `Error` - If token refresh fails

**Description:**
Uses OAuth2 refresh token grant to obtain a new access token from Zoho's authorization server. Updates the global `currentAccessToken` and `tokenExpirationTime` variables.

**Example:**
```javascript
import { refreshAccessToken } from './attendance-scheduler.js';

try {
    await refreshAccessToken();
    console.log('Token refreshed successfully');
} catch (error) {
    console.error('Failed to refresh token:', error);
}
```

---

## Attendance Operations

### `performAttendanceAction(operation, scheduleId)`

Performs a check-in or check-out attendance action on Zoho People Plus.

**Syntax:**
```javascript
const result = await performAttendanceAction(operation, scheduleId);
```

**Parameters:**
- `operation` (string) - Either `'checkin'` or `'checkout'`
- `scheduleId` (string) - Identifier for the schedule (used in logging)

**Returns:**
- `Object` - Result object with structure:
  ```javascript
  {
    success: boolean,
    response: string,    // API response body
    error?: string       // Error message if failed
  }
  ```

**Throws:**
- Does not throw; errors are caught and returned in response object

**Description:**
Sends an attendance action request to Zoho People Plus API. Automatically handles token validation and refresh.

**Example:**
```javascript
import { performAttendanceAction } from './attendance-scheduler.js';

// Check in
const checkinResult = await performAttendanceAction('checkin', 'schedule_123');
if (checkinResult.success) {
    console.log('Check-in successful');
} else {
    console.error('Check-in failed:', checkinResult.error);
}

// Check out
const checkoutResult = await performAttendanceAction('checkout', 'schedule_456');
```

---

### `manualCheckIn()`

Manually triggers an immediate check-in action.

**Syntax:**
```javascript
const result = await manualCheckIn();
```

**Returns:**
- `Object` - Same structure as `performAttendanceAction()` response

**Description:**
Convenience function that performs a check-in with schedule ID 'manual'. Useful for on-demand attendance registration.

**Example:**
```javascript
import { manualCheckIn } from './attendance-scheduler.js';

const result = await manualCheckIn();
console.log(result);
```

---

### `manualCheckOut()`

Manually triggers an immediate check-out action.

**Syntax:**
```javascript
const result = await manualCheckOut();
```

**Returns:**
- `Object` - Same structure as `performAttendanceAction()` response

**Description:**
Convenience function that performs a check-out with schedule ID 'manual'. Useful for on-demand attendance registration.

**Example:**
```javascript
import { manualCheckOut } from './attendance-scheduler.js';

const result = await manualCheckOut();
console.log(result);
```

---

## Schedule Management

### `addSchedule(config)`

Creates and activates a new attendance schedule.

**Syntax:**
```javascript
const schedule = addSchedule(config);
```

**Parameters:**
- `config` (Object) - Configuration object:
  ```javascript
  {
    checkinTime: string,     // 'HH:MM' format (required)
    checkoutTime: string,    // 'HH:MM' format (required)
    workingDays: number[],   // 0-6 (0=Sunday, required)
    enabled: boolean,        // Default: true
    timezone: string,        // Default: 'Asia/Kolkata'
    description: string      // Default: generated
  }
  ```

**Returns:**
- `Object|null` - Schedule object or null if validation fails
  ```javascript
  {
    id: string,
    checkinTime: string,
    checkoutTime: string,
    workingDays: number[],
    enabled: boolean,
    timezone: string,
    description: string,
    createdAt: string (ISO 8601),
    checkinCron: CronJob|null,
    checkoutCron: CronJob|null
  }
  ```

**Description:**
Validates the configuration, creates a new schedule with a unique ID, sets up cron jobs, saves to file, and activates it.

**Example:**
```javascript
import { addSchedule } from './attendance-scheduler.js';

const schedule = addSchedule({
    checkinTime: '08:30',
    checkoutTime: '17:30',
    workingDays: [1, 2, 3, 4, 5],
    timezone: 'America/New_York',
    description: 'US office schedule'
});

if (schedule) {
    console.log('Schedule created:', schedule.id);
} else {
    console.error('Failed to create schedule');
}
```

---

### `getSchedule(scheduleId)`

Retrieves a schedule by its ID.

**Syntax:**
```javascript
const schedule = getSchedule(scheduleId);
```

**Parameters:**
- `scheduleId` (string) - The schedule ID

**Returns:**
- `Object|null` - Schedule object or null if not found

**Example:**
```javascript
import { getSchedule } from './attendance-scheduler.js';

const schedule = getSchedule('schedule_1701700800000');
if (schedule) {
    console.log('Schedule found:', schedule.description);
} else {
    console.log('Schedule not found');
}
```

---

### `listSchedules()`

Retrieves all active schedules.

**Syntax:**
```javascript
const schedules = listSchedules();
```

**Returns:**
- `Array<Object>` - Array of schedule objects

**Example:**
```javascript
import { listSchedules } from './attendance-scheduler.js';

const schedules = listSchedules();
schedules.forEach(schedule => {
    console.log(`${schedule.id}: ${schedule.description}`);
});
```

---

### `updateSchedule(scheduleId, updates)`

Updates an existing schedule and restarts its cron jobs.

**Syntax:**
```javascript
const updated = updateSchedule(scheduleId, updates);
```

**Parameters:**
- `scheduleId` (string) - The schedule ID
- `updates` (Object) - Fields to update:
  ```javascript
  {
    checkinTime?: string,
    checkoutTime?: string,
    workingDays?: number[],
    enabled?: boolean,
    timezone?: string,
    description?: string
  }
  ```

**Returns:**
- `Object|null` - Updated schedule object or null if update fails

**Description:**
Stops existing cron jobs, applies updates, validates configuration, and restarts cron jobs with new settings.

**Example:**
```javascript
import { updateSchedule } from './attendance-scheduler.js';

const updated = updateSchedule('schedule_1701700800000', {
    checkinTime: '09:30',
    checkoutTime: '18:30'
});

if (updated) {
    console.log('Schedule updated successfully');
}
```

---

### `deleteSchedule(scheduleId)`

Deletes a schedule and stops its cron jobs.

**Syntax:**
```javascript
const success = deleteSchedule(scheduleId);
```

**Parameters:**
- `scheduleId` (string) - The schedule ID

**Returns:**
- `boolean` - True if deleted, false if not found

**Description:**
Stops cron jobs, removes from active schedules map, and deletes from persistent storage.

**Example:**
```javascript
import { deleteSchedule } from './attendance-scheduler.js';

if (deleteSchedule('schedule_1701700800000')) {
    console.log('Schedule deleted');
} else {
    console.log('Schedule not found');
}
```

---

## Utilities

### `log(message, level)`

Logs messages to console and file.

**Syntax:**
```javascript
log(message, level);
```

**Parameters:**
- `message` (string) - Message to log
- `level` (string) - Log level: 'INFO', 'SUCCESS', 'WARN', 'ERROR' (default: 'INFO')

**Description:**
Writes timestamped logs to both console and `attendance.log` file.

**Example:**
```javascript
import { log } from './attendance-scheduler.js';

log('Operation started', 'INFO');
log('Operation succeeded', 'SUCCESS');
log('Token expiring soon', 'WARN');
log('Operation failed', 'ERROR');
```

---

### `getSystemStatus()`

Returns comprehensive system status information.

**Syntax:**
```javascript
const status = getSystemStatus();
```

**Returns:**
- `Object` - Status object:
  ```javascript
  {
    token_valid: boolean,
    token_expires_in: number,    // seconds
    active_schedules: number,
    schedules: Array<Object>     // Array of schedule details
  }
  ```

**Example:**
```javascript
import { getSystemStatus } from './attendance-scheduler.js';

const status = getSystemStatus();
console.log(`Active schedules: ${status.active_schedules}`);
console.log(`Token expires in: ${status.token_expires_in} seconds`);
```

---

## Error Handling

### Common Errors

#### Token Refresh Error
```javascript
Error: Token refresh failed: invalid_grant
```
**Cause:** Invalid or expired refresh token
**Solution:** Regenerate refresh token in Zoho console

#### Schedule Validation Error
```javascript
Schedule validation failed: Invalid checkinTime format. Use HH:MM (24-hour)
```
**Cause:** Invalid time format
**Solution:** Use HH:MM format in 24-hour system

#### API Response Error
```javascript
CHECK-OUT failed: <response><error>...</error></response>
```
**Cause:** API request failed
**Solution:** Check API domain, token validity, and internet connection

### Error Handling Pattern

```javascript
import { 
    performAttendanceAction, 
    updateSchedule, 
    deleteSchedule 
} from './attendance-scheduler.js';

// Pattern 1: Check return value
const result = await performAttendanceAction('checkin', 'schedule_123');
if (result.success) {
    console.log('Action succeeded');
} else {
    console.error('Action failed:', result.error);
}

// Pattern 2: Null checks
const schedule = updateSchedule('schedule_123', { checkinTime: '09:00' });
if (schedule) {
    console.log('Updated successfully');
} else {
    console.error('Update failed');
}

// Pattern 3: Boolean returns
if (deleteSchedule('schedule_123')) {
    console.log('Deleted successfully');
} else {
    console.error('Schedule not found');
}

// Pattern 4: Try-catch for async operations
try {
    await refreshAccessToken();
    console.log('Token refreshed');
} catch (error) {
    console.error('Refresh failed:', error.message);
}
```

---

## Configuration Reference

### Time Format
- **Format:** `HH:MM` (24-hour)
- **Valid:** `00:00` to `23:59`
- **Examples:** `09:00`, `14:30`, `23:45`

### Day of Week
- **0:** Sunday
- **1:** Monday
- **2:** Tuesday
- **3:** Wednesday
- **4:** Thursday
- **5:** Friday
- **6:** Saturday

**Examples:**
- `[1, 2, 3, 4, 5]` - Monday to Friday
- `[1, 2, 3, 4, 5, 6]` - Monday to Saturday
- `[0, 1, 2, 3, 4, 5, 6]` - All days

### Timezone
Use IANA timezone format. Common examples:
- `Asia/Kolkata`
- `America/New_York`
- `Europe/London`
- `Asia/Tokyo`
- `Australia/Sydney`

---

## Integration Examples

### Example 1: Create and Start Multiple Schedules

```javascript
import { 
    addSchedule, 
    listSchedules, 
    getSystemStatus 
} from './attendance-scheduler.js';

// Morning shift
addSchedule({
    checkinTime: '06:00',
    checkoutTime: '14:00',
    workingDays: [1, 2, 3, 4, 5],
    description: 'Morning Shift'
});

// Evening shift
addSchedule({
    checkinTime: '14:00',
    checkoutTime: '22:00',
    workingDays: [1, 2, 3, 4, 5],
    description: 'Evening Shift'
});

// View status
const status = getSystemStatus();
console.log(`Created ${status.active_schedules} schedules`);
```

### Example 2: Update Schedule Times

```javascript
import { updateSchedule, getSchedule } from './attendance-scheduler.js';

const scheduleId = 'schedule_1701700800000';

// Get current schedule
const schedule = getSchedule(scheduleId);
console.log(`Current times: ${schedule.checkinTime} - ${schedule.checkoutTime}`);

// Update times
updateSchedule(scheduleId, {
    checkinTime: '09:30',
    checkoutTime: '18:30'
});

// Verify update
const updated = getSchedule(scheduleId);
console.log(`New times: ${updated.checkinTime} - ${updated.checkoutTime}`);
```

### Example 3: Manual Override

```javascript
import { 
    performAttendanceAction, 
    manualCheckIn, 
    manualCheckOut 
} from './attendance-scheduler.js';

// Quick check-in
const checkinResult = await manualCheckIn();

// Specific schedule check-out
const checkoutResult = await performAttendanceAction('checkout', 'schedule_123');
```

---

## Advanced Configuration

### Environment Variables

```javascript
// Load from .env file
const config = {
    CLIENT_ID: process.env.ZOHO_CLIENT_ID,
    CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN,
};
```

### Custom Log Handlers

```javascript
// Override log function for custom handling
function customLog(message, level) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level}] ${message}`);
    
    // Send to external logging service
    externalLogger.log({ message, level, timestamp });
}
```

---

## Support

For issues or questions:
1. Check the main README.md
2. Review attendance.log for error details
3. Verify credentials and API domain
4. Ensure Node.js version is 14+

---

**API Reference v1.0** | Last Updated: 2025-12-04
