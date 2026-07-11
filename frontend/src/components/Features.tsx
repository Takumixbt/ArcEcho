"use client";

const FEATURES = [
  {
    title: "List once. Earn every sale.",
    body: "Publish a content pointer with a buy price, a rent price, or both. Settlement is USDC on Arc — royalties hit the creator wallet on every purchase.",
  },
  {
    title: "Buy permanent. Rent timed.",
    body: "Buyers take permanent rights. Renters take a time-boxed window that stacks if extended. Terms live in the contract, not a platform policy page.",
  },
  {
    title: "Flat 5% protocol fee.",
    body: "Every buy and rent splits 95/5 between creator and treasury. No tiers, no surprises — fee is fixed on-chain.",
  },
  {
    title: "Built for work that ages.",
    body: "Reports, drops, and time-sensitive releases lose value as they age. Rent is the native model — pay for the window you need.",
  },
];

const STEPS = [
  {
    roman: "I",
    title: "Connect wallet",
    body: "Use an injected wallet on Arc Testnet. No email, no account.",
  },
  {
    roman: "II",
    title: "List or purchase",
    body: "Creators list a URI + prices. Buyers approve USDC and buy or rent.",
  },
  {
    roman: "III",
    title: "Royalty settles",
    body: "USDC splits instantly — 95% creator, 5% protocol. Rights recorded on-chain.",
  },
];

export function Features() {
  return (
    <>
      <section id="how-it-works" className="relative py-24 lg:py-32">
        <div className="container-wide">
          <div className="mb-16 lg:mb-24">
            <span className="section-label mb-6">Protocol</span>
            <h2 className="font-display text-4xl lg:text-6xl tracking-tight mt-6">
              Royalty rails for
              <br />
              <span className="text-muted">digital work.</span>
            </h2>
          </div>

          <div>
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-row group">
                <div className="flex-1 grid lg:grid-cols-2 gap-8 items-start">
                  <h3 className="feature-title font-display text-3xl lg:text-4xl">
                    {f.title}
                  </h3>
                  <p className="text-lg text-muted leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 border-y border-white/10">
        <div className="container-wide">
          <div className="mb-16">
            <span className="section-label mb-6">Process</span>
            <h2 className="font-display text-4xl lg:text-6xl tracking-tight mt-6">
              Three steps.
              <br />
              <span className="text-muted">Zero platform accounts.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {STEPS.map((s) => (
              <div key={s.roman} className="bg-background p-8 lg:p-10">
                <div className="font-mono text-xs text-muted mb-6">{s.roman}</div>
                <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                <p className="text-muted leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32">
        <div className="container-wide">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
            <div>
              <span className="section-label mb-6">Terms</span>
              <h2 className="font-display text-4xl lg:text-6xl tracking-tight mt-6">
                The numbers
                <br />
                that matter.
              </h2>
            </div>
            <div className="flex items-center gap-3 font-mono text-sm text-muted">
              <span className="live-dot" />
              Arc Testnet
            </div>
          </div>

          <div className="stats-grid">
            <div className="stats-cell">
              <div className="font-display text-6xl lg:text-8xl tracking-tight">95%</div>
              <div className="mt-4 text-lg text-muted">Creator share on every settlement</div>
            </div>
            <div className="stats-cell">
              <div className="font-display text-6xl lg:text-8xl tracking-tight">5%</div>
              <div className="mt-4 text-lg text-muted">Flat protocol fee — no tiers</div>
            </div>
            <div className="stats-cell">
              <div className="font-display text-6xl lg:text-8xl tracking-tight">USDC</div>
              <div className="mt-4 text-lg text-muted">Instant on-chain settlement</div>
            </div>
            <div className="stats-cell">
              <div className="font-display text-6xl lg:text-8xl tracking-tight">0</div>
              <div className="mt-4 text-lg text-muted">Payout thresholds & chargebacks</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
