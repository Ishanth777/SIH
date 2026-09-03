import { z } from 'zod';

export const createServiceRequestSchema = z.object({
  cooperativeId: z.string().uuid(),
  serviceCatalogId: z.string().uuid(),
  type: z.enum(['SCHEDULED', 'EMERGENCY']),
  description: z.string().optional(),
  address: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  scheduledAt: z.string().datetime().optional(),
  estimatedHours: z.number().positive().optional(),
});

export type CreateServiceRequestDto = z.infer<typeof createServiceRequestSchema>;
