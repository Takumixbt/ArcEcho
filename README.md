# ArcEcho

Buy or rent gated content on [Arc](https://arc.io) (Circle's L1 testnet). Creators list a work with a
buy price and/or a time-boxed rent price; buyers/renters pay in USDC and get instant, on-chain access —
creators are paid immediately, minus a flat 5% protocol fee. No platform account, no payout threshold,
no chargebacks.

v1 content focus: gated alpha/research reports (text/PDF) — the content type where "rent" makes the
most sense on its own (information decays in value fast) and that crypto-native audiences already pay
for via Telegram/Discord/Substack paywalls.

## Contracts

- [`ContentRegistry.sol`](contracts/ContentRegistry.sol) — creators list content: a buy price, an
  optional rent price + duration, and a pointer to the gated asset (e.g. an encrypted IPFS CID).
- [`AccessGate.sol`](contracts/AccessGate.sol) — inherits the registry and adds `buy()`, `rent()`, and
  `hasAccess()`. Payment settles in USDC, split 95/5 between creator and protocol treasury.

Fee: **flat 5%** on every buy and rent, no tiers.

## Development

```bash
npm install
npm run compile
npm test
```

## Deploying to Arc Testnet

Copy `.env.example` to `.env` and fill in:

- `DEPLOYER_KEY` — private key funded with Arc testnet USDC (get some from the
  [Circle faucet](https://faucet.circle.com))
- `ARC_TESTNET_USDC` — USDC contract address on Arc Testnet (see
  [contract addresses](https://docs.arc.io/arc/references/contract-addresses.md))
- `TREASURY_ADDRESS` — where the protocol fee is paid

```bash
npm run deploy:testnet
```

Arc Testnet: chain ID `5042002`, RPC `https://rpc.testnet.arc.network`,
explorer [testnet.arcscan.app](https://testnet.arcscan.app).

## Status

Phase 1 (contracts) — in progress. Phase 2 (storefront frontend) and Phase 3 (testnet dogfood) not
started.
