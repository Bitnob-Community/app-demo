<?php

function generateUUID() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function createPayout() {
    header('Content-Type: application/json');
    
    // Parse JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['name']) || !isset($input['accountNumber'])) {
        http_response_code(400);
        echo json_encode([
            'message' => 'Invalid request: name and accountNumber are required'
        ]);
        return;
    }
    
    $payoutReference = generateUUID();
    
    // Get environment variables
    $apiURL = getenv('API_URL');
    $secretKey = getenv('BITNOB_SECRET_KEY');
    
    if (!$apiURL || !$secretKey) {
        http_response_code(500);
        echo json_encode([
            'message' => 'Missing API configuration',
            'reference' => $payoutReference
        ]);
        return;
    }
    
    try {
        // Step 1: Get quote
        $quoteRequest = [
            'source' => 'offchain',
            'fromAsset' => 'usdt',
            'toCurrency' => 'ngn',
            'settlementAmount' => 100000
        ];
        
        $quoteData = makeAPICall($apiURL . '/payouts/quotes', $secretKey, $quoteRequest);
        $quote = json_decode($quoteData, true);
        
        if (!$quote || !isset($quote['data']['quoteId'])) {
            throw new Exception('Invalid quote response');
        }
        
        error_log('[STEP 1] Quote Generated: ' . json_encode($quote));
        
        // Step 2: Initialize payout
        $initializeRequest = [
            'quoteId' => $quote['data']['quoteId'],
            'customerId' => 'e22795d9-23f6-48e6-8b30-be5718abd876',
            'country' => 'NG',
            'reference' => $payoutReference,
            'paymentReason' => 'Bitnob Nigeria Faucet',
            'beneficiary' => [
                'type' => 'BANK',
                'accountName' => $input['name'],
                'bankName' => 'OPAY',
                'accountNumber' => $input['accountNumber']
            ]
        ];
        
        $initData = makeAPICall($apiURL . '/payouts/initialize', $secretKey, $initializeRequest);
        error_log('[STEP 2] Quote Initialized: ' . $initData);
        
        // Step 3: Finalize payout
        $finalizeRequest = [
            'quoteId' => $quote['data']['quoteId']
        ];
        
        $finalizeData = makeAPICall($apiURL . '/payouts/finalize', $secretKey, $finalizeRequest);
        error_log('[STEP 3] Quote Finalized: ' . $finalizeData);
        
        http_response_code(200);
        echo json_encode([
            'message' => 'Payout process started. Check the webhook site for final confirmation.',
            'reference' => $payoutReference
        ]);
        
    } catch (Exception $e) {
        error_log('Payout failed: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'message' => 'Payout failed: ' . $e->getMessage(),
            'reference' => $payoutReference
        ]);
    }
}

function makeAPICall($url, $secretKey, $payload) {
    $ch = curl_init();
    
    $headers = [
        'Authorization: Bearer ' . $secretKey,
        'Content-Type: application/json'
    ];
    
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    
    curl_close($ch);
    
    if ($error) {
        throw new Exception('cURL error: ' . $error);
    }
    
    if ($httpCode >= 400) {
        throw new Exception('API error (' . $httpCode . '): ' . $response);
    }
    
    return $response;
}
?>