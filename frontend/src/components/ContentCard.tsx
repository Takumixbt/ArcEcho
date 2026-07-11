"use client";

import { useState } from "react";
import { useAccount, useWriteContract, useReadContract } from "wagmi";
import {
  ACCESS_GATE_ADDRESS,
  ACCESS_GATE_ABI,
  USDC_ADDRESS,
  ERC20_ABI,
} from "@/lib/contracts";

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
  return whole.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatDuration(seconds: bigint): string {
  const days = Number(seconds) / 86400;
  if (days >= 30) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days)}d`;
}

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function shortError(e: unknown): string {
  if (e && typeof e === "object" && "shortMessage" in e) {
    return String((e as { shortMessage: string }).shortMessage);
  }
  if (e instanceof Error) return e.message.slice(0, 120);
  return "transaction failed";
}

export function ContentCard({
  content,
  onAction,
}: {
  content: Content;
  onAction: () => void;
}) {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [loading, setLoading] = useState<"buy" | "rent" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fix: content id 0 is valid — do not use truthiness on id
  const { data: hasAccess, refetch: refetchAccess } = useReadContract({
    address: ACCESS_GATE_ADDRESS,
    abi: ACCESS_GATE_ABI,
    functionName: "hasAccess",
    args:
      address && isConnected
        ? [BigInt(content.id), address]
        : undefined,
    query: { enabled: !!address && isConnected },
  });

  const { data: bought } = useReadContract({
    address: ACCESS_GATE_ADDRESS,
    abi: ACCESS_GATE_ABI,
    functionName: "boughtAccess",
    args:
      address && isConnected
        ? [BigInt(content.id), address]
        : undefined,
    query: { enabled: !!address && isConnected },
  });

  const ensureAllowance = async (amount: bigint) => {
    if (!address) throw new Error("wallet not connected");
    if (USDC_ADDRESS === "0x0000000000000000000000000000000000000000") {
      // still attempt buy/rent without approve if USDC not configured
      return;
    }
    await writeContractAsync({
      address: USDC_ADDRESS,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [ACCESS_GATE_ADDRESS, amount],
    });
  };

  const handleBuy = async () => {
    if (!isConnected || !address) return;
    setLoading("buy");
    setError(null);
    try {
      await ensureAllowance(content.buyPrice);
      await writeContractAsync({
        address: ACCESS_GATE_ADDRESS,
        abi: ACCESS_GATE_ABI,
        functionName: "buy",
        args: [BigInt(content.id)],
      });
      await refetchAccess();
      onAction();
    } catch (e) {
      setError(shortError(e));
    }
    setLoading(null);
  };

  const handleRent = async () => {
    if (!isConnected || !address) return;
    setLoading("rent");
    setError(null);
    try {
      await ensureAllowance(content.rentPrice);
      await writeContractAsync({
        address: ACCESS_GATE_ADDRESS,
        abi: ACCESS_GATE_ABI,
        functionName: "rent",
        args: [BigInt(content.id)],
      });
      await refetchAccess();
      onAction();
    } catch (e) {
      setError(shortError(e));
    }
    setLoading(null);
  };

  const isOwner =
    content.creator.toLowerCase() === address?.toLowerCase();
  const creatorLabel = isOwner ? "you" : truncateAddress(content.creator);
  const permanentlyOwned = !!bought;
  // Allow rent extend even when currently has access (unless permanent buy)
  const canRent = content.rentPrice > 0n && !permanentlyOwned;
  const canBuy = content.buyPrice > 0n && !permanentlyOwned;

  return (
    <article className="card group">
      <div className="card-header">
        <span className="font-mono">#{String(content.id).padStart(3, "0")}</span>
        <span className="tag ml-auto">{creatorLabel}</span>
        {hasAccess ? (
          <span className="tag" style={{ borderColor: "rgba(245,245,245,0.35)", color: "#f5f5f5" }}>
            unlocked
          </span>
        ) : null}
      </div>

      <div className="card-body">
        <div className="mb-6">
          <div className="font-mono text-xs text-muted mb-2">CONTENT URI</div>
          {hasAccess ? (
            <div className="font-mono text-sm text-foreground/80 break-all leading-relaxed">
              {content.contentURI || "—"}
            </div>
          ) : (
            <div className="font-mono text-sm text-muted/60 leading-relaxed">
              locked · buy or rent to reveal
            </div>
          )}
        </div>

        <div className="flex gap-10 mb-6">
          {content.buyPrice > 0n && (
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                Buy
              </div>
              <div className="font-display text-3xl tracking-tight">
                ${formatUSDC(content.buyPrice)}
              </div>
            </div>
          )}
          {content.rentPrice > 0n && (
            <div>
              <div className="font-mono text-[10px] text-muted uppercase tracking-widest mb-2">
                Rent
              </div>
              <div className="font-display text-3xl tracking-tight">
                ${formatUSDC(content.rentPrice)}
                <span className="text-base text-muted ml-1 font-sans">
                  /{formatDuration(content.rentDuration)}
                </span>
              </div>
            </div>
          )}
        </div>

        {isConnected ? (
          <div className="flex flex-wrap gap-3">
            {content.buyPrice > 0n && (
              <button
                onClick={handleBuy}
                disabled={loading !== null || !canBuy}
                className="btn btn-primary"
              >
                {permanentlyOwned
                  ? "Owned"
                  : loading === "buy"
                    ? "Buying…"
                    : `Buy $${formatUSDC(content.buyPrice)}`}
              </button>
            )}
            {content.rentPrice > 0n && (
              <button
                onClick={handleRent}
                disabled={loading !== null || !canRent}
                className="btn"
              >
                {permanentlyOwned
                  ? "Owned"
                  : loading === "rent"
                    ? "Renting…"
                    : hasAccess
                      ? `Extend $${formatUSDC(content.rentPrice)}`
                      : `Rent $${formatUSDC(content.rentPrice)}`}
              </button>
            )}
            {hasAccess && content.contentURI ? (
              <a
                href={content.contentURI}
                target="_blank"
                rel="noreferrer"
                className="btn"
              >
                Open content →
              </a>
            ) : null}
          </div>
        ) : (
          <div className="font-mono text-xs text-muted">
            connect wallet to buy or rent
          </div>
        )}

        {error && (
          <div className="mt-4 font-mono text-xs text-red-400 border border-red-500/20 px-3 py-2">
            {error}
          </div>
        )}
      </div>
    </article>
  );
}
