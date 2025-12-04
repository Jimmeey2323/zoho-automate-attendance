# Optional Check-in Parameters Guide

This guide explains how to add optional data to your check-ins, such as location information, notes, and more.

## ❓ Do You NEED Employee ID or Geo-Location?

**Short Answer: NO** ❌

The Zoho People Plus API uses your **OAuth Token** to identify you automatically. You don't need to manually add:
- ❌ Employee ID
- ❌ User ID
- ❌ Email

These are already extracted from your authenticated access token.

---

## ✅ What Optional Data CAN You Add?

If your organization requires additional information, you can optionally include:

### 1. **Note/Comment**
Add a reason or context for your check-in/out

```javascript
// Example: Working from office, working from home, meeting, etc.
note: "Working from main office"
note: "Remote work - home office"
note: "Conference attendance"
```

### 2. **Geo-Location (GPS Coordinates)**
Capture where the check-in happened

```javascript
// Format: "latitude,longitude"
geolocation: "40.7128,-74.0060"    // New York
geolocation: "19.0760,72.8777"     // Mumbai
geolocation: "51.5074,-0.1278"     // London
```

### 3. **Check-in Location Name**
Descriptive name of where you checked in

```javascript
checkin_location: "Main Office"
checkin_location: "Home"
checkin_location: "Client Office - XYZ"
```

### 4. **Specific Date** (for backdated entries)
Register attendance for a past date

```javascript
datetocheck: "2025-12-03"    // Yesterday
datetocheck: "2025-12-01"    // Earlier date
```

---

## 🚀 How to Use Optional Parameters

### Method 1: Manual Check-in with Options

```bash
# Coming soon: Command-line parameter support
# For now, use the API directly:
```

### Method 2: Using the API Directly

In your JavaScript code:

```javascript
import { manualCheckIn, manualCheckOut } from './attendance-scheduler.js';

// Simple check-in (no options)
const result1 = await manualCheckIn();

// Check-in with note
const result2 = await manualCheckIn({
    note: "Working from office today"
});

// Check-in with location
const result3 = await manualCheckIn({
    checkin_location: "Main Office",
    note: "Office attendance"
});

// Check-in with GPS coordinates
const result4 = await manualCheckIn({
    geolocation: "40.7128,-74.0060",
    checkin_location: "New York Office",
    note: "Head office check-in"
});

// Check-out with note
const checkout = await manualCheckOut({
    note: "Leaving office for the day"
});
```

### Method 3: Scheduled Check-ins with Options

To add options to scheduled check-ins, modify the schedule execution:

```javascript
// In your schedule configuration, you can extend the scheduler
// See examples in examples.js for custom implementations
```

---

## 📝 Practical Examples

### Example 1: Basic (No Options Needed)
```javascript
// This works fine on its own
await manualCheckIn();
await manualCheckOut();
```

### Example 2: With Location Information
```javascript
// For office-based attendance tracking
await manualCheckIn({
    checkin_location: "Office - Building A",
    note: "On-site work"
});

// At end of day
await manualCheckOut({
    checkin_location: "Office - Building A",
    note: "Leaving office"
});
```

### Example 3: With GPS (Mobile/Field Work)
```javascript
// For field/remote verification
const officeLocation = "40.7128,-74.0060";

await manualCheckIn({
    geolocation: officeLocation,
    checkin_location: "New York Office",
    note: "Checked in with GPS verification"
});
```

### Example 4: Backdated Entry
```javascript
// If you forgot to check in yesterday
await manualCheckIn({
    datetocheck: "2025-12-03",
    note: "Attendance for previous day"
});
```

---

## 🔍 Complete API Reference

### Function Signature

```javascript
/**
 * Check-in with optional parameters
 * @param {object} options - Optional parameters
 * @returns {Promise<object>} Result with success status
 */
async function manualCheckIn(options = {})

/**
 * Check-out with optional parameters
 * @param {object} options - Optional parameters
 * @returns {Promise<object>} Result with success status
 */
async function manualCheckOut(options = {})
```

### Options Object

```javascript
{
    note: string,              // Optional: Note/comment
    geolocation: string,       // Optional: "latitude,longitude"
    checkin_location: string,  // Optional: Location name
    datetocheck: string        // Optional: "YYYY-MM-DD"
}
```

### Return Value

```javascript
{
    success: boolean,      // true if successful, false if failed
    response: string,      // API response body
    error?: string        // Error message if failed
}
```

---

## ⚠️ Important Notes

### What You DON'T Need to Add
- ❌ **Employee ID** - Automatically from OAuth token
- ❌ **User ID** - Automatically from OAuth token
- ❌ **Email** - Automatically from OAuth token
- ❌ **Name** - Already in your Zoho account
- ❌ **Department** - Already in your Zoho account

### What IS Optional
- ✅ **Notes** - Free text (recommended)
- ✅ **Location** - For tracking (optional)
- ✅ **GPS** - For field work (optional)
- ✅ **Date** - For backdated entries (optional)

### What's Required
- ✅ **Access Token** - Handled automatically
- ✅ **Operation** - 'checkin' or 'checkout' (handled automatically)

---

## 🛠️ Common Use Cases

### Use Case 1: Remote Work Tracking
```javascript
// Working from home
await manualCheckIn({
    note: "Remote work - home office",
    checkin_location: "Home"
});

// At end of day
await manualCheckOut({
    note: "End of remote work day",
    checkin_location: "Home"
});
```

### Use Case 2: Field/Client Visit
```javascript
// Checking in at client location
await manualCheckIn({
    checkin_location: "Client Office - Acme Corp",
    note: "Client meeting and support visit",
    geolocation: "37.7749,-122.4194"  // San Francisco
});

// Checking out
await manualCheckOut({
    checkin_location: "Client Office - Acme Corp",
    note: "Meeting concluded"
});
```

### Use Case 3: Conference/Training
```javascript
await manualCheckIn({
    checkin_location: "Tech Conference - Hall A",
    note: "Attending training session on AI",
    geolocation: "42.3601,-71.0589"  // Boston
});
```

### Use Case 4: Flexible Attendance
```javascript
// Just the essentials - no extra parameters needed
await manualCheckIn();
await manualCheckOut();
```

---

## 🔐 Privacy & Security

### Location Data
- ✅ **Optional** - Only provide if your organization requires it
- ⚠️ **Privacy** - Consider privacy implications before adding GPS
- 🔒 **Encrypted** - Transmitted securely via HTTPS

### Notes
- ✅ **Professional** - Keep notes work-appropriate
- 🔒 **Visible** - May be visible to HR/managers
- 📝 **Logged** - Stored in attendance records

---

## 🎯 Recommendations

### For Most Users
```javascript
// Simple approach - no extra parameters needed
await manualCheckIn();
await manualCheckOut();
```

### For Office-Based Staff
```javascript
// Add location context
await manualCheckIn({
    checkin_location: "Main Office"
});
```

### For Remote/Hybrid Teams
```javascript
// Identify work location
await manualCheckIn({
    checkin_location: "Home Office",
    note: "Remote work"
});

await manualCheckOut({
    checkin_location: "Home Office",
    note: "End of day"
});
```

### For Field Workers
```javascript
// Include GPS for verification
await manualCheckIn({
    geolocation: "40.7128,-74.0060",
    checkin_location: "Site A",
    note: "On-site supervision"
});
```

---

## ❓ FAQ

**Q: Do I need to add employee ID?**
A: No, it's automatically extracted from your OAuth token.

**Q: Is geo-location required?**
A: No, it's completely optional. Only add if your organization requires it.

**Q: Can I add custom fields?**
A: No, only the 4 fields above are supported by Zoho API.

**Q: What if I don't add any parameters?**
A: It works fine! The basic check-in/out is fully functional.

**Q: Can I modify parameters after checking in?**
A: Not directly. You would need to delete and re-create the entry.

**Q: How long are notes stored?**
A: Indefinitely, they become part of your attendance record.

**Q: Is there a character limit for notes?**
A: Yes, typically 255 characters (check your Zoho instance for exact limit).

---

## 📊 Example Script

Here's a complete example showing different scenarios:

```javascript
import { manualCheckIn, manualCheckOut } from './attendance-scheduler.js';

// Scenario 1: Office attendance
console.log('Checking in at office...');
await manualCheckIn({
    checkin_location: "Main Office",
    note: "Office attendance"
});

// Do work...
await new Promise(resolve => setTimeout(resolve, 3600000)); // 1 hour

// Scenario 2: Check out
console.log('Checking out from office...');
await manualCheckOut({
    checkin_location: "Main Office",
    note: "Day complete"
});

// Scenario 3: Remote work day
console.log('Remote work check-in...');
await manualCheckIn({
    checkin_location: "Home",
    note: "Remote work - focus on documentation"
});

// Later...
await manualCheckOut({
    checkin_location: "Home",
    note: "Remote work complete"
});
```

---

## 🚀 Best Practices

1. **Keep it Simple**: Add parameters only if your org requires them
2. **Be Consistent**: Use the same location names each time
3. **Professional Notes**: Keep notes work-related
4. **Accurate Info**: Ensure location/GPS data is correct
5. **No Personal Data**: Avoid sensitive personal information in notes

---

## 🔗 Related Documentation

- See `API-REFERENCE.md` for complete API documentation
- See `COMMANDS.md` for command-line usage
- See `examples.js` for code examples
- See `README.md` for general usage

---

**Optional Parameters Guide v1.0** | Last Updated: December 4, 2025
