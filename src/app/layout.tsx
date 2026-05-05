import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { Backdrop } from "@/components/Backdrop";
import { MobileBottomNav } from "@/components/demo/MobileBottomNav";

export const metadata: Metadata = {
  title: "TMTODDS — Betting Slips (Ghana)",
  description:
    "Free and premium betting slips for Ghana: fixed matches, confirmed picks, and correct score.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GH" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#060a12] text-[#f0f4fc] antialiased">
        <SiteHeader />
        <div className="relative flex-1">
          <Backdrop />
          <div className="relative pb-20 md:pb-0">{children}</div>
        </div>
        <MobileBottomNav />
        <footer className="border-t border-white/[0.08] bg-[#080c14]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-12 text-sm text-white/60 md:px-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white/70">
                18+
              </span>
              <span className="text-xs text-white/45">Gambling can be addictive. Play responsibly.</span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-[#7dd3fc]">
              <Link className="hover:underline" href="/slips">
                Slips board
              </Link>
              <Link className="hover:underline" href="/proof">
                Proof & results
              </Link>
              <Link className="hover:underline" href="/terms">
                Terms
              </Link>
              <Link className="hover:underline" href="/privacy">
                Privacy
              </Link>
              <Link className="hover:underline" href="/responsible-gambling">
                Responsible gambling
              </Link>
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">TMTODDS</div>
            <p>
              Disclaimer: Betting involves risk. Past results do not guarantee future wins. This demo does
              not place real bets.
            </p>
            <p className="text-xs text-white/50">
              © {new Date().getFullYear()} TMTODDS. All rights reserved.
            </p>
            <p className="text-xs text-white/45">
              Built by{" "}
              <a
                className="font-semibold text-[#7dd3fc] hover:underline"
                href="https://strategylab.com"
                target="_blank"
                rel="noreferrer"
              >
                StrategyLab
              </a>
              .
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
