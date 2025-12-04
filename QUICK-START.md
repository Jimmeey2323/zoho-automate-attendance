# Project Files Guide

This document provides an overview of all files in the Zoho Attendance Scheduler project and their purposes.

## 📁 Project Structure

```
zoho-automate-attendance/
├── attendance-scheduler.js      # Main scheduler application
├── examples.js                  # Usage examples and demonstrations
├── zoho.js                      # Original basic implementation
├── package.json                 # Node.js dependencies
├── README.md                    # Main documentation
├── API-REFERENCE.md            # Complete API documentation
├── ENV-SETUP.md                # Environment configuration guide
├── QUICK-START.md              # Quick start guide (this file)
├── setup.sh                    # Automated setup script
├── schedule-example.json       # Example schedule configuration
├── .gitignore                  # Git ignore patterns
└── Generated Runtime Files:
    ├── attendance.log          # Activity log (auto-created)
    ├── schedule.json           # Active schedules (auto-created)
    └── node_modules/           # Dependencies (auto-created)
```

## 📄 File Descriptions

### Core Application Files

#### `attendance-scheduler.js` (Main Application)
**Purpose:** Advanced scheduler with full CRUD operations, cron job management, and token handling

**Size:** ~750 lines | **Language:** JavaScript (Node.js with ES modules)

**Key Features:**
- Schedule creation, reading, updating, deletion
- Automatic token refresh
- Persistent schedule storage
- Comprehensive logging
- Timezone support
- Cron-based scheduling

**Main Exports:**
```javascript
export {
    addSchedule,
    deleteSchedule,
    updateSchedule,
    getSchedule,
    listSchedules,
    performAttendanceAction,
    manualCheckIn,
    manualCheckOut,
    getSystemStatus,
};
```

**Usage:** 
```bash
node attendance-scheduler.js [command] [options]
```

---

#### `zoho.js` (Original Implementation)
**Purpose:** Basic check-in/check-out script with token refresh

**Size:** ~160 lines | **Language:** JavaScript

**Features:**
- Simple token refresh logic
- Manual check-in/check-out
- Basic error handling

**Note:** This is the original implementation. The `attendance-scheduler.js` is the recommended advanced version.

---

#### `examples.js` (Demonstration Script)
**Purpose:** Shows 13 different usage examples and patterns

**Size:** ~700 lines | **Language:** JavaScript

**Examples Included:**
1. Simple daily schedule
2. Multiple shift schedules
3. Global team scheduling
4. Flexible working hours
5. Weekend support
6. View and manage schedules
7. Update schedule
8. Delete schedule
9. Manual attendance
10. System status
11. Batch operations
12. Schedule analysis
13. Concurrent actions

**Usage:**
```bash
node examples.js 1      # Run Example 1
node examples.js 5      # Run Example 5
node examples.js        # Show menu
```

---

### Configuration Files

#### `package.json`
**Purpose:** Node.js project metadata and dependency management

**Key Content:**
- Project name: `zoho-automate-attendance`
- Version: `1.0.0`
- Main entry point: `attendance-scheduler.js`
- Dependencies: `node-cron`, `node-fetch`
- npm scripts for common operations

**npm Scripts Available:**
```bash
npm start              # Start the scheduler
npm run add            # Add a new schedule
npm run list           # List all schedules
npm run status         # Check status
npm run checkin        # Manual check-in
npm run checkout       # Manual check-out
npm run help           # Show help
```

---

#### `schedule-example.json`
**Purpose:** Example schedule configuration with inline documentation

**Contains:**
- Empty schedules array (for actual data)
- Two example schedule objects
- Detailed comments explaining structure

**Format:**
```json
{
  "schedules": [],
  "exampleSchedule": {
    "id": "schedule_...",
    "checkinTime": "HH:MM",
    "checkoutTime": "HH:MM",
    "workingDays": [1, 2, 3, 4, 5],
    "enabled": true,
    "timezone": "Asia/Kolkata",
    "description": "...",
    "createdAt": "ISO 8601 timestamp"
  }
}
```

**Usage:** Copy and modify as your `schedule.json` template

---

### Documentation Files

#### `README.md` (Main Documentation)
**Purpose:** Complete project documentation and user guide

**Sections:**
- Features overview
- Installation instructions
- Quick start guide
- Command reference
- Configuration details
- Logging information
- Troubleshooting
- Examples
- Security best practices

**Best For:** First-time users and general reference

---

#### `API-REFERENCE.md` (Developer API Documentation)
**Purpose:** Comprehensive API documentation for developers

**Sections:**
- Token Management (functions and examples)
- Attendance Operations
- Schedule Management
- Utility Functions
- Error Handling
- Configuration Reference
- Integration Examples
- Advanced Configuration

**Best For:** Developers building on top of the scheduler, API integration

---

#### `ENV-SETUP.md` (Environment Configuration)
**Purpose:** Detailed guide for credential and environment setup

**Sections:**
- Option 1: Direct configuration
- Option 2: .env file setup
- Option 3: System environment variables
- Option 4: Docker with secrets
- Option 5: AWS Secrets Manager
- Security best practices
- Troubleshooting
- Environment variables reference

**Best For:** DevOps engineers, production deployment, security-conscious setups

---

#### `QUICK-START.md` (This File)
**Purpose:** Overview of all project files and their purposes

**Best For:** Understanding project structure and finding relevant documentation

---

### Setup & Automation Files

#### `setup.sh` (Automated Setup Script)
**Purpose:** Interactive setup script to get started quickly

**Features:**
- Checks Node.js version
- Installs dependencies
- Creates necessary files
- Interactive schedule creation
- Option to start scheduler

**Execution:**
```bash
chmod +x setup.sh
./setup.sh
```

**Output:**
- ✅ Installs npm packages
- ✅ Creates empty `schedule.json`
- ✅ Creates empty `attendance.log`
- ✅ Optional: Creates first schedule
- ✅ Optional: Starts the scheduler

---

#### `.gitignore`
**Purpose:** Specifies files to exclude from version control

**Typical Content:**
```
node_modules/
.env
*.log
schedule.json
.DS_Store
```

**Reason:** Prevents committing:
- Sensitive credentials
- Log files
- Schedules (personal data)
- Node modules
- System files

---

### Auto-Generated Runtime Files

#### `attendance.log`
**Purpose:** Persistent activity log with timestamps

**Created:** Automatically on first run

**Format:** Plain text with timestamp, level, and message
```
[2025-12-04T14:35:12.789Z] [SUCCESS] Check-in successful
[2025-12-04T14:35:13.123Z] [INFO] Schedule updated
```

**Levels:** INFO, SUCCESS, WARN, ERROR

**Retention:** Grows indefinitely; manually clean as needed

**Viewing:**
```bash
tail -f attendance.log           # Real-time view
grep SUCCESS attendance.log      # Filter by success
wc -l attendance.log            # Count entries
```

---

#### `schedule.json`
**Purpose:** Persistent storage of active schedules

**Created:** Automatically on first schedule creation

**Format:** JSON array of schedule objects

**Example:**
```json
[
  {
    "id": "schedule_1701700800000",
    "checkinTime": "09:00",
    "checkoutTime": "18:00",
    "workingDays": [1, 2, 3, 4, 5],
    "enabled": true,
    "timezone": "Asia/Kolkata",
    "description": "Main office",
    "createdAt": "2025-12-04T10:00:00.000Z"
  }
]
```

**Restoration:** Automatically loaded when scheduler starts

**Backup:** Recommended to backup this file before major changes

---

#### `node_modules/`
**Purpose:** Contains all npm package dependencies

**Created:** After running `npm install`

**Size:** ~100-200 MB (typical)

**Packages Installed:**
- `node-cron@^3.0.3` - Cron job scheduling
- `node-fetch@^2.7.0` - HTTP requests

**Maintenance:**
```bash
npm install              # Install dependencies
npm install --save-dev   # Add dev dependency
npm update              # Update packages
npm audit               # Check for vulnerabilities
npm prune               # Remove unused packages
```

---

## 🚀 Getting Started Flowchart

```
Start
  │
  ├─→ Read README.md (Overview)
  │
  ├─→ Run setup.sh (Automated setup)
  │   │
  │   ├─→ Installs dependencies
  │   ├─→ Creates first schedule
  │   └─→ Starts scheduler
  │
  └─→ OR Manual Setup:
      │
      ├─→ npm install
      ├─→ node attendance-scheduler.js add --checkin 09:00
      └─→ npm start
```

## 📚 Documentation Navigation

### For Different User Types:

**New Users:**
1. Start with `README.md`
2. Run `./setup.sh`
3. Check `examples.js`
4. View `attendance.log`

**Developers:**
1. Read `API-REFERENCE.md`
2. Study `examples.js`
3. Review `attendance-scheduler.js` source
4. Check `ENV-SETUP.md` for configuration

**DevOps/Deployment:**
1. Read `ENV-SETUP.md`
2. Review security sections in `README.md`
3. Configure environment variables
4. Set up container/service orchestration

**Advanced Users:**
1. Review `API-REFERENCE.md` for deep API knowledge
2. Modify `attendance-scheduler.js` for custom features
3. Create custom scripts using exported functions
4. Integrate with external systems

---

## 🔄 File Modification Guide

### Safe to Modify:
- ✅ `attendance-scheduler.js` - Add custom functions
- ✅ `examples.js` - Add more examples
- ✅ `package.json` - Add dependencies (carefully)
- ✅ `.gitignore` - Add patterns

### Auto-Generated (Don't Modify):
- ❌ `attendance.log` - Log file
- ❌ `schedule.json` - Let scheduler manage
- ❌ `node_modules/` - Regenerated by npm

### Important (Backup Before Modifying):
- ⚠️  `schedule.json` - Your active schedules
- ⚠️  `attendance.log` - Historical records

---

## 📊 File Statistics

| File | Lines | Size | Type | Auto-Gen |
|------|-------|------|------|----------|
| `attendance-scheduler.js` | 750+ | 25 KB | Code | No |
| `examples.js` | 700+ | 24 KB | Code | No |
| `zoho.js` | 160 | 5 KB | Code | No |
| `README.md` | 800+ | 35 KB | Docs | No |
| `API-REFERENCE.md` | 600+ | 30 KB | Docs | No |
| `ENV-SETUP.md` | 400+ | 18 KB | Docs | No |
| `package.json` | 30 | 1 KB | Config | No |
| `schedule.json` | Variable | <5 KB | Data | Yes |
| `attendance.log` | Variable | Variable | Data | Yes |

---

## 🔐 Security Checklist

- [ ] Add `.gitignore` (prevent credential commits)
- [ ] Use environment variables for sensitive data
- [ ] Rotate refresh tokens periodically
- [ ] Restrict file permissions (chmod 600 for .env)
- [ ] Never share `schedule.json` with credentials
- [ ] Review logs regularly for errors
- [ ] Keep dependencies updated (npm audit)

---

## 💡 Tips & Tricks

### Speed Up Development
```bash
# Create convenient aliases
alias scheduler='node attendance-scheduler.js'
alias add='node attendance-scheduler.js add'
alias status='node attendance-scheduler.js status'
```

### Monitor in Real-Time
```bash
# Watch logs as they happen
tail -f attendance.log

# In another terminal, run operations
npm run checkin
npm run checkout
```

### Backup Schedules
```bash
# Before major changes
cp schedule.json schedule.json.bak
cp attendance.log attendance.log.bak
```

### Clean Logs
```bash
# Archive old logs
mv attendance.log attendance.log.old
touch attendance.log

# Or keep last N lines
tail -n 10000 attendance.log > attendance.log.tmp
mv attendance.log.tmp attendance.log
```

---

## 📞 Support & Help

1. **Basic Help:** `node attendance-scheduler.js help`
2. **Status Check:** `npm run status`
3. **Review Logs:** `tail -f attendance.log`
4. **Check Documentation:** See relevant `.md` file
5. **Run Examples:** `node examples.js`

---

**Project Files Guide v1.0** | Last Updated: 2025-12-04
