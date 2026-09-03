import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { EventsGateway } from '../common/gateway';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  /**
   * Core deterministic matcher (Rule A3, A2)
   * Uses PostGIS ST_DWithin to find workers within radiusKm.
   */
  async matchWorkerToRequest(serviceRequestId: string, cooperativeId: string, radiusKm: number = 15) {
    this.logger.log(`Starting geo-match for request ${serviceRequestId}`);

    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: serviceRequestId },
      include: { serviceCatalog: true },
    });

    if (!request) {
      this.logger.error(`Request ${serviceRequestId} not found`);
      return;
    }

    const { latitude, longitude, serviceCatalog } = request;
    const category = serviceCatalog.category;

    // Prisma $queryRaw for PostGIS spatial query
    // SRID 4326 is WGS 84 (GPS). ST_MakePoint takes (longitude, latitude).
    // ST_DWithin uses meters when casting to geography.
    const radiusMeters = radiusKm * 1000;

    const matchedWorkers = await this.prisma.$queryRaw<any[]>`
      SELECT w.id, w."userId", 
             ST_Distance(
               ST_SetSRID(ST_MakePoint(w.longitude, w.latitude), 4326)::geography,
               ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
             ) as distance
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
      ORDER BY distance ASC
      LIMIT 10;
    `;

    if (matchedWorkers.length === 0) {
      this.logger.warn(`No workers found for request ${serviceRequestId} within ${radiusKm}km`);
      // Update request state or enqueue for later? For now, we log it.
      return;
    }

    const topWorker = matchedWorkers[0];
    this.logger.log(`Matched worker ${topWorker.id} to request ${serviceRequestId} at distance ${topWorker.distance}m`);

    // Create a Job in PENDING state
    const job = await this.prisma.job.create({
      data: {
        serviceRequestId,
        cooperativeId,
        workerId: topWorker.id,
        status: 'PENDING',
      },
    });

    // Notify the worker via Socket.IO
    this.eventsGateway.emitJobOffer(topWorker.userId, {
      jobId: job.id,
      serviceRequestId,
      category,
      distance: topWorker.distance,
    });

    return job;
  }
}
