import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/env";

type RouteParams = {
  params: {
    identifier: string;
  };
};

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { identifier } = await params;

    if (!identifier) {
      return NextResponse.json(
        { error: "Transaction ID or reference is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://sandboxapi.bitnob.co/api/v1/transactions/${identifier}`,
      {
        headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` }
      }
    );

    return NextResponse.json({
      data: response.data,
      identifier,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    const { identifier } = await params;
    console.error(`❌ Failed to fetch transaction ${identifier}:`, error);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return NextResponse.json(
          { 
            error: "Transaction not found",
            identifier
          },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch transaction",
        identifier,
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}