#!/bin/bash

# Zoho Attendance Scheduler - Quick Start Guide
# This script helps you get started with the scheduler

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          ZOHO ATTENDANCE SCHEDULER - QUICK START SETUP             ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
if npm install; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies. Check your npm installation."
    exit 1
fi

echo ""

# Step 2: Verify Node.js version
echo "🔍 Step 2: Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "   Current Node.js version: $NODE_VERSION"
echo "   ✅ Version check complete"

echo ""

# Step 3: Create necessary files
echo "📁 Step 3: Setting up directories and files..."
if [ ! -f "schedule.json" ]; then
    echo "[]" > schedule.json
    echo "   ✅ Created schedule.json"
fi

if [ ! -f "attendance.log" ]; then
    touch attendance.log
    echo "   ✅ Created attendance.log"
fi

echo ""

# Step 4: Display available commands
echo "🎯 Step 4: Available commands:"
echo ""
echo "   Scheduler Operations:"
echo "   • npm start              - Start the scheduler service"
echo "   • npm run add            - Add a new attendance schedule"
echo "   • npm run list           - List all schedules"
echo "   • npm run status         - Check scheduler status"
echo "   • npm run help           - Show detailed help"
echo ""
echo "   Manual Attendance:"
echo "   • npm run checkin        - Manually check in"
echo "   • npm run checkout       - Manually check out"
echo ""

echo "═════════════════════════════════════════════════════════════════════"
echo ""

# Step 5: Quick start prompts
read -p "Would you like to add a schedule now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📝 Creating a new schedule..."
    echo ""
    
    read -p "   Enter check-in time (HH:MM, default: 09:00): " CHECKIN_TIME
    CHECKIN_TIME=${CHECKIN_TIME:-"09:00"}
    
    read -p "   Enter check-out time (HH:MM, default: 18:00): " CHECKOUT_TIME
    CHECKOUT_TIME=${CHECKOUT_TIME:-"18:00"}
    
    read -p "   Enter timezone (default: Asia/Kolkata): " TIMEZONE
    TIMEZONE=${TIMEZONE:-"Asia/Kolkata"}
    
    read -p "   Enter schedule description (optional): " DESCRIPTION
    
    # Run the add command
    node attendance-scheduler.js add \
        --checkin "$CHECKIN_TIME" \
        --checkout "$CHECKOUT_TIME" \
        --tz "$TIMEZONE" \
        --desc "$DESCRIPTION"
    
    echo ""
    echo "✅ Schedule added successfully!"
    echo ""
fi

# Step 6: Offer to start the scheduler
read -p "Would you like to start the scheduler now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Starting the Zoho Attendance Scheduler..."
    echo "   Press Ctrl+C to stop the scheduler"
    echo ""
    npm start
else
    echo ""
    echo "To start the scheduler later, run:"
    echo "   npm start"
    echo ""
fi

echo ""
echo "✨ Setup complete! Happy scheduling! 🎯"
echo ""
