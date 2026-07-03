"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, State } from "wagmi";
import { config } from "@/lib/wagmi";
import { ReactNode, useState } from "react";

export function Providers({ children, initialState }: { children: ReactNode; initialState?: State }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
