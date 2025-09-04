# Bitnob API Demo

A comprehensive demonstration of Bitnob's payment API capabilities, showcasing Bitcoin, stablecoins, and financial infrastructure integration.

## 🚀 About This Demo

This demo application shows how to integrate Bitnob's payment infrastructure into your applications. It features real-world implementations of cryptocurrency payments, virtual card issuing, and cross-border financial services for developers building fintech solutions.

## 🎯 API Features Demonstrated

### Core Payment Technologies
- **Bitcoin & Lightning Network** - Instant, low-fee payments at scale
- **USDT/Stablecoins** - Digital dollars for stable value transfers
- **Cross-border Payments** - Seamless money movement across Africa
- **Virtual Card Issuing** - Programmatic card creation and management

### Implementation Examples
- **Payment Processing** - Accept and process crypto payments
- **Currency Conversion** - Convert between crypto and local currencies
- **Disbursement Systems** - Send payments to bank accounts and mobile money
- **Card Management** - Issue, fund, and manage virtual cards

## 💻 Demo Features

This demo includes complete implementations of:

1. **Payment Gateway** - Accept crypto payments and convert to local currency
2. **Disbursement System** - Send payments to mobile money and bank accounts
3. **Card Program** - Issue virtual cards funded by cryptocurrency
4. **Trading System** - Buy/sell cryptocurrency with automatic conversions

## 🛠️ Getting Started

### Prerequisites
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/downloads) 
- **Code Editor** - VS Code recommended ([Download](https://code.visualstudio.com/))
- **Postman** (optional) - [Download](https://www.postman.com/downloads/)

### 1. Account Setup

1. **Create a Bitnob Sandbox Account**
   - Go to [https://sandboxapp.bitnob.co/accounts/signup](https://sandboxapp.bitnob.co/accounts/signup)
   - Complete registration and email verification
   - Enable 2FA (recommended)

2. **Get API Credentials**
   - Login to your sandbox account
   - Navigate to Settings → API Keys
   - Generate and save your API credentials:
     - Client ID
     - Secret Key

### 2. Installation

```bash
git clone <repository-url>
cd app-demo/labs
npm install
cp .env.example .env
```

### 3. Environment Configuration

Edit your `.env` file with your API credentials:

```bash
# Database (for demo data storage)
DATABASE_URL="postgresql://postgres:password@localhost:5432/bitnob_demo"

# Bitnob API Configuration
API_URL="https://sandboxapi.bitnob.co/api/v1"
BITNOB_CLIENT_ID="your_client_id_here"
BITNOB_SECRET_KEY="your_secret_key_here"
```

### 4. Start the Application

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the demo.

### 5. Test Your Setup

You can test your API connection using the test script:

```javascript
// test-api.js
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
    const response = await axios.get(`${process.env.API_URL}/me`, {
      headers: {
        'x-auth-client': process.env.BITNOB_CLIENT_ID,
        'x-auth-timestamp': timestamp,
        'x-auth-nonce': nonce,
        'x-auth-signature': signature,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Setup successful!');
    console.log('Account:', response.data.data.email);
  } catch (error) {
    console.error('❌ Setup failed:', error.response?.data || error.message);
  }
}

testConnection();
```

## 📚 API Resources

### Documentation
- [API Documentation](https://www.bitnob.dev/docs/genesis/overview)
- [API Reference](https://www.bitnob.dev/api-reference/authentication)
- [Developer Dashboard](https://sandboxapp.bitnob.co)

### Support
- **GitHub**: Open issues in this repository
- **Email**: developers@bitnob.com
- **Telegram**: [Join our developer community](https://t.me/+QZEsH1DBhC04YjE0)

## 🏗️ Architecture

This demo includes:
- RESTful API integrations
- Webhook handling for real-time updates
- Secure payment processing
- Error handling and retry logic
- Production-ready code patterns

## 📄 License

This demo is open source and available under the MIT License. Feel free to use, modify, and share.

---

**Ready to integrate Bitnob's payment infrastructure?** Run this demo locally and start building your financial application today.

[View API Docs →](https://www.bitnob.dev/docs/genesis/overview)