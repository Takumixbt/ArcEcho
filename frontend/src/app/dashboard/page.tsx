"use client";

import { useAccount, useWriteContract, useConnect } from "wagmi";
import { ACCESS_GATE_ADDRESS, ACCESS_GATE_ABI } from "@/lib/contracts";
import { parseUnits } from "viem";
import { useState } from "react";

function Stepper({
  value,
  onChange,
  step,
  min,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  step: number;
  min: number;
  placeholder: string;
}) {
  const num = parseFloat(value) || 0;
  const inc = () => onChange((num + step).toFixed(2));
  const dec = () => onChange(Math.max(min, num - step).toFixed(2));

  return (
    <div className="stepper">
      <button type="button" onClick={dec} disabled={num <= min}>
        −
      </button>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="number"
        step={step}
        min={min}
      />
      <button type="button" onClick={inc}>
        +
      </button>
    </div>
  );
}

function DurationStepper({
  value,
  onChange,
}: {
  value: { amount: string; unit: "days" | "months" };
  onChange: (v: { amount: string; unit: "days" | "months" }) => void;
}) {
  const num = parseInt(value.amount) || 0;
  const step = 1;
  const inc = () => onChange({ ...value, amount: String(num + step) });
  const dec = () =>
    onChange({ ...value, amount: String(Math.max(1, num - step)) });
  const toDays = value.unit === "months" ? num * 30 : num;

  return (
    <div className="flex flex-col gap-3">
      <div className="duration-control">
        <button
          type="button"
          className="duration-step-btn"
          onClick={dec}
          disabled={num <= 1}
          aria-label="Decrease duration"
        >
          −
        </button>
        <input
          className="duration-amount"
          value={value.amount}
          onChange={(e) => onChange({ ...value, amount: e.target.value })}
          type="number"
          min={1}
          aria-label="Duration amount"
        />
        <button
          type="button"
          className="duration-step-btn"
          onClick={inc}
          aria-label="Increase duration"
        >
          +
        </button>
        <div className="duration-unit-toggle" role="group" aria-label="Duration unit">
          <button
            type="button"
            className={value.unit === "days" ? "active" : ""}
            onClick={() => onChange({ ...value, unit: "days" })}
          >
            days
          </button>
          <button
            type="button"
            className={value.unit === "months" ? "active" : ""}
            onClick={() => onChange({ ...value, unit: "months" })}
          >
            months
          </button>
        </div>
      </div>
      <div className="font-mono text-[11px] text-muted">
        {toDays} day window · {toDays * 86400}s on-chain
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { writeContractAsync } = useWriteContract();
  const [buyPrice, setBuyPrice] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [rentDuration, setRentDuration] = useState({
    amount: "7",
    unit: "days" as "days" | "months",
  });
  const [contentURI, setContentURI] = useState("");
  const [listing, setListing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleConnect = () => {
    const c = connectors.find((x) => x.type === "injected") ?? connectors[0];
    if (c) connect({ connector: c });
  };

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;
    setListing(true);
    setError(null);
    setSuccess(false);

    const days =
      rentDuration.unit === "months"
        ? parseInt(rentDuration.amount) * 30
        : parseInt(rentDuration.amount);

    try {
      await writeContractAsync({
        address: ACCESS_GATE_ADDRESS,
        abi: ACCESS_GATE_ABI,
        functionName: "list",
        args: [
          buyPrice ? parseUnits(buyPrice, 6) : 0n,
          rentPrice ? parseUnits(rentPrice, 6) : 0n,
          BigInt((days || 0) * 86400),
          contentURI,
        ],
      });
      setBuyPrice("");
      setRentPrice("");
      setContentURI("");
      setRentDuration({ amount: "7", unit: "days" });
      setSuccess(true);
    } catch (err) {
      const msg =
        err && typeof err === "object" && "shortMessage" in err
          ? String((err as { shortMessage: string }).shortMessage)
          : err instanceof Error
            ? err.message.slice(0, 140)
            : "listing failed";
      setError(msg);
    }
    setListing(false);
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <div className="grid-overlay opacity-15">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`h-${i}`} className="h-line" style={{ top: `${(i + 1) * (100 / 7)}%` }} />
          ))}
        </div>
        <div className="relative z-10 container-wide pt-36 pb-24 max-w-3xl">
          <span className="section-label mb-6">Creator studio</span>
          <h1 className="font-display text-5xl lg:text-6xl tracking-tight mt-6 mb-6">
            List work.
            <br />
            <span className="text-muted">Collect royalties.</span>
          </h1>
          <p className="text-lg text-muted max-w-lg mb-10 leading-relaxed">
            Connect a wallet to publish buy/rent terms on Arc. Every settlement
            pays you 95% in USDC — instantly, on-chain.
          </p>
          <button onClick={handleConnect} className="btn btn-primary btn-lg">
            Connect Wallet
          </button>
        </div>
      </main>
    );
  }

  const hasPrice = !!(buyPrice || rentPrice);
  const previewBuy = buyPrice ? Number(buyPrice) : 0;
  const previewRent = rentPrice ? Number(rentPrice) : 0;
  const creatorBuy = previewBuy * 0.95;
  const creatorRent = previewRent * 0.95;

  return (
    <main className="pt-28 pb-28 min-h-screen">
      <div className="container-wide">
        {/* Header band */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14 border-b border-white/10 pb-10">
          <div>
            <span className="section-label mb-6">Creator studio</span>
            <h1 className="font-display text-4xl lg:text-6xl tracking-tight mt-6 mb-3">
              Publish & earn
            </h1>
            <p className="text-muted max-w-xl leading-relaxed">
              Set royalty terms once. ArcEcho settles every buy and rent in USDC
              — 95% to you, 5% to the protocol.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="font-mono text-xs text-muted flex items-center gap-2">
              <span className="live-dot" />
              Arc Testnet
            </div>
            <div className="font-mono text-sm text-foreground/80">
              {address!.slice(0, 6)}…{address!.slice(-4)}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Form */}
          <div className="lg:col-span-7">
            <div className="card">
              <div className="card-header">
                <span>New listing</span>
                <span className="ml-auto font-mono text-[10px] tracking-widest">
                  ON-CHAIN
                </span>
              </div>
              <div className="card-body p-6 lg:p-8">
                <form onSubmit={handleList} className="flex flex-col gap-7">
                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                      Content URL
                    </label>
                    <input
                      value={contentURI}
                      onChange={(e) => setContentURI(e.target.value)}
                      placeholder="ipfs://… or https://…"
                      className="input"
                      required
                    />
                    <p className="font-mono text-[11px] text-muted mt-2">
                      Pointer to the work buyers unlock after payment
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                        Buy price (USDC)
                      </label>
                      <Stepper
                        value={buyPrice}
                        onChange={setBuyPrice}
                        step={0.5}
                        min={0}
                        placeholder="0.00"
                      />
                      <p className="font-mono text-[11px] text-muted mt-2">
                        Permanent rights · optional
                      </p>
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                        Rent price (USDC)
                      </label>
                      <Stepper
                        value={rentPrice}
                        onChange={setRentPrice}
                        step={0.5}
                        min={0}
                        placeholder="0.00"
                      />
                      <p className="font-mono text-[11px] text-muted mt-2">
                        Time-boxed · optional
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                      Rent duration
                    </label>
                    <DurationStepper
                      value={rentDuration}
                      onChange={setRentDuration}
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-white/10 pt-6">
                    <button
                      type="submit"
                      disabled={listing || !hasPrice}
                      className="btn btn-primary"
                    >
                      {listing ? "Publishing…" : "Publish listing"}
                    </button>
                    {!hasPrice && (
                      <span className="font-mono text-xs text-muted">
                        set a buy or rent price
                      </span>
                    )}
                  </div>

                  {error && (
                    <div className="font-mono text-xs text-red-400 border border-red-500/20 px-3 py-2">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="font-mono text-xs border border-white/20 px-3 py-2 text-foreground/80">
                      Listed — live in the content feed
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="border border-white/10 p-6 lg:p-8 bg-white/[0.02]">
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-4">
                Royalty preview
              </div>
              <div className="font-display text-3xl mb-6 tracking-tight">
                You keep 95%
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                  <span className="text-sm text-muted">Buy → you receive</span>
                  <span className="font-mono text-sm">
                    {previewBuy > 0 ? `$${creatorBuy.toFixed(2)}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline border-b border-white/10 pb-3">
                  <span className="text-sm text-muted">Rent → you receive</span>
                  <span className="font-mono text-sm">
                    {previewRent > 0 ? `$${creatorRent.toFixed(2)}` : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-muted">Protocol fee</span>
                  <span className="font-mono text-sm">5%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-px bg-white/10">
              {[
                ["95%", "Creator"],
                ["5%", "Protocol"],
                ["USDC", "Settle"],
              ].map(([v, l]) => (
                <div key={l} className="bg-background p-5 text-center">
                  <div className="font-display text-2xl mb-1">{v}</div>
                  <div className="font-mono text-[10px] text-muted uppercase tracking-widest">
                    {l}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-white/10 p-6">
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-3">
                How it works
              </div>
              <ol className="space-y-3 text-sm text-muted leading-relaxed">
                <li className="flex gap-3">
                  <span className="font-mono text-foreground/50 shrink-0">01</span>
                  Point to your work with a URI
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-foreground/50 shrink-0">02</span>
                  Set buy and/or rent terms in USDC
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-foreground/50 shrink-0">03</span>
                  Publish — royalties settle on every sale
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
