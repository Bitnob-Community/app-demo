import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"

const WEBHOOK_URL = "https://webhook.site/109c1736-3aac-4599-9c66-38f031aa41fb"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const testData = {
      message: "Test webhook from Bitnob API Workshop",
      timestamp: new Date().toISOString(),
      source: "api-workshop-labs",
      data: body,
      metadata: {
        userAgent: req.headers.get("user-agent"),
        ip: req.headers.get("x-forwarded-for") || "localhost"
      }
    }

    console.log("🚀 Sending test data to webhook.site:", testData)

    const response = await axios.post(WEBHOOK_URL, testData, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Bitnob-API-Workshop/1.0"
      }
    })

    return NextResponse.json({
      success: true,
      message: "Data sent to webhook.site successfully",
      webhookResponse: {
        status: response.status,
        statusText: response.statusText
      },
      sentData: testData
    })

  } catch (error) {
    console.error("❌ Error sending to webhook:", error)
    
    return NextResponse.json({
      success: false,
      error: "Failed to send webhook",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const testData = {
      message: "GET request test to webhook.site",
      timestamp: new Date().toISOString(),
      source: "api-workshop-labs",
      method: "GET"
    }

    const response = await axios.post(WEBHOOK_URL, testData)

    return NextResponse.json({
      success: true,
      message: "GET test sent to webhook.site",
      webhookResponse: {
        status: response.status,
        statusText: response.statusText
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to send webhook"
    }, { status: 500 })
  }
}