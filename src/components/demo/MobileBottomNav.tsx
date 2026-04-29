"use client";

import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/slips", label: "Slips" },
  { href: "/proof", label: "Proof" },
  { href: "/account", label: "Account" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-[#0a101c]/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="grid grid-cols-4 gap-2">
        {ITEMS.map((item) => (
          <Button
            key={item.href}
            as="link"
            href={item.href}
            size="sm"
            variant={pathname === item.href ? "primary" : "ghost"}
            className="w-full"
          >
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

