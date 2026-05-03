import { RelaySDK } from "@relay/core-sdk";
import type { TaskRequest, TaskResponse } from "@relay/validation";
import { randomUUID } from "crypto";

async function bootWorkerDaemon() {
  console.log("👷 Booting Worker Daemon...");
  const sdk = new RelaySDK();
  const myWorkerDID = "did:relay:worker-node-99";

  console.log("🎧 Listening to Gensyn mesh for /relay/jobs/data_extraction...");

  // Simulating the delay of waiting for a job to hit the network
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulating the job payload we just caught from the Requester
  const caughtJob: TaskRequest = {
    taskId: randomUUID(), // In reality, this would be the ID from the requester
    requesterId: "did:relay:local-requester-01",
    taskCategory: "data_extraction",
    parameters: {
      targetURL: "https://ethglobal.com",
      extractionTarget: "Hackathon Tracks",
    },
    bounty: { amount: 5, currency: "USDC" },
    timeoutSeconds: 300,
  };

  console.log(`\n📥 Caught Job: ${caughtJob.taskId}`);
  console.log("⚙️ Executing data extraction task...");

  // Simulate execution time
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // 1. Build the strictly typed response
  const resultPayload = {
    tracks: ["Agents", "DeFi", "Infrastructure", "Gaming"],
  };
  console.log("✅ Task executed successfully. Payload generated.");

  const response: TaskResponse = {
    taskId: caughtJob.taskId,
    workerId: myWorkerDID,
    status: "success",
    payload: resultPayload,
  };

  // 2. Log the receipt to 0G Storage for reputation and dispute resolution
  console.log("\n📦 Logging execution receipt to 0G Storage...");
  const zeroGHash = await sdk.logReceiptToZeroG(response);

  if (zeroGHash) {
    response.cryptographicProof = zeroGHash;
    console.log(`✅ Receipt secured. 0G Hash: ${zeroGHash}`);
  }

  // 3. Deliver the result back to the Requester via Gensyn
  console.log("\n📤 Delivering result and cryptographic proof to network...");
  const deliverySuccess = await sdk.deliverTaskResult(response);

  if (deliverySuccess) {
    console.log(
      "🎉 Result delivered! The Unichain Escrow will now release the USDC to your wallet.",
    );
  } else {
    console.error("❌ Failed to deliver result.");
  }
}

bootWorkerDaemon();
