import { Test, TestingModule } from '@nestjs/testing';
import { FederationsService } from './federations.service';
import { PrismaService } from '../common/prisma';
import { NotFoundException } from '@nestjs/common';

describe('FederationsService', () => {
  let service: FederationsService;
  let mockPrismaService: {
    federation: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockFedId = 'fed-1111-2222';

  beforeEach(async () => {
    mockPrismaService = {
      federation: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FederationsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FederationsService>(FederationsService);
  });

  it('should create a federation', async () => {
    const dto = { name: 'State Federation of Labour' };
    mockPrismaService.federation.create.mockResolvedValueOnce({ id: mockFedId, ...dto });

    const result = await service.create(dto);
    expect(result.id).toBe(mockFedId);
  });

  it('should return paginated list of federations (Rule A9)', async () => {
    mockPrismaService.federation.findMany.mockResolvedValueOnce([{ id: mockFedId, name: 'Fed 1' }]);
    mockPrismaService.federation.count.mockResolvedValueOnce(1);

    const result = await service.findAll(1, 10);
    expect(result.data).toHaveLength(1);
    expect(result.meta.totalPages).toBe(1);
  });

  it('should throw NotFoundException if federation does not exist', async () => {
    mockPrismaService.federation.findUnique.mockResolvedValueOnce(null);

    await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
  });
});
