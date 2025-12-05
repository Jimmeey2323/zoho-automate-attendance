# Use Railway Cron Jobs instead of a persistent web service
# Create two cron jobs in Railway:
#   Check-in:  cron schedule "30 4 * * 1-5" -> node attendance-scheduler.js checkin
#   Check-out: cron schedule "30 13 * * 1-5" -> node attendance-scheduler.js checkout
# 
# Or run manually:
worker: node attendance-scheduler.js checkin
