"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ResponseType = {
  message: string;
};

export default function SwapPage() {
  const [amount, setAmount] = useState("1");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    onSuccess(data) {
      setMessage(data.message);
    },
    mutationFn: async () => {
      const response = await fetch("/api/v1/trade", {
        method: "POST",
        body: JSON.stringify({ amount }),
      });
      const data: unknown = await response.json();
      return data as ResponseType;
    },
  });

  async function handleSubmit() {
    await mutation.mutateAsync();
  }

  return (
    <div className="grid h-svh items-center justify-center">
      <Card className="min-w-md">
        <CardContent className="grid gap-3">
          {message === "" && (
            <>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  value={amount}
                  placeholder="e.g 1"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </>
          )}

          {message !== "" && (
            <pre className="bg-muted rounded-md border px-8 py-3 text-center shadow">
              {message}
            </pre>
          )}
        </CardContent>
        {message === "" && (
          <CardFooter>
            <Button disabled={mutation.isPending} onClick={handleSubmit}>
              {mutation.isPending && <Loader2Icon className="animate-spin" />}
              Swap Bitcoin
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
