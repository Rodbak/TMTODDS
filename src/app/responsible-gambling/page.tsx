export const metadata = {
  title: "Responsible Gambling — TMTODDS",
  description: "Responsible gambling information for TMTODDS users.",
};

export default function ResponsibleGamblingPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Safety</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">Responsible Gambling</h1>
      <p className="mt-3 text-sm text-white/60">
        <strong className="text-white/80">TMTODDS</strong> promotes responsible gambling. Betting should be
        entertainment, not a way to solve financial problems.
      </p>

      <div className="mt-8 grid gap-5 text-sm leading-relaxed text-white/65">
        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">Know your limits</h2>
          <ul className="mt-2 list-inside list-disc">
            <li>Set a budget and never chase losses.</li>
            <li>Take breaks. Don&apos;t bet when stressed or tired.</li>
            <li>Only bet what you can afford to lose.</li>
          </ul>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">Get help</h2>
          <p className="mt-2">
            If gambling is negatively affecting your life, consider reaching out to a trusted friend, family
            member, or professional support services in Ghana.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">Contact</h2>
          <p className="mt-2">
            For questions, email{" "}
            <a className="font-semibold text-[#7dd3fc] hover:underline" href="mailto:contact@tmtodds.com">
              contact@tmtodds.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

