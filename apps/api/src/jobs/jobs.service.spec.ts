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
});
