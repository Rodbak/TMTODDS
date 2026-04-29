import Link from "next/link";

import { DEMO_SLIPS } from "@/lib/demo/data";
import { SLIP_TIER_LABEL } from "@/lib/plans";

export default function ProofPage() {
  const slips = DEMO_SLIPS;

  let totalLegs = 0;
  let wonLegs = 0;
  let lostLegs = 0;
  let pendingLegs = 0;
  for (const s of slips) {
    for (const m of s.matches) {
      totalLegs += 1;
      if (m.resultStatus === "WON") wonLegs += 1;
      else if (m.resultStatus === "LOST") lostLegs += 1;
      else pendingLegs += 1;
    }
  }
  const settled = wonLegs + lostLegs;
  const ledgerPct = settled > 0 ? Math.round((wonLegs / settled) * 100) : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Results ledger</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">Proof & results</h1>
      <p className="mt-2 max-w-2xl text-sm text-white/55">
        Demo ledger: every slip rolls up to leg-level outcomes. In production this stays the single
        source of truth for trust.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Slips tracked" value={String(slips.length)} />
        <StatCard label="Total legs" value={String(totalLegs)} />
        <StatCard label="Leg record" value={`${wonLegs}W · ${lostLegs}L · ${pendingLegs}P`} />
        <StatCard
          label="Settled win rate"
          value={ledgerPct !== null ? `${ledgerPct}%` : "—"}
          hint={settled ? `${settled} legs settled` : "No settled legs yet"}
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <div className="border-b border-white/10 bg-black/30 px-4 py-3 md:px-5">
          <h2 className="text-sm font-black uppercase tracking-wide text-white/70">Slip outcomes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-wide text-white/45">
                <th className="border-b border-white/10 px-4 py-3 md:px-5">Slip</th>
                <th className="border-b border-white/10 px-4 py-3 md:px-5">Tier</th>
                <th className="border-b border-white/10 px-4 py-3 md:px-5">Published</th>
                <th className="border-b border-white/10 px-4 py-3 md:px-5">Legs</th>
                <th className="border-b border-white/10 px-4 py-3 md:px-5">W / L / P</th>
                <th className="border-b border-white/10 px-4 py-3 md:px-5">Outcome</th>
                <th className="border-b border-white/10 px-4 py-3 text-right md:px-5">Open</th>
              </tr>
            </thead>
            <tbody>
              {slips.map((s, idx) => {
                const won = s.matches.filter((m) => m.resultStatus === "WON").length;
                const lost = s.matches.filter((m) => m.resultStatus === "LOST").length;
                const pending = s.matches.filter((m) => m.resultStatus === "PENDING").length;
                const headline =
                  lost > 0 ? "LOST" : pending > 0 ? "PENDING" : s.matches.length ? "WON" : "—";
                const color =
                  headline === "WON"
                    ? "text-emerald-300"
                    : headline === "LOST"
                      ? "text-rose-300"
                      : "text-amber-200";
                return (
                  <tr key={s.id} className={idx % 2 === 1 ? "bg-white/[0.02]" : ""}>
                    <td className="border-b border-white/[0.06] px-4 py-3 font-semibold text-white md:px-5">
                      {s.title}
                    </td>
                    <td className="border-b border-white/[0.06] px-4 py-3 text-xs text-white/70 md:px-5">
                      {SLIP_TIER_LABEL[s.tier] ?? s.tier}
                    </td>
                    <td className="border-b border-white/[0.06] whitespace-nowrap px-4 py-3 text-xs text-white/55 md:px-5">
                      {s.publishAt ? new Date(s.publishAt).toLocaleString("en-GB") : "—"}
                    </td>
                    <td className="border-b border-white/[0.06] px-4 py-3 font-mono text-white/80 md:px-5">
                      {s.matches.length}
                    </td>
                    <td className="border-b border-white/[0.06] px-4 py-3 font-mono text-xs text-white/65 md:px-5">
                      {won} / {lost} / {pending}
                    </td>
                    <td className={`border-b border-white/[0.06] px-4 py-3 text-xs font-black uppercase tracking-wide md:px-5 ${color}`}>
                      {headline}
                    </td>
                    <td className="border-b border-white/[0.06] px-4 py-3 text-right md:px-5">
                      <Link
                        href={`/slips/${s.slug}`}
                        className="text-xs font-bold text-[#7dd3fc] hover:underline"
                      >
                        Slip →
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {slips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-white/55">
                    No slips in the ledger yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="tmt-panel rounded-xl p-4">
      <div className="text-[10px] font-bold uppercase tracking-wide text-white/45">{label}</div>
      <div className="mt-1 font-mono text-xl font-black text-white">{value}</div>
      {hint ? <div className="mt-1 text-[11px] text-white/45">{hint}</div> : null}
    </div>
  );
}
