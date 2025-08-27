import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";
import { env } from "@/env";

const WEBHOOK_URL = "https://webhook.site/109c1736-3aac-4599-9c66-38f031aa41fb";

type FinalizeTradePayload = {
  quoteId: string;
  customerId: string;
  reference?: string;
};

type FinalizeTradeResponse = {
  data: {
    tradeId: string;
    status: string;
    fromAsset: string;
    toAsset: string;
    fromAmount: string;
    toAmount: string;
    executedRate: string;
    fees: string;
    executedAt: string;
  };
};

async function sendWebhookNotification(
  event: string,
  data: any,
  reference?: string
) {
  try {
    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      reference,
      data,
      source: "bitnob-trade-api"
    };

    await axios.post(WEBHOOK_URL, webhookPayload, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Bitnob-Trade-Webhook/1.0"
      },
      timeout: 5000
    });

    console.log(`🔔 Webhook sent: ${event}`, { reference, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error(`❌ Webhook failed for ${event}:`, error instanceof Error ? error.message : error);
  }
}

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as FinalizeTradePayload;
  const tradeReference = payload.reference || `trade-${Date.now()}`;

  try {
    // Send trade execution webhook
    await sendWebhookNotification("trade.execution_started", {
      quoteId: payload.quoteId,
      customerId: payload.customerId
    }, tradeReference);

    // Call the real Bitnob trade finalize API
    const { data: tradeResult } = await axios.post<FinalizeTradeResponse>(
      "https://sandboxapi.bitnob.co/api/v1/trade/finalize",
      {
        quoteId: payload.quoteId,
        customerId: payload.customerId,
        reference: tradeReference
      },
      { 
        headers: { 
          Authorization: `Bearer ${env.BITNOB_SECRET_KEY}`,
          "Content-Type": "application/json"
        } 
      },
    );

    console.log("🚀 Trade executed:", tradeResult.data);

    // Send success webhook
    await sendWebhookNotification("trade.completed", {
      tradeId: tradeResult.data.tradeId,
      status: tradeResult.data.status,
      fromAsset: tradeResult.data.fromAsset,
      toAsset: tradeResult.data.toAsset,
      fromAmount: tradeResult.data.fromAmount,
      toAmount: tradeResult.data.toAmount,
      executedRate: tradeResult.data.executedRate,
      fees: tradeResult.data.fees,
      executedAt: tradeResult.data.executedAt
    }, tradeReference);

    return NextResponse.json({
      message: "Trade executed successfully",
      reference: tradeReference,
      trade: tradeResult.data,
      status: "completed"
    });

  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ Trade execution failed:", err.message);
    console.log("🚀 Trade execution error details:", err.response?.data);

    // Send failure webhook
    await sendWebhookNotification("trade.failed", {
      quoteId: payload.quoteId,
      reference: tradeReference,
      error: err.message,
      errorDetails: err.response?.data
    }, tradeReference);

    return NextResponse.json({
      error: "Trade execution failed",
      reference: tradeReference,
      message: err.response?.data?.message || err.message,
      details: err.response?.data
    }, { status: 500 });
  }
}