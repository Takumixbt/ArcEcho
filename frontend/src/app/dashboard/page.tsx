"use client";

import { useAccount, useWriteContract } from "wagmi";
import { ACCESS_GATE_ADDRESS, ACCESS_GATE_ABI } from "@/lib/contracts";
import { parseUnits } from "viem";
import { useState } from "react";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [buyPrice, setBuyPrice] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [rentDuration, setRentDuration] = useState("7");
  const [contentURI, setContentURI] = useState("");
  const [listing, setListing] = useState(false);

  const handleList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) return;
    setListing(true);

    try {
      await writeContractAsync({
        address: ACCESS_GATE_ADDRESS,
        abi: ACCESS_GATE_ABI,
        functionName: "list",
        args: [
          buyPrice ? parseUnits(buyPrice, 6) : 0n,
          rentPrice ? parseUnits(rentPrice, 6) : 0n,
          BigInt(Number(rentDuration) * 86400),
          contentURI,
        ],
      });
      setBuyPrice("");
      setRentPrice("");
      setContentURI("");
    } catch (e) {
      console.error(e);
    }
    setListing(false);
  };

  if (!isConnected) {
    return (
      <main style={{ padding: "100px 24px", maxWidth: 640, margin: "0 auto" }}>
        <div className="terminal-window">
          <div className="terminal-body" style={{ textAlign: "center", padding: 40 }}>
            <div style={{ color: "var(--accent)", marginBottom: 12 }}>◈</div>
            <div style={{ color: "var(--text-dim)", fontSize: 13 }}>connect wallet to access dashboard</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "100px 24px 80px", maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px" }}>
          {'>'} creator dashboard
        </h1>
        <p style={{ color: "var(--text-dim)", fontSize: 11, margin: 0 }}>
          {address?.slice(0, 6)}...{address?.slice(-4)} — Arc Testnet
        </p>
      </div>

      <div className="terminal-window">
        <div className="terminal-header">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
          <span style={{ marginLeft: 8, color: "var(--text-dim)", fontSize: 11 }}>list new content</span>
        </div>
        <div className="terminal-body">
          <form onSubmit={handleList}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ color: "var(--text-dim)", fontSize: 10, display: "block", marginBottom: 4 }}>
                  CONTENT URI (ipfs://... or URL)
                </label>
                <input
                  value={contentURI}
                  onChange={e => setContentURI(e.target.value)}
                  placeholder="ipfs://Qm..."
                  style={{
                    width: "100%",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    padding: "8px 12px",
                    fontSize: 12,
                    borderRadius: 4,
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "var(--text-dim)", fontSize: 10, display: "block", marginBottom: 4 }}>
                    BUY PRICE (USDC)
                  </label>
                  <input
                    value={buyPrice}
                    onChange={e => setBuyPrice(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    style={{
                      width: "100%",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      padding: "8px 12px",
                      fontSize: 12,
                      borderRadius: 4,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ color: "var(--text-dim)", fontSize: 10, display: "block", marginBottom: 4 }}>
                    RENT PRICE (USDC)
                  </label>
                  <input
                    value={rentPrice}
                    onChange={e => setRentPrice(e.target.value)}
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    style={{
                      width: "100%",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      padding: "8px 12px",
                      fontSize: 12,
                      borderRadius: 4,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ flex: 0.6 }}>
                  <label style={{ color: "var(--text-dim)", fontSize: 10, display: "block", marginBottom: 4 }}>
                    RENT DURATION
                  </label>
                  <select
                    value={rentDuration}
                    onChange={e => setRentDuration(e.target.value)}
                    style={{
                      width: "100%",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                      padding: "8px 12px",
                      fontSize: 12,
                      borderRadius: 4,
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={listing || (!buyPrice && !rentPrice)}
                style={{
                  background: "transparent",
                  border: "1px solid var(--accent)",
                  color: listing ? "var(--text-dim)" : "var(--accent)",
                  padding: "8px 16px",
                  fontSize: 12,
                  cursor: listing ? "wait" : "pointer",
                  borderRadius: 4,
                  fontFamily: "inherit",
                  opacity: (!buyPrice && !rentPrice) ? 0.4 : 1,
                }}
              >
                {listing ? 'listing...' : '$ list content'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="ascii-art" style={{ opacity: 0.2, textAlign: "center" }}>
{`  ╔═══════════════════════════╗
  ║  flat 5% protocol fee     ║
  ║  95% goes to you — always  ║
  ╚═══════════════════════════╝`}
        </div>
      </div>
    </main>
  );
}
