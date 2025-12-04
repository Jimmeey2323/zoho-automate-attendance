# Geo-Location Configuration Guide

Your attendance scheduler now includes **automatic geo-location tracking** from your verified office location.

## 📍 What's Configured

Based on your checkout response, the following locations are pre-configured:

### Check-in Location
- **Name**: Godrej Chowk, August Kranti Marg, Gamdevi, Mumbai
- **Coordinates**: `18.96422158371318, 72.80783288277118` (Lat, Long)
- **Accuracy**: 26.6875 meters

### Check-out Location
- **Name**: China Garden, Laxmibai Jagmohandas Marg, Cumballa Hill, Mumbai
- **Coordinates**: `18.96403985526421, 72.80727898535446` (Lat, Long)
- **Accuracy**: 40 meters

---

## ✅ What You Need to Know

### Do You Need Employee ID?
**❌ No** - The system uses your OAuth token, which is tied to your employee account automatically.

### Do You Need Geo-Location?
**✓ Already Included** - Your check-ins and check-outs will include:
- Exact GPS coordinates
- Location address
- Geo-location note

### Is Geo-Location Mandatory?
**✓ Optional** - You can disable it per schedule with `--no-geo` flag

---

## 🚀 How to Use

### Option 1: Create Schedule WITH Geo-Location (Default)
```bash
node attendance-scheduler.js add \
  --checkin 09:00 \
  --checkout 18:00 \
  --days 1,2,3,4,5 \
  --tz Asia/Kolkata \
  --desc "Office with Location Tracking"
```

**Result**: Check-ins and check-outs will include:
- GPS coordinates from your verified location
- Location address (Godrej Chowk / China Garden)
- Location note automatically added

---

### Option 2: Create Schedule WITHOUT Geo-Location
```bash
node attendance-scheduler.js add \
  --checkin 09:00 \
  --checkout 18:00 \
  --no-geo \
  --desc "Office without Location Tracking"
```

**Result**: Check-ins and check-outs will NOT include location data

---

### Option 3: Manual Check-in WITH Geo-Location (Default)
```bash
npm run checkin
```

**Automatically includes**:
- Check-in location: Godrej Chowk, Mumbai
- GPS: 18.96422158371318, 72.80783288277118

---

### Option 4: Manual Check-out WITH Geo-Location (Default)
```bash
npm run checkout
```

**Automatically includes**:
- Check-out location: China Garden, Mumbai
- GPS: 18.96403985526421, 72.80727898535446

---

## 📊 Response Data Included

When you check in/out, the API receives:

```
Operation: "checkin" or "checkout"
Geolocation: "18.96422158371318,72.80783288277118"
Checkin_Location: "Godrej Chowk, August Kranti Marg, Gamdevi, Mumbai"
Note: "Check-in from Godrej Chowk, August Kranti Marg, Gamdevi, Mumbai"
```

---

## 🔧 Customizing Locations

If you want to use different locations, edit `attendance-scheduler.js` and update:

```javascript
const CONFIG = {
    // ... other config ...
    
    // Change these to your office coordinates
    CHECKIN_GEOLOCATION: '18.96422158371318,72.80783288277118',
    CHECKOUT_GEOLOCATION: '18.96403985526421,72.80727898535446',
    CHECKIN_LOCATION_NAME: 'Your Office Name Here',
    CHECKOUT_LOCATION_NAME: 'Your Exit Location Here',
};
```

---

## ✨ What Makes This Secure

✅ **Your Verified Location**: Uses coordinates from your actual checkout response  
✅ **No Additional Parameters Needed**: Employee ID is implicit in your OAuth token  
✅ **Standard Zoho API**: Uses official Zoho People Plus attendance endpoint  
✅ **Automatic**: Geo-location is added automatically on each check-in/out  
✅ **Optional**: Can be disabled per schedule with `--no-geo`  

---

## 📋 Verification Checklist

- ✅ Geo-location data captured from your response
- ✅ Check-in location: Godrej Chowk (from your data)
- ✅ Check-out location: China Garden (from your data)
- ✅ Coordinates extracted correctly
- ✅ Enabled by default for all schedules
- ✅ Can be disabled with `--no-geo` flag
- ✅ Works with manual check-in/check-out

---

## 📞 Example Schedule Creation

```bash
# Create schedule with geo-location (default)
node attendance-scheduler.js add \
  --checkin 09:00 \
  --checkout 18:00 \
  --days 1,2,3,4,5 \
  --tz Asia/Kolkata \
  --desc "Main Office Hours"

# Output will show:
# ✅ Schedule created successfully!
# {
#   "id": "schedule_...",
#   "checkinTime": "09:00",
#   "checkoutTime": "18:00",
#   "includeGeoLocation": true,
#   "checkinGeolocation": "18.96422158371318,72.80783288277118",
#   "checkoutGeolocation": "18.96403985526421,72.80727898535446",
#   ...
# }
#
# 📍 Geo-location enabled:
#    Check-in: Godrej Chowk, August Kranti Marg, Gamdevi, Mumbai
#    Check-out: China Garden, Laxmibai Jagmohandas Marg, Cumballa Hill, Mumbai
```

---

## 🎯 Summary

**Your scheduler is now configured with**:
- ✅ Automatic geo-location from verified office location
- ✅ No employee ID needed (uses OAuth token)
- ✅ Check-in coordinates: Godrej Chowk
- ✅ Check-out coordinates: China Garden
- ✅ Optional geo-location (can be disabled)
- ✅ Works with scheduled and manual check-ins/outs

**Ready to use**:
```bash
# Start scheduler with geo-location
npm start

# Or manually check in with location
npm run checkin
```

---

**Geo-Location Configuration v1.0** | December 4, 2025
