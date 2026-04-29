"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function PaymentSuccessClient({ reference }: { reference: string | null }) {
  const [status, setStatus] = useState<
    "idle" | "verifying" | "paid" | "unpaid" | "error"
  >(reference ? "verifying" : "idle");

  useEffect(() => {
    if (!reference) return;
    let cancelled = false;

    (async () => {
      const res = await fetch(
        `/api/payments/paystack/verify?reference=${encodeURIComponent(reference)}`,
      );
      const data = await res.json().catch(() => ({}));
      if (cancelled) return;
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus(data?.paid ? "paid" : "unpaid");
      if (data?.paid) {
        window.location.href = "/account";
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (!reference) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-700 dark:text-red-200">
        Missing payment reference.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black">
      <div className="text-xs font-semibold text-black/60 dark:text-white/60">
        Reference
      </div>
      <div className="mt-1 font-mono text-sm">{reference}</div>

      <div className="mt-4 text-sm text-black/70 dark:text-white/70">
        {status === "verifying" ? "Verifying with Paystack..." : null}
        {status === "paid" ? "Payment confirmed. Redirecting..." : null}
        {status === "unpaid" ? "Payment not confirmed yet." : null}
        {status === "error" ? "Could not verify payment." : null}
      </div>

      <div className="mt-5 flex gap-2">
        <Button as="link" href="/account" variant="secondary" size="sm">
          Go to dashboard
        </Button>
        <Button as="link" href="/#packages" variant="ghost" size="sm">
          Back to packages
        </Button>
      </div>
    </div>
  );
}

