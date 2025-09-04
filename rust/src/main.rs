use axum::{
    routing::{get, post},
    Router,
};
use std::sync::Arc;
use tower_http::{cors::CorsLayer, services::ServeDir};
use tracing::info;
use tracing_subscriber::fmt::init;

mod config;
mod handlers;

use config::Config;

#[derive(Clone)]
pub struct AppState {
    pub config: Arc<Config>,
    pub http_client: reqwest::Client,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    init();
    
    let config = Arc::new(Config::from_env()?);
    
    let http_client = reqwest::Client::new();
    
    let state = AppState {
        config,
        http_client,
    };
    
    let app = Router::new()
        .route("/api/v1/payouts", post(handlers::payouts::create_payout))
        .route("/api/v1/trade", post(handlers::trading::create_trade))
        .route("/api/v1/trade/finalize", post(handlers::trading::finalize_trade))
        .nest_service("/", ServeDir::new("static"))
        .layer(CorsLayer::permissive())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await?;
        
    info!("Server running on http://localhost:3001");
    
    axum::serve(listener, app)
        .await?;
    
    Ok(())
}

