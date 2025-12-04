#!/usr/bin/env node

/**
 * ZOHO ATTENDANCE SCHEDULER - USAGE EXAMPLES
 * 
 * This file demonstrates various use cases and patterns for using
 * the Zoho Attendance Scheduler API.
 * 
 * Run individual examples by uncommenting the section you want to test.
 */

import {
    addSchedule,
    deleteSchedule,
    updateSchedule,
    getSchedule,
    listSchedules,
    performAttendanceAction,
    manualCheckIn,
    manualCheckOut,
    getSystemStatus,
} from './attendance-scheduler.js';

// ======================================================================
// EXAMPLE 1: Simple Daily Schedule
// ======================================================================

async function example1_simpleSchedule() {
    console.log('\n📌 EXAMPLE 1: Simple Daily Schedule\n');

    // Create a basic 9-to-6 schedule for weekdays
    const schedule = addSchedule({
        checkinTime: '09:00',
        checkoutTime: '18:00',
        workingDays: [1, 2, 3, 4, 5], // Monday to Friday
        timezone: 'Asia/Kolkata',
        description: 'Standard office hours',
    });

    if (schedule) {
        console.log('✅ Schedule created successfully!');
        console.log(`   ID: ${schedule.id}`);
        console.log(`   Check-in: ${schedule.checkinTime}`);
        console.log(`   Check-out: ${schedule.checkoutTime}`);
    }
}

// ======================================================================
// EXAMPLE 2: Multiple Shifts
// ======================================================================

async function example2_multipleShifts() {
    console.log('\n📌 EXAMPLE 2: Multiple Shift Schedules\n');

    // Morning shift (6 AM - 2 PM)
    const morningShift = addSchedule({
        checkinTime: '06:00',
        checkoutTime: '14:00',
        workingDays: [1, 2, 3, 4, 5],
        description: 'Morning Shift (6 AM - 2 PM)',
    });

    // Afternoon shift (2 PM - 10 PM)
    const afternoonShift = addSchedule({
        checkinTime: '14:00',
        checkoutTime: '22:00',
        workingDays: [1, 2, 3, 4, 5],
        description: 'Afternoon Shift (2 PM - 10 PM)',
    });

    // Night shift (10 PM - 6 AM)
    const nightShift = addSchedule({
        checkinTime: '22:00',
        checkoutTime: '06:00',
        workingDays: [1, 2, 3, 4, 5],
        description: 'Night Shift (10 PM - 6 AM)',
    });

    console.log('✅ Three shifts created!');
    console.log(`   Morning: ${morningShift?.id}`);
    console.log(`   Afternoon: ${afternoonShift?.id}`);
    console.log(`   Night: ${nightShift?.id}`);
}

// ======================================================================
// EXAMPLE 3: Global Team Scheduling
// ======================================================================

async function example3_globalTeams() {
    console.log('\n📌 EXAMPLE 3: Global Team Scheduling\n');

    // India office
    const indiaOffice = addSchedule({
        checkinTime: '09:00',
        checkoutTime: '18:00',
        workingDays: [1, 2, 3, 4, 5],
        timezone: 'Asia/Kolkata',
        description: 'India Office (IST)',
    });

    // US office (Eastern Time)
    const usOffice = addSchedule({
        checkinTime: '09:00',
        checkoutTime: '17:00',
        workingDays: [1, 2, 3, 4, 5],
        timezone: 'America/New_York',
        description: 'US Office (EST)',
    });

    // UK office
    const ukOffice = addSchedule({
        checkinTime: '09:00',
        checkoutTime: '17:30',
        workingDays: [1, 2, 3, 4, 5],
        timezone: 'Europe/London',
        description: 'UK Office (GMT)',
    });

    console.log('✅ Global office schedules created!');
    console.log(`   India: ${indiaOffice?.id}`);
    console.log(`   US: ${usOffice?.id}`);
    console.log(`   UK: ${ukOffice?.id}`);
}

// ======================================================================
// EXAMPLE 4: Flexible Working Hours
// ======================================================================

async function example4_flexibleSchedule() {
    console.log('\n📌 EXAMPLE 4: Flexible Working Hours\n');

    // Flexible hours schedule (flexible but consistent 8 hours)
    const flexSchedule = addSchedule({
        checkinTime: '10:00', // Can check in anytime from 9:30 to 10:30
        checkoutTime: '18:00', // Must check out between 5:30 and 6:30
        workingDays: [1, 2, 3, 4, 5],
        description: 'Flexible Start Time (10:00 AM - 6:00 PM)',
    });

    console.log('✅ Flexible schedule created!');
    console.log(`   Check-in: ${flexSchedule?.checkinTime} (Flexible +/- 30 mins)`);
    console.log(`   Check-out: ${flexSchedule?.checkoutTime} (Flexible +/- 30 mins)`);
}

// ======================================================================
// EXAMPLE 5: Weekend Support
// ======================================================================

async function example5_weekendSupport() {
    console.log('\n📌 EXAMPLE 5: Weekend Support Staff\n');

    // Weekend only schedule
    const weekendStaff = addSchedule({
        checkinTime: '09:00',
        checkoutTime: '18:00',
        workingDays: [0, 6], // Sunday and Saturday only
        description: 'Weekend Support (Sat & Sun)',
    });

    // 7-day schedule
    const sevenDaySchedule = addSchedule({
        checkinTime: '08:00',
        checkoutTime: '17:00',
        workingDays: [0, 1, 2, 3, 4, 5, 6], // All days
        description: 'Continuous Operations (7/7)',
    });

    console.log('✅ Weekend schedules created!');
    console.log(`   Weekend only: ${weekendStaff?.id}`);
    console.log(`   7 days/week: ${sevenDaySchedule?.id}`);
}

// ======================================================================
// EXAMPLE 6: View and Manage Schedules
// ======================================================================

async function example6_manageSchedules() {
    console.log('\n📌 EXAMPLE 6: View and Manage Schedules\n');

    // List all schedules
    const schedules = listSchedules();
    console.log(`📋 Total schedules: ${schedules.length}\n`);

    schedules.forEach((schedule, index) => {
        console.log(`${index + 1}. ${schedule.description}`);
        console.log(`   ID: ${schedule.id}`);
        console.log(`   Times: ${schedule.checkinTime} - ${schedule.checkoutTime}`);
        console.log(`   Days: ${schedule.workingDays.join(', ')}`);
        console.log(`   Status: ${schedule.enabled ? '✅ Active' : '❌ Disabled'}`);
        console.log();
    });

    // Get specific schedule details
    if (schedules.length > 0) {
        const firstSchedule = schedules[0];
        console.log(`📌 Detailed info for: ${firstSchedule.id}`);
        const details = getSchedule(firstSchedule.id);
        console.log(JSON.stringify(details, null, 2));
    }
}

// ======================================================================
// EXAMPLE 7: Update Schedule
// ======================================================================

async function example7_updateSchedule() {
    console.log('\n📌 EXAMPLE 7: Update Schedule\n');

    const schedules = listSchedules();
    if (schedules.length === 0) {
        console.log('❌ No schedules to update. Create one first.');
        return;
    }

    const schedule = schedules[0];
    console.log(`Original schedule: ${schedule.checkinTime} - ${schedule.checkoutTime}`);

    // Update times
    const updated = updateSchedule(schedule.id, {
        checkinTime: '09:30',
        checkoutTime: '18:30',
        description: `${schedule.description} (Updated)`,
    });

    if (updated) {
        console.log(`✅ Updated schedule: ${updated.checkinTime} - ${updated.checkoutTime}`);
    }
}

// ======================================================================
// EXAMPLE 8: Delete Schedule
// ======================================================================

async function example8_deleteSchedule() {
    console.log('\n📌 EXAMPLE 8: Delete Schedule\n');

    const schedules = listSchedules();
    if (schedules.length === 0) {
        console.log('❌ No schedules to delete.');
        return;
    }

    const schedule = schedules[0];
    console.log(`Deleting schedule: ${schedule.description}`);

    if (deleteSchedule(schedule.id)) {
        console.log(`✅ Schedule deleted: ${schedule.id}`);
    }
}

// ======================================================================
// EXAMPLE 9: Manual Check-in/Check-out
// ======================================================================

async function example9_manualAttendance() {
    console.log('\n📌 EXAMPLE 9: Manual Attendance Override\n');

    // Manual check-in
    console.log('Performing manual check-in...');
    const checkinResult = await manualCheckIn();
    console.log(`Check-in result: ${checkinResult.success ? '✅ Success' : '❌ Failed'}`);
    if (checkinResult.error) {
        console.log(`Error: ${checkinResult.error}`);
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Manual check-out
    console.log('\nPerforming manual check-out...');
    const checkoutResult = await manualCheckOut();
    console.log(`Check-out result: ${checkoutResult.success ? '✅ Success' : '❌ Failed'}`);
    if (checkoutResult.error) {
        console.log(`Error: ${checkoutResult.error}`);
    }
}

// ======================================================================
// EXAMPLE 10: System Status
// ======================================================================

async function example10_systemStatus() {
    console.log('\n📌 EXAMPLE 10: Check System Status\n');

    const status = getSystemStatus();

    console.log('🔐 Token Status:');
    console.log(`   Valid: ${status.token_valid ? '✅ Yes' : '❌ No'}`);
    console.log(`   Expires in: ${status.token_expires_in} seconds (${Math.round(status.token_expires_in / 60)} minutes)`);

    console.log('\n📊 Active Schedules:');
    console.log(`   Count: ${status.active_schedules}`);

    if (status.schedules.length > 0) {
        console.log('\n   Details:');
        status.schedules.forEach((schedule, index) => {
            console.log(`   ${index + 1}. ${schedule.description}`);
            console.log(`      ${schedule.checkinTime} - ${schedule.checkoutTime}`);
        });
    }
}

// ======================================================================
// EXAMPLE 11: Batch Operations
// ======================================================================

async function example11_batchOperations() {
    console.log('\n📌 EXAMPLE 11: Batch Operations\n');

    console.log('Creating 5 department schedules...\n');

    const departments = [
        { name: 'Engineering', start: '08:00', end: '16:30' },
        { name: 'Sales', start: '09:00', end: '18:00' },
        { name: 'Support', start: '09:30', end: '18:30' },
        { name: 'Administration', start: '09:00', end: '17:00' },
        { name: 'Management', start: '08:30', end: '17:30' },
    ];

    const createdSchedules = [];

    for (const dept of departments) {
        const schedule = addSchedule({
            checkinTime: dept.start,
            checkoutTime: dept.end,
            workingDays: [1, 2, 3, 4, 5],
            description: `${dept.name} Department`,
        });

        if (schedule) {
            createdSchedules.push(schedule);
            console.log(`✅ ${dept.name}: ${dept.start} - ${dept.end}`);
        }
    }

    console.log(`\n🎉 Created ${createdSchedules.length} schedules successfully!`);
}

// ======================================================================
// EXAMPLE 12: Advanced Schedule Analysis
// ======================================================================

async function example12_scheduleAnalysis() {
    console.log('\n📌 EXAMPLE 12: Schedule Analysis\n');

    const schedules = listSchedules();

    if (schedules.length === 0) {
        console.log('❌ No schedules to analyze.');
        return;
    }

    console.log('📊 Schedule Summary:\n');

    // Group by hours
    const hoursBySchedule = schedules.map(s => {
        const [inHour, inMin] = s.checkinTime.split(':').map(Number);
        const [outHour, outMin] = s.checkoutTime.split(':').map(Number);
        let duration = (outHour * 60 + outMin) - (inHour * 60 + inMin);
        if (duration < 0) duration += 24 * 60; // Next day
        return {
            description: s.description,
            duration: Math.round(duration / 60 * 10) / 10, // Convert to hours with decimals
            checkinTime: s.checkinTime,
            checkoutTime: s.checkoutTime,
        };
    });

    // Display sorted by duration
    hoursBySchedule.sort((a, b) => a.duration - b.duration);

    hoursBySchedule.forEach((item, index) => {
        console.log(`${index + 1}. ${item.description}`);
        console.log(`   Hours: ${item.duration} hours`);
        console.log(`   Times: ${item.checkinTime} - ${item.checkoutTime}`);
        console.log();
    });

    const avgHours = (hoursBySchedule.reduce((sum, s) => sum + s.duration, 0) / hoursBySchedule.length).toFixed(1);
    console.log(`📈 Average hours per schedule: ${avgHours} hours`);
}

// ======================================================================
// EXAMPLE 13: Concurrent Attendance Actions
// ======================================================================

async function example13_concurrentActions() {
    console.log('\n📌 EXAMPLE 13: Concurrent Attendance Actions\n');

    console.log('Performing multiple check-ins and check-outs...\n');

    // Create multiple schedules
    const schedule1 = addSchedule({
        checkinTime: '09:00',
        checkoutTime: '18:00',
        description: 'Schedule 1',
    });

    const schedule2 = addSchedule({
        checkinTime: '10:00',
        checkoutTime: '19:00',
        description: 'Schedule 2',
    });

    if (!schedule1 || !schedule2) {
        console.log('❌ Failed to create schedules');
        return;
    }

    // Perform concurrent actions
    console.log('Executing concurrent check-ins...');
    const [result1, result2] = await Promise.all([
        performAttendanceAction('checkin', schedule1.id),
        performAttendanceAction('checkin', schedule2.id),
    ]);

    console.log(`Result 1: ${result1.success ? '✅' : '❌'}`);
    console.log(`Result 2: ${result2.success ? '✅' : '❌'}`);
}

// ======================================================================
// MAIN MENU
// ======================================================================

async function main() {
    const example = process.argv[2] || 'menu';

    switch (example) {
        case '1':
            await example1_simpleSchedule();
            break;
        case '2':
            await example2_multipleShifts();
            break;
        case '3':
            await example3_globalTeams();
            break;
        case '4':
            await example4_flexibleSchedule();
            break;
        case '5':
            await example5_weekendSupport();
            break;
        case '6':
            await example6_manageSchedules();
            break;
        case '7':
            await example7_updateSchedule();
            break;
        case '8':
            await example8_deleteSchedule();
            break;
        case '9':
            await example9_manualAttendance();
            break;
        case '10':
            await example10_systemStatus();
            break;
        case '11':
            await example11_batchOperations();
            break;
        case '12':
            await example12_scheduleAnalysis();
            break;
        case '13':
            await example13_concurrentActions();
            break;
        default:
            console.log(`
╔════════════════════════════════════════════════════════════════════╗
║        ZOHO ATTENDANCE SCHEDULER - USAGE EXAMPLES MENU             ║
╚════════════════════════════════════════════════════════════════════╝

Usage: node examples.js <example_number>

Available Examples:

  1  - Simple Daily Schedule
  2  - Multiple Shift Schedules
  3  - Global Team Scheduling (Different timezones)
  4  - Flexible Working Hours
  5  - Weekend Support Staff
  6  - View and Manage Schedules
  7  - Update Schedule
  8  - Delete Schedule
  9  - Manual Check-in/Check-out
  10 - System Status
  11 - Batch Operations (Create multiple schedules)
  12 - Schedule Analysis
  13 - Concurrent Attendance Actions

Examples:
  node examples.js 1    # Run Example 1
  node examples.js 5    # Run Example 5
  node examples.js 10   # Run Example 10

💡 Tip: Each example demonstrates different features of the scheduler.
        Uncomment sections in this file to run multiple examples together.
            `);
    }
}

main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
