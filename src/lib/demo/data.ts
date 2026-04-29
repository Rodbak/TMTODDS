export type DemoPlan = {
  key: string;
  name: string;
  priceGhs: number;
  durationDays: number;
  includesFixed: boolean;
  includesConfirmed: boolean;
  includesCorrectScore: boolean;
};

export type DemoSlipTier = "FREE" | "FIXED" | "CONFIRMED" | "CORRECT_SCORE";

export type DemoMatch = {
  id: string;
  league?: string;
  kickoffAt?: string;
  homeTeam: string;
  awayTeam: string;
  market: string;
  pick: string;
  odds: number;
  bookmaker?: string;
  bestSiteUrl?: string;
  researchUrls?: string[];
  resultStatus?: "PENDING" | "WON" | "LOST" | "VOID";
  finalHomeScore?: number;
  finalAwayScore?: number;
};

export type DemoSlip = {
  id: string;
  slug: string;
  title: string;
  tier: DemoSlipTier;
  publishAt: string;
  bodyMd: string;
  matches: DemoMatch[];
};

export const DEMO_PLANS: DemoPlan[] = [
  {
    key: "fixed_weekly",
    name: "TMT Fixed Pass (Weekly)",
    priceGhs: 70,
    durationDays: 7,
    includesFixed: true,
    includesConfirmed: false,
    includesCorrectScore: false,
  },
  {
    key: "confirmed_weekly",
    name: "TMT Pro Confirmed (Weekly)",
    priceGhs: 150,
    durationDays: 7,
    includesFixed: true,
    includesConfirmed: true,
    includesCorrectScore: false,
  },
  {
    key: "elite_monthly",
    name: "TMT Elite (All Access) — Monthly",
    priceGhs: 500,
    durationDays: 30,
    includesFixed: true,
    includesConfirmed: true,
    includesCorrectScore: false,
  },
  {
    key: "correct_score_monthly",
    name: "TMT Correct Score Vault — Monthly",
    priceGhs: 1000,
    durationDays: 30,
    includesFixed: true,
    includesConfirmed: true,
    includesCorrectScore: true,
  },
];

export const DEMO_SLIPS: DemoSlip[] = [
  {
    id: "s1",
    slug: "prematch-free-accumulator",
    title: "Prematch — Free Accumulator (5 Picks)",
    tier: "FREE",
    publishAt: "2026-04-28T10:00:00.000Z",
    bodyMd:
      "## Notes\n\n- Market mix: 1X2 / Over 1.5 / BTTS\n- Suggested stake: ₵20\n\n## Quick links\n\n- SofaScore / Flashscore links are inside each match row.\n",
    matches: [
      {
        id: "m1",
        league: "Premier League",
        kickoffAt: "2026-04-28T18:00:00.000Z",
        homeTeam: "Arsenal",
        awayTeam: "Aston Villa",
        market: "Over 1.5",
        pick: "Yes",
        odds: 1.35,
        bookmaker: "Betway",
        bestSiteUrl: "https://example.com",
        researchUrls: ["https://www.sofascore.com/", "https://www.flashscore.com/"],
        resultStatus: "PENDING",
      },
      {
        id: "m2",
        league: "LaLiga",
        kickoffAt: "2026-04-28T20:00:00.000Z",
        homeTeam: "Barcelona",
        awayTeam: "Sevilla",
        market: "1X2",
        pick: "1",
        odds: 1.55,
        bookmaker: "SportyBet",
        researchUrls: ["https://www.sofascore.com/", "https://www.fotmob.com/"],
        resultStatus: "PENDING",
      },
    ],
  },
  {
    id: "s2",
    slug: "confirmed-picks-midweek",
    title: "Confirmed Picks — Midweek (3 Picks)",
    tier: "CONFIRMED",
    publishAt: "2026-04-28T12:30:00.000Z",
    bodyMd:
      "## Notes\n\n- Higher confidence set.\n- Suggested stake: ₵50\n",
    matches: [
      {
        id: "m3",
        league: "UEFA Champions League",
        kickoffAt: "2026-04-28T19:00:00.000Z",
        homeTeam: "Inter",
        awayTeam: "PSG",
        market: "BTTS",
        pick: "Yes",
        odds: 1.72,
        bookmaker: "1xBet",
        researchUrls: ["https://www.flashscore.com/", "https://www.sofascore.com/"],
        resultStatus: "WON",
        finalHomeScore: 2,
        finalAwayScore: 1,
      },
    ],
  },
  {
    id: "s3",
    slug: "correct-score-vault-week-1",
    title: "Correct Score Vault — Week 1 (VIP)",
    tier: "CORRECT_SCORE",
    publishAt: "2026-04-28T14:15:00.000Z",
    bodyMd:
      "## Notes\n\n- Correct score picks are high risk.\n- Stake responsibly.\n",
    matches: [
      {
        id: "m4",
        league: "Serie A",
        kickoffAt: "2026-04-28T17:45:00.000Z",
        homeTeam: "Milan",
        awayTeam: "Napoli",
        market: "Correct Score",
        pick: "2-1",
        odds: 9.0,
        bookmaker: "Bet365",
        researchUrls: ["https://www.soccerway.com/", "https://www.transfermarkt.com/"],
        resultStatus: "PENDING",
      },
    ],
  },
];

