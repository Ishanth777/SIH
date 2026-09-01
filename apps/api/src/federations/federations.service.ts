/**
 * Federations Service — CRUD for the top of the tenancy hierarchy.
 * Per rule T4: Federation → Cooperative Society → Worker.
 * Per rule A9: all list endpoints are paginated.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { ErrorCode } from '../common/constants';
import { CreateFederationDto, UpdateFederationDto } from './dto';

@Injectable()
export class FederationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFederationDto) {
    return this.prisma.federation.create({ data: dto });
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.federation.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { cooperatives: true } } },
      }),
      this.prisma.federation.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const federation = await this.prisma.federation.findUnique({
      where: { id },
      include: {
        cooperatives: true,
        _count: { select: { cooperatives: true, users: true } },
      },
    });

    if (!federation) {
      throw new NotFoundException({
        message: 'Federation not found',
        errorCode: ErrorCode.FEDERATION_NOT_FOUND,
      });
    }

    return federation;
  }

  async update(id: string, dto: UpdateFederationDto) {
    await this.findOne(id); // throws if not found
    return this.prisma.federation.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.federation.delete({ where: { id } });
  }
}
