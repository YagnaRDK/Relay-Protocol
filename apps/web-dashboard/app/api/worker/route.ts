import { NextResponse } from "next/server";
import { RelaySDK } from "@relay/core-sdk";
import { ethers } from "ethers";

export async function POST(request: Request) {
  try {
    const { taskId } = await request.json();
    console.log(`[Worker API] 📥 Caught Task: ${taskId}`);

    const sdk = new RelaySDK();

    // 1. Generate a random worker wallet to receive the payout
    const workerWallet = ethers.Wallet.createRandom();
    console.log(`[Worker API] 👷 Worker Address: ${workerWallet.address}`);

    // 2. Execute the Simulated AI Work
    console.log(`[Worker API] ⚙️ Executing data extraction...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockResult = {
      taskId,
      workerId: workerWallet.address,
      status: "success" as const,
      payload: { extracted_data: "ETHGlobal winning data extracted." },
    };

    // 3. Upload Proof to 0G Storage
    console.log(`[Worker API] 📦 Uploading receipt to 0G Storage...`);
    const zeroGHash = await sdk.logReceiptToZeroG(mockResult);

    // 4. Settle Payment on Unichain
    console.log(`[Worker API] 💸 Triggering Unichain settlement...`);
    const releaseTx = await sdk.releaseEscrow(taskId, workerWallet.address);

    if (!releaseTx) throw new Error("Smart contract settlement failed.");

    return NextResponse.json({
      success: true,
      workerAddress: workerWallet.address,
      zeroGHash,
      releaseTx,
    });
  } catch (error) {
    console.error("[Worker API] ❌ Error:", error);
    return NextResponse.json(
      { success: false, error: "Worker failed to execute task." },
      { status: 500 },
    );
  }
}
