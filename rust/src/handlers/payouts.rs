use axum::{
    extract::{Json, State},
    http::StatusCode,
    response::Json as ResponseJson,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::AppState;

#[derive(Debug, Deserialize)]
pub struct PayoutRequest {
    pub name: String,
    #[serde(rename = "accountNumber")]
    pub account_number: String,
}

#[derive(Debug, Serialize)]
pub struct PayoutResponse {
    pub message: String,
    pub reference: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct QuoteRequest {
    pub source: String,
    #[serde(rename = "fromAsset")]
    pub from_asset: String,
    #[serde(rename = "toCurrency")]
    pub to_currency: String,
    #[serde(rename = "settlementAmount")]
    pub settlement_amount: u64,
}

#[derive(Debug, Serialize)]
pub struct InitializeRequest {
    #[serde(rename = "quoteId")]
    pub quote_id: String,
    #[serde(rename = "customerId")]
    pub customer_id: String,
    pub country: String,
    pub reference: String,
    #[serde(rename = "paymentReason")]
    pub payment_reason: String,
    pub beneficiary: Beneficiary,
}

#[derive(Debug, Serialize)]
pub struct Beneficiary {
    #[serde(rename = "type")]
    pub beneficiary_type: String,
    #[serde(rename = "accountName")]
    pub account_name: String,
    #[serde(rename = "bankName")]
    pub bank_name: String,
    #[serde(rename = "accountNumber")]
    pub account_number: String,
}

#[derive(Debug, Serialize)]
pub struct FinalizeRequest {
    #[serde(rename = "quoteId")]
    pub quote_id: String,
}

#[derive(Debug, Deserialize)]
pub struct ApiResponse<T> {
    pub data: T,
}

#[derive(Debug, Deserialize)]
pub struct QuoteData {
    #[serde(rename = "quoteId")]
    pub quote_id: String,
}

pub async fn create_payout(
    State(state): State<AppState>,
    Json(payload): Json<PayoutRequest>,
) -> Result<ResponseJson<PayoutResponse>, (StatusCode, ResponseJson<PayoutResponse>)> {
    let payout_reference = Uuid::new_v4().to_string();
    
    // Step 1: Get quote
    let quote_request = QuoteRequest {
        source: "offchain".to_string(),
        from_asset: "usdt".to_string(),
        to_currency: "ngn".to_string(),
        settlement_amount: 200000,
    };
    
    let quote_response = state
        .http_client
        .post(&format!("{}/payouts/quotes", state.config.api_url))
        .header("Authorization", format!("Bearer {}", state.config.bitnob_secret_key))
        .header("Content-Type", "application/json")
        .json(&quote_request)
        .send()
        .await;
    
    let quote_response = match quote_response {
        Ok(response) => response,
        Err(err) => {
            tracing::error!("Failed to get quote: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(PayoutResponse {
                    message: format!("Payout failed: {}", err),
                    reference: Some(payout_reference),
                }),
            ));
        }
    };
    
    if !quote_response.status().is_success() {
        let error_text = quote_response.text().await.unwrap_or_default();
        tracing::error!("Quote request failed: {}", error_text);
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            ResponseJson(PayoutResponse {
                message: format!("Quote failed: {}", error_text),
                reference: Some(payout_reference),
            }),
        ));
    }
    
    let quote: ApiResponse<QuoteData> = match quote_response.json().await {
        Ok(data) => data,
        Err(err) => {
            tracing::error!("Failed to parse quote response: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(PayoutResponse {
                    message: format!("Failed to parse quote: {}", err),
                    reference: Some(payout_reference),
                }),
            ));
        }
    };
    
    tracing::info!("[STEP 1] Quote Generated: {:?}", quote);
    
    // Step 2: Initialize payout
    let initialize_request = InitializeRequest {
        quote_id: quote.data.quote_id.clone(),
        customer_id: "e22795d9-23f6-48e6-8b30-be5718abd876".to_string(),
        country: "NG".to_string(),
        reference: payout_reference.clone(),
        payment_reason: "Bitnob Nigeria Faucet".to_string(),
        beneficiary: Beneficiary {
            beneficiary_type: "BANK".to_string(),
            account_name: payload.name,
            bank_name: "OPAY".to_string(),
            account_number: payload.account_number,
        },
    };
    
    let init_response = state
        .http_client
        .post(&format!("{}/payouts/initialize", state.config.api_url))
        .header("Authorization", format!("Bearer {}", state.config.bitnob_secret_key))
        .header("Content-Type", "application/json")
        .json(&initialize_request)
        .send()
        .await;
    
    let init_response = match init_response {
        Ok(response) => response,
        Err(err) => {
            tracing::error!("Failed to initialize payout: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(PayoutResponse {
                    message: format!("Initialize failed: {}", err),
                    reference: Some(payout_reference),
                }),
            ));
        }
    };
    
    if !init_response.status().is_success() {
        let error_text = init_response.text().await.unwrap_or_default();
        tracing::error!("Initialize request failed: {}", error_text);
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            ResponseJson(PayoutResponse {
                message: format!("Initialize failed: {}", error_text),
                reference: Some(payout_reference),
            }),
        ));
    }
    
    let initialize_data: serde_json::Value = match init_response.json().await {
        Ok(data) => data,
        Err(err) => {
            tracing::error!("Failed to parse initialize response: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(PayoutResponse {
                    message: format!("Failed to parse initialize: {}", err),
                    reference: Some(payout_reference),
                }),
            ));
        }
    };
    
    tracing::info!("[STEP 2] Quote Initialized: {:?}", initialize_data);
    
    // Step 3: Finalize payout
    let finalize_request = FinalizeRequest {
        quote_id: quote.data.quote_id.clone(),
    };
    
    let finalize_response = state
        .http_client
        .post(&format!("{}/payouts/finalize", state.config.api_url))
        .header("Authorization", format!("Bearer {}", state.config.bitnob_secret_key))
        .header("Content-Type", "application/json")
        .json(&finalize_request)
        .send()
        .await;
    
    let finalize_response = match finalize_response {
        Ok(response) => response,
        Err(err) => {
            tracing::error!("Failed to finalize payout: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(PayoutResponse {
                    message: format!("Finalize failed: {}", err),
                    reference: Some(payout_reference),
                }),
            ));
        }
    };
    
    if !finalize_response.status().is_success() {
        let error_text = finalize_response.text().await.unwrap_or_default();
        tracing::error!("Finalize request failed: {}", error_text);
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            ResponseJson(PayoutResponse {
                message: format!("Finalize failed: {}", error_text),
                reference: Some(payout_reference),
            }),
        ));
    }
    
    let finalize_data: serde_json::Value = match finalize_response.json().await {
        Ok(data) => data,
        Err(err) => {
            tracing::error!("Failed to parse finalize response: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(PayoutResponse {
                    message: format!("Failed to parse finalize: {}", err),
                    reference: Some(payout_reference),
                }),
            ));
        }
    };
    
    tracing::info!("[STEP 3] Quote Finalized: {:?}", finalize_data);
    
    Ok(ResponseJson(PayoutResponse {
        message: "Payout process started. Check the webhook site for final confirmation.".to_string(),
        reference: Some(payout_reference),
    }))
}