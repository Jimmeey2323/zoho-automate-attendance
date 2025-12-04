import fetch from 'node-fetch';

// ======================================================================
// ⚠️ MANDATORY CONFIGURATION: UPDATE THESE PLACEHOLDERS
// You need your Client ID and Client Secret for token refreshing.
// The Refresh Token and Domains are pre-filled based on your last successful exchange.
// ======================================================================
const CONFIG = {
    // ⚠️ REPLACE WITH YOUR ACTUAL CLIENT ID AND SECRET
    CLIENT_ID: '1000.D5RD137IYSRA5SBMBP000XORKT423B',
    CLIENT_SECRET: 'd1a79031982c7dae82d562d8bd912b7acc678302aa',

    // Pre-filled from your last token exchange
    REFRESH_TOKEN: '1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f',
    
    // API Domains (using the .in domain based on your response)
    ZOHO_ACCOUNT_DOMAIN: 'https://accounts.zoho.in', // For token refresh
    ZOHO_PEOPLE_API_DOMAIN: 'https://people.zoho.in', // For attendance calls
};

// Start with the initial Access Token (it will be refreshed automatically)
let currentAccessToken = '1000.1eb7c4f9c7f90d1024c917d6b3b5de85.f6f3c6b7a297c540f34f9ff3c26bcc3d';
let tokenExpirationTime = Date.now() + (3600 * 1000); // 1 hour from script start (approx)

/**
 * Checks if the current access token is about to expire and refreshes it if necessary.
 * @returns {string} The valid access token.
 */
async function getValidAccessToken() {
    // Check if token expires within the next 5 minutes (300,000 milliseconds)
    if (Date.now() + 300000 >= tokenExpirationTime) {
        console.log('Access token is expired or expiring soon. Initiating refresh...');
        await refreshAccessToken();
    }
    return currentAccessToken;
}

/**
 * Uses the Refresh Token and Client Credentials to obtain a new Access Token.
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
            // Set new expiration time (usually 3600 seconds)
            tokenExpirationTime = Date.now() + (data.expires_in * 1000); 
            console.log('✅ Token refresh successful. New token obtained.');
        } else {
            console.error('❌ Token refresh failed:', data);
            throw new Error(`Failed to refresh token: ${data.error || 'Unknown Error'}`);
        }
    } catch (error) {
        console.error('An error occurred during token refresh:', error.message);
        throw error;
    }
}

/**
 * Performs the Check-in or Check-out action via Zoho People API.
 * @param {'checkin'|'checkout'} operation - The action to perform.
 */
async function performAttendanceAction(operation) {
    // 1. Get a valid access token (refreshes if needed)
    const token = await getValidAccessToken();
    const url = `${CONFIG.ZOHO_PEOPLE_API_DOMAIN}/people/api/attendance/insert`;

    // 2. Prepare the payload (operation is the main parameter)
    const body = new URLSearchParams();
    body.append('operation', operation);
    // You can optionally add 'note' or 'datetocheck' parameters here if needed.

    console.log(`\nAttempting to perform ${operation.toUpperCase()}...`);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Zoho-oauthtoken ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });

        const text = await response.text();
        
        // Zoho's API sometimes returns status 200 even on failure, so we must check the content
        if (response.ok && text.includes('<response><result>')) {
            console.log(`🎉 SUCCESS: ${operation.toUpperCase()} completed.`);
            console.log(`API Response: ${text}`);
            return true;
        } else {
            console.error(`❌ FAILURE: ${operation.toUpperCase()} failed.`);
            console.error(`Status: ${response.status}. Response Body: ${text}`);
            return false;
        }
    } catch (error) {
        console.error(`An error occurred during the API call for ${operation}:`, error.message);
        return false;
    }
}

/**
 * Main execution function to run the attendance process.
 */
async function main() {
    console.log('Zoho Attendance Automation Script Starting...');
    
    // --- Daily Check-in Logic ---
    // You will typically schedule this script to run once in the morning (e.g., 9:00 AM).
    const checkinSuccess = await performAttendanceAction('checkin');
    
    if (checkinSuccess) {
        console.log('\n--- Check-in registered. ---');
    } else {
        console.log('\n--- Failed to Check-in. Check logs above. ---');
        // If check-in fails, we don't proceed to schedule a checkout
        return; 
    }

    // --- Optional: Demonstrate Check-out (Requires a significant delay in a real scenario) ---
    /*
    console.log('\nSimulating work day... (Waiting 8 seconds for demonstration)');
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    const checkoutSuccess = await performAttendanceAction('checkout');

    if (checkoutSuccess) {
        console.log('\n--- Check-out registered. ---');
    } else {
        console.log('\n--- Failed to Check-out. Check logs above. ---');
    }
    */
    
    // For actual production use, you would schedule the check-in script to run in the morning,
    // and a separate script (or another instance of this one with different logic) to run 8-9 hours later 
    // to handle the checkout.
    
    console.log('\nZoho Attendance Automation Script Finished.');
}

// Execute the main function
main().catch(error => {
    console.error('Fatal error in main execution:', error.message);
    process.exit(1);
});