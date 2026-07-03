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
        <div style={{ color: "#555", fontSize: 13 }}>loading content feed...</div>
      </section>
    );
  }

  return (
    <section id="feed" style={{ padding: "40px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 24, borderBottom: "1px solid #222", paddingBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "#e5e5e5", margin: "0 0 4px" }}>
          Content Feed
        </h2>
        <p style={{ color: "#555", fontSize: 12, margin: 0 }}>
          {contents.length} {contents.length === 1 ? "item" : "items"} listed
        </p>
      </div>

      {contents.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "48px 24px" }}>
            <div style={{ color: "#555", marginBottom: 8, fontSize: 24 }}>◆</div>
            <div style={{ color: "#777", fontSize: 14, marginBottom: 4 }}>no content listed yet</div>
            <div style={{ color: "#555", fontSize: 12 }}>
              be the first creator to list content on arc
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
