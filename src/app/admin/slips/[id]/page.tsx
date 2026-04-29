import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_SLIPS } from "@/lib/demo/data";

export default async function AdminSlipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slip = DEMO_SLIPS.find((s) => s.id === id);
  if (!slip) return notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-white/60">
            PUBLISHED • {slip.tier}
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

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/80">
          Demo mode preview: editing and publishing controls are disabled.
        </div>
      </div>
    </main>
  );
}

