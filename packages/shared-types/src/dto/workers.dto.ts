import { z } from 'zod';

export const verifyWorkerSchema = z.object({
  verificationStatus: z.enum(['PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED']),
  kycDocumentUrls: z.array(z.string()).optional(),
});

export type VerifyWorkerDto = z.infer<typeof verifyWorkerSchema>;
