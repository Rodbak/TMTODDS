import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminSlipManage } from "@/components/admin/AdminSlipManage";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSlipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const { id } = await params;
  const slip = await prisma.slip.findUnique({
    where: { id },
    include: { matches: true },
  });
  if (!slip) return notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-white/60">
            {slip.status} • {slip.tier}
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-white">{slip.title}</h1>
          <div className="mt-2 text-sm text-white/70">
            Public URL:{" "}
            <Link className="font-semibold underline" href={`/slips/${slip.slug}`}>
              /slips/{slip.slug}
            </Link>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/slips"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <AdminSlipManage
          slip={{
            id: slip.id,
            status: slip.status,
            publishAt: slip.publishAt ? slip.publishAt.toISOString() : null,
            title: slip.title,
            tier: slip.tier,
            slug: slip.slug,
            matches: slip.matches.map(
              (m: {
                id: string;
                homeTeam: string;
                awayTeam: string;
                market: string;
                pick: string;
                odds: number;
                resultStatus: "PENDING" | "WON" | "LOST" | "VOID";
                finalHomeScore: number | null;
                finalAwayScore: number | null;
              }) => ({
              id: m.id,
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              market: m.market,
              pick: m.pick,
              odds: m.odds,
              resultStatus: m.resultStatus,
              finalHomeScore: m.finalHomeScore,
              finalAwayScore: m.finalAwayScore,
              }),
            ),
          }}
        />
      </div>
    </main>
  );
}

