import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";
import { env } from "@/env";

const WEBHOOK_URL = "https://webhook.site/109c1736-3aac-4599-9c66-38f031aa41fb";

type TradeQuoteResponse = {
  data: {
    quoteId: string;
    rate: string;
    fees: string;
    fromAmount: string;
    toAmount: string;
    expiresAt: string;
  };
};

type TradePayload = {
  fromAsset: string;
  toAsset: string;
  amount: string;
  amountType?: "fromAmount" | "toAmount";
  customerId: string;
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
  const payload = (await req.json()) as TradePayload;
  const tradeReference = crypto.randomUUID();

  try {
    // Send initial webhook notification
    await sendWebhookNotification("trade.initiated", {
      fromAsset: payload.fromAsset,
      toAsset: payload.toAsset,
      amount: payload.amount,
      amountType: payload.amountType || "fromAmount",
      customerId: payload.customerId
    }, tradeReference);

    // Call the real Bitnob trade API
    const { data: tradeResponse } = await axios.post<TradeQuoteResponse>(
      "https://sandboxapi.bitnob.co/api/v1/trade",
      {
        fromAsset: payload.fromAsset,
        toAsset: payload.toAsset,
        amount: payload.amount,
        amountType: payload.amountType || "fromAmount",
        customerId: payload.customerId,
      },
      { 
        headers: { 
          Authorization: `Bearer ${env.BITNOB_SECRET_KEY}`,
          "Content-Type": "application/json"
        } 
      },
    );

    console.log("🚀 Trade initialized:", tradeResponse.data);

    // Send quote received webhook
    await sendWebhookNotification("trade.quote_received", {
      quoteId: tradeResponse.data.quoteId,
      rate: tradeResponse.data.rate,
      fromAsset: payload.fromAsset,
      toAsset: payload.toAsset,
      fromAmount: tradeResponse.data.fromAmount,
      toAmount: tradeResponse.data.toAmount,
      fees: tradeResponse.data.fees,
      expiresAt: tradeResponse.data.expiresAt
    }, tradeReference);

    return NextResponse.json({
      message: "Trade initialized successfully",
      reference: tradeReference,
      quote: tradeResponse.data,
      status: "quote_ready"
    });

  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ Trade quote failed:", err.message);

    // Send error webhook
    await sendWebhookNotification("trade.quote_error", {
      reference: tradeReference,
      error: err.message,
      fromAsset: payload.fromAsset,
      toAsset: payload.toAsset,
      amount: payload.amount
    }, tradeReference);

    return NextResponse.json({
      error: "Trade quote failed",
      reference: tradeReference,
      message: err.response?.data?.message || err.message
    }, { status: 500 });
  }
}