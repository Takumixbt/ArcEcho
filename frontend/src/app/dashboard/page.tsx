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
                Content URI
              </label>
              <input
                value={contentURI}
                onChange={e => setContentURI(e.target.value)}
                placeholder="ipfs://Qm..."
                className="input"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  Buy Price (USDC)
                </label>
                <input
                  value={buyPrice}
                  onChange={e => setBuyPrice(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  Rent Price (USDC)
                </label>
                <input
                  value={rentPrice}
                  onChange={e => setRentPrice(e.target.value)}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  className="input"
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                  Rent Duration
                </label>
                <select
                  value={rentDuration}
                  onChange={e => setRentDuration(e.target.value)}
                  className="select"
                >
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
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
