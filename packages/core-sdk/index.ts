import type { TaskRequest, TaskResponse } from "@relay/validation";

// These are the URLs and Keys needed to talk to the sponsor networks
interface RelayConfig {
  gensynEndpoint: string;
  keeperHubApiKey: string;
  keeperHubEndpoint: string;
  zeroGEndpoint: string;
}

export class RelaySDK {
  private config: RelayConfig;

  // When we start an agent, it will load these settings
  constructor(config: Partial<RelayConfig> = {}) {
    this.config = {
      gensynEndpoint: config.gensynEndpoint || "http://localhost:8080/axl",
      keeperHubApiKey:
        config.keeperHubApiKey || process.env.KEEPERHUB_API_KEY || "",
      keeperHubEndpoint:
        config.keeperHubEndpoint || "https://api.testnet.keeperhub.io/v1",
      zeroGEndpoint: config.zeroGEndpoint || "https://api.0g.ai/v1/store",
    };
  }

  // ==========================================
  // 1. GENSYN AXL (The Communication Mesh)
  // ==========================================
  async broadcastTask(task: TaskRequest): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.gensynEndpoint}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `/relay/jobs/${task.taskCategory}`,
          payload: task,
        }),
      });
      if (!response.ok) throw new Error(`Gensyn Error: ${response.statusText}`);
      console.log(`[Gensyn] Broadcasted task ${task.taskId} to mesh.`);
      return true;
    } catch (error) {
      console.error("[Gensyn] Failed to broadcast:", error);
      return false;
    }
  }

  // ==========================================
  // 2. KEEPERHUB (Escrow & Smart Contracts)
  // ==========================================
  async lockEscrow(
    taskId: string,
    amount: number,
    requesterAddress: string,
  ): Promise<string | null> {
    try {
      const response = await fetch(
        `${this.config.keeperHubEndpoint}/escrow/lock`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.config.keeperHubApiKey}`,
          },
          body: JSON.stringify({
            taskId,
            amount,
            currency: "USDC",
            requesterAddress,
          }),
        },
      );
      if (!response.ok)
        throw new Error(`KeeperHub Error: ${response.statusText}`);
      const data = await response.json();
      console.log(`[KeeperHub] Locked ${amount} USDC. TxHash: ${data.txHash}`);
      return data.txHash;
    } catch (error) {
      console.error("[KeeperHub] Escrow lock failed:", error);
      return null;
    }
  }

  // ==========================================
  // 3. 0G STORAGE (The Immutable Receipt)
  // ==========================================
  async logReceiptToZeroG(result: TaskResponse): Promise<string | null> {
    try {
      const response = await fetch(this.config.zeroGEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: result,
          tags: ["relay-protocol", "task-receipt", result.workerId],
        }),
      });
      if (!response.ok)
        throw new Error(`0G Storage Error: ${response.statusText}`);
      const data = await response.json();
      console.log(`[0G] Receipt logged. Hash: ${data.dataHash}`);
      return data.dataHash;
    } catch (error) {
      console.error("[0G] Failed to log receipt:", error);
      return null;
    }
  }
}
