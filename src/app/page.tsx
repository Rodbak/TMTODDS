import Link from "next/link";
import { DemoModeCallout } from "@/components/demo/DemoModeCallout";

import { Button } from "@/components/ui/button";
import { SportsbookShell } from "@/components/SportsbookShell";
import { SLIP_TIER_LABEL } from "@/lib/plans";
import { DEMO_PLANS, DEMO_SLIPS } from "@/lib/demo/data";
import { formatKickoffGmtLabel } from "@/lib/kickoff";

const MARQUEE_ITEMS = [
  "Live slip board",
  "Bookmaker links",
  "Odds & markets",
  "Proof & results",
  "VIP tiers",
  "Ghana Cedis pricing",
  "Instant unlock (demo)",
  "Match research links",
];

const FEATURES = [
  {
    title: "Daily Slip Board",
    body: "Browse free and VIP picks across top leagues. Updated every matchday.",
    icon: "grid",
  },
  {
    title: "Verified Proof",
    body: "Every pick is logged with outcome. Win, lose, or pending — we show it all.",
    icon: "shield",
  },
  {
    title: "Flexible Packages",
    body: "Weekly or monthly access. Start free, upgrade when you're ready.",
    icon: "layers",
  },
];

export default async function Home() {
  const plans = DEMO_PLANS;
  const slips = DEMO_SLIPS.slice(0, 10);
  const featuredPlanKey = "confirmed_weekly";

  const tierCounts = countBy(DEMO_SLIPS.map((s) => s.tier));
  const leagueCounts = countBy(
    DEMO_SLIPS.flatMap((s) => s.matches.map((m) => m.league).filter(Boolean)).map((x) => x as string),
  );
  const topLeagues = Object.entries(leagueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <main className="flex flex-col">
      <section className="tmt-hero relative overflow-hidden">
        <div className="relative z-[1] mx-auto max-w-[1280px] px-4 pb-14 pt-12 md:px-5 md:pb-20 md:pt-16">
          <HeroPlayersBanner />
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
            Ghana · Football · Premium slip delivery
          </p>
          <h1 className="mx-auto mt-4 max-w-[920px] text-center text-[clamp(2rem,5vw,3.25rem)] font-black leading-[1.08] tracking-tight text-white">
            Ghana&apos;s #1 Football Betting Slips — Delivered Daily
          </h1>
          <p className="mx-auto mt-5 max-w-[640px] text-center text-base leading-relaxed text-white/65 md:text-lg">
            Fixed matches, confirmed picks, and correct scores — curated for Ghanaian bettors. Free picks daily. VIP
            tiers for serious players.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button as="link" href="/slips" variant="primary" size="md">
              See Today&apos;s Slips
            </Button>
            <Button as="link" href="/#packages" variant="secondary" size="md">
              View VIP Packages
            </Button>
            <Link
              href="/proof"
              className="text-sm font-semibold text-[#7dd3fc] underline-offset-4 hover:underline"
            >
              Check Proof &amp; Results
            </Link>
          </div>
          <div className="mx-auto mt-12 grid max-w-[720px] grid-cols-2 gap-3 sm:grid-cols-4">
            <HeroStat value={`${DEMO_SLIPS.length}+`} label="Demo slips" />
            <HeroStat value="4" label="Access tiers" />
            <HeroStat value="GHS" label="Local pricing" />
            <HeroStat value="24/7" label="Board access" />
          </div>
          <p className="mx-auto mt-8 max-w-[640px] px-2 text-center text-[10px] leading-relaxed text-white/38">
            Hero photos via{" "}
            <a
              className="text-[#7dd3fc]/80 underline-offset-2 hover:underline"
              href="https://commons.wikimedia.org/"
              target="_blank"
              rel="noreferrer"
            >
              Wikimedia Commons
            </a>{" "}
            (free licenses).
          </p>
        </div>
      </section>

      <div className="border-b border-white/[0.06] bg-[#0a101c] px-4 py-3 text-center md:px-5">
        <p className="text-xs text-white/55">
          <span className="font-bold text-white/80">How to explore:</span>{" "}
          <Link className="font-semibold text-[#7dd3fc] hover:underline" href="/slips">
            Pick a league
          </Link>
          <span className="text-white/40"> → </span>
          <span className="text-white/70">add lines to your slip</span>
          <span className="text-white/40"> → </span>
          <Link className="font-semibold text-[#7dd3fc] hover:underline" href="/#packages">
            unlock VIP
          </Link>
        </p>
      </div>

      <div className="border-y border-white/[0.08] bg-[#080c14] py-3">
        <div className="tmt-marquee-mask overflow-hidden">
          <div className="tmt-marquee-track">
            {MARQUEE_ITEMS.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/70"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="border-b border-white/[0.06] bg-[#0a101c] py-14 md:py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
              Unmatched clarity for your audience
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
              Built for Ghanaian bettors who want real picks, real proof, and real value.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="tmt-feature-card">
                <FeatureIcon name={f.icon} />
                <h3 className="mt-3 text-base font-bold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SportsbookShell
        left={
          <div className="tmt-panel rounded-2xl p-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Quick nav</div>
            <div className="mt-3 grid gap-2">
              <NavItem href="/slips" label="Slips board" right={<CountBadge n={DEMO_SLIPS.length} />} />
              <NavItem href="/proof" label="Proof results" />
              <NavItem href="/blog" label="News & blog" />
              <NavItem href="/account" label="Dashboard" />
            </div>
            <div className="my-4 h-px bg-white/10" />
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Hot leagues</div>
            <div className="mt-2 grid gap-1.5">
              {topLeagues.length ? (
                topLeagues.map(([name, n]) => <LeagueRow key={name} name={name} count={n} />)
              ) : (
                <LeagueRow name="—" count={0} />
              )}
            </div>
            <div className="my-4 h-px bg-white/10" />
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Tiers</div>
            <div className="mt-2 grid gap-1.5">
              <TierRow tier="FREE" count={tierCounts.FREE ?? 0} />
              <TierRow tier="FIXED" count={tierCounts.FIXED ?? 0} />
              <TierRow tier="CONFIRMED" count={tierCounts.CONFIRMED ?? 0} />
              <TierRow tier="CORRECT_SCORE" count={tierCounts.CORRECT_SCORE ?? 0} />
            </div>
          </div>
        }
        main={
          <div className="grid gap-5">
            <div className="tmt-panel-strong flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                  Live board preview
                </div>
                <p className="mt-1 text-lg font-black text-white md:text-xl">Today&apos;s slip lines</p>
                <p className="mt-1 max-w-xl text-sm text-white/55">
                  Each row mirrors a sportsbook line: fixture, market, and displayed odds.
                </p>
              </div>
              <Button as="link" href="/slips" variant="primary" size="sm">
                Open full board
              </Button>
            </div>

            <div className="tmt-panel overflow-hidden rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/20 px-4 py-3 md:px-5">
                <span className="text-xs font-black uppercase tracking-wide text-white/80">Fixture</span>
                <span className="hidden text-xs font-black uppercase tracking-wide text-white/80 sm:inline">
                  Date / Time
                </span>
                <span className="hidden text-xs font-black uppercase tracking-wide text-white/80 sm:inline">
                  Market / pick
                </span>
                <span className="text-xs font-black uppercase tracking-wide text-white/80">Tier</span>
                <span className="text-xs font-black uppercase tracking-wide text-white/80">Odds</span>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {slips.map((s) => {
                  const m = s.matches[0];
                  return (
                    <div
                      key={s.id}
                      className="flex flex-wrap items-center gap-3 px-4 py-3 transition hover:bg-white/[0.03] md:flex-nowrap md:gap-4 md:px-5"
                    >
                      <div className="min-w-0 flex-1">
                        <Link href={`/slips/${s.slug}`} className="font-semibold text-white hover:text-[#7dd3fc]">
                          {m ? `${m.homeTeam} — ${m.awayTeam}` : s.title}
                        </Link>
                        <div className="mt-0.5 text-[11px] text-white/45">
                          {m?.league ?? "Slip"} · {s.title}
                        </div>
                      </div>
                      <div className="hidden min-w-[160px] text-sm text-white/70 sm:block">
                        {formatKickoffGmtLabel(m?.kickoffAt)}
                      </div>
                      <div className="hidden min-w-[140px] text-sm text-white/70 sm:block">
                        {m ? (
                          <>
                            <span className="text-white/90">{m.market}</span>
                            <span className="text-white/45"> · </span>
                            <span className="font-semibold text-[#b9ffd4]">{m.pick}</span>
                          </>
                        ) : (
                          "—"
                        )}
                      </div>
                      <TierPill tier={s.tier} />
                      <div className="flex items-center gap-2 md:ml-auto">
                        {m ? <span className="tmt-odds">{m.odds.toFixed(2)}</span> : <span className="tmt-odds">—</span>}
                        <Button as="link" href={`/slips/${s.slug}`} variant="secondary" size="sm">
                          Slip
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-white/10 bg-black/15 px-4 py-3 text-center md:px-5">
                <Link href="/slips" className="text-xs font-bold text-[#7dd3fc] hover:underline">
                  View all slips & filters →
                </Link>
              </div>
            </div>
          </div>
        }
        right={
          <section id="packages" className="tmt-glow tmt-panel-strong rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">VIP access</div>
                <h2 className="mt-1 text-xl font-black text-white">Packages</h2>
                <p className="mt-1 text-sm text-white/55">Subscribe in demo mode for instant local unlock.</p>
              </div>
              <span className="shrink-0 rounded-md border border-[#1e88e5]/40 bg-[#1e88e5]/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#90caf9]">
                Demo
              </span>
            </div>
            <div className="mt-5 grid gap-3">
              <DemoModeCallout />
              <PricingCards plans={plans} featuredKey={featuredPlanKey} />
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-white/45">
              Production: Paystack checkout, webhooks, and WhatsApp delivery wire in behind the same UI.
            </p>
          </section>
        }
      />

      <section className="border-t border-white/[0.06] bg-[#060a12] py-12">
        <div className="mx-auto max-w-[1280px] px-4 md:px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-xl font-black tracking-tight text-white md:text-2xl">Why Trust TMTODDS?</h2>
          </div>
          <div className="mx-auto mt-6 grid max-w-4xl gap-3 md:grid-cols-3">
            <TrustCard icon="✅" title="200+ Slips Delivered" body="A steady pipeline of picks across matchdays." />
            <TrustCard icon="📊" title="Win rate tracked publicly" body="Proof & results ledger stays visible." />
            <TrustCard icon="🇬🇭" title="Built for Ghana" body="Local pricing, local context, clear UX." />
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroPlayersBanner() {
  return (
    <div className="relative mb-8 w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
      <div className="relative h-[240px] md:h-[420px]">
        <div className="grid h-full grid-cols-2 md:grid-cols-4">
          <img
            className="h-full w-full object-cover"
            src="/assets/images/players/player1.jpg"
            alt="Football player"
            loading="eager"
          />
          <img
            className="h-full w-full object-cover"
            src="/assets/images/players/player2.jpg"
            alt="Football player"
            loading="eager"
          />
          <img
            className="hidden h-full w-full object-cover md:block"
            src="/assets/images/players/player3.jpg"
            alt="Football player"
            loading="lazy"
          />
          <img
            className="hidden h-full w-full object-cover md:block"
            src="/assets/images/players/player4.jpg"
            alt="Football player"
            loading="lazy"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.55)] to-transparent" />

        <div className="absolute left-5 top-1/2 -translate-y-1/2 md:left-10">
          <div className="text-4xl font-black tracking-tight text-white md:text-6xl">TMTODDS</div>
          <div className="mt-2 h-[3px] w-24 bg-[#00c853]" />
        </div>
      </div>
    </div>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center">
      <div className="text-lg font-black text-white md:text-xl">{value}</div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-white/45">{label}</div>
    </div>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const common = "h-10 w-10 rounded-lg border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02]";
  if (name === "shield") {
    return (
      <div className={`${common} flex items-center justify-center text-[#7dd3fc]`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3 20 7v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  }
  if (name === "layers") {
    return (
      <div className={`${common} flex items-center justify-center text-[#b9ffd4]`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3 22 8 12 13 2 8 12 3Z" stroke="currentColor" strokeWidth="2" />
          <path d="M2 12 12 17 22 12" stroke="currentColor" strokeWidth="2" />
          <path d="M2 16 12 21 22 16" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  }
  return (
    <div className={`${common} flex items-center justify-center text-white/80`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

function TrustCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-sm font-black text-white">{title}</div>
      <div className="mt-1 text-sm text-white/60">{body}</div>
    </div>
  );
}

function NavItem({
  href,
  label,
  right,
}: {
  href: string;
  label: string;
  right?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-semibold text-white/85 transition hover:border-white/15 hover:bg-white/[0.06]"
    >
      <span>{label}</span>
      {right}
    </Link>
  );
}

function LeagueRow({ name, count }: { name: string; count: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2">
      <span className="truncate text-xs font-medium text-white/75">{name}</span>
      {count ? <CountBadge n={count} /> : <span className="text-[10px] font-bold text-white/25">—</span>}
    </div>
  );
}

function TierPill({ tier }: { tier: string }) {
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
    <span
      className={`inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}

function TierRow({ tier, count }: { tier: string; count: number }) {
  return (
    <Link
      href={`/slips?tier=${encodeURIComponent(tier)}`}
      className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-2 hover:bg-white/[0.05]"
    >
      <span className="text-xs font-medium text-white/75">{SLIP_TIER_LABEL[tier] ?? tier}</span>
      <CountBadge n={count} />
    </Link>
  );
}

function CountBadge({ n }: { n: number }) {
  return (
    <span className="inline-flex min-w-6 items-center justify-center rounded-md bg-black/40 px-1.5 py-0.5 text-[10px] font-black text-white/70">
      {n}
    </span>
  );
}

function countBy(items: string[]) {
  const out: Record<string, number> = {};
  for (const x of items) out[x] = (out[x] ?? 0) + 1;
  return out;
}

async function PricingCards({
  plans,
  featuredKey,
}: {
  plans: typeof DEMO_PLANS;
  featuredKey: string;
}) {
  if (plans.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
        No plans loaded.
      </div>
    );
  }

  return (
    <>
      {plans.map((p) => {
        const featured = p.key === featuredKey;
        return (
          <div
            key={p.key}
            className={`rounded-xl border p-4 transition ${
              featured
                ? "border-[#00e676]/45 bg-gradient-to-br from-[#00e676]/10 to-transparent shadow-[0_0_0_1px_rgba(0,230,118,0.12)]"
                : "border-white/10 bg-white/[0.02] hover:border-white/15"
            }`}
          >
            {featured ? (
              <div className="mb-2 inline-flex rounded-md bg-[#00e676]/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#b9ffd4]">
                Most popular
              </div>
            ) : null}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="text-[15px] font-black leading-snug text-white">{p.name}</div>
                <div className="mt-0.5 text-xs text-white/50">{p.durationDays} days included</div>
              </div>
              <div className="text-left sm:text-right">
                <div className="font-mono text-lg font-black text-white">₵{p.priceGhs}</div>
                <div className="text-[10px] font-semibold uppercase tracking-wide text-white/40">GHS</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.includesFixed ? (
                <span className="rounded border border-sky-400/25 bg-sky-500/10 px-2 py-0.5 text-[10px] font-bold text-sky-100">
                  Fixed
                </span>
              ) : null}
              {p.includesConfirmed ? (
                <span className="rounded border border-emerald-400/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-100">
                  Confirmed
                </span>
              ) : null}
              {p.includesCorrectScore ? (
                <span className="rounded border border-fuchsia-400/25 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-bold text-fuchsia-100">
                  Correct score
                </span>
              ) : null}
            </div>
            <div className="mt-4">
              <Button
                as="link"
                href={`/checkout?plan=${encodeURIComponent(p.key)}`}
                variant="primary"
                size="sm"
                className="w-full sm:w-auto"
              >
                {featured ? "Get this plan" : "Subscribe"}
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
}
