import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { CreateServiceCatalogDto, UpdateServiceCatalogDto } from './dto';
import { ErrorCode } from '../common/constants';

const DEFAULT_CATALOG_ITEMS = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    category: 'ELECTRICIAN' as const,
    name: 'Electrician',
    description: 'Wiring, repairs, fixture installations, and electrical troubleshooting',
    baseRateMin: 300,
    baseRateMax: 500,
    unit: 'per_hour',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    category: 'PLUMBER' as const,
    name: 'Plumber',
    description: 'Leak repairs, pipe installations, drainage, and plumbing fixtures',
    baseRateMin: 250,
    baseRateMax: 450,
    unit: 'per_hour',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    category: 'CLEANER' as const,
    name: 'Home Cleaner',
    description: 'Deep home cleaning, sanitation, and waste management',
    baseRateMin: 200,
    baseRateMax: 350,
    unit: 'per_hour',
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    category: 'CAREGIVER' as const,
    name: 'Elderly & Patient Caregiver',
    description: 'Certified in-home caregiving, medical assistance, and companion care',
    baseRateMin: 350,
    baseRateMax: 600,
    unit: 'per_hour',
  },
];

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
    try {
      const items = await this.prisma.serviceCatalog.findMany({
        orderBy: { name: 'asc' },
      });
      if (items.length > 0) return items;
    } catch {
      // Fallback to default catalog items if DB not yet seeded or offline
    }
    return DEFAULT_CATALOG_ITEMS;
  }

  async findOne(id: string) {
    try {
      const service = await this.prisma.serviceCatalog.findUnique({ where: { id } });
      if (service) return service;
    } catch {
      // Fallback
    }

    const item = DEFAULT_CATALOG_ITEMS.find((c) => c.id === id);
    if (!item) {
      throw new NotFoundException({
        message: 'Service catalog entry not found',
        errorCode: ErrorCode.NOT_FOUND,
      });
    }
    return item;
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
