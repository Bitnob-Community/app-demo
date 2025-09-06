package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TradeRequest struct {
	Side     string  `json:"side" binding:"required"`
	Asset    string  `json:"asset" binding:"required"`
	Currency string  `json:"currency" binding:"required"`
	Amount   float64 `json:"amount" binding:"required"`
}

type TradeResponse struct {
	Message   string  `json:"message"`
	QuoteID   *string `json:"quoteId,omitempty"`
	Reference *string `json:"reference,omitempty"`
}

type CreateTradeRequest struct {
	Side      string  `json:"side"`
	Asset     string  `json:"asset"`
	Currency  string  `json:"currency"`
	Amount    float64 `json:"amount"`
	Reference string  `json:"reference"`
}

type FinalizeTradeRequest struct {
	QuoteID string `json:"quoteId"`
}

type TradeApiResponse struct {
	Data TradeData `json:"data"`
}

type TradeData struct {
	QuoteID string `json:"quoteId"`
}

type SwapRequest struct {
	Amount int `json:"amount"`
}

type SwapFinalizeRequest struct {
	QuoteID   string `json:"quoteId"`
	Reference string `json:"reference"`
}

func createTrade(c *gin.Context) {
	var payload TradeRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, TradeResponse{
			Message: fmt.Sprintf("Invalid request: %s", err.Error()),
		})
		return
	}

	tradeReference := uuid.New().String()
	
	// Get environment variables
	secretKey := os.Getenv("BITNOB_SECRET_KEY")
	
	if secretKey == "" {
		c.JSON(http.StatusInternalServerError, TradeResponse{
			Message:   "Missing API configuration",
			Reference: &tradeReference,
		})
		return
	}

	tradeRequest := CreateTradeRequest{
		Side:      payload.Side,
		Asset:     payload.Asset,
		Currency:  payload.Currency,
		Amount:    payload.Amount,
		Reference: tradeReference,
	}

	// Use the trade endpoint for general trading
	tradeData, err := makeTradeAPICall("https://api.bitnob.co/api/v1/trade", secretKey, tradeRequest)
	if err != nil {
		fmt.Printf("Trade creation failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, TradeResponse{
			Message:   fmt.Sprintf("Trade creation failed: %s", err.Error()),
			Reference: &tradeReference,
		})
		return
	}

	var trade TradeApiResponse
	if err := json.Unmarshal(tradeData, &trade); err != nil {
		fmt.Printf("Failed to parse trade response: %v\n", err)
		c.JSON(http.StatusInternalServerError, TradeResponse{
			Message:   "Failed to parse trade response",
			Reference: &tradeReference,
		})
		return
	}

	fmt.Printf("Trade created successfully: %+v\n", trade)

	c.JSON(http.StatusOK, TradeResponse{
		Message:   "Trade created successfully. Use the quoteId to finalize the trade.",
		QuoteID:   &trade.Data.QuoteID,
		Reference: &tradeReference,
	})
}

func finalizeTrade(c *gin.Context) {
	var payload map[string]interface{}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, TradeResponse{
			Message: fmt.Sprintf("Invalid request: %s", err.Error()),
		})
		return
	}

	quoteID, ok := payload["quoteId"].(string)
	if !ok || quoteID == "" {
		c.JSON(http.StatusBadRequest, TradeResponse{
			Message: "quoteId is required",
		})
		return
	}

	secretKey := os.Getenv("BITNOB_SECRET_KEY")
	
	if secretKey == "" {
		c.JSON(http.StatusInternalServerError, TradeResponse{
			Message: "Missing API configuration",
		})
		return
	}

	finalizeRequest := FinalizeTradeRequest{
		QuoteID: quoteID,
	}

	finalizeData, err := makeTradeAPICall("https://api.bitnob.co/api/v1/trade/finalize", secretKey, finalizeRequest)
	if err != nil {
		fmt.Printf("Trade finalization failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, TradeResponse{
			Message: fmt.Sprintf("Trade finalization failed: %s", err.Error()),
			QuoteID: &quoteID,
		})
		return
	}

	fmt.Printf("Trade finalized successfully: %s\n", string(finalizeData))

	c.JSON(http.StatusOK, TradeResponse{
		Message: "Trade finalized successfully.",
		QuoteID: &quoteID,
	})
}

func createSwap(c *gin.Context) {
	var payload map[string]interface{}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"message": fmt.Sprintf("Invalid request: %s", err.Error()),
		})
		return
	}

	secretKey := os.Getenv("BITNOB_SECRET_KEY")
	
	if secretKey == "" {
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Missing API configuration",
		})
		return
	}

	// Step 1: Initialize swap
	swapRequest := SwapRequest{
		Amount: 200, // Default amount from TypeScript implementation
	}

	initData, err := makeTradeAPICall("https://api.bitnob.co/api/v1/wallets/initialize-swap-for-bitcoin", secretKey, swapRequest)
	if err != nil {
		fmt.Printf("Swap initialization failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": fmt.Sprintf("Swap initialization failed: %s", err.Error()),
		})
		return
	}

	var initResponse TradeApiResponse
	if err := json.Unmarshal(initData, &initResponse); err != nil {
		fmt.Printf("Failed to parse swap init response: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": "Failed to parse swap initialization response",
		})
		return
	}

	fmt.Printf("Swap initialized: %+v\n", initResponse)

	// Step 2: Finalize swap
	finalizeRequest := SwapFinalizeRequest{
		QuoteID:   initResponse.Data.QuoteID,
		Reference: uuid.New().String(),
	}

	finalizeData, err := makeTradeAPICall("https://api.bitnob.co/api/v1/wallets/finalize-swap-for-bitcoin", secretKey, finalizeRequest)
	if err != nil {
		fmt.Printf("Swap finalization failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"message": fmt.Sprintf("Swap finalization failed: %s", err.Error()),
		})
		return
	}

	fmt.Printf("Swap finalized: %s\n", string(finalizeData))

	c.JSON(http.StatusOK, gin.H{
		"message": "Swap completed successfully",
	})
}

func makeTradeAPICall(url, secretKey string, payload interface{}) ([]byte, error) {
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", secretKey))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("API error (%d): %s", resp.StatusCode, string(body))
	}

	return body, nil
}