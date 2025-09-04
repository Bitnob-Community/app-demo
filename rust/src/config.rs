use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub api_url: String,
    pub bitnob_secret_key: String,
}

impl Config {
    pub fn from_env() -> Result<Self, Box<dyn std::error::Error>> {
        dotenvy::dotenv().ok();

        let api_url = env::var("API_URL")
            .unwrap_or_else(|_| "https://sandboxapi.bitnob.co".to_string());
        
        let bitnob_secret_key = env::var("BITNOB_SECRET_KEY")
            .map_err(|_| "BITNOB_SECRET_KEY environment variable is required")?;

        Ok(Self {
            api_url,
            bitnob_secret_key,
        })
    }
}