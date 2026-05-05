import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const tier = typeof body?.tier === "string" ? body.tier : "FREE";
  const bodyMd = typeof body?.bodyMd === "string" ? body.bodyMd : "";
  const publishNow = Boolean(body?.publishNow);
  const matches = Array.isArray(body?.matches) ? (body.matches as unknown[]) : [];

  if (!title || !bodyMd) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const base = slugify(title) || `slip-${Date.now()}`;
  let slug = base;
  for (let i = 0; i < 10; i++) {
    const exists = await prisma.slip.findUnique({ where: { slug } });
    if (!exists) break;
    slug = `${base}-${i + 2}`;
  }

  const slip = await prisma.slip.create({
    data: {
      title,
      slug,
      tier,
      status: publishNow ? "PUBLISHED" : "DRAFT",
      publishAt: publishNow ? new Date() : null,
      bodyMd,
      createdById: admin.userId,
      matches: {
        create: matches
          .filter(isRecord)
          .map((m) => ({
            kickoffAt: typeof m.kickoffAt === "string" ? new Date(m.kickoffAt) : null,
            league: typeof m.league === "string" ? m.league : null,
            homeTeam: typeof m.homeTeam === "string" ? m.homeTeam : String(m.homeTeam ?? ""),
            awayTeam: typeof m.awayTeam === "string" ? m.awayTeam : String(m.awayTeam ?? ""),
            market: typeof m.market === "string" ? m.market : String(m.market ?? ""),
            pick: typeof m.pick === "string" ? m.pick : String(m.pick ?? ""),
            odds: Number(m.odds ?? 1),
            bookmaker: typeof m.bookmaker === "string" ? m.bookmaker : null,
            bestSiteUrl: typeof m.bestSiteUrl === "string" ? m.bestSiteUrl : null,
            researchUrls: Array.isArray(m.researchUrls)
              ? JSON.stringify(m.researchUrls)
              : typeof m.researchUrls === "string"
                ? m.researchUrls
                : null,
          })),
      },
    },
    select: { id: true, slug: true },
  });

  return NextResponse.json({ ok: true, id: slip.id, slug: slip.slug }, { status: 201 });
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slips = await prisma.slip.findMany({
    orderBy: { createdAt: "desc" },
    include: { matches: true },
    take: 200,
  }) as Array<{
    id: string;
    title: string;
    slug: string;
    tier: string;
    status: string;
    publishAt: Date | null;
    matches: Array<{ id: string }>;
  }>;

  return NextResponse.json({
    slips: slips.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      tier: s.tier,
      status: s.status,
      publishAt: s.publishAt,
      matches: s.matches.length,
    })),
  });
}

