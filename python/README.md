# Bitnob Python Payout Demo

A Python Flask implementation of the Bitnob payout API integration, providing a complete three-step payout process: quote generation, initialization, and finalization.

## Features

- **Complete Payout Flow**: Implements the full Bitnob payout process
- **Flask Framework**: Simple, lightweight web framework
- **Environment Configuration**: Secure API key and URL management
- **Error Handling**: Comprehensive error handling with detailed logging
- **CORS Support**: Ready for frontend integration
- **Responsive UI**: Clean, modern interface with loading states

## Requirements

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Clone the repository and navigate to the Python directory:
```bash
cd python
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

Create a `.env` file in the python directory:

```env
API_URL=https://api.bitnob.co/api/v1
BITNOB_SECRET_KEY=your_secret_key_here
```

## Running the Application

Start the Flask development server:

```bash
python app.py
```

The application will be available at `http://localhost:8080`

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
python/
├── app.py              # Main Flask application
├── static/
│   └── index.html     # Frontend interface
├── requirements.txt   # Python dependencies
├── .env              # Environment variables (create this)
└── README.md         # This file
```

## Implementation Details

### Three-Step Payout Process

1. **Quote Generation**: Request a quote for the payout
2. **Initialization**: Initialize the payout with beneficiary details
3. **Finalization**: Complete the payout process

### Flask Features

- **Static File Serving**: Serves the HTML interface from `/static`
- **JSON API**: RESTful endpoint for payout processing
- **CORS Enabled**: Cross-origin requests supported
- **Environment Variables**: Secure configuration management

### Error Handling

- Validates required fields (name and accountNumber)
- Handles API errors with detailed logging
- Returns appropriate HTTP status codes
- Includes reference IDs for tracking
- Console logging for debugging

## Development

The application uses Flask, a lightweight WSGI web application framework. It's designed to be simple and easy to understand while demonstrating production-ready patterns.

### Dependencies

- **Flask**: Web framework for routing and request handling
- **Flask-CORS**: Cross-origin resource sharing support
- **requests**: HTTP library for API calls
- **python-dotenv**: Environment variable management

## Testing

Test the payout functionality by:

1. Starting the server with `python app.py`
2. Opening `http://localhost:8080` in your browser
3. Filling out the payout form
4. Observing the three-step API process in console logs

## Production Deployment

For production deployment, consider:

- Using a production WSGI server like Gunicorn
- Setting up proper logging configuration
- Implementing rate limiting
- Adding request validation middleware
- Using environment-specific configuration

Example with Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8080 app:app
```

## Troubleshooting

- **Import Errors**: Ensure all dependencies are installed with `pip install -r requirements.txt`
- **API Errors**: Check that your `.env` file has correct API credentials
- **Port Issues**: The app runs on port 8080 by default, ensure it's available
- **CORS Issues**: Flask-CORS is configured to allow all origins for development