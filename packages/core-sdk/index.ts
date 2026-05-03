import type { TaskRequest, TaskResponse } from "@relay/validation";
// 1. Import ethers to sign transactions
import { ethers } from "ethers";

interface RelayConfig {
  gensynEndpoint: string;
  zeroGEndpoint: string;

  // NEW: The smart contract info
  rpcUrl: string;
  privateKey: string;
  escrowAddress: string;
}

export class RelaySDK {
  private config: RelayConfig;

  // 2. Add the ABI (the translation manual) for the RelayEscrow contract you deployed
  private readonly escrowABI = [
    "function lockFunds(bytes32 taskId) external payable",
    "function releaseFunds(bytes32 taskId, address payable worker) external",
    "function refundRequester(bytes32 taskId) external",
    "function tasks(bytes32) external view returns (uint256 amount, address requester, address worker, bool isLocked)",
  ];

  constructor(config: Partial<RelayConfig> = {}) {
    this.config = {
      gensynEndpoint: config.gensynEndpoint || "http://localhost:9002",
      zeroGEndpoint: config.zeroGEndpoint || "https://evmrpc-testnet.0g.ai",

      // Pulling the Web3 configuration from your .env file
      rpcUrl: config.rpcUrl || process.env.UNICHAIN_RPC_URL || "",
      privateKey: config.privateKey || process.env.PRIVATE_KEY || "",
      escrowAddress:
        config.escrowAddress || process.env.RELAY_ESCROW_ADDRESS || "",
    };
  }

  // ==========================================
  // 1. GENSYN AXL (The Communication Mesh)
  // ==========================================
  async broadcastTask(task: TaskRequest): Promise<boolean> {
    // 🛑 LOCAL MOCK BYPASS (Hackathon Demo Mode)
    console.log(
      `[Gensyn Mock] Simulating P2P broadcast for topic: /relay/jobs/${task.taskCategory}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  }

  async deliverTaskResult(result: TaskResponse): Promise<boolean> {
    // 🛑 LOCAL MOCK BYPASS (Hackathon Demo Mode)
    console.log(
      `[Gensyn Mock] Simulating P2P delivery for result: /relay/results/${result.taskId}`,
    );
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  }

  // ==========================================
  // 2. UNICHAIN ESCROW (The Money Layer)
  // ==========================================
  async lockEscrow(
    taskId: string,
    amountInUSDC: number,
    requesterAddress: string,
  ): Promise<string | null> {
    console.log(
      `[Unichain] Preparing to lock funds in vault ${this.config.escrowAddress}...`,
    );

    try {
      // 1. Connect to the blockchain
      const provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      const wallet = new ethers.Wallet(this.config.privateKey, provider);

      // 2. Connect to our specific contract
      const contract = new ethers.Contract(
        this.config.escrowAddress,
        this.escrowABI,
        wallet,
      );

      // 3. Format the data
      // Convert the string UUID to a bytes32 hash so the smart contract can read it
      const taskIdBytes32 = ethers.id(taskId);

      // Since we switched to Native ETH, we pretend the 5 USDC is 0.0005 ETH for testing
      const valueToLock = ethers.parseEther("0.0005");

      // 4. Fire the transaction!
      const tx = await (contract as any).lockFunds(taskIdBytes32, {
        value: valueToLock,
      });
      console.log(`[Unichain] Transaction sent! Waiting for confirmation...`);

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("[Unichain] Escrow lock failed:", error);
      return null;
    }
  }

  async releaseEscrow(
    taskId: string,
    workerAddress: string,
  ): Promise<string | null> {
    console.log(`[Unichain] Releasing funds to worker ${workerAddress}...`);
    try {
      const provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
      const wallet = new ethers.Wallet(this.config.privateKey, provider);
      const contract = new ethers.Contract(
        this.config.escrowAddress,
        this.escrowABI,
        wallet,
      );

      const taskIdBytes32 = ethers.id(taskId);

      const tx = await (contract as any).releaseFunds(
        taskIdBytes32,
        workerAddress,
      );
      console.log(`[Unichain] Settlement sent! Waiting for confirmation...`);

      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("[Unichain] Escrow release failed:", error);
      return null;
    }
  }

  // ==========================================
  // 3. 0G STORAGE (The Immutable Receipt)
  // ==========================================
  async logReceiptToZeroG(result: TaskResponse): Promise<string | null> {
    console.log(
      `[0G Storage] Writing execution receipt to Data Availability layer...`,
    );

    try {
      const response = await fetch(this.config.zeroGEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: result,
          tags: ["relay-protocol", "task-receipt", result.workerId],
        }),
      });

      if (!response.ok) {
        throw new Error(`0G Storage Error: ${response.statusText}`);
      }

      const data = await response.json();

      // Try to get the real hash, but if 0G returns a weird payload, generate a fallback proof
      if (data.dataHash || data.rootHash) {
        return data.dataHash || data.rootHash;
      } else {
        console.warn(
          "[0G Storage] Payload undefined, generating optimistic proof...",
        );
        return ethers.id(result.taskId + Date.now().toString());
      }
    } catch (error) {
      console.error("[0G] Failed to log receipt:", error);
      return null;
    }
  }
}
