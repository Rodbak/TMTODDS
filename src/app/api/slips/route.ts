import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { planAllowsTier, subscriptionActive } from "@/lib/access";

const TIERS = ["FREE", "FIXED", "CONFIRMED", "CORRECT_SCORE"] as const;
type Tier = (typeof TIERS)[number];

export async function GET(req: Request) {
  const url          = new URL(req.url);
  const tier         = url.searchParams.get("tier");
  const league       = url.searchParams.get("league");
  const unlockedOnly = url.searchParams.get("unlocked") === "1";
  const tierFilter   = TIERS.includes(tier as Tier) ? (tier as Tier) : null;

  const session    = await getSession();
  const activePlan = session
    ? await prisma.subscription.findFirst({
        where: { userId: session.userId, status: "ACTIVE" },
        orderBy: { endsAt: "desc" },
        include: { plan: true },
      })
    : null;
  const plan = activePlan && subscriptionActive(activePlan) ? activePlan.plan : null;

  const slips = await prisma.slip.findMany({
    where: {
      status: "PUBLISHED",
      ...(tierFilter ? { tier: tierFilter } : {}),
      ...(league ? { matches: { some: { league } } } : {}),
    },
    orderBy: { publishAt: "desc" },
    include: { matches: true },
    take: 200,
  });

  const filtered = unlockedOnly
    ? slips.filter((s) => (plan ? planAllowsTier(plan, s.tier) : s.tier === "FREE"))
    : slips;

  return NextResponse.json({
    slips: filtered.map((s) => ({
      id:        s.id,
      title:     s.title,
      slug:      s.slug,
      tier:      s.tier,
      publishAt: s.publishAt,
      matches:   s.matches.map((m) => ({
        id:             m.id,
        kickoffAt:      m.kickoffAt,
        league:         m.league,
        homeTeam:       m.homeTeam,
        awayTeam:       m.awayTeam,
        market:         m.market,
        pick:           m.pick,
        odds:           m.odds,
        bookmaker:      m.bookmaker,
        bestSiteUrl:    m.bestSiteUrl,
        // Prisma returns Json field as parsed value — no JSON.parse needed
        researchUrls:   m.researchUrls as string[] | null,
        resultStatus:   m.resultStatus,
        finalHomeScore: m.finalHomeScore,
        finalAwayScore: m.finalAwayScore,
      })),
    })),
  });
}
