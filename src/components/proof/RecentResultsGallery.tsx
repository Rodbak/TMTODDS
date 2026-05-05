"use client";

import { useEffect } from "react";

type Props = {
  images: Array<{ src: string; alt: string }>;
};

declare global {
  interface Window {
    GLightbox?: (opts?: Record<string, unknown>) => { destroy?: () => void };
  }
}

function ensureLink(href: string) {
  const existing = document.querySelector(`link[href="${href}"]`);
  if (existing) return;
  const el = document.createElement("link");
  el.rel = "stylesheet";
  el.href = href;
  document.head.appendChild(el);
}

function ensureScript(src: string) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

export function RecentResultsGallery({ images }: Props) {
  useEffect(() => {
    let inst: { destroy?: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        ensureLink("https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css");
        await ensureScript("https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js");
        if (cancelled) return;
        inst = window.GLightbox?.({
          selector: ".tmt-proof-lightbox",
          touchNavigation: true,
          loop: true,
        }) ?? null;
      } catch {
        // If the CDN fails, the gallery still works as normal links.
      }
    })();

    return () => {
      cancelled = true;
      inst?.destroy?.();
    };
  }, []);

  if (!images.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-sm text-white/60">
        No proof screenshots found yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((img) => (
        <a
          key={img.src}
          href={img.src}
          className="tmt-proof-lightbox group overflow-hidden rounded-2xl border border-white/10 bg-black/20"
          data-gallery="recent-results"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            alt={img.alt}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </a>
      ))}
    </div>
  );
}

