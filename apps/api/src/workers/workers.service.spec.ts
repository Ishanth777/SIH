import { Test, TestingModule } from '@nestjs/testing';
import { WorkersService } from './workers.service';
import { PrismaService } from '../common/prisma';
import { ConflictException } from '@nestjs/common';

describe('WorkersService', () => {
  let service: WorkersService;
  let mockPrismaService: {
    worker: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    user: {
      update: jest.Mock;
    };
  };

  const mockWorkerId = 'worker-uuid-1111';
  const mockUserId = 'user-uuid-2222';
  const mockCoopId = 'coop-uuid-3333';

  beforeEach(async () => {
    mockPrismaService = {
      worker: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      user: {
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<WorkersService>(WorkersService);
  });

  describe('register', () => {
    it('should throw ConflictException if worker profile already exists', async () => {
      mockPrismaService.worker.findUnique.mockResolvedValueOnce({ id: mockWorkerId });

      await expect(
        service.register({
          userId: mockUserId,
          cooperativeId: mockCoopId,
          name: 'Rajesh',
          skills: ['ELECTRICIAN' as any],
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should register a new worker and update user role', async () => {
      mockPrismaService.worker.findUnique.mockResolvedValueOnce(null);
      mockPrismaService.user.update.mockResolvedValueOnce({ id: mockUserId, role: 'WORKER' });
      mockPrismaService.worker.create.mockResolvedValueOnce({
        id: mockWorkerId,
        userId: mockUserId,
        cooperativeId: mockCoopId,
        name: 'Rajesh',
        skills: ['ELECTRICIAN' as any],
      });

      const result = await service.register({
        userId: mockUserId,
        cooperativeId: mockCoopId,
        name: 'Rajesh',
        skills: ['ELECTRICIAN' as any],
      });

      expect(result.id).toBe(mockWorkerId);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockUserId },
          data: expect.objectContaining({ role: 'WORKER' }),
        }),
      );
    });
  });

  describe('toggleAvailability & location', () => {
    it('should toggle worker availability', async () => {
      mockPrismaService.worker.findUnique.mockResolvedValueOnce({ id: mockWorkerId });
      mockPrismaService.worker.update.mockResolvedValueOnce({
        id: mockWorkerId,
        isAvailable: true,
      });

      const result = await service.toggleAvailability(mockWorkerId, true);
      expect(result.isAvailable).toBe(true);
    });

    it('should update worker latitude and longitude', async () => {
      mockPrismaService.worker.findUnique.mockResolvedValueOnce({ id: mockWorkerId });
      mockPrismaService.worker.update.mockResolvedValueOnce({
        id: mockWorkerId,
        latitude: 12.97,
        longitude: 77.59,
      });

      const result = await service.updateLocation(mockWorkerId, 12.97, 77.59);
      expect(result.latitude).toBe(12.97);
    });
  });
});
