"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await fetch("/api/auth/logout", { method: "POST" });
          window.location.href = "/";
        });
      }}
    >
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

