import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";
import { env } from "@/env";

type TradeInitRequest = {
  amount: number;
};

type TradeInitResponse = {
  status: boolean;
  message: string;
  data: {
    quoteId: string;
    quote: any;
  };
};

type TradeFinalizeRequest = {
  quoteId: string;
  amount?: number;
  reference?: string;
};

type TradeFinalizeResponse = {
  status: boolean;
  message: string;
  data: any;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  let tradeReference = body.reference || crypto.randomUUID();

  try {
    // Step 1: Trade initialization
    const { data: initResponse } = await axios.post<TradeInitResponse>(
      `${env.API_URL}/trade`,
      {
        amount: body.amount,
      },
      {
        headers: {
          Authorization: `Bearer ${env.BITNOB_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("[TRADE INIT] Response:", initResponse);

    if (!initResponse.status || !initResponse.data?.quoteId) {
      throw new Error(initResponse.message || "Trade initialization failed");
    }

    // Step 2: Trade finalization
    const { data: finalizeResponse } = await axios.post<TradeFinalizeResponse>(
      `${env.API_URL}/trade/finalize`,
      {
        quoteId: initResponse.data.quoteId,
        amount: body.amount,
        reference: tradeReference,
      },
      {
        headers: {
          Authorization: `Bearer ${env.BITNOB_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("[TRADE FINALIZE] Response:", finalizeResponse);

    if (!finalizeResponse.status) {
      throw new Error(finalizeResponse.message || "Trade finalization failed");
    }

    return NextResponse.json({
      message: "Trade status pending. Go to webhook site for confirmation",
      reference: tradeReference,
      quoteId: initResponse.data.quoteId,
      trade: finalizeResponse.data
    });

  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ Trade process failed:", err.message);
    return NextResponse.json({
      error: "Trade process failed",
      reference: tradeReference,
      message:
        err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data
          ? (err.response.data as any).message
          : err.message
    }, { status: 500 });
  }
}