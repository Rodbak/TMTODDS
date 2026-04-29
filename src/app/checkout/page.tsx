import { DemoCheckoutCard } from "@/components/demo/DemoCheckoutCard";
import { DEMO_PLANS } from "@/lib/demo/data";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const planKey = typeof searchParams.plan === "string" ? searchParams.plan : null;
  const plan = DEMO_PLANS.find((p) => p.key === planKey) ?? DEMO_PLANS[0];

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight text-white">Checkout</h1>
      <p className="mt-2 text-sm text-white/70">
        Demo checkout activates plan instantly in this browser.
      </p>
      <DemoCheckoutCard plan={plan} />
    </main>
  );
}

