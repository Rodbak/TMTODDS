"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const hasIdentifier = useMemo(
    () => email.trim().length > 0 || phone.trim().length > 0,
    [email, phone],
  );

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
          }
          const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, phone, password }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(data?.error ?? "Registration failed");
            return;
          }
          window.location.href = "/account";
        });
      }}
    >
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Email (optional)</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
          placeholder="example@gmail.com"
          autoComplete="email"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-semibold">Phone (optional)</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
          placeholder="024xxxxxxx"
          autoComplete="tel"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-semibold">Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
          autoComplete="new-password"
          required
        />
      </label>

      {!hasIdentifier ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-900 dark:text-amber-200">
          Add either an email or a phone number.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <Button disabled={pending || !hasIdentifier} type="submit">
        {pending ? "Creating..." : "Create account"}
      </Button>

      <div className="text-sm text-black/70 dark:text-white/70">
        This creates a real account (stored in the database).
      </div>

      <div className="text-sm text-black/70 dark:text-white/70">
        Already have an account?{" "}
        <Link className="font-semibold underline" href="/login">
          Sign in
        </Link>
        .
      </div>
    </form>
  );
}

