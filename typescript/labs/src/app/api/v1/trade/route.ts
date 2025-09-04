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
    amount: string;
};

export async function POST(req: NextRequest) {
  const incoming = (await req.json()) as IncomingPayload;
  const { data: quote } = await axios.post<QuoteResponse>(
    "https://api.bitnob.co/api/v1/wallets/initialize-swap-for-bitcoin",
    {
        amount: 200,

    },

    { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
  );

  await axios.post<InitializeResponse>(
    "https://api.bitnob.co/api/v1/wallets/finalize-swap-for-bitcoin",
    {
      quoteId: quote.data.quoteId,
      reference: crypto.randomUUID(),
    },
    { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
  );

  try {
    const response = await axios.post(
      "https://api.bitnob.co/api/v1/wallets/finalize-swap-for-bitcoin",
      { quoteId: quote.data.quoteId },
      { headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` } },
    );

    console.log("🚀 ~ POST ~ response:", response.data);
  } catch (error) {
    const err = error as AxiosError;
    console.log("🚀 ~ POST ~ err.message:", err.toJSON());
  }

  return NextResponse.json({
    message: "Swap completed successfully",
  });
}
