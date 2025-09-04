# Bitnob API Demo - Rust Implementation

A Rust implementation of the Bitnob API demo using Axum web framework, showcasing payment processing, trading, and payout functionalities.

## 🚀 Features

This Rust demo implements:

1. **Payout System** - Send payments to bank accounts and mobile money
2. **Trading System** - Buy/sell cryptocurrency with automatic conversions

## 🛠️ Getting Started

### Prerequisites
- **Rust 1.70+** - [Install Rust](https://rustup.rs/)
- **Bitnob sandbox account** - [Create account](https://sandboxapp.bitnob.co/accounts/signup)

### Installation

1. Clone and navigate to the Rust directory:
```bash
git clone <repository-url>
cd app-demo/rust
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your credentials:
```bash
API_URL=https://sandboxapi.bitnob.co
BITNOB_SECRET_KEY=your_secret_key_here
```

4. Run the application:
```bash
cargo run
```

The server will start on `http://localhost:3001`

## 📡 API Endpoints

### Payouts
```bash
POST /api/v1/payouts
Content-Type: application/json

{
  "name": "John Doe",
  "accountNumber": "1234567890"
}
```

### Trading
```bash
# Create trade
POST /api/v1/trade
Content-Type: application/json

{
  "side": "buy",
  "asset": "bitcoin",
  "currency": "ngn",
  "amount": 50000
}

# Finalize trade
POST /api/v1/trade/finalize
Content-Type: application/json

{
  "quoteId": "quote_id_from_create_trade"
}
```

## 🏗️ Project Structure

```
src/
├── main.rs              # Application entry point and routing
├── config.rs            # Environment configuration
└── handlers/
    ├── mod.rs           # Handler modules
    ├── payouts.rs       # Payout functionality
    └── trading.rs       # Trading functionality
```

## 🔧 Development

### Build
```bash
cargo build
```

### Run in development mode with auto-reload
```bash
cargo watch -x run
```

### Run tests
```bash
cargo test
```

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `API_URL` | Bitnob API base URL | `https://sandboxapi.bitnob.co` |
| `BITNOB_SECRET_KEY` | Your Bitnob secret key | `sk_sandbox_...` |


## 📄 License

This demo is open source and available under the MIT License.