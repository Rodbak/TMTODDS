import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DEMO_SLIPS } from "@/lib/demo/data";

export default function AdminSlipsPage() {
  const slips = DEMO_SLIPS;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Slips</h1>
          <p className="mt-2 text-sm text-white/70">
            Demo admin slip list.
          </p>
        </div>
        <Button as="link" href="/admin/slips/new">
          New slip
        </Button>
      </div>

      <div className="mt-6 grid gap-3">
        {slips.map((s) => (
          <Link
            key={s.id}
            href={`/admin/slips/${s.id}`}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-white/60">
                  PUBLISHED • {s.tier}
                </div>
                <div className="mt-1 text-lg font-black text-white">{s.title}</div>
                <div className="mt-2 text-xs text-white/60">
                  /slips/{s.slug}
                </div>
              </div>
              <div className="text-right text-xs font-semibold text-white/60">
                Matches: {s.matches.length}
              </div>
            </div>
          </Link>
        ))}

        {slips.length === 0 ? (
          <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/70">
            No slips yet.
          </div>
        ) : null}
      </div>
    </main>
  );
}

