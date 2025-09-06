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

type PayoutRequest struct {
	Name          string `json:"name" binding:"required"`
	AccountNumber string `json:"accountNumber" binding:"required"`
}

type PayoutResponse struct {
	Message   string  `json:"message"`
	Reference *string `json:"reference,omitempty"`
}

type QuoteRequest struct {
	Source           string `json:"source"`
	FromAsset        string `json:"fromAsset"`
	ToCurrency       string `json:"toCurrency"`
	SettlementAmount int    `json:"settlementAmount"`
}

type InitializeRequest struct {
	QuoteID       string      `json:"quoteId"`
	CustomerID    string      `json:"customerId"`
	Country       string      `json:"country"`
	Reference     string      `json:"reference"`
	PaymentReason string      `json:"paymentReason"`
	Beneficiary   Beneficiary `json:"beneficiary"`
}

type Beneficiary struct {
	Type          string `json:"type"`
	AccountName   string `json:"accountName"`
	BankName      string `json:"bankName"`
	AccountNumber string `json:"accountNumber"`
}

type FinalizeRequest struct {
	QuoteID string `json:"quoteId"`
}

type ApiResponse struct {
	Data QuoteData `json:"data"`
}

type QuoteData struct {
	QuoteID string `json:"quoteId"`
}

func createPayout(c *gin.Context) {
	var payload PayoutRequest
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, PayoutResponse{
			Message: fmt.Sprintf("Invalid request: %s", err.Error()),
		})
		return
	}

	payoutReference := uuid.New().String()

	// Get environment variables
	apiURL := os.Getenv("API_URL")
	secretKey := os.Getenv("BITNOB_SECRET_KEY")

	if apiURL == "" || secretKey == "" {
		c.JSON(http.StatusInternalServerError, PayoutResponse{
			Message:   "Missing API configuration",
			Reference: &payoutReference,
		})
		return
	}

	// Step 1: Get quote
	quoteRequest := QuoteRequest{
		Source:           "offchain",
		FromAsset:        "usdt",
		ToCurrency:       "ngn",
		SettlementAmount: 100000,
	}

	quoteData, err := makeAPICall(fmt.Sprintf("%s/payouts/quotes", apiURL), secretKey, quoteRequest)
	if err != nil {
		fmt.Printf("Quote request failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, PayoutResponse{
			Message:   fmt.Sprintf("Quote failed: %s", err.Error()),
			Reference: &payoutReference,
		})
		return
	}

	var quote ApiResponse
	if err := json.Unmarshal(quoteData, &quote); err != nil {
		fmt.Printf("Failed to parse quote response: %v\n", err)
		c.JSON(http.StatusInternalServerError, PayoutResponse{
			Message:   "Failed to parse quote response",
			Reference: &payoutReference,
		})
		return
	}

	fmt.Printf("[STEP 1] Quote Generated: %+v\n", quote)

	// Step 2: Initialize payout
	initializeRequest := InitializeRequest{
		QuoteID:       quote.Data.QuoteID,
		CustomerID:    "e22795d9-23f6-48e6-8b30-be5718abd876",
		Country:       "NG",
		Reference:     payoutReference,
		PaymentReason: "Bitnob Nigeria Faucet",
		Beneficiary: Beneficiary{
			Type:          "BANK",
			AccountName:   payload.Name,
			BankName:      "OPAY",
			AccountNumber: payload.AccountNumber,
		},
	}

	initData, err := makeAPICall(fmt.Sprintf("%s/payouts/initialize", apiURL), secretKey, initializeRequest)
	if err != nil {
		fmt.Printf("Initialize request failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, PayoutResponse{
			Message:   fmt.Sprintf("Initialize failed: %s", err.Error()),
			Reference: &payoutReference,
		})
		return
	}

	fmt.Printf("[STEP 2] Quote Initialized: %s\n", string(initData))

	// Step 3: Finalize payout
	finalizeRequest := FinalizeRequest{
		QuoteID: quote.Data.QuoteID,
	}

	finalizeData, err := makeAPICall(fmt.Sprintf("%s/payouts/finalize", apiURL), secretKey, finalizeRequest)
	if err != nil {
		fmt.Printf("Finalize request failed: %v\n", err)
		c.JSON(http.StatusInternalServerError, PayoutResponse{
			Message:   fmt.Sprintf("Finalize failed: %s", err.Error()),
			Reference: &payoutReference,
		})
		return
	}

	fmt.Printf("[STEP 3] Quote Finalized: %s\n", string(finalizeData))

	c.JSON(http.StatusOK, PayoutResponse{
		Message:   "Payout process started. Check the webhook site for final confirmation.",
		Reference: &payoutReference,
	})
}

func makeAPICall(url, secretKey string, payload interface{}) ([]byte, error) {
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