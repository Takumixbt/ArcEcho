import { http, createConfig, cookieStorage, createStorage } from "wagmi";
import { defineChain } from "viem";

export const arcTestnet = defineChain({
  id: 504_2002,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETH",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
    public: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [arcTestnet],
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [arcTestnet.id]: http(),
  },
});
