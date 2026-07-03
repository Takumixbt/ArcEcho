"use client";

import { useAccount, useConnect } from "wagmi";

export function Hero() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const handleConnect = () => {
    const c = connectors.find((conn) => conn.type === "injected") ?? connectors[0];
    if (c) connect({ connector: c });
  };

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 24px 40px",
    }}>
      <div className="mono fade-up" style={{
        fontSize: 14,
        color: "#555",
        marginBottom: 24,
        textAlign: "center",
      }}>
        gated content on arc
      </div>

      <h1 style={{
        fontSize: "clamp(32px, 5vw, 56px)",
        fontWeight: 300,
        textAlign: "center",
        margin: 0,
        marginBottom: 20,
        lineHeight: 1.15,
        letterSpacing: -0.5,
      }}>
        buy or rent gated content.
        <br />
        <span style={{ fontWeight: 600 }}>creators paid instantly.</span>
      </h1>

      <p style={{
        color: "#777",
        fontSize: 14,
        textAlign: "center",
        maxWidth: 500,
        lineHeight: 1.8,
        margin: "0 0 48px",
      }}>
        creators list their work with a buy price or time-boxed rent.
        payments settle in USDC on arc — 95% to creator, 5% to protocol.
        no platform account, no payout threshold, no chargebacks.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {!isConnected && (
          <button
            onClick={handleConnect}
            className="btn btn-primary"
          >
            connect wallet
          </button>
        )}
        <a href="#feed" className="btn" style={{ textDecoration: "none" }}>
          view content feed →
        </a>
      </div>

      <div style={{
        marginTop: 80,
        display: "flex",
        gap: 48,
        color: "#444",
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 18, marginBottom: 4 }}>95%</div>
          <div>to creator</div>
        </div>
        <div style={{ width: 1, background: "#222" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 18, marginBottom: 4 }}>5%</div>
          <div>protocol fee</div>
        </div>
        <div style={{ width: 1, background: "#222" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 18, marginBottom: 4 }}>USDC</div>
          <div>instant settlement</div>
        </div>
      </div>
    </section>
  );
}
