import { z } from 'zod';

export const HeliusWebhookEventTxSchema = z.object({
  description: z.string(),
  type: z.string(),
  source: z.string(),
  fee: z.number(),
  feePayer: z.string(),
  signature: z.string(),
  slot: z.number(),
  timestamp: z.number(),
  nativeTransfers: z.array(
    z.object({
      fromUserAccount: z.string(),
      toUserAccount: z.string(),
      amount: z.number(),
    }),
  ),
  tokenTransfers: z.array(
    z.object({
      fromUserAccount: z.string(),
      toUserAccount: z.string(),
      fromTokenAccount: z.string(),
      toTokenAccount: z.string(),
      tokenAmount: z.number(),
      mint: z.string(),
    }),
  ),
  accountData: z.array(
    z.object({
      account: z.string(),
      nativeBalanceChange: z.number(),
      tokenBalanceChanges: z.array(
        z.object({
          userAccount: z.string(),
          tokenAccount: z.string(),
          mint: z.string(),
          rawTokenAmount: z.object({
            tokenAmount: z.string(),
            decimals: z.number(),
          }),
        }),
      ),
    }),
  ),
  transactionError: z
    .object({
      error: z.string(),
    })
    .nullable()
    .optional(),
  instructions: z
    .array(
      z.object({
        accounts: z.array(z.string()),
        data: z.string(),
        innerInstructions: z.array(
          z.object({
            accounts: z.array(z.string()),
            data: z.string(),
            programId: z.string(),
          }),
        ),
        programId: z.string(),
      }),
    )
    .optional(),
  events: z.any(),
});

export const HeliusWebhookEventSchema = z.object({
  body: z.array(HeliusWebhookEventTxSchema),
});

export type HeliusWebhookEventTx = z.infer<typeof HeliusWebhookEventTxSchema>;
export type HeliusWebhookEvent = z.infer<typeof HeliusWebhookEventSchema>;
