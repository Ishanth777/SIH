import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { EventsGateway } from '../common/gateway';
import { ServiceCategory } from '@prisma/client';
import { DENSITY_RADIUS_TIERS, DEFAULT_RADIUS_TIER } from './constants';
import { MatchedWorker } from './interfaces';

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  /**
   * Deterministic PostGIS Worker Matching Algorithm (Rule A2, A3)
   * 
   * Fine-tuned with multi-tier radius expansion based on service density:
   * Tier 1 (Urban/Dense) -> Tier 2 (Suburban) -> Tier 3 (Max Radius)
   */
  async matchWorkerToRequest(serviceRequestId: string, cooperativeId: string) {
    this.logger.log(`Starting deterministic geo-match for request ${serviceRequestId}`);

    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: { serviceCatalog: true },
    });

    if (!request) {
      this.logger.error(`ServiceRequest ${serviceRequestId} not found`);
      return null;
    }

    const { latitude, longitude, serviceCatalog } = request;
    const category = serviceCatalog.category as ServiceCategory;
    const radiiConfig = DENSITY_RADIUS_TIERS[category] || DEFAULT_RADIUS_TIER;

    const searchTiers = [radiiConfig.tier1Km, radiiConfig.tier2Km, radiiConfig.maxRadiusKm];
    let matchedWorkers: MatchedWorker[] = [];
    let matchedRadiusKm = searchTiers[0];

    // Iteratively expand radius until workers are found or max radius reached
    for (const radiusKm of searchTiers) {
      matchedRadiusKm = radiusKm;
      const radiusMeters = radiusKm * 1000;

      matchedWorkers = await this.queryPostGisWorkers({
        cooperativeId,
        category,
        latitude,
        longitude,
        radiusMeters,
      });

      if (matchedWorkers.length > 0) {
        this.logger.log(
          `Found ${matchedWorkers.length} candidate worker(s) at Tier (${radiusKm}km) for request ${serviceRequestId}`
        );
        break;
      }
    }

    if (matchedWorkers.length === 0) {
      this.logger.warn(
        `No available verified workers found for request ${serviceRequestId} within max radius ${radiiConfig.maxRadiusKm}km`
      );
      return null;
    }

    // Top worker selection (deterministic ranking: shortest distance with high-rating tie-breaker)
    const topWorker = matchedWorkers[0];

    // Create Job in PENDING status
    const job = await this.prisma.job.create({
      data: {
        serviceRequestId,
        cooperativeId,
        workerId: topWorker.id,
        status: 'PENDING',
      },
    });

    this.logger.log(
      `Job ${job.id} created. Assigned worker ${topWorker.id} (${topWorker.name}) at ${(topWorker.distanceMeters / 1000).toFixed(2)}km`
    );

    // Fan-out Socket.IO notification to the worker
    this.eventsGateway.emitJobOffer(topWorker.userId, {
      jobId: job.id,
      serviceRequestId,
      category,
      distanceMeters: Math.round(topWorker.distanceMeters),
      radiusTierKm: matchedRadiusKm,
    });

    return { job, topWorker };
  }

  /**
   * Pure PostGIS raw query execution (Rule A2)
   * 
   * - Uses ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
   * - Leverages GIST spatial index on geography points
   * - Filters by availability, KYC status, skills array, and cooperative tenancy
   */
  private async queryPostGisWorkers(params: {
    cooperativeId: string;
    category: ServiceCategory;
    latitude: number;
    longitude: number;
    radiusMeters: number;
  }): Promise<MatchedWorker[]> {
    const { cooperativeId, category, latitude, longitude, radiusMeters } = params;

    const rawResults = await this.prisma.$queryRaw<any[]>`
      SELECT 
        w.id,
        w."userId",
        w.name,
        w."averageRating",
        ST_Distance(
          ST_SetSRID(ST_MakePoint(w.longitude, w.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
        ) AS "distanceMeters"
      FROM workers w
      WHERE w."cooperativeId" = ${cooperativeId}::uuid
        AND w."isAvailable" = true
        AND w."verificationStatus" = 'VERIFIED'
        AND ${category}::"ServiceCategory" = ANY(w.skills)
        AND w.latitude IS NOT NULL
        AND w.longitude IS NOT NULL
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(w.longitude, w.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
          ${radiusMeters}
        )
      ORDER BY 
        "distanceMeters" ASC,
        w."averageRating" DESC
      LIMIT 10;
    `;

    return rawResults.map((r) => ({
      id: r.id,
      userId: r.userId,
      name: r.name,
      averageRating: Number(r.averageRating),
      distanceMeters: Number(r.distanceMeters),
    }));
  }
}
