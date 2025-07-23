import crypto from "crypto";
import { NextResponse } from "next/server";
import { env } from "@/env";
import axios from "axios";

type QuoteResponse = {
  data: {
    id: string;
  };
};

export async function POST() {
  const { data: quote } = await axios.post<QuoteResponse>(
    "https://api.bitnob.co/api/v1/payouts/quotes",
    {
      source: "offchain",
      fromAsset: "usdt",
      toCurrency: "ugx",
      settlementAmount: 1000000,
    },
    { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
  );

  try {
    const response = await axios.post(
      "https://api.bitnob.co/api/v1/payouts/initialize",
      {
        quoteId: String(quote.data.id),
        customerId: "e22795d9-23f6-48e6-8b30-be5718abd876",
        country: "UG",
        reference: crypto.randomUUID(),
        paymentReason: "Bitnob Uganda Faucet",
        beneficiary: {
          type: "MOMO",
          accountName: "Samuel Oloruntoba",
          network: "MTN",
          accountNumber: "0766589332",
        },
      },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );
    console.log("🚀 ~ POST ~ response:", response);

    await axios.post(
      "https://api.bitnob.co/api/v1/payouts/finalize",
      { quoteId: String(response.data.data.id) },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
  }

  return NextResponse.json({
    message: "you should receive a notification soon",
  });
}
