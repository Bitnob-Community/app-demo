import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";
import { env } from "@/env";

const WEBHOOK_URL = "https://webhook.site/109c1736-3aac-4599-9c66-38f031aa41fb";

type QuoteResponse = {
  data: {
    quoteId: string;
  };
};

type InitializeResponse = {
  data: {
    quoteId: string;
  };
};

type IncomingPayload = {
  name: string;
  accountNumber: string;
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
      source: "bitnob-payout-api"
    };

    await axios.post(WEBHOOK_URL, webhookPayload, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Bitnob-Payout-Webhook/1.0"
      },
      timeout: 5000
    });

    console.log(`🔔 Webhook sent: ${event}`, { reference, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error(`❌ Webhook failed for ${event}:`, error instanceof Error ? error.message : error);
  }
}

export async function POST(req: NextRequest) {
  const incoming = (await req.json()) as IncomingPayload;
  const payoutReference = crypto.randomUUID();

  try {
    // Send initial webhook notification
    await sendWebhookNotification("payout.initiated", {
      beneficiary: {
        name: incoming.name,
        accountNumber: incoming.accountNumber
      },
      amount: 200000,
      currency: "NGN",
      fromAsset: "USDT"
    }, payoutReference);

    const { data: quote } = await axios.post<QuoteResponse>(
      "https://sandboxapi.bitnob.co/api/v1/payouts/quotes",
      {
        source: "offchain",
        fromAsset: "usdt",
        toCurrency: "ngn",
        settlementAmount: 200000,
      },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );

    console.log("🚀 ~ POST ~ quote:", quote.data);

    // Send quote received webhook
    await sendWebhookNotification("payout.quote_received", {
      quoteId: quote.data.quoteId,
      beneficiary: incoming.name
    }, payoutReference);

    const initializeResponse = await axios.post<InitializeResponse>(
      "https://sandboxapi.bitnob.co/api/v1/payouts/initialize",
      {
        quoteId: quote.data.quoteId,
        customerId: "e22795d9-23f6-48e6-8b30-be5718abd876",
        country: "NG",
        reference: payoutReference,
        paymentReason: "Bitnob Nigeria Faucet",
        beneficiary: {
          type: "BANK",
          accountName: incoming.name,
          bankName: "OPAY",
          accountNumber: incoming.accountNumber,
        },
      },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );


    try {
      const response = await axios.post(
        "https://sandboxapi.bitnob.co/api/v1/payouts/finalize",
        { quoteId: quote.data.quoteId },
        { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
      );

      console.log("🚀 ~ POST ~ response:", response.data);

      // Send finalization success webhook
      await sendWebhookNotification("payout.completed", {
        quoteId: quote.data.quoteId,
        reference: payoutReference,
        status: "success",
        finalizeResponse: response.data
      }, payoutReference);

    } catch (error) {
      const err = error as AxiosError;
      console.log("🚀 ~ POST ~ err.message:", err.toJSON());

      // Send finalization error webhook
      await sendWebhookNotification("payout.failed", {
        quoteId: quote.data.quoteId,
        reference: payoutReference,
        error: err.message,
        status: "failed"
      }, payoutReference);
    }

    return NextResponse.json({
      message: "you should receive a notification soon",
      reference: payoutReference,
      quote: quote.data,
    });

  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ Payout process failed:", err.message);

    // Send general error webhook
    await sendWebhookNotification("payout.error", {
      reference: payoutReference,
      error: err.message,
      beneficiary: incoming.name
    }, payoutReference);

    return NextResponse.json({
      error: "Payout failed",
      reference: payoutReference,
      message: err.message
    }, { status: 500 });
  }
}
