import { Suspense } from "react";

import { SlipsPageClient } from "./slips-page-client";

export default function SlipsPage() {
  return (
    <main>
      <Suspense fallback={<div className="mx-auto max-w-[1280px] px-4 py-10 text-white/60">Loading slips…</div>}>
        <SlipsPageClient />
      </Suspense>
    </main>
  );
}
