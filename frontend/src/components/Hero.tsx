"use client";

import { useAccount, useConnect } from "wagmi";

const STATS = [
  { value: "95%", label: "to creator", tag: "SPLIT" },
  { value: "5%", label: "protocol fee", tag: "FEE" },
  { value: "USDC", label: "instant settlement", tag: "PAY" },
  { value: "Arc", label: "Circle L1 testnet", tag: "CHAIN" },
];

export function Hero() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const handleConnect = () => {
    const c = connectors.find((c) => c.type === "injected") ?? connectors[0];
    if (c) connect({ connector: c });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Grid overlay — soft, contained to hero body */}
      <div className="grid-overlay opacity-20">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`h-${i}`} className="h-line" style={{ top: `${(i + 1) * (100 / 7)}%` }} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`v-${i}`} className="v-line" style={{ left: `${(i + 1) * (100 / 11)}%` }} />
        ))}
      </div>

      <div className="relative z-10 container-wide pt-32 lg:pt-40 pb-16 lg:pb-20">
        <div className="mb-8 fade-up">
          <span className="section-label">
            content royalty infrastructure on Arc
          </span>
        </div>

        <div className="mb-10 fade-up fade-up-delay-1 max-w-5xl">
          <h1 className="font-display text-[clamp(2.75rem,7.5vw,6.75rem)] leading-[0.92] tracking-tight">
            <span className="block">Buy or rent</span>
            <span className="block">content.</span>
            <span className="block text-muted">Creators paid instantly.</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end fade-up fade-up-delay-2">
          <p className="lg:col-span-6 text-lg lg:text-xl text-muted leading-relaxed max-w-xl">
            ArcEcho is royalty rails for digital work. List a piece, set buy and
            rent prices in USDC, settle on-chain — 95% to the creator, 5% to the
            protocol. No platform account. No payout threshold. No chargebacks.
          </p>

          <div className="lg:col-span-6 flex flex-col sm:flex-row sm:justify-end items-start gap-3">
            {!isConnected ? (
              <button onClick={handleConnect} className="btn btn-primary btn-lg group">
                Connect Wallet
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </button>
            ) : (
              <a href="#feed" className="btn btn-primary btn-lg group">
                Browse catalog
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            )}
            <a href="/dashboard" className="btn btn-lg">
              Creator studio
            </a>
          </div>
        </div>
      </div>

      {/* Marquee — in document flow, under hero, not floating in empty space */}
      <div className="relative z-10 border-y border-white/10 bg-white/[0.015]">
        <div className="overflow-hidden py-8 lg:py-10">
          <div className="marquee gap-20 whitespace-nowrap px-8">
            {[...STATS, ...STATS].map((s, i) => (
              <div key={i} className="flex items-baseline gap-4 shrink-0 pr-8">
                <span className="font-display text-3xl lg:text-4xl tracking-tight">
                  {s.value}
                </span>
                <span className="text-sm text-muted text-left">
                  {s.label}
                  <span className="block font-mono text-[10px] mt-1 tracking-widest opacity-50">
                    {s.tag}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
