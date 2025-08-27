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
    fromAsset: "BTC",
    toAsset: "USDT",
    amount: "0.001",
    amountType: "fromAmount" as "fromAmount" | "toAmount",
    customerId: "e22795d9-23f6-48e6-8b30-be5718abd876"
  });
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [result, setResult] = useState<any>(null);

  const getQuoteMutation = useMutation({
    onSuccess(data) {
      setQuoteData({
        ...data.quote,
        reference: data.reference
      });
      setStep("quote");
    },
    onError(error: any) {
      setResult({ error: true, message: error.message });
      setStep("result");
    },
    mutationFn: async () => {
      const response = await fetch("/api/v1/trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    },
  });

  const finalizeMutation = useMutation({
    onSuccess(data) {
      setResult({ success: true, ...data });
      setStep("result");
    },
    onError(error: any) {
      setResult({ error: true, message: error.message });
      setStep("result");
    },
    mutationFn: async () => {
      if (!quoteData) throw new Error("No quote data available");
      
      const response = await fetch("/api/v1/trade/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quoteId: quoteData.quoteId,
          customerId: formData.customerId,
          reference: quoteData.reference
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    },
  });

  const handleGetQuote = () => {
    getQuoteMutation.mutate();
  };

  const handleFinalizeTrade = () => {
    finalizeMutation.mutate();
  };

  const handleStartOver = () => {
    setStep("form");
    setQuoteData(null);
    setResult(null);
  };

  const swapAssets = () => {
    setFormData(prev => ({
      ...prev,
      fromAsset: prev.toAsset,
      toAsset: prev.fromAsset
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp className="w-8 h-8 text-blue-600" />
        Trading
      </h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Trading Interface */}
        <div className="lg:col-span-2">
          {step === "form" && (
            <Card>
              <CardHeader>
                <CardTitle>Create Trade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-700 mb-2">
                    💡 Bitnob supports BTC ↔ USDT trading pairs only
                  </p>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fromAsset">From Asset</Label>
                    <select
                      id="fromAsset"
                      value={formData.fromAsset}
                      onChange={(e) => setFormData({...formData, fromAsset: e.target.value, toAsset: e.target.value === "BTC" ? "USDT" : "BTC"})}
                      className="w-full p-2 border rounded"
                    >
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="USDT">Tether (USDT)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="toAsset">To Asset</Label>
                    <div className="w-full p-2 border rounded bg-gray-50 text-gray-700">
                      {formData.fromAsset === "BTC" ? "Tether (USDT)" : "Bitcoin (BTC)"}
                    </div>
                    <input type="hidden" value={formData.toAsset} />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={swapAssets}
                    className="flex items-center gap-2"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Swap
                  </Button>
                </div>

                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.00000001"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <Label htmlFor="amountType">Amount Type</Label>
                  <select
                    id="amountType"
                    value={formData.amountType}
                    onChange={(e) => setFormData({...formData, amountType: e.target.value as "fromAmount" | "toAmount"})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="fromAmount">From Amount (You Send)</option>
                    <option value="toAmount">To Amount (You Receive)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="customerId">Customer ID</Label>
                  <Input
                    id="customerId"
                    value={formData.customerId}
                    onChange={(e) => setFormData({...formData, customerId: e.target.value})}
                    placeholder="Customer ID"
                  />
                </div>

                <Button
                  onClick={handleGetQuote}
                  disabled={getQuoteMutation.isPending}
                  className="w-full"
                >
                  {getQuoteMutation.isPending ? "Getting Quote..." : "Get Quote"}
                </Button>
              </CardContent>
            </Card>
          )}

          {step === "quote" && quoteData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  Trade Quote
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">You Send:</span>
                    <span className="text-xl font-bold text-gray-900">{quoteData.fromAmount} {formData.fromAsset}</span>
                  </div>
                  <div className="flex justify-center mb-3">
                    <ArrowUpDown className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-gray-700">You Receive:</span>
                    <span className="text-xl font-bold text-green-600">{quoteData.toAmount} {formData.toAsset}</span>
                  </div>
                  <div className="border-t border-blue-200 pt-3 mt-3 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Exchange Rate:</span>
                      <span className="text-sm text-gray-800 font-mono">{formData.fromAsset === "BTC" ? `1 BTC = ${Number(quoteData.rate).toLocaleString()} USDT` : `1 USDT = ${Number(quoteData.rate).toFixed(8)} BTC`}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600">Trading Fees:</span>
                      <span className="text-sm text-gray-800">{quoteData.fees} {formData.fromAsset}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Quote expires: {new Date(quoteData.expiresAt).toLocaleString()}</p>
                  <p>Reference: {quoteData.reference}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleStartOver} className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleFinalizeTrade}
                    disabled={finalizeMutation.isPending}
                    className="flex-1"
                  >
                    {finalizeMutation.isPending ? "Executing..." : "Execute Trade"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === "result" && result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {result.error ? (
                    <XCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  Trade {result.error ? "Failed" : "Completed"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.error ? (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-700 font-medium">Error:</p>
                    <p className="text-red-600">{result.message}</p>
                  </div>
                ) : (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700 font-medium mb-2">Trade Successful!</p>
                    {result.trade && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Trade ID:</span>
                          <span className="font-mono">{result.trade.tradeId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>From:</span>
                          <span>{result.trade.fromAmount} {result.trade.fromAsset}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>To:</span>
                          <span>{result.trade.toAmount} {result.trade.toAsset}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Executed Rate:</span>
                          <span>{result.trade.executedRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fees:</span>
                          <span>{result.trade.fees}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Executed At:</span>
                          <span>{new Date(result.trade.executedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Reference: {result.reference}
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