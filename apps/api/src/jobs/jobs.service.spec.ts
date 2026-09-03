import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { PrismaService } from '../common/prisma';
import { EventsGateway } from '../common/gateway';
import { WorkerJobAction } from './dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('JobsService (State Machine & Realtime)', () => {
  let service: JobsService;
  let mockPrismaService: {
    job: { findUnique: jest.Mock; update: jest.Mock };
    rating: { create: jest.Mock; findMany: jest.Mock };
    worker: { update: jest.Mock };
  };
  let mockEventsGateway: {
    emitJobStatus: jest.Mock;
    emitBookingStatus: jest.Mock;
  };

  const mockJobId = 'job-1111-2222';
  const mockWorkerId = 'worker-9999';

  beforeEach(async () => {
    mockPrismaService = {
      job: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      rating: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      worker: {
        update: jest.fn(),
      },
    };

    mockEventsGateway = {
      emitJobStatus: jest.fn(),
      emitBookingStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventsGateway, useValue: mockEventsGateway },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
  });

  describe('updateJobStatus state machine transitions', () => {
    it('should throw NotFoundException if job not found', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.updateJobStatus(mockJobId, mockWorkerId, WorkerJobAction.ACCEPT),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if worker is not assigned to job', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: 'different-worker',
        status: 'PENDING',
        serviceRequest: { customerId: 'cust-1' },
      });

      await expect(
        service.updateJobStatus(mockJobId, mockWorkerId, WorkerJobAction.ACCEPT),
      ).rejects.toThrow('Worker is not assigned to this job');
    });

    it('should transition PENDING -> ACCEPTED on ACCEPT action', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'PENDING',
        serviceRequest: { customerId: 'cust-1' },
      });
      mockPrismaService.job.update.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'ACCEPTED',
      });

      const res = await service.updateJobStatus(mockJobId, mockWorkerId, WorkerJobAction.ACCEPT);

      expect(res.status).toBe('ACCEPTED');
      expect(mockEventsGateway.emitJobStatus).toHaveBeenCalledWith(mockJobId, {
        jobId: mockJobId,
        status: 'ACCEPTED',
      });
    });

    it('should reject START if job is not ACCEPTED', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'PENDING', // Cannot start directly from pending
        serviceRequest: { customerId: 'cust-1' },
      });

      await expect(
        service.updateJobStatus(mockJobId, mockWorkerId, WorkerJobAction.START),
      ).rejects.toThrow('Job must be accepted to start');
    });

    it('should transition ACCEPTED -> IN_PROGRESS on START action', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'ACCEPTED',
        serviceRequest: { customerId: 'cust-1' },
      });
      mockPrismaService.job.update.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'IN_PROGRESS',
      });

      const res = await service.updateJobStatus(mockJobId, mockWorkerId, WorkerJobAction.START);

      expect(res.status).toBe('IN_PROGRESS');
      expect(mockEventsGateway.emitJobStatus).toHaveBeenCalled();
    });

    it('should transition IN_PROGRESS -> COMPLETED on COMPLETE action', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'IN_PROGRESS',
        serviceRequest: { customerId: 'cust-1' },
      });
      mockPrismaService.job.update.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'COMPLETED',
      });

      const res = await service.updateJobStatus(mockJobId, mockWorkerId, WorkerJobAction.COMPLETE);

      expect(res.status).toBe('COMPLETED');
      expect(mockEventsGateway.emitJobStatus).toHaveBeenCalled();
    });
  });

  describe('rateJob', () => {
    it('should successfully submit rating and recalculate average rating for completed job', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'COMPLETED',
        rating: null,
        serviceRequest: { customerId: 'cust-1' },
      });

      mockPrismaService.rating.create.mockResolvedValueOnce({
        id: 'rating-1',
        jobId: mockJobId,
        customerId: 'cust-1',
        workerId: mockWorkerId,
        score: 5,
        comment: 'Great job!',
      });

      mockPrismaService.rating.findMany.mockResolvedValueOnce([
        { score: 5 },
        { score: 4 },
      ]);

      mockPrismaService.worker.update.mockResolvedValueOnce({
        id: mockWorkerId,
        averageRating: 4.5,
      });

      const rating = await service.rateJob(mockJobId, 'cust-1', {
        rating: 5,
        comment: 'Great job!',
      });

      expect(rating.score).toBe(5);
      expect(mockPrismaService.worker.update).toHaveBeenCalledWith({
        where: { id: mockWorkerId },
        data: { averageRating: 4.5 },
      });
    });

    it('should throw BadRequestException if job is not COMPLETED', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'IN_PROGRESS',
        rating: null,
        serviceRequest: { customerId: 'cust-1' },
      });

      await expect(
        service.rateJob(mockJobId, 'cust-1', { rating: 4 }),
      ).rejects.toThrow('Only completed jobs can be rated');
    });

    it('should throw BadRequestException if job is already rated', async () => {
      mockPrismaService.job.findUnique.mockResolvedValueOnce({
        id: mockJobId,
        workerId: mockWorkerId,
        status: 'COMPLETED',
        rating: { id: 'existing-rating' },
        serviceRequest: { customerId: 'cust-1' },
      });

      await expect(
        service.rateJob(mockJobId, 'cust-1', { rating: 4 }),
      ).rejects.toThrow('Job has already been rated');
    });
  });
});

