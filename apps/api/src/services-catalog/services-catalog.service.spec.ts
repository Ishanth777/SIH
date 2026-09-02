import { Test, TestingModule } from '@nestjs/testing';
import { ServicesCatalogService } from './services-catalog.service';
import { PrismaService } from '../common/prisma';

describe('ServicesCatalogService', () => {
  let service: ServicesCatalogService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesCatalogService,
        {
          provide: PrismaService,
          useValue: {
            serviceCatalog: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ServicesCatalogService>(ServicesCatalogService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
