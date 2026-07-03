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
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, rgba(0,255,65,0.03) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="ascii-art fade-up" style={{ marginBottom: 32, textAlign: "center" }}>
{`   ╔══════════════════════════╗
   ║       ◈  ARCE CHO  ◈      ║
   ║   gated content on arc    ║
   ╚══════════════════════════╝`}
      </div>

      <h1 className="glitch" style={{
        fontSize: "clamp(28px, 5vw, 48px)",
        fontWeight: 700,
        textAlign: "center",
        margin: 0,
        marginBottom: 16,
        lineHeight: 1.2,
        letterSpacing: 2,
      }}>
        buy or rent gated content.
        <br />
        <span style={{ color: "var(--accent)" }}>creators paid instantly.</span>
      </h1>

      <p style={{
        color: "var(--text-secondary)",
        fontSize: 13,
        textAlign: "center",
        maxWidth: 480,
        lineHeight: 1.8,
        margin: "0 0 40px",
      }}>
        content creators list their work with a buy price or time-boxed rent.
        payments settle in USDC on arc — <span style={{ color: "var(--accent)" }}>95% to creator, 5% to protocol</span>.
        no platform account, no payout threshold, no chargebacks.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {!isConnected && (
          <button
            onClick={handleConnect}
            className="glow-pulse"
            style={{
              background: "transparent",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              padding: "10px 24px",
              fontSize: 13,
              cursor: "pointer",
              borderRadius: 4,
              fontFamily: "inherit",
            }}
          >
            connect wallet to start
          </button>
        )}
        <a
          href="#feed"
          style={{
            color: "var(--text-secondary)",
            fontSize: 13,
            textDecoration: "none",
            borderBottom: "1px solid var(--border)",
            padding: "10px 24px",
          }}
        >
          view content feed →
        </a>
      </div>

      <div className="ascii-art" style={{ marginTop: 60, opacity: 0.3 }}>
{`  ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗ ╔═══╗
  ║ B ║ ║ U ║ ║ Y ║ ║ / ║ ║ R ║
  ╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝ ╚═══╝`}
      </div>
    </section>
  );
}
