import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { CreateWelfareSchemeDto, EnrollWelfareDto } from './dto';

@Injectable()
export class WelfareService {
  constructor(private readonly prisma: PrismaService) {}

  async createScheme(dto: CreateWelfareSchemeDto) {
    return this.prisma.welfareScheme.create({ data: dto });
  }

  async findAllSchemes() {
    return this.prisma.welfareScheme.findMany({ where: { isActive: true } });
  }

  async enrollWorker(workerId: string, dto: EnrollWelfareDto) {
    const scheme = await this.prisma.welfareScheme.findUnique({
      where: { id: dto.schemeId },
    });

    if (!scheme || !scheme.isActive) {
      throw new NotFoundException('Active scheme not found');
    }

    const existing = await this.prisma.welfareEnrollment.findUnique({
      where: { workerId_schemeId: { workerId, schemeId: dto.schemeId } },
    });

    if (existing) {
      throw new ConflictException('Worker is already enrolled in this scheme');
    }

    return this.prisma.welfareEnrollment.create({
      data: {
        workerId,
        schemeId: dto.schemeId,
      },
    });
  }

  async findWorkerEnrollments(workerId: string) {
    return this.prisma.welfareEnrollment.findMany({
      where: { workerId },
      include: { scheme: true },
    });
  }
}
