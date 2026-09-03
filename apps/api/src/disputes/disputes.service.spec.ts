import { Test, TestingModule } from '@nestjs/testing';
import { DisputesService } from './disputes.service';
import { PrismaService } from '../common/prisma';
import { NotFoundException } from '@nestjs/common';
import { DisputeType } from './dto/dispute.dto';

describe('DisputesService', () => {
  let service: DisputesService;
  let mockPrismaService: {
    job: { findUnique: jest.Mock };
    dispute: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock; findMany: jest.Mock };
  };

  const mockJobId = 'job-1111';
  const mockDisputeId = 'dispute-2222';
  const mockUserId = 'user-3333';

  beforeEach(async () => {
    mockPrismaService = {
      job: { findUnique: jest.fn() },
      dispute: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisputesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DisputesService>(DisputesService);
  });

  describe('create', () => {
    it('should throw NotFoundException if job does not exist', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.create(mockUserId, {
          jobId: mockJobId,
          type: 'PAYMENT' as any,
          description: 'Payment discrepancy',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should create an open dispute', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({ id: mockJobId });
      mockPrismaService.dispute.create.mockResolvedValueOnce({
        id: mockDisputeId,
        jobId: mockJobId,
        type: 'PAYMENT',
        description: 'Payment discrepancy',
        status: 'OPEN',
      });

      const result = await service.create(mockUserId, {
        jobId: mockJobId,
        type: 'PAYMENT' as any,
        description: 'Payment discrepancy',
      });

      expect(result.id).toBe(mockDisputeId);
      expect(result.status).toBe('OPEN');
    });
  });

  describe('resolve', () => {
    it('should resolve an existing dispute', async () => {
      mockPrismaService.dispute.findUnique.mockResolvedValueOnce({ id: mockDisputeId });
      mockPrismaService.dispute.update.mockResolvedValueOnce({
        id: mockDisputeId,
        status: 'RESOLVED',
        resolution: 'Refund processed to customer',
      });

      const result = await service.resolve(mockDisputeId, {
        resolution: 'Refund processed to customer',
      });

      expect(result.status).toBe('RESOLVED');
    });
  });
});
