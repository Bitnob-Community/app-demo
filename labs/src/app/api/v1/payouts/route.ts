import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";
import { env } from "@/env";

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

export async function POST(req: NextRequest) {
  const incoming = (await req.json()) as IncomingPayload;
  const payoutReference = crypto.randomUUID();

  try {
    // 1. Get quote
    const quoteRes = await axios.post(
      `${env.API_URL}/payouts/quotes`,
      {
        source: "offchain",
        fromAsset: "usdt",
        toCurrency: "ngn",
        settlementAmount: 200000,
      },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );
    const quote = quoteRes.data;
    console.log("[STEP 1] Quote Generated:", quote);

    // 2. Initialize payout
    const initRes = await axios.post(
      `${env.API_URL}/payouts/initialize`,
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
    const initialize = initRes.data;
    console.log("[STEP 2] Quote Initialized:", initialize);

    // 3. Finalize payout
    const finalizeRes = await axios.post(
      `${env.API_URL}/payouts/finalize`,
      { quoteId: quote.data.quoteId },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );
    const finalize = finalizeRes.data;
    console.log("[STEP 3] Quote Finalized:", finalize);

    return NextResponse.json({
      message: "Payout process started. Check the webhook site for final confirmation.",
      reference: payoutReference
    });

  } catch (error) {
    const err = error as AxiosError;
    if(err.status == 400){
      console.error("Bad JSON request: ", err.message);
    } else if(err.status == 404) {
      console.error("Resource not found: ", err.message);
    } else {
      console.error("❌ Payout process failed:", err.message);
    }
    return NextResponse.json({
      error: "Payout failed",
      reference: payoutReference,
      message: err.message
    }, { status: 500 });
  }
}
