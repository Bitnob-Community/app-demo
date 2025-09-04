import { type NextRequest, NextResponse } from "next/server";
import axios, { type AxiosError } from "axios";
import { env } from "@/env";

type FinalizeTradePayload = {
  quoteId: string;
  customerId: string;
  reference?: string;
};

type FinalizeTradeResponse = {
  status: boolean;
  message: string;
  data: {
    id: string;
    createdAt: string;
    updatedAt: string;
    reference: string;
    description: string;
    balanceAfter: number;
    amount: number;
    centAmount: number;
    fees: number;
    centFees: number;
    spotPrice: string;
    action: string;
    type: string;
    status: string;
    channel: string;
    companyId: string;
  };
};

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as FinalizeTradePayload;
  const tradeReference = payload.reference || `trade-${Date.now()}`;

  try {
    const { data: finalizeResponse } = await axios.post<FinalizeTradeResponse>(
      `${env.API_URL}/trade/finalize`,
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
      }
    );
    console.log("[TRADE FINALIZE] Response:", finalizeResponse);

    return NextResponse.json({
      message: "Trade finalized. Check the webhook site for final confirmation.",
      reference: tradeReference,
      data: finalizeResponse.data
    });
  } catch (error) {
    const err = error as AxiosError;
    console.error("❌ Trade finalization failed:", err.message);
    return NextResponse.json({
      error: "Trade finalization failed",
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