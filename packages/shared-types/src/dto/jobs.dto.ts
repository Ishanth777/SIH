import { z } from 'zod';

export const rateJobSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type RateJobDto = z.infer<typeof rateJobSchema>;

export const updateJobStatusSchema = z.object({
  action: z.enum(['ACCEPT', 'REJECT', 'START', 'COMPLETE']),
});

export type UpdateJobStatusDto = z.infer<typeof updateJobStatusSchema>;
