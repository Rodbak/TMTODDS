"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { getDemoSession, setDemoSession } from "@/lib/demo/session";
import type { DemoPlan } from "@/lib/demo/data";

export function DemoCheckoutCard({ plan }: { plan: DemoPlan }) {
  const [done, setDone] = useState(false);

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-black text-white">{plan.name}</div>
          <div className="text-sm text-white/70">{plan.durationDays} days access</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-white">GHS {plan.priceGhs}</div>
        </div>
      </div>

      <div className="mt-6 grid gap-2">
        <Button
          onClick={() => {
            const session = getDemoSession();
            if (!session) {
              window.location.href = "/login";
              return;
            }
            setDemoSession({ ...session, activePlanKey: plan.key });
            setDone(true);
          }}
        >
          {done ? "Plan activated" : "Activate plan (Demo)"}
        </Button>
        <Button as="link" href="/#packages" variant="secondary">
          Back to packages
        </Button>
      </div>
    </div>
  );
}

