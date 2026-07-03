"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { ACCESS_GATE_ADDRESS, ACCESS_GATE_ABI } from "@/lib/contracts";

type Content = {
  id: number;
  creator: string;
  buyPrice: bigint;
  rentPrice: bigint;
  rentDuration: bigint;
  contentURI: string;
};

function formatUSDC(amount: bigint): string {
  const whole = Number(amount) / 1_000_000;
  return whole.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDuration(seconds: bigint): string {
  const days = Number(seconds) / 86400;
  if (days >= 30) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days)}d`;
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function ContentCard({ content, onAction }: { content: Content; onAction: () => void }) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState<"buy" | "rent" | null>(null);

  const { data: hasAccess } = useReadContract({
    address: ACCESS_GATE_ADDRESS,
    abi: ACCESS_GATE_ABI,
    functionName: "hasAccess",
    args: content.id ? [BigInt(content.id), address ?? "0x0"] : undefined,
    query: { enabled: !!address && isConnected && content.id !== undefined },
  });

  const handleBuy = async () => {
    if (!isConnected || !address) return;
    setLoading("buy");
    try {
      await writeContractAsync({
        address: ACCESS_GATE_ADDRESS,
        abi: ACCESS_GATE_ABI,
        functionName: "buy",
        args: [BigInt(content.id)],
      });
      onAction();
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  };

  const handleRent = async () => {
    if (!isConnected || !address) return;
    setLoading("rent");
    try {
      await writeContractAsync({
        address: ACCESS_GATE_ADDRESS,
        abi: ACCESS_GATE_ABI,
        functionName: "rent",
        args: [BigInt(content.id)],
      });
      onAction();
    } catch (e) {
      console.error(e);
    }
    setLoading(null);
  };

  const creatorLabel = content.creator.toLowerCase() === address?.toLowerCase()
    ? "you"
    : truncateAddress(content.creator);

  return (
    <div className="terminal-window fade-up">
      <div className="terminal-header">
        <span className="terminal-dot red"></span>
        <span className="terminal-dot yellow"></span>
        <span className="terminal-dot green"></span>
        <span style={{ marginLeft: 8, color: "var(--text-dim)", fontSize: 11 }}>
          content #{content.id}
        </span>
      </div>

      <div className="terminal-body">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>
            {'>'} {content.contentURI ? content.contentURI.slice(0, 40) + (content.contentURI.length > 40 ? '...' : '') : 'no uri'}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ color: "var(--text-dim)", fontSize: 11 }}>creator:</span>
          <span style={{ color: "var(--cyan)", fontSize: 11 }}>{creatorLabel}</span>
        </div>

        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          {content.buyPrice > 0n && (
            <div>
              <div style={{ color: "var(--text-dim)", fontSize: 10, marginBottom: 4 }}>BUY PRICE</div>
              <div style={{ color: "var(--accent)", fontSize: 16, fontWeight: 600 }}>
                ${formatUSDC(content.buyPrice)}
              </div>
            </div>
          )}
          {content.rentPrice > 0n && (
            <div>
              <div style={{ color: "var(--text-dim)", fontSize: 10, marginBottom: 4 }}>RENT PRICE</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 16, fontWeight: 600 }}>
                ${formatUSDC(content.rentPrice)}
                <span style={{ color: "var(--text-dim)", fontSize: 10, fontWeight: 400 }}>
                  /{formatDuration(content.rentDuration)}
                </span>
              </div>
            </div>
          )}
        </div>

        {isConnected && (
          <div style={{ display: "flex", gap: 8 }}>
            {content.buyPrice > 0n && (
              <button
                onClick={handleBuy}
                disabled={loading !== null || hasAccess}
                style={{
                  background: hasAccess ? "var(--bg-tertiary)" : "transparent",
                  border: `1px solid ${hasAccess ? "var(--text-dim)" : "var(--accent)"}`,
                  color: hasAccess ? "var(--text-dim)" : "var(--accent)",
                  padding: "6px 16px",
                  fontSize: 12,
                  cursor: loading === "buy" ? "wait" : hasAccess ? "default" : "pointer",
                  borderRadius: 4,
                  fontFamily: "inherit",
                  opacity: loading === "buy" ? 0.6 : 1,
                }}
              >
                {hasAccess ? '✓ owned' : loading === 'buy' ? 'buying...' : `buy $${formatUSDC(content.buyPrice)}`}
              </button>
            )}
            {content.rentPrice > 0n && (
              <button
                onClick={handleRent}
                disabled={loading !== null || hasAccess}
                style={{
                  background: hasAccess ? "var(--bg-tertiary)" : "transparent",
                  border: `1px solid ${hasAccess ? "var(--text-dim)" : "var(--cyan)"}`,
                  color: hasAccess ? "var(--text-dim)" : "var(--cyan)",
                  padding: "6px 16px",
                  fontSize: 12,
                  cursor: loading === "rent" ? "wait" : hasAccess ? "default" : "pointer",
                  borderRadius: 4,
                  fontFamily: "inherit",
                  opacity: loading === "rent" ? 0.6 : 1,
                }}
              >
                {hasAccess ? '✓ access' : loading === 'rent' ? 'renting...' : `rent $${formatUSDC(content.rentPrice)}`}
              </button>
            )}
          </div>
        )}

        {!isConnected && (
          <div style={{ color: "var(--text-dim)", fontSize: 11, fontStyle: "italic" }}>
            connect wallet to buy or rent
          </div>
        )}
      </div>
    </div>
  );
}
