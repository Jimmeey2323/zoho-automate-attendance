import fetch from 'node-fetch';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';

// Load environment variables without debug output
dotenv.config({ quiet: true });

// ======================================================================
// ADVANCED ZOHO PEOPLE PLUS ATTENDANCE SCHEDULER
// ======================================================================

const CONFIG = {
    // API Credentials (from Railway environment variables)
    CLIENT_ID: process.env.ZOHO_CLIENT_ID,
    CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN,
    
    // API Domains
    ZOHO_ACCOUNT_DOMAIN: 'https://accounts.zoho.in',
    ZOHO_PEOPLE_API_DOMAIN: 'https://people.zoho.in',
    
    // Employee Identification (from Railway environment variables)
    EMPLOYEE_ID: process.env.EMPLOYEE_ID,  // For check-in/check-out API (record number)
    EMPLOYEE_API_ID: process.env.EMPLOYEE_API_ID || process.env.EMPLOYEE_ID,  // For filtering fetch results
    EMPLOYEE_EMAIL: process.env.EMPLOYEE_EMAIL,
    MAPPER_ID: process.env.MAPPER_ID || '',
    
    // Scheduling Configuration (24-hour format)
    CHECKIN_TIME: '10:30',      // Check-in at 10:30 AM
    CHECKOUT_TIME: '19:00',     // Check-out at 7:00 PM
    WORKING_DAYS: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday)
    
    // Geo-Location Configuration (Your verified location from check-out)
    // These coordinates match your actual office location from the response
    CHECKIN_GEOLOCATION: '18.96422158371318,72.80783288277118',   // Godrej Chowk, Mumbai
    CHECKOUT_GEOLOCATION: '18.96403985526421,72.80727898535446',  // China Garden, Mumbai
    CHECKIN_LOCATION_NAME: 'Godrej Chowk, August Kranti Marg, Gamdevi, Mumbai',
    CHECKOUT_LOCATION_NAME: 'China Garden, Laxmibai Jagmohandas Marg, Cumballa Hill, Mumbai',
    
    // Log file configuration
    LOG_FILE: './attendance.log',
    SCHEDULE_FILE: './schedule.json',
};

let currentAccessToken = '1000.305324c867175f42336be1c3aa7700f7.7b11357bb6e0a75b61aefdbff56464e4';
let tokenExpirationTime = Date.now() + (3600 * 1000);
const activeSchedules = new Map();

// ======================================================================
// UTILITY FUNCTIONS
// ======================================================================

/**
 * Logs messages to console and file (production optimized)
 */
function log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    // Only log errors and important messages in production
    if (level === 'ERROR' || level === 'SUCCESS') {
        console.log(logMessage);
    }
    
    try {
        fs.appendFileSync(CONFIG.LOG_FILE, logMessage + '\n');
    } catch (error) {
        // Silent fail for log file issues
    }
}

/**
 * Saves schedule configuration to file
 */
function saveScheduleConfig(schedules) {
    try {
        fs.writeFileSync(CONFIG.SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
        log('Schedule configuration saved', 'SUCCESS');
    } catch (error) {
        log(`Failed to save schedule: ${error.message}`, 'ERROR');
    }
}

/**
 * Loads schedule configuration from file
 */
function loadScheduleConfig() {
    try {
        if (fs.existsSync(CONFIG.SCHEDULE_FILE)) {
            const data = fs.readFileSync(CONFIG.SCHEDULE_FILE, 'utf-8');
            return JSON.parse(data);
        }
    } catch (error) {
        log(`Failed to load schedule: ${error.message}`, 'WARN');
    }
    return [];
}

/**
 * Gets or refreshes access token
 */
async function getValidAccessToken() {
    if (Date.now() + 300000 >= tokenExpirationTime) {
        log('Access token expiring soon. Refreshing...', 'WARN');
        await refreshAccessToken();
    }
    return currentAccessToken;
}

/**
 * Refreshes the access token using refresh token
 */
async function refreshAccessToken() {
    const url = `${CONFIG.ZOHO_ACCOUNT_DOMAIN}/oauth/v2/token`;
    const body = new URLSearchParams();
    body.append('grant_type', 'refresh_token');
    body.append('client_id', CONFIG.CLIENT_ID);
    body.append('client_secret', CONFIG.CLIENT_SECRET);
    body.append('refresh_token', CONFIG.REFRESH_TOKEN);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        const data = await response.json();

        if (data.access_token) {
            currentAccessToken = data.access_token;
            tokenExpirationTime = Date.now() + (data.expires_in * 1000);
            log('Token refreshed successfully', 'SUCCESS');
        } else {
            throw new Error(`Token refresh failed: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        log(`Token refresh error: ${error.message}`, 'ERROR');
        throw error;
    }
}

/**
 * Fetches the last attendance entry to check status
 */
async function fetchLastAttendanceEntry() {
    try {
        const token = await getValidAccessToken();
        const url = `${CONFIG.ZOHO_PEOPLE_API_DOMAIN}/api/attendance/fetchLatestAttEntries?duration=5&dateTimeFormat=dd-MM-yyyy HH:mm:ss`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`,
            },
        });

        const text = await response.text();
        
        if (response.ok) {
            try {
                const data = JSON.parse(text);
                return { success: true, data };
            } catch (e) {
                return { success: true, data: text };
            }
        } else {
            log('Failed to fetch last attendance entry', 'ERROR');
            return { success: false, response: text };
        }
    } catch (error) {
        log(`Error fetching last entry: ${error.message}`, 'ERROR');
        return { success: false, error: error.message };
    }
}

/**
 * Helper function to parse timestamp and find the most recent action
 */
function getMostRecentAction(lastEntryData) {
    try {
        let results = lastEntryData;
        if (lastEntryData.response && lastEntryData.response.result) {
            results = lastEntryData.response.result;
        }
        
        if (Array.isArray(results) && results.length > 0) {
            // Find the entry matching our employee ID
            const userEntry = results.find(entry => {
                const idMatch = entry.employeeId === CONFIG.EMPLOYEE_API_ID;
                const emailMatch = entry.emailId === CONFIG.EMPLOYEE_EMAIL;
                // Debug: log comparison
                if (process.argv.includes('debug')) {
                    console.log(`\nDebug: Checking employee entry:`);
                    console.log(`  API employeeId: "${entry.employeeId}" vs Config: "${CONFIG.EMPLOYEE_API_ID}" = ${idMatch}`);
                    console.log(`  API emailId: "${entry.emailId}" vs Config: "${CONFIG.EMPLOYEE_EMAIL}" = ${emailMatch}`);
                }
                return idMatch || emailMatch;
            });
            
            if (!userEntry) {
                // No entry found for this employee
                return null;
            }
            
            if (userEntry.entries && Array.isArray(userEntry.entries) && userEntry.entries.length > 0) {
                const dateEntry = userEntry.entries[0];
                const dateKey = Object.keys(dateEntry)[0];
                const attEntries = dateEntry[dateKey]?.attEntries;
                
                if (Array.isArray(attEntries) && attEntries.length > 0) {
                    // Parse all timestamps and find the most recent action
                    let mostRecentAction = null;
                    let mostRecentTime = null;
                    
                    attEntries.forEach(entry => {
                        const checkInTime = entry.checkInTime || entry.CheckInTime;
                        const checkOutTime = entry.checkOutTime || entry.CheckOutTime;
                        
                        if (checkInTime) {
                            const checkInDate = parseDate(checkInTime);
                            if (!mostRecentTime || checkInDate > mostRecentTime) {
                                mostRecentTime = checkInDate;
                                mostRecentAction = 'checkin';
                            }
                        }
                        
                        if (checkOutTime) {
                            const checkOutDate = parseDate(checkOutTime);
                            if (!mostRecentTime || checkOutDate > mostRecentTime) {
                                mostRecentTime = checkOutDate;
                                mostRecentAction = 'checkout';
                            }
                        }
                    });
                    
                    return mostRecentAction;
                }
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

/**
 * Helper to parse date from format "dd-MM-yyyy HH:mm:ss"
 */
function parseDate(dateStr) {
    try {
        // Format: "04-12-2025 19:53:00"
        const [datePart, timePart] = dateStr.split(' ');
        const [day, month, year] = datePart.split('-');
        const [hour, minute, second] = timePart.split(':');
        return new Date(year, month - 1, day, hour, minute, second);
    } catch (error) {
        return null;
    }
}

/**
 * Checks if last entry was check-out
 */
function isLastEntryCheckOut(lastEntryData) {
    return getMostRecentAction(lastEntryData) === 'checkout';
}

/**
 * Checks if last entry was check-in
 */
function isLastEntryCheckIn(lastEntryData) {
    return getMostRecentAction(lastEntryData) === 'checkin';
}

/**
 * Performs attendance action (check-in or check-out) without validation
 * @param {string} operation - 'checkin' or 'checkout'
 * @param {string} scheduleId - Schedule identifier
 * @param {object} options - Optional parameters
 *   - note: Add a note to the check-in/out
 *   - geolocation: GPS coordinates (lat,long)
 *   - checkin_location: Location name
 *   - datetocheck: Specific date (YYYY-MM-DD)
 */
async function performAttendanceAction(operation, scheduleId, options = {}) {
    try {
        log(`Performing ${operation} without validation check`, 'INFO');
        // Directly execute the attendance action without checking last entry
        return await performAttendanceActionDirect(operation, scheduleId, options);
    } catch (error) {
        log(`${operation.toUpperCase()} error: ${error.message}`, 'ERROR');
        return { success: false, error: error.message };
    }
}

/**
 * Direct attendance action without validation (internal use)
 */
async function performAttendanceActionDirect(operation, scheduleId, options = {}) {
    try {
        const token = await getValidAccessToken();
        
        // Get current date/time for check-in/out
        const now = new Date();
        const dateFormat = 'dd/MM/yyyy HH:mm:ss';
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

        // Build URL with query parameters
        const params = new URLSearchParams();
        params.append('dateFormat', 'dd/MM/yyyy HH:mm:ss');
        
        if (operation === 'checkin') {
            params.append('checkIn', timestamp);
        } else if (operation === 'checkout') {
            params.append('checkOut', timestamp);
        }

        // Add at least one employee identifier
        if (CONFIG.EMPLOYEE_ID) params.append('empId', CONFIG.EMPLOYEE_ID);
        if (CONFIG.EMPLOYEE_EMAIL) params.append('emailId', CONFIG.EMPLOYEE_EMAIL);
        if (CONFIG.MAPPER_ID) params.append('mapId', CONFIG.MAPPER_ID);

        const url = `${CONFIG.ZOHO_PEOPLE_API_DOMAIN}/people/api/attendance?${params.toString()}`;

        log(`Executing ${operation.toUpperCase()} for schedule ${scheduleId}`, 'INFO');

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`,
            },
        });

        const text = await response.text();

        if (response.ok) {
            log(`${operation.toUpperCase()} successful for schedule ${scheduleId}`, 'SUCCESS');
            return { success: true, response: text };
        } else {
            log(`${operation.toUpperCase()} failed: ${text}`, 'ERROR');
            return { success: false, response: text };
        }
    } catch (error) {
        log(`${operation.toUpperCase()} error: ${error.message}`, 'ERROR');
        return { success: false, error: error.message };
    }
}

// ======================================================================
// SCHEDULE MANAGEMENT FUNCTIONS
// ======================================================================

/**
 * Creates a new attendance schedule
 */
function createSchedule(config) {
    const scheduleId = `schedule_${Date.now()}`;
    
    const schedule = {
        id: scheduleId,
        checkinTime: config.checkinTime || CONFIG.CHECKIN_TIME,
        checkoutTime: config.checkoutTime || CONFIG.CHECKOUT_TIME,
        workingDays: config.workingDays || CONFIG.WORKING_DAYS,
        enabled: config.enabled !== false,
        timezone: config.timezone || 'Asia/Kolkata',
        description: config.description || 'Default attendance schedule',
        // Geo-location settings
        includeGeoLocation: config.includeGeoLocation !== false,  // Default: true
        checkinGeolocation: config.checkinGeolocation || CONFIG.CHECKIN_GEOLOCATION,
        checkoutGeolocation: config.checkoutGeolocation || CONFIG.CHECKOUT_GEOLOCATION,
        checkinLocationName: config.checkinLocationName || CONFIG.CHECKIN_LOCATION_NAME,
        checkoutLocationName: config.checkoutLocationName || CONFIG.CHECKOUT_LOCATION_NAME,
        createdAt: new Date().toISOString(),
        checkinCron: null,
        checkoutCron: null,
    };

    return schedule;
}

/**
 * Validates schedule configuration
 */
function validateSchedule(schedule) {
    const errors = [];

    if (!schedule.checkinTime || !/^\d{2}:\d{2}$/.test(schedule.checkinTime)) {
        errors.push('Invalid checkinTime format. Use HH:MM (24-hour)');
    }

    if (!schedule.checkoutTime || !/^\d{2}:\d{2}$/.test(schedule.checkoutTime)) {
        errors.push('Invalid checkoutTime format. Use HH:MM (24-hour)');
    }

    if (!Array.isArray(schedule.workingDays)) {
        errors.push('workingDays must be an array');
    }

    return errors;
}

/**
 * Adds a new attendance schedule
 */
function addSchedule(config) {
    const schedule = createSchedule(config);
    const errors = validateSchedule(schedule);

    if (errors.length > 0) {
        log(`Schedule validation failed: ${errors.join(', ')}`, 'ERROR');
        return null;
    }

    scheduleAttendance(schedule);
    activeSchedules.set(schedule.id, schedule);
    
    // Save to file
    const allSchedules = loadScheduleConfig();
    allSchedules.push({
        id: schedule.id,
        checkinTime: schedule.checkinTime,
        checkoutTime: schedule.checkoutTime,
        workingDays: schedule.workingDays,
        enabled: schedule.enabled,
        timezone: schedule.timezone,
        description: schedule.description,
        createdAt: schedule.createdAt,
    });
    saveScheduleConfig(allSchedules);

    log(`Schedule added: ${schedule.id} | Check-in: ${schedule.checkinTime} | Check-out: ${schedule.checkoutTime}`, 'SUCCESS');
    return schedule;
}

/**
 * Gets a schedule by ID
 */
function getSchedule(scheduleId) {
    return activeSchedules.get(scheduleId) || null;
}

/**
 * Lists all active schedules
 */
function listSchedules() {
    return Array.from(activeSchedules.values());
}

/**
 * Updates a schedule
 */
function updateSchedule(scheduleId, updates) {
    const schedule = activeSchedules.get(scheduleId);

    if (!schedule) {
        log(`Schedule not found: ${scheduleId}`, 'ERROR');
        return null;
    }

    // Stop existing cron jobs
    if (schedule.checkinCron) schedule.checkinCron.stop();
    if (schedule.checkoutCron) schedule.checkoutCron.stop();

    // Apply updates
    Object.assign(schedule, updates);

    // Validate
    const errors = validateSchedule(schedule);
    if (errors.length > 0) {
        log(`Schedule validation failed: ${errors.join(', ')}`, 'ERROR');
        return null;
    }

    // Reschedule
    scheduleAttendance(schedule);

    log(`Schedule updated: ${scheduleId}`, 'SUCCESS');
    return schedule;
}

/**
 * Deletes a schedule
 */
function deleteSchedule(scheduleId) {
    const schedule = activeSchedules.get(scheduleId);

    if (!schedule) {
        log(`Schedule not found: ${scheduleId}`, 'ERROR');
        return false;
    }

    // Stop cron jobs
    if (schedule.checkinCron) schedule.checkinCron.stop();
    if (schedule.checkoutCron) schedule.checkoutCron.stop();

    activeSchedules.delete(scheduleId);

    // Remove from file
    let allSchedules = loadScheduleConfig();
    allSchedules = allSchedules.filter(s => s.id !== scheduleId);
    saveScheduleConfig(allSchedules);

    log(`Schedule deleted: ${scheduleId}`, 'SUCCESS');
    return true;
}

/**
 * Schedules attendance actions using cron
 */
function scheduleAttendance(schedule) {
    if (!schedule.enabled) {
        log(`Schedule ${schedule.id} is disabled`, 'WARN');
        return;
    }

    const [checkinHour, checkinMin] = schedule.checkinTime.split(':');
    const [checkoutHour, checkoutMin] = schedule.checkoutTime.split(':');

    // Create cron expression for check-in
    // Only on working days: minute hour * * working-days
    const checkinCronExpression = `${checkinMin} ${checkinHour} * * ${schedule.workingDays.join(',')}`;
    
    // Create cron expression for check-out
    const checkoutCronExpression = `${checkoutMin} ${checkoutHour} * * ${schedule.workingDays.join(',')}`;

    try {
        // Schedule check-in
        schedule.checkinCron = cron.schedule(checkinCronExpression, async () => {
            log(`[CRON] Check-in task triggered for ${schedule.id}`, 'INFO');
            const checkinOptions = schedule.includeGeoLocation ? {
                geolocation: schedule.checkinGeolocation,
                checkin_location: schedule.checkinLocationName,
                note: `Check-in from ${schedule.checkinLocationName}`
            } : {};
            await performAttendanceAction('checkin', schedule.id, checkinOptions);
        }, {
            scheduled: true,
            timezone: schedule.timezone,
        });

        // Schedule check-out
        schedule.checkoutCron = cron.schedule(checkoutCronExpression, async () => {
            log(`[CRON] Check-out task triggered for ${schedule.id}`, 'INFO');
            const checkoutOptions = schedule.includeGeoLocation ? {
                geolocation: schedule.checkoutGeolocation,
                checkin_location: schedule.checkoutLocationName,
                note: `Check-out from ${schedule.checkoutLocationName}`
            } : {};
            await performAttendanceAction('checkout', schedule.id, checkoutOptions);
        }, {
            scheduled: true,
            timezone: schedule.timezone,
        });

        log(`Scheduled ${schedule.id}: Check-in at ${schedule.checkinTime} | Check-out at ${schedule.checkoutTime}`, 'SUCCESS');
    } catch (error) {
        log(`Failed to schedule attendance: ${error.message}`, 'ERROR');
    }
}

/**
 * Restores schedules from saved configuration
 */
function restoreSchedules() {
    const savedSchedules = loadScheduleConfig();

    for (const config of savedSchedules) {
        if (config.enabled) {
            const schedule = createSchedule({
                checkinTime: config.checkinTime,
                checkoutTime: config.checkoutTime,
                workingDays: config.workingDays,
                timezone: config.timezone,
                description: config.description,
                enabled: config.enabled,
            });
            schedule.id = config.id;
            schedule.createdAt = config.createdAt;

            scheduleAttendance(schedule);
            activeSchedules.set(schedule.id, schedule);
        }
    }

    log(`Restored ${activeSchedules.size} schedules from configuration`, 'INFO');
}

// ======================================================================
// MANUAL ATTENDANCE EXECUTION
// ======================================================================

/**
 * Manually triggers check-in with optional parameters
 * @param {object} options - Optional parameters
 *   - note: Add a note
 *   - geolocation: GPS coordinates (lat,long)
 *   - checkin_location: Location name
 */
async function manualCheckIn(options = {}) {
    log('Manual check-in triggered', 'SUCCESS');
    return await performAttendanceAction('checkin', 'manual', options);
}

/**
 * Manually triggers check-out with optional parameters
 * @param {object} options - Optional parameters
 *   - note: Add a note
 *   - geolocation: GPS coordinates (lat,long)
 *   - checkin_location: Location name
 */
async function manualCheckOut(options = {}) {
    log('Manual check-out triggered', 'SUCCESS');
    return await performAttendanceAction('checkout', 'manual', options);
}

// ======================================================================
// SYSTEM COMMANDS & CLI
// ======================================================================

/**
 * Displays system status
 */
function getSystemStatus() {
    return {
        token_valid: Date.now() < tokenExpirationTime,
        token_expires_in: Math.round((tokenExpirationTime - Date.now()) / 1000),
        active_schedules: activeSchedules.size,
        schedules: listSchedules().map(s => ({
            id: s.id,
            checkinTime: s.checkinTime,
            checkoutTime: s.checkoutTime,
            workingDays: s.workingDays,
            enabled: s.enabled,
            timezone: s.timezone,
            description: s.description,
        })),
    };
}

/**
 * Displays help information
 */
function displayHelp() {
    console.log(`
╔════════════════════════════════════════════════════════════════════╗
║       ZOHO PEOPLE PLUS ATTENDANCE SCHEDULER - COMMANDS             ║
╚════════════════════════════════════════════════════════════════════╝

📌 SCHEDULE MANAGEMENT:
  node attendance-scheduler.js add --checkin 09:00 --checkout 18:00 --days 1,2,3,4,5 --tz Asia/Kolkata
  node attendance-scheduler.js list
  node attendance-scheduler.js get <schedule_id>
  node attendance-scheduler.js delete <schedule_id>
  node attendance-scheduler.js update <schedule_id> --checkin 09:30 --checkout 17:30

📌 MANUAL ATTENDANCE (with Geo-Location):
  node attendance-scheduler.js checkin
  node attendance-scheduler.js checkout

📌 SYSTEM:
  node attendance-scheduler.js status
  node attendance-scheduler.js help
  node attendance-scheduler.js start

📌 OPTIONS:
  --checkin <HH:MM>     : Check-in time (24-hour format)
  --checkout <HH:MM>    : Check-out time (24-hour format)
  --days <1,2,3,4,5>    : Working days (0=Sun, 1=Mon, ..., 6=Sat)
  --tz <timezone>       : Timezone (default: Asia/Kolkata)
  --desc <description>  : Schedule description
  --no-geo              : Disable geo-location tracking for this schedule

🌍 GEO-LOCATION:
  ✓ Check-ins include your verified office location
  ✓ Check-outs include your verified office location
  ✓ Default: ${CONFIG.CHECKIN_LOCATION_NAME}
  ✓ Disable with --no-geo flag

📌 EXAMPLES:
  # Add a schedule with geo-location (default)
  node attendance-scheduler.js add --checkin 09:00 --checkout 18:00

  # Add schedule WITHOUT geo-location
  node attendance-scheduler.js add --checkin 09:00 --checkout 18:00 --no-geo

  # List all active schedules
  node attendance-scheduler.js list

  # Manually check in (with location)
  node attendance-scheduler.js checkin

  # Check system status
  node attendance-scheduler.js status

💡 The script runs in the background and executes attendance actions
   at specified times on working days with your verified geo-location.
   View attendance.log for details.
    `);
}

// ======================================================================
// COMMAND LINE INTERFACE
// ======================================================================

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === 'help') {
        displayHelp();
        return;
    }

    switch (command) {
        case 'start': {
            restoreSchedules();
            
            // Start a simple HTTP server for Railway health checks
            const PORT = process.env.PORT || 3000;
            const server = http.createServer((req, res) => {
                if (req.url === '/health' || req.url === '/') {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        status: 'ok', 
                        schedules: activeSchedules.size,
                        uptime: process.uptime()
                    }));
                } else {
                    res.writeHead(404);
                    res.end('Not Found');
                }
            });
            
            server.listen(PORT, () => {
                log(`Health server listening on port ${PORT}`, 'SUCCESS');
            });
            
            log('Scheduler running', 'SUCCESS');
            
            // Handle graceful shutdown
            process.on('SIGINT', () => {
                server.close();
                log('Scheduler stopped', 'SUCCESS');
                process.exit(0);
            });
            
            process.on('SIGTERM', () => {
                server.close();
                log('Scheduler stopped (SIGTERM)', 'SUCCESS');
                process.exit(0);
            });
            
            // Keep process alive - the HTTP server will keep the event loop running
            break;
        }

        case 'add': {
            const checkinTime = args[args.indexOf('--checkin') + 1] || CONFIG.CHECKIN_TIME;
            const checkoutTime = args[args.indexOf('--checkout') + 1] || CONFIG.CHECKOUT_TIME;
            const daysArg = args[args.indexOf('--days') + 1];
            const workingDays = daysArg ? daysArg.split(',').map(Number) : CONFIG.WORKING_DAYS;
            const timezone = args[args.indexOf('--tz') + 1] || 'Asia/Kolkata';
            const description = args[args.indexOf('--desc') + 1] || `Schedule at ${checkinTime}-${checkoutTime}`;
            const noGeoIdx = args.indexOf('--no-geo');
            const includeGeoLocation = noGeoIdx === -1; // Default: true, unless --no-geo flag

            restoreSchedules();
            const schedule = addSchedule({
                checkinTime,
                checkoutTime,
                workingDays,
                timezone,
                description,
                includeGeoLocation,
            });

            if (schedule) {
                console.log('✅ Schedule created successfully!');
                // Create a copy without circular references (cron jobs)
                const scheduleInfo = {
                    id: schedule.id,
                    checkinTime: schedule.checkinTime,
                    checkoutTime: schedule.checkoutTime,
                    workingDays: schedule.workingDays,
                    enabled: schedule.enabled,
                    timezone: schedule.timezone,
                    description: schedule.description,
                    includeGeoLocation: schedule.includeGeoLocation,
                    checkinGeolocation: schedule.checkinGeolocation,
                    checkoutGeolocation: schedule.checkoutGeolocation,
                    checkinLocationName: schedule.checkinLocationName,
                    checkoutLocationName: schedule.checkoutLocationName,
                    createdAt: schedule.createdAt,
                };
                console.log(JSON.stringify(scheduleInfo, null, 2));
                if (schedule.includeGeoLocation) {
                    console.log(`\n📍 Geo-location enabled:`);
                    console.log(`   Check-in: ${schedule.checkinLocationName}`);
                    console.log(`   Check-out: ${schedule.checkoutLocationName}`);
                }
            }
            break;
        }

        case 'list': {
            restoreSchedules();
            const schedules = listSchedules();
            if (schedules.length === 0) {
                console.log('No active schedules.');
            } else {
                console.log('\n📋 Active Schedules:');
                schedules.forEach((s, i) => {
                    console.log(`\n  ${i + 1}. ${s.id}`);
                    console.log(`     Check-in: ${s.checkinTime} | Check-out: ${s.checkoutTime}`);
                    console.log(`     Days: ${s.workingDays.join(', ')} | Timezone: ${s.timezone}`);
                    console.log(`     Status: ${s.enabled ? '✅ Enabled' : '❌ Disabled'}`);
                });
            }
            break;
        }

        case 'get': {
            const scheduleId = args[1];
            if (!scheduleId) {
                console.error('❌ Schedule ID required. Usage: node attendance-scheduler.js get <schedule_id>');
                break;
            }
            restoreSchedules();
            const schedule = getSchedule(scheduleId);
            if (schedule) {
                console.log(JSON.stringify(schedule, null, 2));
            } else {
                console.error('❌ Schedule not found.');
            }
            break;
        }

        case 'delete': {
            const scheduleId = args[1];
            if (!scheduleId) {
                console.error('❌ Schedule ID required. Usage: node attendance-scheduler.js delete <schedule_id>');
                break;
            }
            restoreSchedules();
            if (deleteSchedule(scheduleId)) {
                console.log('✅ Schedule deleted successfully.');
            }
            break;
        }

        case 'update': {
            const scheduleId = args[1];
            if (!scheduleId) {
                console.error('❌ Schedule ID required. Usage: node attendance-scheduler.js update <schedule_id> [options]');
                break;
            }
            restoreSchedules();
            const updates = {};
            const checkinIdx = args.indexOf('--checkin');
            const checkoutIdx = args.indexOf('--checkout');
            const daysIdx = args.indexOf('--days');

            if (checkinIdx !== -1) updates.checkinTime = args[checkinIdx + 1];
            if (checkoutIdx !== -1) updates.checkoutTime = args[checkoutIdx + 1];
            if (daysIdx !== -1) updates.workingDays = args[daysIdx + 1].split(',').map(Number);

            const updated = updateSchedule(scheduleId, updates);
            if (updated) {
                console.log('✅ Schedule updated successfully!');
                console.log(JSON.stringify(updated, null, 2));
            }
            break;
        }

        case 'checkin': {
            const result = await manualCheckIn({
                geolocation: CONFIG.CHECKIN_GEOLOCATION,
                checkin_location: CONFIG.CHECKIN_LOCATION_NAME,
                note: `Check-in from ${CONFIG.CHECKIN_LOCATION_NAME}`
            });
            if (result.success) {
                console.log('✓ Check-in successful');
            } else {
                console.error('✗ Check-in failed');
            }
            break;
        }

        case 'checkout': {
            const result = await manualCheckOut({
                geolocation: CONFIG.CHECKOUT_GEOLOCATION,
                checkin_location: CONFIG.CHECKOUT_LOCATION_NAME,
                note: `Check-out from ${CONFIG.CHECKOUT_LOCATION_NAME}`
            });
            if (result.success) {
                console.log('✓ Check-out successful');
            } else {
                console.error('✗ Check-out failed:', result.message || result.error || 'Unknown error');
            }
            break;
        }

        case 'status': {
            const status = getSystemStatus();
            console.log('\n📊 System Status:');
            console.log(JSON.stringify(status, null, 2));
            break;
        }

        case 'debug': {
            console.log('\n🔍 Fetching last attendance entry...');
            const lastEntry = await fetchLastAttendanceEntry();
            console.log('\nRaw Response:');
            console.log(JSON.stringify(lastEntry, null, 2));
            if (lastEntry.success && lastEntry.data) {
                console.log('\nValidation Checks:');
                console.log('- Is last entry check-in?', isLastEntryCheckIn(lastEntry.data));
                console.log('- Is last entry check-out?', isLastEntryCheckOut(lastEntry.data));
                console.log('\nConfig Values:');
                console.log('- EMPLOYEE_API_ID:', CONFIG.EMPLOYEE_API_ID);
                console.log('- EMPLOYEE_EMAIL:', CONFIG.EMPLOYEE_EMAIL);
            }
            break;
        }

        default:
            console.error(`❌ Unknown command: ${command}`);
            console.log('Run: node attendance-scheduler.js help');
    }
}

// Run the main function
main().catch(error => {
    log(`Fatal error: ${error.message}`, 'ERROR');
    process.exit(1);
});

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
