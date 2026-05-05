export const metadata = {
  title: "Terms of Service — TMTODDS",
  description: "Terms of Service for TMTODDS (Ghana).",
};

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Legal</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-white/60">
        These Terms of Service (&quot;Terms&quot;) govern your use of <strong className="text-white/80">TMTODDS</strong>.
        By accessing or using the site, you agree to these Terms.
      </p>

      <div className="mt-8 grid gap-5 text-sm leading-relaxed text-white/65">
        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">1) Eligibility</h2>
          <p className="mt-2">
            You must be at least 18 years old (or the legal gambling age in your location) to use this site.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">2) No guarantee of winnings</h2>
          <p className="mt-2">
            Betting involves risk. Past results do not guarantee future outcomes. Any picks, tips, or information
            are provided for informational purposes only.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">3) Responsible gambling</h2>
          <p className="mt-2">
            Please gamble responsibly. If you feel gambling is becoming a problem, seek help and consider
            self-exclusion tools offered by betting providers.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">4) Ghana jurisdiction</h2>
          <p className="mt-2">
            These Terms are governed by the laws of Ghana. Any disputes will be handled in the appropriate courts
            of Ghana.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">5) Contact</h2>
          <p className="mt-2">
            For questions about these Terms, contact{" "}
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

