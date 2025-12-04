# Environment Setup Guide

This guide helps you configure environment variables for the Zoho Attendance Scheduler.

## Option 1: Direct Configuration (Default)

The scheduler has credentials embedded in `attendance-scheduler.js`:

```javascript
const CONFIG = {
    CLIENT_ID: '1000.D5RD137IYSRA5SBMBP000XORKT423B',
    CLIENT_SECRET: 'd1a79031982c7dae82d562d8bd912b7acc678302aa',
    REFRESH_TOKEN: '1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f',
    ZOHO_ACCOUNT_DOMAIN: 'https://accounts.zoho.in',
    ZOHO_PEOPLE_API_DOMAIN: 'https://people.zoho.in',
};
```

**Pros:**
- Simple setup
- No additional dependencies
- Works immediately

**Cons:**
- Credentials visible in source code
- Not suitable for production or version control

---

## Option 2: Environment Variables (.env file)

For better security, use a `.env` file:

### Step 1: Create .env File

In your project directory, create a `.env` file:

```bash
touch /Users/jimmeeygondaa/zoho-automate-attendance/.env
```

### Step 2: Add Credentials

Add your credentials to `.env`:

```env
ZOHO_CLIENT_ID=1000.D5RD137IYSRA5SBMBP000XORKT423B
ZOHO_CLIENT_SECRET=d1a79031982c7dae82d562d8bd912b7acc678302aa
ZOHO_REFRESH_TOKEN=1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f
ZOHO_ACCOUNT_DOMAIN=https://accounts.zoho.in
ZOHO_PEOPLE_API_DOMAIN=https://people.zoho.in
CHECKIN_TIME=09:00
CHECKOUT_TIME=18:00
TIMEZONE=Asia/Kolkata
```

### Step 3: Update Script

Modify `attendance-scheduler.js` to load environment variables:

```bash
npm install dotenv
```

Then add to the top of `attendance-scheduler.js`:

```javascript
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const CONFIG = {
    CLIENT_ID: process.env.ZOHO_CLIENT_ID,
    CLIENT_SECRET: process.env.ZOHO_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.ZOHO_REFRESH_TOKEN,
    ZOHO_ACCOUNT_DOMAIN: process.env.ZOHO_ACCOUNT_DOMAIN,
    ZOHO_PEOPLE_API_DOMAIN: process.env.ZOHO_PEOPLE_API_DOMAIN,
    CHECKIN_TIME: process.env.CHECKIN_TIME || '09:00',
    CHECKOUT_TIME: process.env.CHECKOUT_TIME || '18:00',
    TIMEZONE: process.env.TIMEZONE || 'Asia/Kolkata',
};
```

### Step 4: Add to .gitignore

Ensure .env is never committed:

```bash
echo ".env" >> /Users/jimmeeygondaa/zoho-automate-attendance/.gitignore
echo "*.log" >> /Users/jimmeeygondaa/zoho-automate-attendance/.gitignore
echo "node_modules/" >> /Users/jimmeeygondaa/zoho-automate-attendance/.gitignore
```

**Pros:**
- Credentials not in source code
- Easy to change across environments
- Industry standard practice

**Cons:**
- Requires dotenv package
- Need to manage .env file separately

---

## Option 3: System Environment Variables

### macOS/Linux

Set environment variables for the session:

```bash
export ZOHO_CLIENT_ID="1000.D5RD137IYSRA5SBMBP000XORKT423B"
export ZOHO_CLIENT_SECRET="d1a79031982c7dae82d562d8bd912b7acc678302aa"
export ZOHO_REFRESH_TOKEN="1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f"

node attendance-scheduler.js start
```

To make permanent, add to `~/.zshrc` or `~/.bash_profile`:

```bash
export ZOHO_CLIENT_ID="1000.D5RD137IYSRA5SBMBP000XORKT423B"
export ZOHO_CLIENT_SECRET="d1a79031982c7dae82d562d8bd912b7acc678302aa"
export ZOHO_REFRESH_TOKEN="1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f"
```

Then:
```bash
source ~/.zshrc
```

### Windows

Set environment variables via Command Prompt:

```batch
setx ZOHO_CLIENT_ID "1000.D5RD137IYSRA5SBMBP000XORKT423B"
setx ZOHO_CLIENT_SECRET "d1a79031982c7dae82d562d8bd912b7acc678302aa"
setx ZOHO_REFRESH_TOKEN "1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f"
```

Or via PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("ZOHO_CLIENT_ID", "1000.D5RD137IYSRA5SBMBP000XORKT423B", "User")
[Environment]::SetEnvironmentVariable("ZOHO_CLIENT_SECRET", "d1a79031982c7dae82d562d8bd912b7acc678302aa", "User")
[Environment]::SetEnvironmentVariable("ZOHO_REFRESH_TOKEN", "1000.7c8573a28d1a91e4c5ae625a60ea30b6.f705a17de843b43a47f4c52af4a53d9f", "User")
```

---

## Option 4: Production - Docker with Secrets

### Docker File

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application
COPY attendance-scheduler.js .
COPY . .

# Run the scheduler
CMD ["node", "attendance-scheduler.js", "start"]
```

### Docker Compose with Secrets

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  attendance-scheduler:
    build: .
    environment:
      ZOHO_CLIENT_ID: ${ZOHO_CLIENT_ID}
      ZOHO_CLIENT_SECRET: ${ZOHO_CLIENT_SECRET}
      ZOHO_REFRESH_TOKEN: ${ZOHO_REFRESH_TOKEN}
      ZOHO_ACCOUNT_DOMAIN: https://accounts.zoho.in
      ZOHO_PEOPLE_API_DOMAIN: https://people.zoho.in
    volumes:
      - ./attendance.log:/app/attendance.log
      - ./schedule.json:/app/schedule.json
    restart: always
```

Run with:

```bash
docker-compose up -d
```

---

## Option 5: Using AWS Secrets Manager

For AWS deployment:

```javascript
import AWS from 'aws-sdk';

const secretsClient = new AWS.SecretsManager();

async function loadSecretsFromAWS() {
    try {
        const data = await secretsClient.getSecretValue({
            SecretId: 'zoho-attendance-secrets'
        }).promise();
        
        const secrets = JSON.parse(data.SecretString);
        return {
            CLIENT_ID: secrets.client_id,
            CLIENT_SECRET: secrets.client_secret,
            REFRESH_TOKEN: secrets.refresh_token,
        };
    } catch (error) {
        console.error('Failed to load secrets:', error);
        throw error;
    }
}
```

---

## Credential Generation

### Getting Your Credentials from Zoho

1. **Log in to Zoho API Console:**
   - Visit: https://api.zoho.in/

2. **Create OAuth2 Application:**
   - Navigate to Connected Applications
   - Add new OAuth2 application
   - Set callback URL

3. **Get Authorization Code:**
   - Use OAuth2 flow to get authorization code

4. **Exchange for Tokens:**
   ```bash
   curl -X POST https://accounts.zoho.in/oauth/v2/token \
     -d "code=YOUR_AUTH_CODE" \
     -d "client_id=YOUR_CLIENT_ID" \
     -d "client_secret=YOUR_CLIENT_SECRET" \
     -d "redirect_uri=YOUR_REDIRECT_URL" \
     -d "grant_type=authorization_code"
   ```

5. **Store the Response:**
   - `access_token` - Used for API calls
   - `refresh_token` - Used to get new access tokens
   - `expires_in` - Token expiration time

---

## Security Best Practices

### 1. Never Commit Credentials
```bash
echo ".env" >> .gitignore
echo "*.env" >> .gitignore
echo "!.env.example" >> .gitignore
```

### 2. Create Example File
Create `.env.example` with empty values:

```env
ZOHO_CLIENT_ID=
ZOHO_CLIENT_SECRET=
ZOHO_REFRESH_TOKEN=
ZOHO_ACCOUNT_DOMAIN=https://accounts.zoho.in
ZOHO_PEOPLE_API_DOMAIN=https://people.zoho.in
```

### 3. Use Different Credentials for Each Environment

```env
# .env.production
ZOHO_CLIENT_ID=production_client_id
ZOHO_CLIENT_SECRET=production_client_secret

# .env.development
ZOHO_CLIENT_ID=dev_client_id
ZOHO_CLIENT_SECRET=dev_client_secret
```

### 4. Rotate Credentials Regularly
- Change refresh tokens every 90 days
- Update client secrets when needed
- Monitor access logs

### 5. Restrict Permissions
- Use minimal OAuth2 scopes
- Create separate apps for different environments
- Limit API endpoint access

---

## Troubleshooting

### Credentials Not Loading
1. Check if file is in correct path
2. Verify environment variables are set:
   ```bash
   echo $ZOHO_CLIENT_ID
   ```
3. Restart terminal/IDE after setting environment variables

### Token Invalid
1. Verify refresh token hasn't expired
2. Check client ID and secret match
3. Ensure API domains are correct for your region

### File Permissions
On Unix/Linux, restrict .env file:

```bash
chmod 600 /Users/jimmeeygondaa/zoho-automate-attendance/.env
```

---

## Environment Variables Summary

| Variable | Required | Format | Example |
|----------|----------|--------|---------|
| `ZOHO_CLIENT_ID` | Yes | String | `1000.D5RD137I...` |
| `ZOHO_CLIENT_SECRET` | Yes | String | `d1a79031982c7d...` |
| `ZOHO_REFRESH_TOKEN` | Yes | String | `1000.7c8573a28...` |
| `ZOHO_ACCOUNT_DOMAIN` | No | URL | `https://accounts.zoho.in` |
| `ZOHO_PEOPLE_API_DOMAIN` | No | URL | `https://people.zoho.in` |
| `CHECKIN_TIME` | No | HH:MM | `09:00` |
| `CHECKOUT_TIME` | No | HH:MM | `18:00` |
| `TIMEZONE` | No | IANA TZ | `Asia/Kolkata` |

---

## Quick Setup Checklist

- [ ] Choose configuration method (embedded/env/.env file)
- [ ] Set credentials
- [ ] Test token refresh: `npm run status`
- [ ] Create first schedule: `npm run add`
- [ ] Test manual checkin: `npm run checkin`
- [ ] Start scheduler: `npm start`
- [ ] Monitor logs: `tail -f attendance.log`

---

**Environment Setup Guide v1.0** | Last Updated: 2025-12-04
