/**
 * Cooperatives Service — CRUD for cooperative societies.
 * Per rule T4: Cooperative is child of Federation.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { ErrorCode } from '../common/constants';
import { CreateCooperativeDto, UpdateCooperativeDto } from './dto';

@Injectable()
export class CooperativesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCooperativeDto) {
    // Verify parent federation exists
    const federation = await this.prisma.federation.findUnique({
      where: { id: dto.federationId },
    });

    if (!federation) {
      throw new NotFoundException({
        message: 'Parent federation not found',
        errorCode: ErrorCode.FEDERATION_NOT_FOUND,
      });
    }

    return this.prisma.cooperativeSociety.create({
      data: dto,
      include: { federation: { select: { id: true, name: true } } },
    });
  }

  async findAll(federationId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where = { federationId };

    const [data, total] = await Promise.all([
      this.prisma.cooperativeSociety.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          federation: { select: { id: true, name: true } },
          _count: { select: { workers: true, customers: true } },
        },
      }),
      this.prisma.cooperativeSociety.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const cooperative = await this.prisma.cooperativeSociety.findUnique({
      where: { id },
      include: {
        federation: { select: { id: true, name: true } },
        _count: { select: { workers: true, customers: true, jobs: true } },
      },
    });

    if (!cooperative) {
      throw new NotFoundException({
        message: 'Cooperative not found',
        errorCode: ErrorCode.COOPERATIVE_NOT_FOUND,
      });
    }

    return cooperative;
  }

  async update(id: string, dto: UpdateCooperativeDto) {
    await this.findOne(id);
    return this.prisma.cooperativeSociety.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cooperativeSociety.delete({ where: { id } });
  }
}
