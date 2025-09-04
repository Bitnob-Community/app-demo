"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

type TradeStep = "form" | "quote" | "confirm" | "result";

interface QuoteData {
  quoteId: string;
  rate: string;
  fees: string;
  fromAmount: string;
  toAmount: string;
  expiresAt: string;
  reference: string;
}

export default function TradingPage() {
  const [step, setStep] = useState<TradeStep>("form");
  const [formData, setFormData] = useState({
    amount: "" // placeholder
  });
  const [tradeResult, setTradeResult] = useState<any>(null);

  const tradeMutation = useMutation({
    onSuccess(data) {
      setTradeResult(data);
      setStep("result");
    },
    onError(error: any) {
      setTradeResult({ error: true, message: error.message });
      setStep("result");
    },
    mutationFn: async () => {
      const response = await fetch("/api/v1/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(formData.amount)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    },
  });

  const handleTrade = () => {
    tradeMutation.mutate();
  };

  const handleStartOver = () => {
    setStep("form");
    setTradeResult(null);
    setFormData({
      amount: ""
    });
  };
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">

      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Trading Interface */}
        <div className="lg:col-span-2">
          {step === "form" && (
            <Card>
              <CardHeader>
                <CardTitle>Start Trade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700 mb-2">
                    💡 Bitnob supports BTC ↔ USDT trading pairs only
                  </p>
                </div>
                {/* Only amount input needed */}
                <div>
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="Amount in USD to convert to BTC"
                  />
                </div>
                <Button
                  onClick={handleTrade}
                  disabled={tradeMutation.isPending}
                  className="w-full"
                >
                  {tradeMutation.isPending ? "Processing Trade..." : "Trade Now"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* No quote step, trade is processed in one go */}

          {step === "result" && tradeResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {tradeResult.error ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  Trade {tradeResult.error ? "Failed" : "Completed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tradeResult.error ? (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-700 font-medium">Error:</p>
                    <p className="text-red-600">{tradeResult.message}</p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700 font-medium mb-2">Trade Successful!</p>
                    {tradeResult.trade && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Trade ID:</span>
                          <span className="font-mono">{tradeResult.trade.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quote ID:</span>
                          <span className="font-mono">{tradeResult.quoteId}</span>
                        </div>
                        {/* You can add more fields from tradeResult.trade as needed */}
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Reference: {tradeResult.reference}
                    </p>
                  </div>
                )}

                <Button onClick={handleStartOver} className="w-full">
                  Start New Trade
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trading Info Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className={`flex items-center gap-2 ${step === "form" ? "text-blue-600 font-medium" : step === "quote" || step === "result" ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "form" ? "bg-blue-600 text-white" : step === "quote" || step === "result" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                    1
                  </div>
                  <span>Enter Trade Details</span>
                </div>
                <div className={`flex items-center gap-2 ${step === "quote" ? "text-blue-600 font-medium" : step === "result" ? "text-green-600" : "text-gray-400"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "quote" ? "bg-blue-600 text-white" : step === "result" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                    2
                  </div>
                  <span>Review Quote</span>
                </div>
                <div className={`flex items-center gap-2 ${step === "result" ? "text-green-600 font-medium" : "text-gray-400"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === "result" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                    3
                  </div>
                  <span>Execute Trade</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Trading Pair</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2">₿</div>
                    <span className="text-sm font-medium">Bitcoin</span>
                    <span className="text-xs text-gray-500">BTC</span>
                  </div>
                  <ArrowUpDown className="w-6 h-6 text-gray-400" />
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold mb-2">₮</div>
                    <span className="text-sm font-medium">Tether</span>
                    <span className="text-xs text-gray-500">USDT</span>
                  </div>
                </div>
                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
                  Only BTC ↔ USDT trading pairs are supported by Bitnob's trading infrastructure
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}