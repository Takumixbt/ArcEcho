import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("AccessGate", () => {
  async function deploy() {
    const [creator, buyer, renter, treasury] = await ethers.getSigners();

    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const usdc = await MockUSDC.deploy();

    const AccessGate = await ethers.getContractFactory("AccessGate");
    const gate = await AccessGate.deploy(await usdc.getAddress(), treasury.address);

    const BUY_PRICE = 10_000_000n; // 10 USDC
    const RENT_PRICE = 2_000_000n; // 2 USDC
    const RENT_DURATION = 48n * 60n * 60n; // 48 hours

    await usdc.mint(buyer.address, BUY_PRICE);
    await usdc.mint(renter.address, RENT_PRICE * 2n);

    const tx = await gate
      .connect(creator)
      .list(BUY_PRICE, RENT_PRICE, RENT_DURATION, "ipfs://fake-cid");
    await tx.wait();
    const contentId = 0n;

    return { gate, usdc, creator, buyer, renter, treasury, contentId, BUY_PRICE, RENT_PRICE, RENT_DURATION };
  }

  it("splits a buy 95/5 between creator and treasury and grants permanent access", async () => {
    const { gate, usdc, creator, buyer, treasury, contentId, BUY_PRICE } = await deploy();

    await usdc.connect(buyer).approve(await gate.getAddress(), BUY_PRICE);
    await expect(gate.connect(buyer).buy(contentId))
      .to.emit(gate, "Bought")
      .withArgs(contentId, buyer.address, BUY_PRICE);

    expect(await usdc.balanceOf(creator.address)).to.equal((BUY_PRICE * 9_500n) / 10_000n);
    expect(await usdc.balanceOf(treasury.address)).to.equal((BUY_PRICE * 500n) / 10_000n);
    expect(await gate.hasAccess(contentId, buyer.address)).to.equal(true);
  });

  it("grants time-boxed access on rent and expires it", async () => {
    const { gate, usdc, renter, contentId, RENT_PRICE, RENT_DURATION } = await deploy();

    await usdc.connect(renter).approve(await gate.getAddress(), RENT_PRICE);
    await gate.connect(renter).rent(contentId);

    expect(await gate.hasAccess(contentId, renter.address)).to.equal(true);

    await time.increase(RENT_DURATION + 1n);

    expect(await gate.hasAccess(contentId, renter.address)).to.equal(false);
  });

  it("rejects buying content that isn't for sale", async () => {
    const { gate, usdc, creator, renter } = await deploy();

    const tx = await gate.connect(creator).list(0, 1_000_000n, 3_600n, "ipfs://rent-only");
    await tx.wait();
    const rentOnlyId = 1n;

    await usdc.connect(renter).approve(await gate.getAddress(), 1_000_000n);
    await expect(gate.connect(renter).buy(rentOnlyId)).to.be.revertedWith("not for sale");
  });
});
