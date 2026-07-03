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
    <div className="card fade-up">
      <div className="card-header">
        <span>content #{content.id}</span>
        <span style={{ marginLeft: "auto" }} className="tag">
          {creatorLabel}
        </span>
      </div>

      <div className="card-body">
        <div style={{ marginBottom: 16 }}>
          <span className="mono" style={{ fontSize: 12, color: "#999", wordBreak: "break-all" }}>
            {content.contentURI
              ? content.contentURI.slice(0, 50) + (content.contentURI.length > 50 ? "..." : "")
              : "no uri"}
          </span>
        </div>

        <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
          {content.buyPrice > 0n && (
            <div>
              <div style={{ color: "#555", fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Buy</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>
                ${formatUSDC(content.buyPrice)}
              </div>
            </div>
          )}
          {content.rentPrice > 0n && (
            <div>
              <div style={{ color: "#555", fontSize: 10, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Rent</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>
                ${formatUSDC(content.rentPrice)}
                <span style={{ color: "#777", fontSize: 11, fontWeight: 400 }}>
                  /{formatDuration(content.rentDuration)}
                </span>
              </div>
            </div>
          )}
        </div>

        {isConnected ? (
          <div style={{ display: "flex", gap: 8 }}>
            {content.buyPrice > 0n && (
              <button
                onClick={handleBuy}
                disabled={loading !== null || !!hasAccess}
                className="btn btn-primary"
              >
                {hasAccess ? "owned" : loading === "buy" ? "buying..." : `buy $${formatUSDC(content.buyPrice)}`}
              </button>
            )}
            {content.rentPrice > 0n && (
              <button
                onClick={handleRent}
                disabled={loading !== null || !!hasAccess}
                className="btn"
              >
                {hasAccess ? "has access" : loading === "rent" ? "renting..." : `rent $${formatUSDC(content.rentPrice)}`}
              </button>
            )}
          </div>
        ) : (
          <div style={{ color: "#555", fontSize: 12 }}>
            connect wallet to buy or rent
          </div>
        )}
      </div>
    </div>
  );
}
