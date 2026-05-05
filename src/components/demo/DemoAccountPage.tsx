"use client";

import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { DEMO_SLIPS } from "@/lib/demo/data";
import {
  demoDaysRemaining,
  demoProgressUsed,
  demoSubscriptionEndsAt,
} from "@/lib/demo/subscription-demo";
import {
  clearDemoSession,
  getDemoSession,
  planByKey,
  setDemoSession,
  type DemoSession,
} from "@/lib/demo/session";
import { SLIP_TIER_LABEL } from "@/lib/plans";

export function DemoAccountPage() {
  const [session] = useState<DemoSession | null>(() => {
    const s = getDemoSession();
    if (s?.activePlanKey && !s.subscriptionStartedAt) {
      const next = { ...s, subscriptionStartedAt: new Date().toISOString() };
      setDemoSession(next);
      return next;
    }
    return s;
  });
  const [pending, startTransition] = useTransition();

  const activePlan = useMemo(
    () => planByKey(session?.activePlanKey ?? null),
    [session?.activePlanKey],
  );

  const endsAt = useMemo(
    () => (session && activePlan ? demoSubscriptionEndsAt(session, activePlan) : null),
    [session, activePlan],
  );

  const startedAt = (() => {
    if (!session?.subscriptionStartedAt) return null;
    const d = new Date(session.subscriptionStartedAt);
    return Number.isNaN(d.getTime()) ? null : d;
  })();

  const daysLeft = endsAt ? demoDaysRemaining(endsAt) : 0;
  const progress =
    startedAt && endsAt ? demoProgressUsed(startedAt, endsAt) : activePlan ? 0.15 : 0;

  const referralCode = useMemo(() => {
    if (!session) return "—";
    const raw = session.user.id.replace(/\W/g, "").toUpperCase().slice(-6) || "DEMO";
    return `TMT-${raw}`;
  }, [session]);

  const accessibleTiers = useMemo(() => {
    if (!activePlan) return ["FREE"] as const;
    const t: string[] = ["FREE"];
    if (activePlan.includesFixed) t.push("FIXED");
    if (activePlan.includesConfirmed) t.push("CONFIRMED");
    if (activePlan.includesCorrectScore) t.push("CORRECT_SCORE");
    return t;
  }, [activePlan]);

  const slipCount = DEMO_SLIPS.filter((s) => {
    if (s.tier === "FREE") return true;
    if (!activePlan) return false;
    if (s.tier === "FIXED") return activePlan.includesFixed;
    if (s.tier === "CONFIRMED") return activePlan.includesConfirmed;
    if (s.tier === "CORRECT_SCORE") return activePlan.includesCorrectScore;
    return false;
  }).length;

  if (!session) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Account</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-white/60">Sign in to see your plan, access, and quick links.</p>
        <div className="mt-6">
          <Button as="link" href="/login" variant="primary">
            Demo sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Account</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-white/55">
        Welcome back, <span className="font-semibold text-white/85">{session.user.email}</span>
      </p>

      <div className="mt-8 grid gap-5">
        <section className="tmt-panel-strong rounded-2xl p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                Active plan
              </div>
              {activePlan ? (
                <>
                  <h2 className="mt-1 text-xl font-black text-white">{activePlan.name}</h2>
                  <p className="mt-1 font-mono text-lg font-black text-[#b9ffd4]">₵{activePlan.priceGhs} GHS</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-white/60">No plan on this demo session.</p>
              )}
            </div>
            {activePlan ? (
              <Button as="link" href="/#packages" variant="primary" size="sm">
                Change plan
              </Button>
            ) : (
              <Button as="link" href="/#packages" variant="primary" size="sm">
                View packages
              </Button>
            )}
          </div>

          {activePlan && endsAt && startedAt ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {activePlan.includesFixed ? <TierChip label="Fixed" /> : null}
                {activePlan.includesConfirmed ? <TierChip label="Confirmed" /> : null}
                {activePlan.includesCorrectScore ? <TierChip label="Correct score" /> : null}
              </div>
              <div className="mt-5">
                <div className="flex flex-wrap justify-between gap-2 text-xs text-white/55">
                  <span>Started {startedAt.toLocaleString("en-GB")}</span>
                  <span className="font-semibold text-white/80">
                    Renews / ends {endsAt.toLocaleString("en-GB")}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00e676] to-[#1e88e5] transition-all"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-white/45">
                  Demo: period length is from your plan&apos;s <span className="font-semibold text-white/70">{activePlan.durationDays} days</span>.{" "}
                  <span className="font-mono font-bold text-white/70">{daysLeft}</span> day
                  {daysLeft === 1 ? "" : "s"} left (illustrative).
                </p>
              </div>
            </>
          ) : null}
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
            What you can open
          </div>
          <p className="mt-1 text-sm text-white/55">
            You can browse roughly <span className="font-mono font-bold text-white">{slipCount}</span> demo slips
            with your current access.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {accessibleTiers.map((t) => (
              <Button
                key={t}
                as="link"
                href={t === "FREE" ? "/slips?tier=FREE" : `/slips?tier=${encodeURIComponent(t)}`}
                variant="secondary"
                size="sm"
              >
                {SLIP_TIER_LABEL[t] ?? t}
              </Button>
            ))}
          </div>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Referrals (demo)</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <code className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-[#b9ffd4]">
              {referralCode}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                void navigator.clipboard.writeText(referralCode);
              }}
            >
              Copy code
            </Button>
          </div>
          <p className="mt-2 text-xs text-white/45">Points: 0 — redemption rules ship with production.</p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Quick links</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <Button as="link" href="/slips" variant="secondary" size="sm">
              Slips board
            </Button>
            <Button as="link" href="/proof" variant="secondary" size="sm">
              Proof & results
            </Button>
            <Button as="link" href="/#packages" variant="secondary" size="sm">
              VIP packages
            </Button>
            {session.user.role === "ADMIN" ? (
              <Button as="link" href="/admin" variant="secondary" size="sm">
                Admin
              </Button>
            ) : null}
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={() => {
              startTransition(() => {
                clearDemoSession();
                window.location.href = "/";
              });
            }}
          >
            {pending ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </div>
    </main>
  );
}

function TierChip({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-bold text-white/80">
      {label}
    </span>
  );
}
