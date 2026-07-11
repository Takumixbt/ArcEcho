import { ethers } from "hardhat";

// End-to-end check against a live deployment: list content, buy it, confirm access.
// Uses the deployer key as both creator and buyer, so it only proves the contract
// wiring (ABI, USDC transfers, access accounting) — not multi-party royalty splits.
async function main() {
  const accessGateAddress = process.env.ACCESS_GATE_ADDRESS;
  if (!accessGateAddress) {
    throw new Error("Set ACCESS_GATE_ADDRESS to the deployed AccessGate address");
  }

  const [signer] = await ethers.getSigners();
  const gate = await ethers.getContractAt("AccessGate", accessGateAddress, signer);
  const usdcAddress = await gate.usdc();
  const usdc = await ethers.getContractAt("IERC20", usdcAddress, signer);

  const buyPrice = 1_000_000n; // 1 USDC
  console.log("signer:", signer.address);

  const listTx = await gate.list(buyPrice, 0n, 0n, "ipfs://smoke-test-cid");
  const listReceipt = await listTx.wait();
  console.log("listed — tx:", listReceipt?.hash);

  const contentId = (await gate.nextContentId()) - 1n;
  console.log("contentId:", contentId.toString());

  const approveTx = await usdc.approve(accessGateAddress, buyPrice);
  await approveTx.wait();
  console.log("approved USDC spend — tx:", approveTx.hash);

  const buyTx = await gate.buy(contentId);
  const buyReceipt = await buyTx.wait();
  console.log("bought — tx:", buyReceipt?.hash);

  const hasAccess = await gate.hasAccess(contentId, signer.address);
  console.log("hasAccess:", hasAccess);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
