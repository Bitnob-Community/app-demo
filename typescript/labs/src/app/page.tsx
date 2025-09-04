import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowUpDown, DollarSign, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Bitnob API Workshop</h1>
        <p className="text-lg text-gray-600">
          Explore different Bitnob API integrations and features
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/payouts" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Payouts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Send money to bank accounts and mobile money wallets across Africa.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Bank transfers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Mobile money</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Webhook notifications</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/virtual-cards" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Virtual Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Create and manage virtual cards for online payments and spending.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>User management</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Card creation</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Transaction history</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/trading" className="group">
          <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <ArrowUpDown className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Exchange cryptocurrencies with real-time quotes and execution.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time quotes</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Multi-asset support</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Trade execution</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-12 text-center">
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">API Features</h3>
            <div className="grid gap-4 md:grid-cols-3 mt-6 text-sm">
              <div>
                <h4 className="font-medium mb-2">Transaction Endpoints</h4>
                <p className="text-gray-600">
                  GET /api/v1/transactions<br/>
                  GET /api/v1/transactions/{'{id}'}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Trading Endpoints</h4>
                <p className="text-gray-600">
                  POST /api/v1/trade<br/>
                  POST /api/v1/trade/finalize
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Virtual Cards</h4>
                <p className="text-gray-600">
                  Full CRUD operations<br/>
                  User & transaction management
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}