# Bitnob API Workshop - Setup Guide

## Pre-Workshop Setup Checklist

Please complete these steps **before** attending the workshop to maximize hands-on coding time.

### 1. Required Software

#### Development Tools
- [ ] **Git** - [Download](https://git-scm.com/downloads)
- [ ] **Code Editor** - VS Code recommended ([Download](https://code.visualstudio.com/))
- [ ] **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- [ ] **Postman** - [Download](https://www.postman.com/downloads/)

#### For Lab 3 (LLM Integration)
- [ ] **Python 3.8+** - [Download](https://www.python.org/downloads/)
- [ ] **pip** (comes with Python)

### 2. Bitnob Account Setup

1. **Create a Bitnob Developer Account**
   - Go to [https://app.bitnob.co/accounts/signup](https://app.bitnob.co/accounts/signup)
   - Complete registration and email verification
   - Enable 2FA (recommended)

2. **Create Sandbox Account for Testing**
   - Go to [https://sandboxapp.bitnob.co/accounts/signup](https://sandboxapp.bitnob.co/accounts/signup)
   - This is your testing environment for the workshop
   - Complete registration with sandbox account

3. **Access Developer Dashboard**
   - Login to your sandbox account
   - Navigate to Settings → API Keys
   - Generate and save your API credentials:
     - Client ID
     - Secret Key
   - Note: Bitnob uses HMAC-based authentication

### 3. Environment Configuration

Create a `.env` file in your project directory:

```bash
BITNOB_CLIENT_ID=your_client_id_here
BITNOB_SECRET_KEY=your_secret_key_here
BITNOB_BASE_URL=https://sandboxapi.bitnob.co/api/v1
```

### 4. Test Your Setup

#### Quick API Test
For testing authentication, we'll create a proper HMAC signature during the workshop. The test endpoint is:

```bash
GET https://sandboxapi.bitnob.co/api/v1/me
```

This requires HMAC headers:
- `x-auth-client`: Your Client ID
- `x-auth-timestamp`: Current timestamp
- `x-auth-nonce`: Unique identifier
- `x-auth-signature`: HMAC signature

We'll implement the signature generation together in the workshop.

#### Node.js Setup Test
Install dependencies:
```bash
npm init -y
npm install axios dotenv crypto
```

Create `test-setup.js`:
```javascript
require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

function generateSignature(method, path, timestamp, nonce, body = '') {
  const message = `${method}${path}${timestamp}${nonce}${body}`;
  return crypto
    .createHmac('sha256', process.env.BITNOB_SECRET_KEY)
    .update(message)
    .digest('hex');
}

async function testConnection() {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const method = 'GET';
  const path = '/api/v1/me';
  
  const signature = generateSignature(method, path, timestamp, nonce);
  
  try {
    const response = await axios.get(`${process.env.BITNOB_BASE_URL}/me`, {
      headers: {
        'x-auth-client': process.env.BITNOB_CLIENT_ID,
        'x-auth-timestamp': timestamp,
        'x-auth-nonce': nonce,
        'x-auth-signature': signature,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Setup successful! Connected to Bitnob API');
    console.log('Account:', response.data.data.email);
  } catch (error) {
    console.error('❌ Setup failed:', error.response?.data || error.message);
  }
}

testConnection();
```

Run: `node test-setup.js`

### 5. Workshop Materials

Workshop materials will be available in this repository before the event. Check the Telegram group for updates.

### 6. Postman Collection

1. Download the [Bitnob API Postman Collection](https://bitnob.dev/postman-collection)
2. Import into Postman
3. Configure environment variables in Postman:
   - `client_id`: Your Client ID
   - `secret_key`: Your Secret Key
   - `base_url`: https://sandboxapi.bitnob.co/api/v1
   - Note: You'll need to configure pre-request scripts for HMAC signatures

### 7. Goose Setup (for Lab 3)

#### Install Goose:

**macOS:**
```bash
# Option 1: Using Homebrew
brew install --cask block-goose

# Option 2: Using CLI installer
curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | bash
```

**Linux:**
```bash
# Using CLI installer
curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | bash
```

**Windows:**
```bash
# Using Git Bash or PowerShell
curl -fsSL https://github.com/block/goose/releases/download/stable/download_cli.sh | bash
```

#### Verify Goose installation:
```bash
goose --version
```

#### Configure Goose:
You'll need an LLM provider API key (OpenAI, Anthropic, etc.). We'll configure this together during the workshop.

### 8. Mobile Money Test Accounts

For the workshop, we'll provide test mobile money numbers for different countries:
- **Uganda (UGX)**: Will be provided at workshop
- **Nigeria (NGN)**: Will be provided at workshop
- **Kenya (KES)**: Will be provided at workshop

### 9. Documentation Access

Bookmark these resources:
- [Bitnob API Documentation](https://www.bitnob.dev/docs/genesis/overview)
- [Bitnob API Reference ](https://www.bitnob.dev/api-reference/authentication)


### 10. Troubleshooting

#### Common Issues:

**API Authentication Issues:**
- Ensure no extra spaces in your Client ID or Secret Key
- Check if using sandbox vs production keys
- Verify the timestamp is in milliseconds
- Ensure the signature generation matches Bitnob's specification

**Network Issues:**
- Some corporate networks block API calls
- Have a mobile hotspot as backup
- Test from home network before workshop

**Node.js Issues:**
```bash
# Clear npm cache
npm cache clean --force
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### 11. Day-of Checklist

Bring to the workshop:
- [ ] Laptop with all software installed
- [ ] Power adapter
- [ ] API credentials saved securely
- [ ] Backup internet connection (mobile hotspot)
- [ ] Questions about your specific use case

### 12. Support Channels

- **Telegram Group**: [https://t.me/+QZEsH1DBhC04YjE0](https://t.me/+QZEsH1DBhC04YjE0)
- **Pre-workshop Support**: Ask in Telegram group
- **Workshop Day Support**: On-site team

---

## Next Steps

Once you've completed this setup:
1. Join the Telegram group: [https://t.me/+QZEsH1DBhC04YjE0](https://t.me/+QZEsH1DBhC04YjE0)
2. Test your API connection 24 hours before the workshop
3. Check this repository for workshop materials updates

If you encounter any issues during setup, please ask in the Telegram group with:
- Your error message
- Your operating system
- Workshop location you're attending

---

**Note**: Complete this setup at least 24 hours before the workshop. This ensures we can help resolve any issues before the event.