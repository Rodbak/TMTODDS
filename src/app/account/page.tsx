import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { subscriptionActive } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/LogoutButton";
import { SLIP_TIER_LABEL } from "@/lib/plans";

export const dynamic = "force-dynamic";

export default function AccountPage() {
  return <AccountPageServer />;
}

async function AccountPageServer() {
  const session = await requireUser();
  if (!session) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Account</p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-white/60">Sign in to see your plan, access, and quick links.</p>
        <div className="mt-6 flex gap-2">
          <Button as="link" href="/login" variant="primary">
            Sign in
          </Button>
          <Button as="link" href="/register" variant="secondary">
            Create account
          </Button>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { email: true, role: true, referralCode: true, points: true },
  });

  const sub = await prisma.subscription.findFirst({
    where: { userId: session.userId, status: "ACTIVE" },
    orderBy: { endsAt: "desc" },
    include: { plan: true },
  });
  const activePlan = sub && subscriptionActive(sub) ? sub.plan : null;

  const tiers = (() => {
    if (!activePlan) return ["FREE"];
    const out = ["FREE"];
    if (activePlan.includesFixed) out.push("FIXED");
    if (activePlan.includesConfirmed) out.push("CONFIRMED");
    if (activePlan.includesCorrectScore) out.push("CORRECT_SCORE");
    return out;
  })();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Account</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-white/55">
        Welcome back,{" "}
        <span className="font-semibold text-white/85">{user?.email ?? "—"}</span>
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
                <p className="mt-2 text-sm text-white/60">No active plan.</p>
              )}
            </div>
            <Button as="link" href="/#packages" variant="primary" size="sm">
              View packages
            </Button>
          </div>

          {activePlan && sub ? (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {activePlan.includesFixed ? <TierChip label="Fixed" /> : null}
                {activePlan.includesConfirmed ? <TierChip label="Confirmed" /> : null}
                {activePlan.includesCorrectScore ? <TierChip label="Correct score" /> : null}
              </div>
              <div className="mt-5 text-xs text-white/55">
                <div>Started {new Date(sub.startsAt).toLocaleString("en-GB")}</div>
                <div className="font-semibold text-white/80">
                  Renews / ends {new Date(sub.endsAt).toLocaleString("en-GB")}
                </div>
              </div>
            </>
          ) : null}
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
            What you can open
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tiers.map((t) => (
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
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">Referrals</div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <code className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-sm text-[#b9ffd4]">
              {user?.referralCode ?? "—"}
            </code>
          </div>
          <p className="mt-2 text-xs text-white/45">Points: {user?.points ?? 0}</p>
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
            {session.role === "ADMIN" ? (
              <Button as="link" href="/admin" variant="secondary" size="sm">
                Admin
              </Button>
            ) : null}
          </div>
        </section>

        <div className="flex justify-end">
          <LogoutButton />
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

