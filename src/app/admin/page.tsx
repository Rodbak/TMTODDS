import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight text-white">Admin (Demo)</h1>
      <p className="mt-2 text-sm text-white/70">
        Frontend-only demo admin screens.
      </p>

      <div className="mt-6 grid gap-3">
        <Link
          href="/admin/slips"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 font-semibold text-white hover:bg-white/10"
        >
          Manage slips →
        </Link>
      </div>
    </main>
  );
}

