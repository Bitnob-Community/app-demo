#!/usr/bin/env python3

import os
import json
import uuid
import requests
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/v1/payouts', methods=['POST'])
def create_payout():
    try:
        data = request.get_json()
        
        if not data or 'name' not in data or 'accountNumber' not in data:
            return jsonify({
                'message': 'Invalid request: name and accountNumber are required'
            }), 400
        
        payout_reference = str(uuid.uuid4())
        
        # Get environment variables
        api_url = os.getenv('API_URL')
        secret_key = os.getenv('BITNOB_SECRET_KEY')
        
        if not api_url or not secret_key:
            return jsonify({
                'message': 'Missing API configuration',
                'reference': payout_reference
            }), 500
        
        # Step 1: Get quote
        quote_request = {
            'source': 'offchain',
            'fromAsset': 'usdt',
            'toCurrency': 'ngn',
            'settlementAmount': 100000
        }
        
        quote_response = make_api_call(f"{api_url}/payouts/quotes", secret_key, quote_request)
        quote_id = quote_response['data']['quoteId']
        
        print(f"[STEP 1] Quote Generated: {quote_response}")
        
        # Step 2: Initialize payout
        initialize_request = {
            'quoteId': quote_id,
            'customerId': 'e22795d9-23f6-48e6-8b30-be5718abd876',
            'country': 'NG',
            'reference': payout_reference,
            'paymentReason': 'Bitnob Nigeria Faucet',
            'beneficiary': {
                'type': 'BANK',
                'accountName': data['name'],
                'bankName': 'OPAY',
                'accountNumber': data['accountNumber']
            }
        }
        
        init_response = make_api_call(f"{api_url}/payouts/initialize", secret_key, initialize_request)
        print(f"[STEP 2] Quote Initialized: {init_response}")
        
        # Step 3: Finalize payout
        finalize_request = {
            'quoteId': quote_id
        }
        
        finalize_response = make_api_call(f"{api_url}/payouts/finalize", secret_key, finalize_request)
        print(f"[STEP 3] Quote Finalized: {finalize_response}")
        
        return jsonify({
            'message': 'Payout process started. Check the webhook site for final confirmation.',
            'reference': payout_reference
        })
        
    except Exception as e:
        print(f"Payout failed: {str(e)}")
        return jsonify({
            'message': f'Payout failed: {str(e)}',
            'reference': payout_reference if 'payout_reference' in locals() else None
        }), 500

def make_api_call(url, secret_key, payload):
    headers = {
        'Authorization': f'Bearer {secret_key}',
        'Content-Type': 'application/json'
    }
    
    response = requests.post(url, json=payload, headers=headers, timeout=30)
    
    if response.status_code >= 400:
        raise Exception(f'API error ({response.status_code}): {response.text}')
    
    return response.json()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)