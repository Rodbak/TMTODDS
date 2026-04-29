import type { ReactNode } from "react";

export function SportsbookShell({
  left,
  main,
  right,
  className,
}: {
  left: ReactNode;
  main: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-5 md:py-10">
        <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)_300px] xl:grid-cols-[260px_minmax(0,1fr)_320px] lg:gap-6">
          <aside className="hidden lg:block">{left}</aside>
          <section className="min-w-0">{main}</section>
          {right ? (
            <aside className="min-w-0 lg:sticky lg:top-[4.25rem] lg:self-start">{right}</aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
