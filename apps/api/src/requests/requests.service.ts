import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { CreateServiceRequestDto, RequestType } from './dto';
import { ErrorCode } from '../common/constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MATCHING_QUEUE } from '../common/queue';

@Injectable()
export class RequestsService {
  private readonly logger = new Logger(RequestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(MATCHING_QUEUE) private matchingQueue: Queue,
  ) {}

  async create(customerId: string, dto: CreateServiceRequestDto) {
    if (dto.type === RequestType.SCHEDULED && !dto.scheduledAt) {
      throw new BadRequestException('scheduledAt is required for SCHEDULED requests');
    }

    // Verify catalog entry exists
    const catalog = await this.prisma.serviceCatalog.findUnique({
      where: { id: dto.serviceCatalogId },
    });
    if (!catalog) {
      throw new NotFoundException('Service catalog entry not found');
    }

    // Verify customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    const request = await this.prisma.serviceRequest.create({
      data: {
        customerId,
        cooperativeId: dto.cooperativeId,
        serviceCatalogId: dto.serviceCatalogId,
        type: dto.type,
        description: dto.description,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        estimatedHours: dto.estimatedHours,
      },
      include: {
        customer: true,
        serviceCatalog: true,
      },
    });

    // Enqueue matching job
    await this.matchingQueue.add('match-workers', {
      serviceRequestId: request.id,
      cooperativeId: request.cooperativeId,
    });
    this.logger.log(`Enqueued matching for request ${request.id}`);

    return request;
  }

  async findAllByCustomer(customerId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.serviceRequest.findMany({
        where: { customerId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { serviceCatalog: true, job: true },
      }),
      this.prisma.serviceRequest.count({ where: { customerId } }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: { customer: true, serviceCatalog: true, job: true },
    });
    if (!request) {
      throw new NotFoundException({
        message: 'Service request not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }
    return request;
  }
}
