import { ethers } from "hardhat";

// Arc Testnet USDC — see https://docs.arc.io/arc/references/contract-addresses.md
// Fill in before running against arcTestnet.
const ARC_TESTNET_USDC = process.env.ARC_TESTNET_USDC ?? "";
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS ?? "";

async function main() {
  if (!ARC_TESTNET_USDC || !TREASURY_ADDRESS) {
    throw new Error("Set ARC_TESTNET_USDC and TREASURY_ADDRESS in .env before deploying");
  }

  const AccessGate = await ethers.getContractFactory("AccessGate");
  const gate = await AccessGate.deploy(ARC_TESTNET_USDC, TREASURY_ADDRESS);
  await gate.waitForDeployment();

  console.log("AccessGate deployed to:", await gate.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
