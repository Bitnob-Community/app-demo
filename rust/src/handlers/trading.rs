use axum::{
    extract::{Json, State},
    http::StatusCode,
    response::Json as ResponseJson,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::AppState;

#[derive(Debug, Deserialize)]
pub struct TradeRequest {
    pub side: String,
    pub asset: String,
    pub currency: String,
    pub amount: f64,
}

#[derive(Debug, Serialize)]
pub struct TradeResponse {
    pub message: String,
    #[serde(rename = "quoteId")]
    pub quote_id: Option<String>,
    pub reference: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct CreateTradeRequest {
    pub side: String,
    pub asset: String,
    pub currency: String,
    pub amount: f64,
    pub reference: String,
}

#[derive(Debug, Serialize)]
pub struct FinalizeTradeRequest {
    #[serde(rename = "quoteId")]
    pub quote_id: String,
}

#[derive(Debug, Deserialize)]
pub struct ApiResponse<T> {
    pub data: T,
}

#[derive(Debug, Deserialize)]
pub struct TradeData {
    #[serde(rename = "quoteId")]
    pub quote_id: String,
}

pub async fn create_trade(
    State(state): State<AppState>,
    Json(payload): Json<TradeRequest>,
) -> Result<ResponseJson<TradeResponse>, (StatusCode, ResponseJson<TradeResponse>)> {
    let trade_reference = Uuid::new_v4().to_string();
    
    let trade_request = CreateTradeRequest {
        side: payload.side,
        asset: payload.asset,
        currency: payload.currency,
        amount: payload.amount,
        reference: trade_reference.clone(),
    };
    
    let response = state
        .http_client
        .post(&format!("{}/trade", state.config.api_url))
        .header("Authorization", format!("Bearer {}", state.config.bitnob_secret_key))
        .header("Content-Type", "application/json")
        .json(&trade_request)
        .send()
        .await;
    
    let response = match response {
        Ok(response) => response,
        Err(err) => {
            tracing::error!("Failed to create trade: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(TradeResponse {
                    message: format!("Trade creation failed: {}", err),
                    quote_id: None,
                    reference: Some(trade_reference),
                }),
            ));
        }
    };
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_default();
        tracing::error!("Trade creation failed: {}", error_text);
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            ResponseJson(TradeResponse {
                message: format!("Trade creation failed: {}", error_text),
                quote_id: None,
                reference: Some(trade_reference),
            }),
        ));
    }
    
    let trade_data: ApiResponse<TradeData> = match response.json().await {
        Ok(data) => data,
        Err(err) => {
            tracing::error!("Failed to parse trade response: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(TradeResponse {
                    message: format!("Failed to parse trade response: {}", err),
                    quote_id: None,
                    reference: Some(trade_reference),
                }),
            ));
        }
    };
    
    tracing::info!("Trade created successfully: {:?}", trade_data);
    
    Ok(ResponseJson(TradeResponse {
        message: "Trade created successfully. Use the quoteId to finalize the trade.".to_string(),
        quote_id: Some(trade_data.data.quote_id),
        reference: Some(trade_reference),
    }))
}

pub async fn finalize_trade(
    State(state): State<AppState>,
    Json(payload): Json<serde_json::Value>,
) -> Result<ResponseJson<TradeResponse>, (StatusCode, ResponseJson<TradeResponse>)> {
    let quote_id = payload["quoteId"].as_str().unwrap_or_default().to_string();
    
    let finalize_request = FinalizeTradeRequest {
        quote_id: quote_id.clone(),
    };
    let response = state
        .http_client
        .post(&format!("{}/trade/finalize", state.config.api_url))
        .header("Authorization", format!("Bearer {}", state.config.bitnob_secret_key))
        .header("Content-Type", "application/json")
        .json(&finalize_request)
        .send()
        .await;
    
    let response = match response {
        Ok(response) => response,
        Err(err) => {
            tracing::error!("Failed to finalize trade: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(TradeResponse {
                    message: format!("Trade finalization failed: {}", err),
                    quote_id: Some(quote_id.clone()),
                    reference: None,
                }),
            ));
        }
    };
    
    if !response.status().is_success() {
        let error_text = response.text().await.unwrap_or_default();
        tracing::error!("Trade finalization failed: {}", error_text);
        return Err((
            StatusCode::INTERNAL_SERVER_ERROR,
            ResponseJson(TradeResponse {
                message: format!("Trade finalization failed: {}", error_text),
                quote_id: Some(quote_id.clone()),
                reference: None,
            }),
        ));
    }
    
    let finalize_data: serde_json::Value = match response.json().await {
        Ok(data) => data,
        Err(err) => {
            tracing::error!("Failed to parse finalize response: {}", err);
            return Err((
                StatusCode::INTERNAL_SERVER_ERROR,
                ResponseJson(TradeResponse {
                    message: format!("Failed to parse finalize response: {}", err),
                    quote_id: Some(quote_id.clone()),
                    reference: None,
                }),
            ));
        }
    };
    
    tracing::info!("Trade finalized successfully: {:?}", finalize_data);
    
    Ok(ResponseJson(TradeResponse {
        message: "Trade finalized successfully.".to_string(),
        quote_id: Some(quote_id),
        reference: None,
    }))
}