import { Test, TestingModule } from '@nestjs/testing';
import { WelfareService } from './welfare.service';
import { PrismaService } from '../common/prisma';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('WelfareService', () => {
  let service: WelfareService;
  let mockPrismaService: {
    welfareScheme: { findUnique: jest.Mock; findMany: jest.Mock; create: jest.Mock };
    welfareEnrollment: { findUnique: jest.Mock; create: jest.Mock; findMany: jest.Mock };
  };

  const mockSchemeId = 'scheme-1111';
  const mockWorkerId = 'worker-2222';

  beforeEach(async () => {
    mockPrismaService = {
      welfareScheme: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
      },
      welfareEnrollment: {
        findUnique: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WelfareService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WelfareService>(WelfareService);
  });

  describe('enrollWorker', () => {
    it('should throw NotFoundException if scheme not active or not found', async () => {
      mockPrismaService.welfareScheme.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.enrollWorker(mockWorkerId, { schemeId: mockSchemeId }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if already enrolled', async () => {
      mockPrismaService.welfareScheme.findUnique.mockResolvedValueOnce({
        id: mockSchemeId,
        isActive: true,
      });
      mockPrismaService.welfareEnrollment.findUnique.mockResolvedValueOnce({
        id: 'enroll-1',
      });

      await expect(
        service.enrollWorker(mockWorkerId, { schemeId: mockSchemeId }),
      ).rejects.toThrow(ConflictException);
    });

    it('should enroll worker successfully', async () => {
      mockPrismaService.welfareScheme.findUnique.mockResolvedValueOnce({
        id: mockSchemeId,
        isActive: true,
      });
      mockPrismaService.welfareEnrollment.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.welfareEnrollment.create.mockResolvedValueOnce({
        id: 'enroll-new',
        workerId: mockWorkerId,
        schemeId: mockSchemeId,
      });

      const result = await service.enrollWorker(mockWorkerId, { schemeId: mockSchemeId });
      expect(result.id).toBe('enroll-new');
    });
  });
});
