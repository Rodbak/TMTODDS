"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { clearDemoSession, getDemoSession } from "@/lib/demo/session";

export function DemoHeaderAuth() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"USER" | "ADMIN" | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const s = getDemoSession();
    setSessionEmail(s?.user.email ?? null);
    setRole(s?.user.role ?? null);

    const onStorage = () => {
      const s2 = getDemoSession();
      setSessionEmail(s2?.user.email ?? null);
      setRole(s2?.user.role ?? null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!sessionEmail) {
    return (
      <>
        <Button as="link" href="/login" variant="secondary" size="sm">
          Sign in
        </Button>
        <Button as="link" href="/register" variant="primary" size="sm" className="hidden md:inline-flex">
          Create account
        </Button>
      </>
    );
  }

  return (
    <>
      <Button as="link" href="/account" variant="secondary" size="sm">
        Dashboard
      </Button>
      {role === "ADMIN" ? (
        <Button as="link" href="/admin" variant="secondary" size="sm" className="hidden md:inline-flex">
          Admin
        </Button>
      ) : null}
      <Button
        variant="ghost"
        size="sm"
        className="hidden md:inline-flex"
        disabled={pending}
        onClick={() => {
          startTransition(() => {
            clearDemoSession();
            window.location.href = "/";
          });
        }}
      >
        {pending ? "Signing out..." : "Sign out"}
      </Button>
    </>
  );
}

