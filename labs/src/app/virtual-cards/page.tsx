"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VirtualCard, CardGrid, UserCard, TransactionCard } from "@/components/ui/virtual-card";

export default function VirtualCardsPage() {
  const [action, setAction] = useState("register");
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    customerEmail: "john@example.com",
    phoneNumber: "08012345678",
    dateOfBirth: "1990-01-01",
    address: "123 Main Street",
    city: "Lagos",
    state: "Lagos",
    country: "NG",
    postalCode: "100001",
    idNumber: "12345678901",
    idType: "NIN",
    bvn: "22123456789"
  });
  const [result, setResult] = useState<any>(null);
  const [displayMode, setDisplayMode] = useState<"cards" | "users" | "transactions" | "json">("json");

  const mutation = useMutation({
    onSuccess(data) {
      setResult(data);
      if (action === "create") {
        setDisplayMode("cards");
      }
    },
    onError(error: any) {
      setResult({ error: error.message });
      setDisplayMode("json");
    },
    mutationFn: async () => {
      const response = await fetch("/api/virtual-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...formData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Virtual Cards</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="action">Action</Label>
              <select
                id="action"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="register">Register User</option>
                <option value="create">Create Card</option>
                <option value="topup">Top Up Card</option>
                <option value="freeze">Freeze Card</option>
                <option value="unfreeze">Unfreeze Card</option>
                <option value="withdraw">Withdraw</option>
                <option value="terminate">Terminate Card</option>
              </select>
            </div>

            {action === "register" && (
              <>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="idType">ID Type</Label>
                  <select
                    id="idType"
                    value={formData.idType}
                    onChange={(e) => setFormData({...formData, idType: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="NIN">NIN</option>
                    <option value="BVN">BVN</option>
                    <option value="PASSPORT">Passport</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="bvn">BVN</Label>
                  <Input
                    id="bvn"
                    value={formData.bvn}
                    onChange={(e) => setFormData({...formData, bvn: e.target.value})}
                  />
                </div>
              </>
            )}

            <Button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Loading..." : "Submit"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Response
              {result && (
                <div className="flex gap-1">
                  <Button
                    variant={displayMode === "cards" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDisplayMode("cards")}
                    disabled={!result?.data?.cards}
                  >
                    Cards
                  </Button>
                  <Button
                    variant={displayMode === "users" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDisplayMode("users")}
                    disabled={!result?.data?.cardUsers}
                  >
                    Users
                  </Button>
                  <Button
                    variant={displayMode === "transactions" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDisplayMode("transactions")}
                    disabled={!result?.data?.cardTransactions}
                  >
                    Transactions
                  </Button>
                  <Button
                    variant={displayMode === "json" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDisplayMode("json")}
                  >
                    JSON
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <p className="text-gray-500 text-center py-8">No response yet</p>
            ) : displayMode === "cards" && result?.data?.cards ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <CardGrid cards={result.data.cards.slice(0, 6)} className="grid-cols-1 md:grid-cols-2" />
                {result.data.cards.length > 6 && (
                  <p className="text-sm text-gray-500 text-center">
                    Showing first 6 of {result.data.cards.length} cards
                  </p>
                )}
              </div>
            ) : displayMode === "users" && result?.data?.cardUsers ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.data.cardUsers.slice(0, 5).map((user: any) => (
                  <UserCard key={user.id} user={user} />
                ))}
                {result.data.cardUsers.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    Showing first 5 of {result.data.cardUsers.length} users
                  </p>
                )}
              </div>
            ) : displayMode === "transactions" && result?.data?.cardTransactions ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.data.cardTransactions.slice(0, 5).map((transaction: any) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
                {result.data.cardTransactions.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    Showing first 5 of {result.data.cardTransactions.length} transactions
                  </p>
                )}
              </div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => {
              fetch("/api/virtual-cards?action=cards")
                .then(r => r.json())
                .then(data => {
                  setResult(data);
                  setDisplayMode("cards");
                });
            }}
          >
            Get All Cards
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              fetch("/api/virtual-cards?action=users")
                .then(r => r.json())
                .then(data => {
                  setResult(data);
                  setDisplayMode("users");
                });
            }}
          >
            Get All Users
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              fetch("/api/virtual-cards?action=transactions")
                .then(r => r.json())
                .then(data => {
                  setResult(data);
                  setDisplayMode("transactions");
                });
            }}
          >
            Get Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}