import { z } from 'zod';

export const createDisputeSchema = z.object({
  jobId: z.string().uuid(),
  type: z.enum(['RATING', 'PAYMENT', 'SERVICE_QUALITY']),
  description: z.string().min(1),
});

export type CreateDisputeDto = z.infer<typeof createDisputeSchema>;

export const resolveDisputeSchema = z.object({
  resolution: z.string().min(1),
  status: z.enum(['RESOLVED', 'ESCALATED']).optional(),
});

export type ResolveDisputeDto = z.infer<typeof resolveDisputeSchema>;
