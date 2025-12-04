# Quick Reference: Employee ID & Geo-Location FAQ

## ❓ Do I Need These for Check-Ins?

### Employee ID
❌ **NO** - Automatically from OAuth token

### User ID  
❌ **NO** - Automatically from OAuth token

### Email
❌ **NO** - Already in your account

### Geo-Location
❌ **NO (Optional)** - Only if your organization requires it

### Location Name
❌ **NO (Optional)** - Only for tracking purposes

---

## ✅ What IS Required?

Just these (handled automatically):
- ✅ **OAuth Token** - Your access token (auto-refreshed)
- ✅ **Operation** - 'checkin' or 'checkout' (automatic)

---

## 🆕 What CAN You Add?

If your organization needs additional data:

```javascript
// All optional - choose what you need:
{
    note: "Working from office",        // Free text note
    checkin_location: "Main Office",    // Location name
    geolocation: "40.7128,-74.0060",   // GPS (lat,long)
    datetocheck: "2025-12-04"          // Specific date
}
```

---

## 💡 Common Scenarios

### Scenario 1: Most Users
```bash
npm run checkin
npm run checkout
```
✅ **Works perfectly** - No extra parameters needed

### Scenario 2: Office/Remote Tracking
```javascript
await manualCheckIn({
    checkin_location: "Main Office"
});
```
✅ **Optional** - For better attendance tracking

### Scenario 3: Field/GPS Verification
```javascript
await manualCheckIn({
    geolocation: "40.7128,-74.0060",
    checkin_location: "New York Office"
});
```
✅ **Optional** - Only if org requires GPS

---

## 🚀 Bottom Line

**You don't need anything extra.** The scheduler works out of the box with just:

```bash
npm install
npm run add -- --checkin 09:00 --checkout 18:00
npm start
```

**That's it!** ✅

---

## 📚 Read More

See **OPTIONAL-PARAMETERS.md** for complete details and examples.

---

**December 4, 2025**
