import { type NextRequest, NextResponse } from "next/server"

export function GET() {
  return NextResponse.json({ 
    message: "Webhook endpoint is active",
    timestamp: new Date().toISOString(),
    status: "ok" 
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const headers = Object.fromEntries(req.headers.entries())
    
    console.log("🔔 Webhook received:", {
      method: "POST",
      timestamp: new Date().toISOString(),
      headers: {
        "content-type": headers["content-type"],
        "user-agent": headers["user-agent"],
        "x-forwarded-for": headers["x-forwarded-for"],
      },
      body
    })

    return NextResponse.json({
      message: "Webhook received successfully",
      timestamp: new Date().toISOString(),
      received: {
        method: "POST",
        bodySize: JSON.stringify(body).length,
        contentType: headers["content-type"]
      }
    })
  } catch (error) {
    console.error("❌ Webhook error:", error)
    return NextResponse.json(
      { 
        error: "Failed to process webhook",
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("🔔 Webhook PUT received:", body)
    
    return NextResponse.json({
      message: "PUT webhook received",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("🔔 Webhook PATCH received:", body)
    
    return NextResponse.json({
      message: "PATCH webhook received",
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }
}
