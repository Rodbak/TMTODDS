import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

export function getPaystackSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Missing PAYSTACK_SECRET_KEY");
  return key;
}

export function paystackAuthHeaders() {
  const key = getPaystackSecretKey();
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function paystackInitialize(input: {
  email: string;
  amountPesewas: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: paystackAuthHeaders(),
    body: JSON.stringify({
      email: input.email,
      amount: input.amountPesewas,
      currency: "GHS",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata ?? {},
    }),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.status || !json?.data?.authorization_url) {
    return { ok: false as const, error: json?.message ?? "Paystack init failed", raw: json };
  }
  return {
    ok: true as const,
    authorizationUrl: json.data.authorization_url as string,
    accessCode: json.data.access_code as string,
    raw: json,
  };
}

export async function paystackVerify(reference: string) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: "GET",
    headers: paystackAuthHeaders(),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.status) {
    return { ok: false as const, error: json?.message ?? "Paystack verify failed", raw: json };
  }
  return { ok: true as const, raw: json };
}

export function verifyPaystackWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET ?? process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error("Missing PAYSTACK_WEBHOOK_SECRET (or PAYSTACK_SECRET_KEY fallback)");
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

