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

export default function PayoutsPage() {
  const [name, setName] = useState("Joshua Mutekanga");
  const [accountNumber, setAccountNumber] = useState("704457200");
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    onSuccess(data) {
      setMessage(data.message);
    },
    onError(error) {
      setMessage(`Error: ${error.message}`);
    },
    mutationFn: async () => {
      const response = await fetch("/api/payouts", {
        method: "POST",
        body: JSON.stringify({ name, accountNumber }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

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
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  defaultValue={name}
                  placeholder="e.g Bruce Wayne"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid w-full items-center gap-3">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="number"
                  defaultValue={accountNumber}
                  placeholder="e.g 07493852824"
                  onChange={(e) => setAccountNumber(e.target.value)}
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
              Submit
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
