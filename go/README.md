# Bitnob Go Payout Demo

A Go implementation of the Bitnob payout API demo using Gin framework.

## Features

- **3-step payout process**: Quote → Initialize → Finalize
- **Web interface**: Simple HTML form for testing payouts
- **Error handling**: Comprehensive error handling with detailed logging
- **Environment configuration**: Uses `.env` file for API credentials
- **RESTful API**: Clean API endpoints following REST conventions

## Prerequisites

- Go 1.21 or higher
- Bitnob API credentials

## Setup

1. **Clone and navigate to the Go directory:**
   ```bash
   cd go
   ```

2. **Install dependencies:**
   ```bash
   go mod tidy
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your environment variables in `.env`:**
   ```
   API_URL=https://api.bitnob.com
   BITNOB_SECRET_KEY=your_actual_secret_key_here
   ```

## Running the Application

```bash
go run .
```

The server will start on `http://localhost:8080`

## API Endpoints

### Create Payout
- **URL**: `POST /api/v1/payouts`
- **Content-Type**: `application/json`

**Request Body:**
```json
{
  "name": "John Doe",
  "accountNumber": "1234567890"
}
```

**Response:**
```json
{
  "message": "Payout process started. Check the webhook site for final confirmation.",
  "reference": "uuid-generated-reference"
}
```

## How It Works

The payout process follows these steps:

1. **Quote Generation**: Creates a quote for USDT to NGN conversion
2. **Initialization**: Sets up the payout with beneficiary details
3. **Finalization**: Executes the payout transaction

## Project Structure

```
go/
├── main.go           # Main application entry point
├── payouts.go        # Payout handlers and logic
├── go.mod           # Go module dependencies
├── .env.example     # Environment variables template
├── static/
│   └── index.html   # Web interface
└── README.md        # This file
```

## Dependencies

- **gin-gonic/gin**: Web framework
- **google/uuid**: UUID generation
- **joho/godotenv**: Environment variable loading

## Error Handling

The application includes comprehensive error handling for:
- Invalid JSON requests
- Missing environment variables
- API communication failures
- Response parsing errors

All errors are logged with detailed information and return appropriate HTTP status codes.