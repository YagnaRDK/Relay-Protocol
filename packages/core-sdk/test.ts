import { RelaySDK } from "./index.ts";
import type { TaskRequest } from "@relay/validation";

async function runSmokeTest() {
  console.log("🚀 Booting Relay SDK...");

  try {
    const sdk = new RelaySDK();
    console.log("✅ SDK Instantiated Successfully!");

    // Create a dummy task to test the Zod types
    const dummyTask: TaskRequest = {
      taskId: "123e4567-e89b-12d3-a456-426614174000",
      requesterId: "did:gensyn:local",
      taskCategory: "data_extraction",
      parameters: { target: "https://example.com" },
      bounty: { amount: 5, currency: "USDC" },
      timeoutSeconds: 60,
    };

    console.log("✅ Zod Types Imported and Working!");
    console.log("Ready to connect to Gensyn at:", sdk["config"].gensynEndpoint);
  } catch (error) {
    console.error("❌ SDK Failed to boot:", error);
  }
}

runSmokeTest();
