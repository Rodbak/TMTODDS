"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { addSlipToBetslip, getBetslip, type BetslipLine } from "@/lib/demo/betslip";
import { formatKickoffGmtLabel, isKickoffOnCalendarDay } from "@/lib/kickoff";
import {
  formatOdds,
  getStoredOddsFormat,
  type OddsFormat,
} from "@/lib/odds-format";
import { SLIP_TIER_LABEL } from "@/lib/plans";

type TabKey = "prematch" | "live" | "today" | "tomorrow";

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
  researchUrls: string[] | null; // Json column — Prisma returns parsed array
  resultStatus: "PENDING" | "WON" | "LOST" | "VOID";
  finalHomeScore: number | null;
  finalAwayScore: number | null;
};

type Slip = {
  id: string;
  title: string;
  slug: string;
  tier: SlipTier;
  publishAt: string | null;
  matches: SlipMatch[];
};

type ActivePlan = {
  includesFixed: boolean;
  includesConfirmed: boolean;
  includesCorrectScore: boolean;
} | null;

export function SlipsBoard({
  tab,
  tier,
  unlockedOnly,
  league,
}: {
  tab: string;
  tier: string;
  unlockedOnly: boolean;
  league: string;
}) {
  const [slips, setSlips] = useState<Slip[]>([]);
  const tabKey: TabKey =
    tab === "live" || tab === "today" || tab === "tomorrow" ? tab : "prematch";

  const [betslipTick, setBetslipTick] = useState(0);
  const [fmt, setFmt] = useState<OddsFormat>(() => getStoredOddsFormat());
  const [now, setNow] = useState(() => new Date());
  const [plan, setPlan] = useState<ActivePlan>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (cancelled) return;
      setPlan(data?.activePlan ?? null);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const p = new URLSearchParams();
      if (tier && tier !== "ALL") p.set("tier", tier);
      if (league) p.set("league", league);
      if (unlockedOnly) p.set("unlocked", "1");
      const qs = p.toString();
      const res = await fetch(`/api/slips${qs ? `?${qs}` : ""}`, { cache: "no-store" });
      const data = await res.json().catch(() => null);
      if (cancelled) return;
      setSlips(Array.isArray(data?.slips) ? data.slips : []);
    })();
    return () => {
      cancelled = true;
    };
  }, [tier, league, unlockedOnly]);

  useEffect(() => {
    const onOdds = () => setFmt(getStoredOddsFormat());
    const onBet = () => setBetslipTick((x) => x + 1);
    window.addEventListener("tmt-odds-format", onOdds);
    window.addEventListener("tmt-betslip", onBet);
    return () => {
      window.removeEventListener("tmt-odds-format", onOdds);
      window.removeEventListener("tmt-betslip", onBet);
    };
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const tierSet = new Set(["FREE", "FIXED", "CONFIRMED", "CORRECT_SCORE"]);
  const startOfToday = useMemo(() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [now]);
  const startOfTomorrow = useMemo(() => {
    const d = new Date(startOfToday);
    d.setDate(d.getDate() + 1);
    return d;
  }, [startOfToday]);

  const filtered = useMemo(() => {
    const leagueFilter = league.trim();
    return slips.filter((s) => {
      if (tier !== "ALL") {
        if (!tierSet.has(tier)) return false;
        if (s.tier !== tier) return false;
      }
      if (leagueFilter) {
        const hit = s.matches.some((m) => m.league === leagueFilter);
        if (!hit) return false;
      }
      if (unlockedOnly && !allowedTier(plan, s.tier)) return false;

      if (tabKey === "live") return false;

      if (tabKey === "today") {
        const pub = s.publishAt ? new Date(s.publishAt) : null;
        const pubToday = pub ? pub >= startOfToday && pub < startOfTomorrow : false;
        const kickToday = s.matches.some((m) =>
          m.kickoffAt ? isKickoffOnCalendarDay(m.kickoffAt, startOfToday) : false,
        );
        const ageMs = pub ? now.getTime() - pub.getTime() : null;
        const pubRollingRecent =
          ageMs !== null && ageMs >= 0 && ageMs <= 4 * 24 * 60 * 60 * 1000;
        if (!pubToday && !kickToday && !pubRollingRecent) return false;
      }

      if (tabKey === "tomorrow") {
        const kickTom = s.matches.some((m) =>
          m.kickoffAt ? isKickoffOnCalendarDay(m.kickoffAt, startOfTomorrow) : false,
        );
        const pub = s.publishAt ? new Date(s.publishAt) : null;
        const pubTom = pub
          ? pub >= startOfTomorrow &&
            pub < new Date(startOfTomorrow.getTime() + 86400000)
          : false;
        if (!kickTom && !pubTom) return false;
      }

      return true;
    });
  }, [
    slips,
    tier,
    league,
    unlockedOnly,
    tabKey,
    startOfToday,
    startOfTomorrow,
    plan,
    betslipTick,
  ]);

  const list = tabKey === "live" ? [] : filtered;

  return (
    <div className="grid gap-4">
      <div className="tmt-panel-strong rounded-2xl p-4 md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
              Football · Lines
            </div>
            <h1 className="mt-1 text-xl font-black tracking-tight text-white md:text-2xl">
              Slips board
            </h1>
            <p className="mt-1 max-w-xl text-sm text-white/55">
              Prematch-style lines: fixture, selection, odds, book. Use the betslip rail to mimic
              how users build slips on real apps.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button as="link" href="/login" variant="secondary" size="sm">
              Sign in
            </Button>
            <Button as="link" href="/#packages" variant="ghost" size="sm">
              VIP
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
          <BookTab href={buildQuery({ tab: "prematch", tier, league, unlocked: unlockedOnly })} label="Prematch" active={tabKey === "prematch"} />
          <BookTab href={buildQuery({ tab: "live", tier, league, unlocked: unlockedOnly })} label="Live" active={tabKey === "live"} />
          <BookTab href={buildQuery({ tab: "today", tier, league, unlocked: unlockedOnly })} label="Today" active={tabKey === "today"} />
          <BookTab
            href={buildQuery({ tab: "tomorrow", tier, league, unlocked: unlockedOnly })}
            label="Tomorrow"
            active={tabKey === "tomorrow"}
          />
          <Link href="/proof" className="ml-auto text-xs font-bold text-[#7dd3fc] hover:underline">
            Results →
          </Link>
        </div>
      </div>

      <div className="tmt-panel rounded-2xl p-4">
        <form action="/slips" method="get" className="grid gap-3 md:grid-cols-3">
          <input type="hidden" name="tab" value={tabKey} />
          <input type="hidden" name="league" value={league || ""} />
          <input type="hidden" name="unlocked" value={unlockedOnly ? "1" : ""} />

          <FilterSelect
            label="Tier"
            name="tier"
            value={tier}
            options={[
              ["ALL", "All tiers"],
              ["FREE", "Free"],
              ["FIXED", "Fixed"],
              ["CONFIRMED", "Confirmed"],
              ["CORRECT_SCORE", "Correct score"],
            ]}
          />

          <div className="md:col-span-2 flex flex-wrap items-end justify-between gap-2">
            <div className="text-sm text-white/55">
              Showing <span className="font-mono font-black text-white">{list.length}</span> lines
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" variant="secondary" size="sm">
                Apply filters
              </Button>
              <Button
                as="link"
                href={buildQuery({
                  tab: tabKey,
                  tier: tier === "ALL" ? undefined : tier,
                  league: league || undefined,
                  unlocked: unlockedOnly ? undefined : "1",
                })}
                variant="ghost"
                size="sm"
              >
                {unlockedOnly ? "All lines" : "Unlocked only"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      {tabKey === "live" ? (
        <div className="tmt-panel rounded-2xl border border-dashed border-white/15 p-8 text-center">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-rose-300/90">Live</div>
          <p className="mt-2 text-lg font-bold text-white">No live lines right now</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
            Same empty state users see on books when there are no in-play markets. Hook your feed
            API here later.
          </p>
          <div className="mt-4">
            <Button as="link" href={buildQuery({ tab: "prematch", tier, league })} variant="primary" size="sm">
              Back to prematch
            </Button>
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="tmt-panel rounded-2xl border border-dashed border-white/15 p-6 md:p-8">
          <p className="text-lg font-bold text-white">No lines match this view</p>
          <p className="mt-2 text-sm text-white/55">
            Try <strong className="text-white/80">Prematch</strong> for all demo fixtures, clear the league
            filter, or switch tier to <strong className="text-white/80">All tiers</strong>.
          </p>
          <ul className="mt-4 list-inside list-disc text-sm text-white/50">
            <li>Tomorrow only shows kicks dated for the next calendar day.</li>
            <li>Sign in with a demo account if you toggled &quot;Unlocked only&quot;.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button as="link" href={buildQuery({ tab: "prematch", tier: "ALL", league: "" })} variant="primary" size="sm">
              Reset to prematch
            </Button>
            <Button as="link" href="/login" variant="secondary" size="sm">
              Demo sign in
            </Button>
          </div>
        </div>
      ) : (
        <div className="tmt-panel overflow-hidden rounded-2xl">
          <div className="grid gap-3 p-3 md:hidden">
            {list.map((s) => (
              <SlipLineCard
                key={s.id}
                slip={s}
                plan={plan}
                fmt={fmt}
                onBetslipChange={() => setBetslipTick((x) => x + 1)}
              />
            ))}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[960px] border-separate border-spacing-0 text-sm">
              <thead className="sticky top-16 z-10 bg-[#0f1729] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] md:top-[4.25rem]">
                <tr className="text-left text-[10px] font-black uppercase tracking-wide text-white/45">
                  <th className="whitespace-nowrap px-3 py-2.5 md:px-4">Fixture</th>
                  <th className="whitespace-nowrap px-3 py-2.5 md:px-4">Date / Time</th>
                  <th className="whitespace-nowrap px-3 py-2.5 md:px-4">Selection</th>
                  <th className="whitespace-nowrap px-3 py-2.5 md:px-4">Odds</th>
                  <th className="whitespace-nowrap px-3 py-2.5 md:px-4">Book</th>
                  <th className="whitespace-nowrap px-3 py-2.5 md:px-4">Tier</th>
                  <th className="whitespace-nowrap px-3 py-2.5 md:px-4">Access</th>
                  <th className="whitespace-nowrap px-3 py-2.5 pr-4 text-right md:px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s, idx) => {
                  const m = s.matches[0];
                  const allowed = allowedTier(plan, s.tier);
                  const combined = combinedOdds(s);
                  const kick = m?.kickoffAt;
                  return (
                    <tr
                      key={s.id}
                      className={`border-t border-white/[0.06] transition hover:bg-white/[0.04] ${idx % 2 === 1 ? "bg-black/15" : ""}`}
                    >
                      <td className="px-3 py-2.5 align-top md:px-4">
                        <Link href={`/slips/${s.slug}`} className="font-semibold text-white hover:text-[#7dd3fc]">
                          {m ? `${m.homeTeam} — ${m.awayTeam}` : s.title}
                        </Link>
                        <div className="text-[11px] text-white/45">{m?.league ?? "Accumulator"}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 align-top text-xs text-white/60 md:px-4">
                        {formatKickoffGmtLabel(kick ?? undefined)}
                      </td>
                      <td className="max-w-[200px] px-3 py-2.5 align-top md:px-4">
                        {m ? (
                          <>
                            <span className="text-white/80">{m.market}</span>
                            <span className="text-white/35"> · </span>
                            <span className="font-bold text-[#b9ffd4]">{m.pick}</span>
                          </>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-3 py-2.5 align-top md:px-4">
                        <span className="tmt-odds font-mono text-sm">{formatOdds(combined, fmt)}</span>
                        <div className="text-[10px] text-white/35">{s.matches.length} leg(s)</div>
                      </td>
                      <td className="px-3 py-2.5 align-top text-xs text-white/65 md:px-4">
                        {m?.bookmaker ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 align-top md:px-4">
                        <TierBadge tier={s.tier} />
                      </td>
                      <td className="px-3 py-2.5 align-top md:px-4">
                        <span
                          className={
                            allowed
                              ? "text-[11px] font-black uppercase tracking-wide text-emerald-300"
                              : "text-[11px] font-black uppercase tracking-wide text-amber-200"
                          }
                        >
                          {allowed ? "Unlocked" : "Locked"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right align-top md:px-4">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <Button as="link" href={`/slips/${s.slug}`} variant="secondary" size="sm">
                            View slip
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={getBetslip().some((l) => l.slipId === s.id)}
                            onClick={() => {
                              const line: BetslipLine = {
                                slipId: s.id,
                                slug: s.slug,
                                title: s.title,
                                combinedDecimal: combined,
                                legs: Math.max(1, s.matches.length),
                                league: m?.league ?? undefined,
                              };
                              addSlipToBetslip(line);
                              setBetslipTick((x) => x + 1);
                            }}
                          >
                            {getBetslip().some((l) => l.slipId === s.id) ? "In slip" : "Add to slip"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function SlipLineCard({
  slip: s,
  plan,
  fmt,
  onBetslipChange,
}: {
  slip: Slip;
  plan: ActivePlan;
  fmt: OddsFormat;
  onBetslipChange: () => void;
}) {
  const m = s.matches[0];
  const allowed = allowedTier(plan, s.tier);
  const combined = combinedOdds(s);
  const kick = m?.kickoffAt;
  const inSlip = getBetslip().some((l) => l.slipId === s.id);

  return (
    <div className="rounded-xl border border-white/10 bg-black/25 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/slips/${s.slug}`} className="font-semibold text-white hover:text-[#7dd3fc]">
            {m ? `${m.homeTeam} — ${m.awayTeam}` : s.title}
          </Link>
          <div className="text-[11px] text-white/45">{m?.league ?? "Accumulator"}</div>
        </div>
        <TierBadge tier={s.tier} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
        <span>{formatKickoffGmtLabel(kick ?? undefined)}</span>
        <span className="text-white/35">·</span>
        <span>
          {m ? (
            <>
              {m.market} <span className="text-[#b9ffd4]">{m.pick}</span>
            </>
          ) : (
            "—"
          )}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="tmt-odds font-mono">{formatOdds(combined, fmt)}</span>
          <span className="ml-2 text-[10px] text-white/40">{m?.bookmaker ?? "—"}</span>
        </div>
        <span className={allowed ? "text-[10px] font-black uppercase text-emerald-300" : "text-[10px] font-black uppercase text-amber-200"}>
          {allowed ? "Unlocked" : "Locked"}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        <Button as="link" href={`/slips/${s.slug}`} variant="secondary" size="sm" className="flex-1">
          View slip
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          disabled={inSlip}
          onClick={() => {
            addSlipToBetslip({
              slipId: s.id,
              slug: s.slug,
              title: s.title,
              combinedDecimal: combined,
              legs: Math.max(1, s.matches.length),
              league: m?.league ?? undefined,
            });
            onBetslipChange();
          }}
        >
          {inSlip ? "In slip" : "Add"}
        </Button>
      </div>
    </div>
  );
}

function combinedOdds(s: Slip): number {
  if (!s.matches.length) return 1;
  return s.matches.reduce((acc, m) => acc * m.odds, 1);
}

function TierBadge({ tier }: { tier: string }) {
  const label = SLIP_TIER_LABEL[tier] ?? tier;
  const cls =
    tier === "FREE"
      ? "border-white/15 bg-white/10 text-white"
      : tier === "FIXED"
        ? "border-sky-400/30 bg-sky-500/15 text-sky-100"
        : tier === "CONFIRMED"
          ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-100"
          : "border-fuchsia-400/35 bg-fuchsia-500/15 text-fuchsia-100";
  return (
    <span className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

function allowedTier(plan: ActivePlan, tier: SlipTier) {
  if (tier === "FREE") return true;
  if (!plan) return false;
  if (tier === "FIXED") return Boolean(plan.includesFixed);
  if (tier === "CONFIRMED") return Boolean(plan.includesConfirmed);
  if (tier === "CORRECT_SCORE") return Boolean(plan.includesCorrectScore);
  return false;
}

function BookTab({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <a
      href={href}
      className={
        active
          ? "inline-flex items-center rounded-lg bg-[#00e676] px-3 py-2 text-xs font-black text-black"
          : "inline-flex items-center rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs font-bold text-white/75 hover:border-white/20 hover:bg-white/5"
      }
    >
      {label}
    </a>
  );
}

function FilterSelect({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: Array<[string, string]>;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wide text-white/45">{label}</span>
      <select
        name={name}
        defaultValue={value}
        className="h-10 rounded-lg border border-white/10 bg-black/40 px-3 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-[#00e676]/25"
      >
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}

function buildQuery(params: Record<string, string | boolean | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === "" || v === false) continue;
    sp.set(k, String(v));
  }
  const q = sp.toString();
  return q ? `/slips?${q}` : "/slips";
}
