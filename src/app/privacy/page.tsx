export const metadata = {
  title: "Privacy Policy — TMTODDS",
  description: "Privacy Policy for TMTODDS (Ghana).",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-12">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">Legal</p>
      <h1 className="mt-2 text-2xl font-black tracking-tight text-white md:text-3xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-white/60">
        This Privacy Policy explains how <strong className="text-white/80">TMTODDS</strong> handles information
        when you use the site.
      </p>

      <div className="mt-8 grid gap-5 text-sm leading-relaxed text-white/65">
        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">1) Information we collect</h2>
          <p className="mt-2">
            We may collect account information you provide (such as email) and basic usage data needed to operate
            the service.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">2) How we use information</h2>
          <p className="mt-2">
            We use information to provide and improve the service, support users, and maintain security and fraud
            prevention.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">3) Cookies</h2>
          <p className="mt-2">
            Cookies may be used for authentication sessions and preferences. You can manage cookies in your browser
            settings.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">4) Ghana jurisdiction</h2>
          <p className="mt-2">
            This policy is governed by the laws of Ghana. If you have concerns, contact us and we will try to
            resolve them promptly.
          </p>
        </section>

        <section className="tmt-panel rounded-2xl p-5">
          <h2 className="text-base font-black text-white">5) Contact</h2>
          <p className="mt-2">
            Questions? Email{" "}
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

