"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { SportsbookShell } from "@/components/SportsbookShell";
import { BetslipSidebar } from "@/components/demo/BetslipSidebar";
import { FloatingBetslipFab } from "@/components/demo/FloatingBetslipFab";
import { SlipsBoard } from "@/components/demo/SlipsBoard";
import { SLIP_TIER_LABEL } from "@/lib/plans";

export function SlipsPageClient() {
  const sp = useSearchParams();
  const tab = sp.get("tab") ?? "prematch";
  const tier = sp.get("tier") ?? "ALL";
  const unlockedOnly = sp.get("unlocked") === "1";
  const league = sp.get("league") ?? "";

  const [slips, setSlips] = useState<Slip[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/slips", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (cancelled) return;
      setSlips(Array.isArray(data?.slips) ? (data.slips as Slip[]) : []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SportsbookShell
      left={
        <LeftDemoSidebar
          tab={tab}
          tier={tier}
          league={league}
          unlockedOnly={unlockedOnly}
          slips={slips}
        />
      }
      main={
        <>
          <SlipsBoard
            tab={tab}
            tier={tier}
            unlockedOnly={unlockedOnly}
            league={league}
          />
          <FloatingBetslipFab />
        </>
      }
      right={<BetslipSidebar />}
    />
  );
}

function LeftDemoSidebar({
  tab,
  tier,
  league,
  unlockedOnly,
  slips,
}: {
  tab: string;
  tier: string;
  league: string;
  unlockedOnly: boolean;
  slips: Slip[];
}) {
  const { tierCounts, topLeagues } = useMemo(() => {
    const tierCounts: Record<string, number> = {};
    const leagueCounts: Record<string, number> = {};
    for (const s of slips) {
      tierCounts[s.tier] = (tierCounts[s.tier] ?? 0) + 1;
      for (const m of s.matches ?? []) {
        if (!m?.league) continue;
        leagueCounts[m.league] = (leagueCounts[m.league] ?? 0) + 1;
      }
    }
    const topLeagues = Object.entries(leagueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    return { tierCounts, topLeagues };
  }, [slips]);

  const slipHref = (overrides: { tier?: string; league?: string } = {}) => {
    const p = new URLSearchParams();
    p.set("tab", tab || "prematch");
    const tierVal = overrides.tier !== undefined ? overrides.tier : tier;
    if (tierVal && tierVal !== "ALL") p.set("tier", tierVal);
    if (unlockedOnly) p.set("unlocked", "1");
    const leagueVal = overrides.league !== undefined ? overrides.league : league;
    if (leagueVal) p.set("league", leagueVal);
    const s = p.toString();
    return s ? `/slips?${s}` : "/slips";
  };

  return (
    <div className="tmt-panel rounded-2xl p-4">
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
        Sports
      </div>
      <div className="mt-3 grid gap-1.5 text-sm">
        <Link
          href="/"
          className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-semibold text-white/85 hover:bg-white/10"
        >
          Home <span className="text-white/35">→</span>
        </Link>
        <span className="flex items-center justify-between rounded-lg border border-[#00e676]/35 bg-[#00e676]/10 px-3 py-2 font-black text-[#b9ffd4]">
          Football <span className="text-[#00e676]">●</span>
        </span>
      </div>

      <div className="my-4 h-px bg-white/10" />
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
        Leagues
      </div>
      <div className="mt-2 grid max-h-[280px] gap-1 overflow-y-auto pr-0.5">
        <Link
          href={slipHref({ league: "" })}
          className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-semibold ${
            !league
              ? "border-[#00e676]/40 bg-[#00e676]/10 text-white"
              : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
          }`}
        >
          All leagues
        </Link>
        {topLeagues.map(([name, n]) => (
          <Link
            key={name}
            href={slipHref({ league: name })}
            className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-semibold ${
              league === name
                ? "border-[#00e676]/40 bg-[#00e676]/10 text-white"
                : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
            }`}
          >
            <span className="truncate pr-2">{name}</span>
            <span className="shrink-0 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-black text-white/70">
              {n}
            </span>
          </Link>
        ))}
      </div>

      <div className="my-4 h-px bg-white/10" />
      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
        Tiers
      </div>
      <div className="mt-2 grid gap-1.5">
        {(["FREE", "FIXED", "CONFIRMED", "CORRECT_SCORE"] as const).map((t) => (
          <Link
            key={t}
            href={slipHref({ tier: t, league })}
            className={`flex items-center justify-between rounded-lg border px-2.5 py-2 text-xs font-semibold ${
              tier === t
                ? "border-[#1e88e5]/40 bg-[#1e88e5]/15 text-[#90caf9]"
                : "border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
            }`}
          >
            <span>{SLIP_TIER_LABEL[t] ?? t}</span>
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-black text-white/70">
              {tierCounts[t] ?? 0}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

type SlipMatch = {
  league?: string | null;
};

type Slip = {
  tier: string;
  matches?: SlipMatch[];
};

