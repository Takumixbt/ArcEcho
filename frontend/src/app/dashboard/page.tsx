"use client";

import { useAccount, useWriteContract } from "wagmi";
import { ACCESS_GATE_ADDRESS, ACCESS_GATE_ABI } from "@/lib/contracts";
import { parseUnits } from "viem";
import { useState } from "react";

function Stepper({ value, onChange, step, min, placeholder }: {
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
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      <button type="button" onClick={dec} disabled={num <= min}
        style={{
          width: 32, height: 38, border: "1px solid #222", borderRight: "none",
          borderTopLeftRadius: 6, borderBottomLeftRadius: 6,
          background: "transparent", color: num <= min ? "#333" : "#999",
          cursor: num <= min ? "not-allowed" : "pointer",
          fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit",
        }}
      >−</button>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type="number"
        step={step}
        min={min}
        style={{
          width: "100%", height: 38,
          background: "#000", border: "1px solid #222", borderLeft: "none", borderRight: "none",
          color: "#e5e5e5", padding: "0 4px", fontSize: 13,
          borderRadius: 0, fontFamily: "inherit", outline: "none",
          textAlign: "center",
          MozAppearance: "textfield",
        }}
      />
      <button type="button" onClick={inc}
        style={{
          width: 32, height: 38, border: "1px solid #222", borderLeft: "none",
          borderTopRightRadius: 6, borderBottomRightRadius: 6,
          background: "transparent", color: "#999",
          cursor: "pointer", fontSize: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "inherit",
        }}
      >+</button>
    </div>
  );
}

function DurationStepper({ value, onChange }: {
  value: { amount: string; unit: "days" | "months" };
  onChange: (v: { amount: string; unit: "days" | "months" }) => void;
}) {
  const num = parseInt(value.amount) || 0;
  const step = value.unit === "days" ? 1 : 1;
  const inc = () => onChange({ ...value, amount: String(num + step) });
  const dec = () => onChange({ ...value, amount: String(Math.max(1, num - step)) });

  const toDays = value.unit === "months" ? num * 30 : num;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <button type="button" onClick={dec} disabled={num <= 1}
          style={{
            width: 32, height: 38, border: "1px solid #222", borderRight: "none",
            borderTopLeftRadius: 6, borderBottomLeftRadius: 6,
            background: "transparent", color: num <= 1 ? "#333" : "#999",
            cursor: num <= 1 ? "not-allowed" : "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}
        >−</button>
        <input
          value={value.amount}
          onChange={e => onChange({ ...value, amount: e.target.value })}
          type="number"
          min={1}
          style={{
            width: "100%", height: 38,
            background: "#000", border: "1px solid #222", borderLeft: "none", borderRight: "none",
            color: "#e5e5e5", padding: "0 4px", fontSize: 13,
            borderRadius: 0, fontFamily: "inherit", outline: "none",
            textAlign: "center",
            MozAppearance: "textfield",
          }}
        />
        <button type="button" onClick={inc}
          style={{
            width: 32, height: 38, border: "1px solid #222", borderLeft: "none",
            borderTopRightRadius: 6, borderBottomRightRadius: 6,
            background: "transparent", color: "#999",
            cursor: "pointer", fontSize: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "inherit",
          }}
        >+</button>
        <select
          value={value.unit}
          onChange={e => onChange({ ...value, unit: e.target.value as "days" | "months" })}
          style={{
            marginLeft: 8, height: 38,
            background: "#0a0a0a", border: "1px solid #222",
            color: "#999", padding: "0 8px", fontSize: 12,
            borderRadius: 6, fontFamily: "inherit", outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="days">days</option>
          <option value="months">months</option>
        </select>
      </div>
      <div style={{ color: "#555", fontSize: 11 }}>
        total: {toDays} days · {toDays * 86400}s on-chain
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [buyPrice, setBuyPrice] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [rentDuration, setRentDuration] = useState({ amount: "7", unit: "days" as "days" | "months" });
  const [contentURI, setContentURI] = useState("");
  const [listing, setListing] = useState(false);

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;
    setListing(true);

    const days = rentDuration.unit === "months"
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
          BigInt(days * 86400),
          contentURI,
        ],
      });
      setBuyPrice("");
      setRentPrice("");
      setContentURI("");
      setRentDuration({ amount: "7", unit: "days" });
    } catch (e) {
      console.error(e);
    }
    setListing(false);
  };

  if (!isConnected) {
    return (
      <main className="fade-up" style={{ padding: "120px 24px", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 24, color: "#555", marginBottom: 12 }}>◆</div>
        <p style={{ color: "#777", fontSize: 14 }}>connect your wallet to access the creator dashboard</p>
      </main>
    );
  }

  const hasPrice = buyPrice || rentPrice;

  return (
    <main style={{ padding: "100px 24px 80px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px", letterSpacing: -0.3 }}>
          Creator Dashboard
        </h1>
        <p className="mono" style={{ color: "#555", fontSize: 12, margin: 0 }}>
          {address!.slice(0, 6)}...{address!.slice(-4)}
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <span>List New Content</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "#555" }}>
            Arc Testnet
          </span>
        </div>
        <div className="card-body">
          <form onSubmit={handleList} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                Content URL
              </label>
              <input
                value={contentURI}
                onChange={e => setContentURI(e.target.value)}
                placeholder="https://example.com/content"
                className="input"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  Buy Price (USDC)
                </label>
                <Stepper value={buyPrice} onChange={setBuyPrice} step={0.5} min={0} placeholder="0" />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  Rent Price (USDC)
                </label>
                <Stepper value={rentPrice} onChange={setRentPrice} step={0.5} min={0} placeholder="0" />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                Rent Duration
              </label>
              <DurationStepper value={rentDuration} onChange={setRentDuration} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                type="submit"
                disabled={listing || !hasPrice}
                className="btn btn-primary"
              >
                {listing ? "listing..." : "List Content"}
              </button>
              {!hasPrice && (
                <span style={{ color: "#555", fontSize: 12 }}>
                  set a buy or rent price to continue
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      <div style={{ marginTop: 32, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Creator Share</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>95%</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Protocol Fee</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>5%</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ color: "#555", fontSize: 10, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Settlement</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>USDC</div>
          </div>
        </div>
      </div>
    </main>
  );
}
