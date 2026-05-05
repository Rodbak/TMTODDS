"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [pending, startTransition] = useTransition();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ identifier, password }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(data?.error ?? "Sign in failed");
            return;
          }
          window.location.href = "/account";
        });
      }}
    >
      <label className="grid gap-1">
        <span className="text-sm font-semibold">Email or phone</span>
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
          placeholder="example@gmail.com or 024xxxxxxx"
          autoComplete="username"
          required
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-semibold">Password</span>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="h-11 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-white/10 dark:bg-black"
          autoComplete="current-password"
          required
        />
      </label>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <Button disabled={pending} type="submit">
        {pending ? "Signing in..." : "Sign in"}
      </Button>

      <div className="text-sm text-black/70 dark:text-white/70">
        Default seeded accounts (change later): `admin@tmtodds.com / admin12345`, `demo@tmtodds.com /
        demo12345`.
      </div>

      <div className="text-sm text-black/70 dark:text-white/70">
        No account?{" "}
        <Link className="font-semibold underline" href="/register">
          Create one
        </Link>
        .
      </div>
    </form>
  );
}

