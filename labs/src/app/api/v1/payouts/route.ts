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
    const { data: quote } = await axios.post<QuoteResponse>(
      `${env.API_URL}/payouts/quotes`,
      {
        source: "offchain",
        fromAsset: "usdt",
        toCurrency: "ngn",
        settlementAmount: 200000,
      },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );

    // 2. Initialize payout
    await axios.post<InitializeResponse>(
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

    // 3. Finalize payout
    const response = await axios.post(
      `${env.API_URL}/payouts/finalize`,
      { quoteId: quote.data.quoteId },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );

    return NextResponse.json({
      message: "Payout pending. Go to webhook site for confirmation",
      reference: payoutReference,
      quote: quote.data,
      finalizeResponse: response.data,
    });

  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ Payout process failed:", err.message);

    return NextResponse.json({
      error: "Payout failed",
      reference: payoutReference,
      message: err.message
    }, { status: 500 });
  }
}
