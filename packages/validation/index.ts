import { z } from "zod";

// 1. The Intent (What the local agent broadcasts)
export const TaskRequestSchema = z.object({
  taskId: z.string().uuid(),
  requesterId: z.string(), // e.g., the DID of the local agent
  taskCategory: z.enum([
    "data_extraction",
    "defi_math",
    "smart_contract_audit",
  ]),
  parameters: z.record(z.string(), z.any()), // The flexible instructions for the job
  bounty: z.object({
    amount: z.number().positive(),
    currency: z.literal("USDC"),
  }),
  timeoutSeconds: z.number().max(300).default(30),
});

// 2. The Delivery (What the remote worker returns)
export const TaskResponseSchema = z.object({
  taskId: z.string().uuid(),
  workerId: z.string(), // The DID of the specialized worker
  status: z.enum(["success", "failed"]),
  payload: z.record(z.string(), z.any()).optional(), // The executed result
  cryptographicProof: z.string().optional(), // The 0G storage hash
  errorMessage: z.string().optional(),
});

// Export inferred TypeScript types so your apps can use them seamlessly
export type TaskRequest = z.infer<typeof TaskRequestSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
