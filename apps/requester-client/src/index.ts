import { RelaySDK } from "@relay/core-sdk";
import type { TaskRequest } from "@relay/validation";

// Node's built-in crypto for generating secure UUIDs
import { randomUUID } from "crypto";

async function bootRequesterAgent() {
  console.log("🤖 Booting Requester Agent...");

  // 1. Initialize the SDK (it automatically pulls from your .env file)
  const sdk = new RelaySDK();

  // Your public wallet address (where the contract will pull funds from)
  // Replace this with your actual public address later, but keep it mock for now to test the SDK flow
  const myWalletAddress = "0xYourPublicWalletAddressHere";

  // 2. Define the exact parameters of the job using our strict Schema
  const newJob: TaskRequest = {
    taskId: randomUUID(),
    requesterId: "did:relay:local-requester-01",
    taskCategory: "data_extraction",
    parameters: {
      targetURL: "https://ethglobal.com",
      extractionTarget: "Hackathon Tracks",
    },
    bounty: {
      amount: 5, // 5 USDC
      currency: "USDC",
    },
    timeoutSeconds: 300,
  };

  console.log(`\n📋 Assembling new bounty for task: ${newJob.taskId}`);
  console.log(`💰 Bounty: ${newJob.bounty.amount} USDC`);

  // 3. Lock the funds in Unichain Escrow via KeeperHub
  console.log("\n🔒 Locking funds in Unichain Escrow...");
  const txHash = await sdk.lockEscrow(
    newJob.taskId,
    newJob.bounty.amount,
    myWalletAddress,
  );

  if (!txHash) {
    console.error("❌ Failed to lock funds. Aborting task broadcast.");
    return;
  }

  console.log(`✅ Funds locked successfully! TxHash: ${txHash}`);

  // 4. Broadcast the intent to the Gensyn AXL mesh
  console.log("\n📡 Broadcasting intent to Gensyn AXL network...");
  const broadcastSuccess = await sdk.broadcastTask(newJob);

  if (broadcastSuccess) {
    console.log(
      "🚀 Agent has successfully hired the network. Waiting for workers...",
    );
  } else {
    console.error("❌ Failed to broadcast to the network.");
  }
}

// Run the agent
bootRequesterAgent();
