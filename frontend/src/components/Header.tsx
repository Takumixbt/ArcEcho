"use client";

import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useConnect, useDisconnect } from "wagmi";

function useAutoConnect() {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    if (tried || isConnected) return;
    if (typeof window === "undefined") return;
    if (typeof window.ethereum === "undefined") return;

    const tryConnect = async () => {
      try {
        const hasAccounts = await window.ethereum?.request({ method: "eth_accounts" }) as string[] | undefined;
        if (hasAccounts && hasAccounts.length > 0) {
          const c = connectors.find((c) => c.type === "injected");
          if (c) await connect({ connector: c });
        }
      } catch {
        /* silent */
      }
      setTried(true);
    };
    tryConnect();
  }, [tried, isConnected, connect, connectors]);
}

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  useAutoConnect();

  const handleConnect = async () => {
    const c = connectors.find((conn) => conn.type === "injected")
      ?? connectors[0];
    if (c) connect({ connector: c });
    else if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        window.location.reload();
      } catch {}
    }
  };

  return (
    <header style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #222",
      padding: "0 24px",
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span className="mono" style={{ fontWeight: 700, fontSize: 20, color: "#fff" }}>◆</span>
          <span style={{ color: "#e5e5e5", fontWeight: 600, fontSize: 16, letterSpacing: 0.5 }}>
            ArcEcho
          </span>
          <span style={{ color: "#555", fontSize: 11 }}>v0.1</span>
        </a>
        <nav style={{ display: "flex", gap: 24 }}>
          {[
            ["Explore", "/"],
            ["Dashboard", "/dashboard"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                color: "#777",
                fontSize: 13,
                textDecoration: "none",
                transition: "color 0.15s",
              }}
              onMouseOver={e => e.currentTarget.style.color = "#fff"}
              onMouseOut={e => e.currentTarget.style.color = "#777"}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div>
        {isConnected && address ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="mono" style={{ color: "#999", fontSize: 12 }}>
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <button
              onClick={() => disconnect()}
              className="btn"
            >
              disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            className="btn btn-primary"
          >
            connect wallet
          </button>
        )}
      </div>
    </header>
  );
}
