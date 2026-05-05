import { notFound } from "next/navigation";
import { SlipBody } from "@/components/demo/SlipBody";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { planAllowsTier, subscriptionActive } from "@/lib/access";

export const dynamic = "force-dynamic";

export default async function SlipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slip = await prisma.slip.findUnique({
    where: { slug },
    include: { matches: true },
  }) as
    | ({
        id: string;
        status: string;
        title: string;
        slug: string;
        tier: "FREE" | "FIXED" | "CONFIRMED" | "CORRECT_SCORE";
        publishAt: Date | null;
        bodyMd: string;
        matches: Array<{
          id: string;
          kickoffAt: Date | null;
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
        }>;
      })
    | null;
  if (!slip || slip.status !== "PUBLISHED") return notFound();

  const session = await getSession();
  const active = session
    ? await prisma.subscription.findFirst({
        where: { userId: session.userId, status: "ACTIVE" },
        orderBy: { endsAt: "desc" },
        include: { plan: true },
      })
    : null;
  const plan = active && subscriptionActive(active) ? active.plan : null;
  const allowed = slip.tier === "FREE" || (plan ? planAllowsTier(plan, slip.tier) : false);

  return (
    <SlipBody
      allowed={allowed}
      slip={{
        id: slip.id,
        title: slip.title,
        slug: slip.slug,
        tier: slip.tier,
        publishAt: slip.publishAt ? slip.publishAt.toISOString() : null,
        bodyMd: allowed ? slip.bodyMd : "",
        matches: allowed
          ? slip.matches.map((m) => ({
              id: m.id,
              kickoffAt: m.kickoffAt ? m.kickoffAt.toISOString() : null,
              league: m.league,
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              market: m.market,
              pick: m.pick,
              odds: m.odds,
              bookmaker: m.bookmaker,
              bestSiteUrl: m.bestSiteUrl,
              resultStatus: m.resultStatus,
              finalHomeScore: m.finalHomeScore,
              finalAwayScore: m.finalAwayScore,
            }))
          : [],
      }}
    />
  );
}

