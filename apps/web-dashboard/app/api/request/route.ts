import { NextResponse } from "next/server";
import { RelaySDK } from "@relay/core-sdk";
import { ethers } from "ethers";

export async function POST(request: Request) {
  try {
    // Catch the custom parameters from the UI
    const { taskInstructions, bountyAmount } = await request.json();

    const sdk = new RelaySDK();
    const taskId = crypto.randomUUID();

    const provider = new ethers.JsonRpcProvider(process.env.UNICHAIN_RPC_URL);
    const requesterWallet = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider,
    );

    console.log(
      `[Requester] Task: ${taskInstructions} | Bounty: ${bountyAmount} ETH`,
    );

    // Pass the dynamic amount (fallback to 0.0005 if empty)
    const txBounty = parseFloat(bountyAmount) || 0.0005;
    const lockTx = await sdk.lockEscrow(
      taskId,
      txBounty,
      requesterWallet.address,
    );

    if (!lockTx) throw new Error("Failed to lock funds");

    return NextResponse.json({ success: true, taskId, lockTx });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to broadcast task" },
      { status: 500 },
    );
  }
}
