import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { CreateDisputeDto, ResolveDisputeDto } from './dto';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateDisputeDto) {
    const job = await this.prisma.job.findUnique({ where: { id: dto.jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.prisma.dispute.create({
      data: {
        jobId: dto.jobId,
        type: dto.type,
        description: dto.description,
        raisedBy: userId,
        status: 'OPEN',
      },
    });
  }

  async findAll() {
    return this.prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: { job: true },
    });
  }

  async resolve(id: string, dto: ResolveDisputeDto) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id } });
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    return this.prisma.dispute.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolution: dto.resolution,
      },
    });
  }
}
