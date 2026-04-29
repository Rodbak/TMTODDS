import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DemoHeaderAuth } from "./demo/DemoHeaderAuth";

export async function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a101c]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[3.75rem] max-w-[1280px] items-center justify-between gap-3 px-4 md:h-16 md:px-5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00e676] to-[#00c853] text-xs font-black text-[#041208] shadow-[0_0_20px_rgba(0,230,118,0.25)]">
            TMT
          </span>
          <span className="text-[15px] font-black tracking-tight text-white md:text-base">
            TMTODDS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 md:flex">
          <Link
            href="/slips"
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            Slips
          </Link>
          <Link
            href="/proof"
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            Proof
          </Link>
          <Link
            href="/blog"
            className="rounded-full px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            News
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          <span
            className="hidden rounded border border-white/15 bg-white/5 px-1.5 py-0.5 text-[9px] font-black text-white/55 sm:inline"
            title="Adults only"
          >
            18+
          </span>
          <Button as="link" href="/#packages" variant="secondary" size="sm" className="hidden sm:inline-flex">
            Packages
          </Button>
          <DemoHeaderAuth />
        </div>
      </div>
    </header>
  );
}
