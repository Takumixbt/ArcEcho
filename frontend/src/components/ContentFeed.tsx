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
          results.push({ id: i, creator, buyPrice, rentPrice, rentDuration, contentURI });
        } catch {
          /* skip unlisted */
        }
      }
      setContents(results);
      setLoading(false);
    };

    fetchAll();
  }, [nextContentId, trigger]);

  if (loading) {
    return (
      <section id="feed" style={{ padding: "40px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ color: "var(--accent)", fontSize: 12 }}>{'>'} loading content feed...</div>
      </section>
    );
  }

  return (
    <section id="feed" style={{ padding: "40px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px" }}>
          {'>'} content feed
        </h2>
        <p style={{ color: "var(--text-dim)", fontSize: 11, margin: 0 }}>
          {contents.length} content items listed
        </p>
      </div>

      {contents.length === 0 ? (
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="terminal-dot red"></span>
            <span className="terminal-dot yellow"></span>
            <span className="terminal-dot green"></span>
          </div>
          <div className="terminal-body" style={{ color: "var(--text-dim)", fontSize: 12, textAlign: "center", padding: 40 }}>
            <div style={{ marginBottom: 8 }}>◈</div>
            <div>no content listed yet</div>
            <div style={{ fontSize: 11, marginTop: 8 }}>
              be the first creator to list content on arc
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {contents.map((c) => (
            <ContentCard
              key={c.id}
              content={c}
              onAction={() => setTrigger(t => t + 1)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
