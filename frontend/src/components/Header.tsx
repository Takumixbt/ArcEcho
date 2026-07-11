"use client";

import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { arcTestnet } from "@/lib/wagmi";

export function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: switching } = useSwitchChain();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const wrongNetwork = isConnected && chainId !== arcTestnet.id;

  const handleConnect = () => {
    const c = connectors.find((c) => c.type === "injected") ?? connectors[0];
    if (c) connect({ connector: c });
  };

  const nav = [
    { label: "Explore", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "How it works", href: "/#how-it-works" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <span className="font-display text-xl tracking-tight text-foreground">
                ArcEcho
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href.replace("/#how-it-works", "/dashboard")) ||
                      pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 font-mono text-xs transition-colors no-underline ${
                      active
                        ? "text-foreground bg-white/[0.05]"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/[0.05]"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isConnected && address ? (
              <>
                <span className="font-mono text-xs text-muted">
                  {address.slice(0, 6)}…{address.slice(-4)}
                </span>
                <button onClick={() => disconnect()} className="btn">
                  Disconnect
                </button>
              </>
            ) : (
              <button onClick={handleConnect} className="btn">
                Connect Wallet
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <>
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <>
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {wrongNetwork && (
        <div className="bg-red-500/10 border-b border-red-500/30">
          <div className="container-wide flex items-center justify-between gap-4 py-2">
            <span className="font-mono text-xs text-red-300">
              Wrong network — switch to Arc Testnet to buy, rent, or list.
            </span>
            <button
              onClick={() => switchChain({ chainId: arcTestnet.id })}
              disabled={switching}
              className="font-mono text-xs px-3 py-1 border border-red-500/40 text-red-200 hover:bg-red-500/10 transition-colors shrink-0"
            >
              {switching ? "Switching…" : "Switch network"}
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          <div className="flex-1 flex flex-col justify-center gap-8">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-4xl font-display text-foreground hover:text-muted transition-colors no-underline"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="pt-8 border-t border-white/10">
            {isConnected && address ? (
              <button onClick={() => disconnect()} className="btn w-full h-14 text-base">
                Disconnect {address.slice(0, 6)}…
              </button>
            ) : (
              <button onClick={handleConnect} className="btn w-full h-14 text-base">
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
