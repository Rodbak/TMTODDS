import { PaystackCheckoutButton } from "@/components/payments/PaystackCheckoutButton";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const planKey = typeof searchParams.plan === "string" ? searchParams.plan : null;
  return <CheckoutPageServer planKey={planKey} />;
}

async function CheckoutPageServer({ planKey }: { planKey: string | null }) {
  const session = await requireUser();
  if (!session) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="text-2xl font-black tracking-tight text-white">Checkout</h1>
        <p className="mt-2 text-sm text-white/70">Sign in to purchase a plan.</p>
        <div className="mt-6">
          <Button as="link" href="/login" variant="primary">
            Sign in
          </Button>
        </div>
      </main>
    );
  }

  const plan = planKey
    ? await prisma.plan.findUnique({ where: { key: planKey } })
    : await prisma.plan.findFirst({ orderBy: { priceGhs: "asc" } });

  if (!plan) {
    return (
      <main className="mx-auto w-full max-w-md px-4 py-12">
        <h1 className="text-2xl font-black tracking-tight text-white">Checkout</h1>
        <p className="mt-2 text-sm text-white/70">No plans found. Run the seed first.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight text-white">Checkout</h1>
      <p className="mt-2 text-sm text-white/70">You’ll be redirected to Paystack to complete payment.</p>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-black text-white">{plan.name}</div>
            <div className="text-sm text-white/70">{plan.durationDays} days access</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-white">GHS {plan.priceGhs}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-2">
          <PaystackCheckoutButton planKey={plan.key} />
          <Button as="link" href="/#packages" variant="secondary">
            Back to packages
          </Button>
        </div>
      </div>
    </main>
  );
}

