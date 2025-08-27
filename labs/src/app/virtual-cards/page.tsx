"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
  const [result, setResult] = useState("");

  const mutation = useMutation({
    onSuccess(data) {
      setResult(JSON.stringify(data, null, 2));
    },
    onError(error: any) {
      setResult(`Error: ${error.message}`);
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
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {result || "No response yet"}
            </pre>
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
                .then(data => setResult(JSON.stringify(data, null, 2)));
            }}
          >
            Get All Cards
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              fetch("/api/virtual-cards?action=users")
                .then(r => r.json())
                .then(data => setResult(JSON.stringify(data, null, 2)));
            }}
          >
            Get All Users
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              fetch("/api/virtual-cards?action=transactions")
                .then(r => r.json())
                .then(data => setResult(JSON.stringify(data, null, 2)));
            }}
          >
            Get Transactions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}