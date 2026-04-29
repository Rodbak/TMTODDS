import { PaymentSuccessClient } from "@/components/payments/PaymentSuccessClient";

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { reference?: string };
}) {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-black tracking-tight">Payment status</h1>
      <p className="mt-2 text-sm text-black/70 dark:text-white/70">
        We’re confirming your payment and activating your subscription.
      </p>
      <div className="mt-6">
        <PaymentSuccessClient reference={searchParams.reference ?? null} />
      </div>
    </main>
  );
}

