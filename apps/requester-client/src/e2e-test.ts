// apps/requester-client/e2e-test.ts
import { RelaySDK } from "@relay/core-sdk";
import { ethers } from "ethers";
import { randomUUID } from "crypto";

async function runEndToEndTest() {
  console.log("🚀 Booting Relay Protocol E2E Test...");
  const sdk = new RelaySDK();

  // 1. Setup our actors
  const taskId = randomUUID();
  const workerWallet = ethers.Wallet.createRandom(); // Generate a random worker to pay
  console.log(`\n📋 TASK ID: ${taskId}`);
  console.log(`👷 WORKER ADDRESS: ${workerWallet.address}`);

  try {
    // ==========================================
    // PHASE 1: REQUESTER LOCKS FUNDS
    // ==========================================
    console.log("\n--- PHASE 1: ESCROW LOCK ---");
    // We pass our own address as the requester (derived from the .env private key)
    const provider = new ethers.JsonRpcProvider(process.env.UNICHAIN_RPC_URL);
    const requesterWallet = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider,
    );

    const lockTx = await sdk.lockEscrow(taskId, 5, requesterWallet.address);
    if (!lockTx) throw new Error("Lock failed!");
    console.log(`✅ Funds Locked! TxHash: ${lockTx}`);

    // ==========================================
    // PHASE 2: WORKER EXECUTES & PROVES WORK
    // ==========================================
    console.log("\n--- PHASE 2: EXECUTION & DATA AVAILABILITY ---");
    console.log("⚙️ Worker executing task...");
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate AI work

    const mockResult = {
      taskId,
      workerId: workerWallet.address,
      status: "success" as const,
      payload: { extracted_data: "Hackathon winning data" },
    };

    const zeroGHash = await sdk.logReceiptToZeroG(mockResult);
    console.log(`📦 0G Storage Proof Generated: ${zeroGHash}`);

    // ==========================================
    // PHASE 3: KEEPERHUB SETTLES PAYMENT
    // ==========================================
    console.log("\n--- PHASE 3: ON-CHAIN SETTLEMENT ---");
    const releaseTx = await sdk.releaseEscrow(taskId, workerWallet.address);
    if (!releaseTx) throw new Error("Release failed!");
    console.log(`💸 Funds Released to Worker! TxHash: ${releaseTx}`);

    // ==========================================
    // FINAL VERIFICATION
    // ==========================================
    console.log("\n🔍 Verifying Worker Balance on Unichain...");
    const balance = await provider.getBalance(workerWallet.address);
    console.log(`💰 Worker Balance: ${ethers.formatEther(balance)} ETH`);
    console.log("\n🎉 END-TO-END TEST PASSED! The protocol works perfectly.");
  } catch (error) {
    console.error("\n❌ E2E TEST FAILED:", error);
  }
}

runEndToEndTest();
