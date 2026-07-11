"use client";

import { useReadContract } from "wagmi";
import { ACCESS_GATE_ADDRESS, ACCESS_GATE_ABI } from "@/lib/contracts";
import { ContentCard } from "./ContentCard";
import { useEffect, useState } from "react";
import { readContract } from "wagmi/actions";
import { config } from "@/lib/wagmi";

type Content = {
  id: number;
  creator: string;
  buyPrice: bigint;
  rentPrice: bigint;
  rentDuration: bigint;
  contentURI: string;
};

export function ContentFeed() {
  const [contents, setContents] = useState<Content[]>([]);
  const [trigger, setTrigger] = useState(0);
  const [loading, setLoading] = useState(true);

  const { data: nextContentId } = useReadContract({
    address: ACCESS_GATE_ADDRESS,
    abi: ACCESS_GATE_ABI,
    functionName: "nextContentId",
    query: { enabled: trigger >= 0 },
  });

  useEffect(() => {
    if (nextContentId === undefined) return;
    const id = Number(nextContentId);
    if (id === 0) {
      setContents([]);
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      const results: Content[] = [];
      for (let i = 0; i < id; i++) {
        try {
          const data = await readContract(config, {
            address: ACCESS_GATE_ADDRESS,
            abi: ACCESS_GATE_ABI,
            functionName: "contents",
            args: [BigInt(i)],
          });
          const [creator, buyPrice, rentPrice, rentDuration, contentURI] = data;
          if (creator === "0x0000000000000000000000000000000000000000") continue;
          results.push({
            id: i,
            creator,
            buyPrice,
            rentPrice,
            rentDuration,
            contentURI,
          });
        } catch {
          /* skip */
        }
      }
      setContents(results.reverse());
      setLoading(false);
    };

    fetchAll();
  }, [nextContentId, trigger]);

  return (
    <section id="feed" className="relative py-24 lg:py-32 border-t border-white/10">
      <div className="container-wide">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <span className="section-label mb-6">Catalog</span>
            <h2 className="font-display text-4xl lg:text-5xl tracking-tight mt-6">
              Content feed
            </h2>
            <p className="text-muted mt-3 max-w-lg">
              Live listings on Arc Testnet. Buy permanent rights or rent a
              time-boxed window — royalties settle in USDC.
            </p>
          </div>
          <div className="font-mono text-sm text-muted flex items-center gap-2">
            <span className="live-dot" />
            {loading
              ? "syncing…"
              : `${contents.length} ${contents.length === 1 ? "listing" : "listings"}`}
          </div>
        </div>

        {loading ? (
          <div className="font-mono text-sm text-muted py-16 border border-white/10 px-6">
            loading content feed…
          </div>
        ) : contents.length === 0 ? (
          <div className="border border-white/10 px-8 py-20 text-center">
            <div className="font-display text-3xl mb-3">No listings yet</div>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Be the first creator to list work and start earning royalties on Arc.
            </p>
            <a href="/dashboard" className="btn btn-primary">
              Open creator studio
            </a>
          </div>
        ) : (
          <div className="grid gap-4 max-w-3xl">
            {contents.map((c) => (
              <ContentCard
                key={c.id}
                content={c}
                onAction={() => setTrigger((t) => t + 1)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
