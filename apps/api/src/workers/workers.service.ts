/**
 * Workers Service — registration, skill profiling, KYC, availability.
 * Per rule A6: KYC documents in object storage only (URLs stored, not blobs).
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { ErrorCode } from '../common/constants';
import { RegisterWorkerDto, UpdateWorkerDto, VerifyWorkerDto } from './dto';

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterWorkerDto) {
    // Check user doesn't already have a worker profile
    const existing = await this.prisma.worker.findUnique({
      where: { userId: dto.userId },
    });

    if (existing) {
      throw new ConflictException({
        message: 'Worker profile already exists for this user',
        errorCode: 'WORKER_ALREADY_EXISTS',
      });
    }

    // Update user role to WORKER
    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { role: 'WORKER', cooperativeId: dto.cooperativeId },
    });

    return this.prisma.worker.create({
      data: {
        userId: dto.userId,
        cooperativeId: dto.cooperativeId,
        name: dto.name,
        skills: dto.skills,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
      include: {
        user: { select: { id: true, phone: true, role: true } },
        cooperative: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(cooperativeId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where = { cooperativeId };

    const [data, total] = await Promise.all([
      this.prisma.worker.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { phone: true } },
        },
      }),
      this.prisma.worker.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, phone: true, role: true } },
        cooperative: { select: { id: true, name: true } },
      },
    });

    if (!worker) {
      throw new NotFoundException({
        message: 'Worker not found',
        errorCode: ErrorCode.WORKER_NOT_FOUND,
      });
    }

    return worker;
  }

  async update(id: string, dto: UpdateWorkerDto) {
    await this.findOne(id);
    return this.prisma.worker.update({ where: { id }, data: dto });
  }

  async verify(id: string, dto: VerifyWorkerDto) {
    await this.findOne(id);
    return this.prisma.worker.update({
      where: { id },
      data: {
        verificationStatus: dto.verificationStatus,
        kycDocumentUrls: dto.kycDocumentUrls,
      },
    });
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    await this.findOne(id);
    return this.prisma.worker.update({
      where: { id },
      data: { isAvailable },
    });
  }

  async updateLocation(id: string, latitude: number, longitude: number) {
    await this.findOne(id);
    return this.prisma.worker.update({
      where: { id },
      data: { latitude, longitude },
    });
  }
}
