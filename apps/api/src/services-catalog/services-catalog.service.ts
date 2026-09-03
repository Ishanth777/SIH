import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto';
import { ErrorCode } from '../common/constants';

@Injectable()
export class ServicesCatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceCatalogDto) {
    const existing = await this.prisma.serviceCatalog.findUnique({
      where: { category: dto.category },
    });
    if (existing) {
      throw new ConflictException('Service category already exists in catalog');
    }
    return this.prisma.serviceCatalog.create({ data: dto });
  }

  async findAll() {
    return this.prisma.serviceCatalog.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.serviceCatalog.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException({
        message: 'Service catalog entry not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceCatalogDto) {
    await this.findOne(id);
    return this.prisma.serviceCatalog.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.serviceCatalog.delete({ where: { id } });
  }
}
