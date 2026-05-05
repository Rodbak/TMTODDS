import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const status = body?.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const matches = Array.isArray(body?.matches) ? (body.matches as unknown[]) : null;

  const slip = await prisma.slip.findUnique({
    where: { id },
    include: { matches: true },
  });
  if (!slip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.slip.update({
    where: { id },
    data: {
      status,
      publishAt: status === "PUBLISHED" && !slip.publishAt ? new Date() : slip.publishAt,
    },
  });

  if (matches) {
    // Update by position or id if present
    for (const incoming of matches.filter(isRecord)) {
      const matchId = typeof incoming.id === "string" ? incoming.id : null;
      if (!matchId) continue;
      await prisma.slipMatch.update({
        where: { id: matchId },
        data: {
          resultStatus:
            incoming.resultStatus === "WON" ||
            incoming.resultStatus === "LOST" ||
            incoming.resultStatus === "VOID"
              ? incoming.resultStatus
              : "PENDING",
          finalHomeScore:
            incoming.finalHomeScore === null || incoming.finalHomeScore === undefined
              ? null
              : Number(incoming.finalHomeScore),
          finalAwayScore:
            incoming.finalAwayScore === null || incoming.finalAwayScore === undefined
              ? null
              : Number(incoming.finalAwayScore),
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

