import { type NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/env";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) params.append("status", status);
    if (type) params.append("type", type);

    const response = await axios.get(
      `https://sandboxapi.bitnob.co/api/v1/transactions?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${env.BITNOB_SECRET_KEY}` }
      }
    );

    return NextResponse.json({
      data: response.data,
      page,
      limit,
      filters: { status, type }
    });

  } catch (error) {
    console.error("❌ Failed to fetch transactions:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to fetch transactions",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}