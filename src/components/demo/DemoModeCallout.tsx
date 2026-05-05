"use client";

import { useState } from "react";

const KEY = "tmtodds_demo_callout_dismissed_v1";

export function DemoModeCallout() {
  const [hidden, setHidden] = useState(() => {
    try {
      return window.localStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });

  if (hidden) return null;

  return (
    <div className="relative rounded-xl border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
      <button
        type="button"
        onClick={() => {
          setHidden(true);
          try {
            window.localStorage.setItem(KEY, "1");
          } catch {}
        }}
        className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-amber-300/20 bg-black/20 text-amber-100/80 hover:bg-black/30 hover:text-amber-100"
        aria-label="Dismiss"
      >
        ×
      </button>
      <div className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-200/80">Demo mode</div>
      <div className="mt-1 pr-10 font-semibold">
        ⚠️ Demo Mode — No real payments are processed. Paystack integration activates on launch.
      </div>
    </div>
  );
}

