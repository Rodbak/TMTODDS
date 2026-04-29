"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

export function PaystackCheckoutButton({ planKey }: { planKey: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const res = await fetch("/api/payments/paystack/initialize", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ planKey }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data?.authorizationUrl) {
            alert(data?.error ?? "Payment init failed");
            return;
          }
          window.location.href = data.authorizationUrl;
        });
      }}
    >
      {pending ? "Redirecting..." : "Pay with Paystack"}
    </Button>
  );
}

