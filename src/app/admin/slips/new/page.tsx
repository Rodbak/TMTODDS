import { redirect } from "next/navigation";

import { AdminSlipEditor } from "@/components/admin/AdminSlipEditor";
import { requireAdmin } from "@/lib/auth/session";

export default function NewSlipPage() {
  return <NewSlipPageServer />;
}

async function NewSlipPageServer() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight text-white">New slip</h1>
      <p className="mt-2 text-sm text-white/70">
        Create a slip and publish it to the board.
      </p>
      <div className="mt-6">
        <AdminSlipEditor />
      </div>
    </main>
  );
}

