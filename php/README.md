# Bitnob PHP Payout Demo

A PHP implementation of the Bitnob payout API integration, providing a complete three-step payout process: quote generation, initialization, and finalization.

## Features

- **Complete Payout Flow**: Implements the full Bitnob payout process
- **Environment Configuration**: Secure API key and URL management
- **Error Handling**: Comprehensive error handling with detailed logging
- **CORS Support**: Ready for frontend integration
- **Responsive UI**: Clean, modern interface with loading states

## Requirements

- PHP 7.4 or higher
- cURL extension
- JSON extension

## Installation

1. Clone the repository and navigate to the PHP directory:
```bash
cd php
```

2. Install dependencies (optional, since we're using native PHP):
```bash
composer install
```

## Configuration

Create a `.env` file in the php directory:

```env
API_URL=https://api.bitnob.co/api/v1
BITNOB_SECRET_KEY=your_secret_key_here
```

## Running the Application

Start the PHP development server:

```bash
php -S localhost:8080 index.php
```

Or use the composer script:

```bash
composer run start
```

Visit `http://localhost:8080` in your browser.

## API Endpoints

### POST /api/v1/payouts

Creates a complete payout transaction.

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
    "reference": "uuid-reference-string"
}
```

## Project Structure

```
php/
├── index.php          # Main application router
├── payouts.php        # Payout functionality
├── static/
│   └── index.html    # Frontend interface
├── composer.json     # PHP project configuration
└── README.md        # This file
```

## Implementation Details

### Three-Step Payout Process

1. **Quote Generation**: Request a quote for the payout
2. **Initialization**: Initialize the payout with beneficiary details
3. **Finalization**: Complete the payout process

### Error Handling

- Validates required fields (name and accountNumber)
- Handles API errors with detailed logging
- Returns appropriate HTTP status codes
- Includes reference IDs for tracking

### Security Features

- Environment variable configuration
- SSL verification for API calls
- Request timeout handling
- Input validation

## Development

The application uses native PHP without external frameworks, making it lightweight and easy to deploy on any PHP-enabled server.

### Logging

Error logs are written to PHP's error log. Enable error logging in your PHP configuration to see detailed debug information.

## Testing

Test the payout functionality by filling out the form on the homepage. The application will:

1. Validate the input
2. Generate a payout reference
3. Execute the three-step Bitnob API flow
4. Display the result with reference ID
