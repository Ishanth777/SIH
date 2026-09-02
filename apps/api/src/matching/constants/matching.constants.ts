import { ServiceCategory } from '@prisma/client';

export interface DensityRadiusTier {
  tier1Km: number;
  tier2Km: number;
  maxRadiusKm: number;
}

/**
 * Service density radius configurations in kilometers (Rule A3)
 */
export const DENSITY_RADIUS_TIERS: Record<ServiceCategory, DensityRadiusTier> = {
  ELECTRICIAN: { tier1Km: 5, tier2Km: 12, maxRadiusKm: 25 },
  PLUMBER:     { tier1Km: 5, tier2Km: 12, maxRadiusKm: 25 },
  CLEANER:     { tier1Km: 4, tier2Km: 8,  maxRadiusKm: 15 },
  CAREGIVER:   { tier1Km: 8, tier2Km: 20, maxRadiusKm: 35 },
};

export const DEFAULT_RADIUS_TIER: DensityRadiusTier = {
  tier1Km: 5,
  tier2Km: 15,
  maxRadiusKm: 30,
};
