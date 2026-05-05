"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { addSlipToBetslip, getBetslip } from "@/lib/demo/betslip";
import { formatKickoffLabel } from "@/lib/kickoff";
import {
  formatOdds,
  getStoredOddsFormat,
  type OddsFormat,
} from "@/lib/odds-format";
import { SLIP_TIER_LABEL } from "@/lib/plans";

type SlipTier = "FREE" | "FIXED" | "CONFIRMED" | "CORRECT_SCORE";
type SlipMatch = {
  id: string;
  kickoffAt: string | null;
  league: string | null;
  homeTeam: string;
  awayTeam: string;
  market: string;
  pick: string;
  odds: number;
  bookmaker: string | null;
  bestSiteUrl: string | null;
  resultStatus: "PENDING" | "WON" | "LOST" | "VOID";
  finalHomeScore: number | null;
  finalAwayScore: number | null;
};

export type Slip = {
  id: string;
  title: string;
  slug: string;
  tier: SlipTier;
  publishAt: string | null;
  bodyMd: string;
  matches: SlipMatch[];
};

export function SlipBody({ slip, allowed }: { slip: Slip; allowed: boolean }) {
  const [fmt, setFmt] = useState<OddsFormat>(() => getStoredOddsFormat());
  const [now, setNow] = useState(() => new Date());
  const [slipBetTick, setSlipBetTick] = useState(0);

  useEffect(() => {
    const onOdds = () => setFmt(getStoredOddsFormat());
    window.addEventListener("tmt-odds-format", onOdds);
    return () => window.removeEventListener("tmt-odds-format", onOdds);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const on = () => setSlipBetTick((t) => t + 1);
    window.addEventListener("tmt-betslip", on);
    return () => window.removeEventListener("tmt-betslip", on);
  }, []);

  const combined =
    slip.matches.length > 0 ? slip.matches.reduce((a, m) => a * m.odds, 1) : 1;
  const inSlip = useMemo(
    () => getBetslip().some((l) => l.slipId === slip.id),
    [slipBetTick, slip.id],
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 md:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
            {SLIP_TIER_LABEL[slip.tier] ?? slip.tier}
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">{slip.title}</h1>
          <div className="mt-1 text-xs text-white/50">
            Published {slip.publishAt ? new Date(slip.publishAt).toLocaleString("en-GB") : "—"}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              allowed
                ? "rounded-md border border-emerald-400/35 bg-emerald-500/15 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-emerald-200"
                : "rounded-md border border-amber-400/35 bg-amber-500/15 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-amber-100"
            }
          >
            {allowed ? "Unlocked" : "Locked"}
          </span>
          <Button
            variant="primary"
            size="sm"
            disabled={inSlip}
            onClick={() => {
              addSlipToBetslip({
                slipId: slip.id,
                slug: slip.slug,
                title: slip.title,
                combinedDecimal: combined,
                legs: Math.max(1, slip.matches.length),
                league: slip.matches[0]?.league ?? undefined,
              });
              setSlipBetTick((x) => x + 1);
            }}
          >
            {inSlip ? "In betslip" : "Add all to slip"}
          </Button>
        </div>
      </div>

      {!allowed ? (
        <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-5">
          <div className="font-bold text-white">Premium slip</div>
          <p className="mt-1 text-sm text-white/60">Subscribe to unlock this tier.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button as="link" href="/#packages">
              View packages
            </Button>
            <Button as="link" href="/login" variant="secondary">
              Sign in
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <div className="prose prose-invert max-w-none prose-p:text-white/75 prose-headings:text-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{slip.bodyMd}</ReactMarkdown>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-black text-white md:text-xl">Selections</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-white/50">Combined (demo)</span>
            <span className="tmt-odds font-mono">{formatOdds(combined, fmt)}</span>
            <Link href="/proof" className="font-semibold text-[#7dd3fc] hover:underline">
              Proof →
            </Link>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm">
            <thead className="bg-black/30">
              <tr className="text-left text-[10px] font-black uppercase tracking-wide text-white/45">
                <th className="border-b border-white/10 px-3 py-2.5 md:px-4">Fixture</th>
                <th className="border-b border-white/10 px-3 py-2.5 md:px-4">Kickoff</th>
                <th className="border-b border-white/10 px-3 py-2.5 md:px-4">Market</th>
                <th className="border-b border-white/10 px-3 py-2.5 md:px-4">Pick</th>
                <th className="border-b border-white/10 px-3 py-2.5 md:px-4">Odds</th>
                <th className="border-b border-white/10 px-3 py-2.5 md:px-4">Book</th>
                <th className="border-b border-white/10 px-3 py-2.5 md:px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {slip.matches.map((m, idx) => (
                <tr key={m.id} className={idx % 2 === 1 ? "bg-black/20" : ""}>
                  <td className="border-b border-white/[0.06] px-3 py-3 font-semibold text-white md:px-4">
                    {m.homeTeam} — {m.awayTeam}
                    <div className="text-[11px] font-normal text-white/45">{m.league ?? "—"}</div>
                  </td>
                  <td className="border-b border-white/[0.06] whitespace-nowrap px-3 py-3 text-xs text-white/60 md:px-4">
                    {formatKickoffLabel(m.kickoffAt ?? undefined, now)}
                  </td>
                  <td className="border-b border-white/[0.06] px-3 py-3 text-white/80 md:px-4">{m.market}</td>
                  <td className="border-b border-white/[0.06] px-3 py-3 font-bold text-[#b9ffd4] md:px-4">{m.pick}</td>
                  <td className="border-b border-white/[0.06] px-3 py-3 md:px-4">
                    <span className="tmt-odds font-mono text-sm">{formatOdds(m.odds, fmt)}</span>
                  </td>
                  <td className="border-b border-white/[0.06] px-3 py-3 text-xs text-white/65 md:px-4">
                    {m.bookmaker ?? "—"}
                    {m.bestSiteUrl ? (
                      <div>
                        <a
                          href={m.bestSiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#7dd3fc] hover:underline"
                        >
                          Best site
                        </a>
                      </div>
                    ) : null}
                  </td>
                  <td className="border-b border-white/[0.06] px-3 py-3 md:px-4">
                    <span
                      className={
                        m.resultStatus === "WON"
                          ? "font-bold text-emerald-300"
                          : m.resultStatus === "LOST"
                            ? "font-bold text-rose-300"
                            : m.resultStatus === "VOID"
                              ? "text-white/50"
                              : "font-bold text-amber-200"
                      }
                    >
                      {m.resultStatus ?? "PENDING"}
                    </span>
                    {m.finalHomeScore != null && m.finalAwayScore != null ? (
                      <div className="text-[11px] text-white/45">
                        FT {m.finalHomeScore}-{m.finalAwayScore}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
              {slip.matches.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-white/55">
                    No selections on this slip.
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
