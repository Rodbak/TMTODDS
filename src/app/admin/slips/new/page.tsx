import { Button } from "@/components/ui/button";

export default function NewSlipPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight text-white">New slip</h1>
      <p className="mt-2 text-sm text-white/70">
        Demo mode: editing is disabled in frontend-only preview.
      </p>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm text-white/80">
          Use this as a showcase screen for prospects. We can re-enable full
          admin authoring once backend APIs are turned back on.
        </div>
        <div className="mt-4">
          <Button as="link" href="/admin/slips" variant="secondary">
            Back to slips
          </Button>
        </div>
      </div>
    </main>
  );
}

