// apps/requester-client/rescue.ts
import { ethers } from "ethers";

async function rescueFunds() {
  // 1. Setup connection (using the same .env vars)
  const provider = new ethers.JsonRpcProvider(process.env.UNICHAIN_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

  // 2. The minimal ABI needed for a refund
  const escrowABI = ["function refundRequester(bytes32 taskId) external"];
  const contract = new ethers.Contract(
    process.env.RELAY_ESCROW_ADDRESS as string,
    escrowABI,
    wallet,
  );

  // 3. 🚨 PASTE YOUR STUCK TASK ID HERE 🚨
  // Scroll up in your terminal to find the Task ID that locked the funds
  // (e.g., "4b96b66c-9fa6-430d-8b3b-13a55f0df3e6")
  const stuckTaskId = "e7ad3206-27d4-4048-8dc6-34dd4cf81e7d";
  const taskIdBytes32 = ethers.id(stuckTaskId);

  console.log(
    `[Unichain] Attempting to rescue funds for task: ${stuckTaskId}...`,
  );

  try {
    const tx = await contract.refundRequester(taskIdBytes32);
    console.log(`[Unichain] Transaction sent! Waiting for confirmation...`);

    const receipt = await tx.wait();
    console.log(`✅ Funds rescued successfully! TxHash: ${receipt.hash}`);
  } catch (error) {
    console.error("❌ Failed to rescue funds:", error);
  }
}

rescueFunds();
