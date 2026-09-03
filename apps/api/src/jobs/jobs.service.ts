import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { WorkerJobAction } from './dto';
import { ErrorCode } from '../common/constants';
import { EventsGateway } from '../common/gateway';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async updateJobStatus(jobId: string, workerId: string, action: WorkerJobAction) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { serviceRequest: true },
    });

    if (!job) {
      throw new NotFoundException({ message: 'Job not found', errorCode: ErrorCode.NOT_FOUND });
    }

    if (job.workerId !== workerId) {
      throw new BadRequestException('Worker is not assigned to this job');
    }

    let newStatus = job.status;
    let startedAt = job.startedAt;
    let completedAt = job.completedAt;

    switch (action) {
      case WorkerJobAction.ACCEPT:
        if (job.status !== 'PENDING') throw new BadRequestException('Job is not pending');
        newStatus = 'ACCEPTED';
        break;
      case WorkerJobAction.REJECT:
        if (job.status !== 'PENDING') throw new BadRequestException('Job is not pending');
        // If rejected, we might want to re-enqueue matching for the next best worker.
        // For now, we'll just set it back to PENDING and unassign worker.
        newStatus = 'PENDING';
        break;
      case WorkerJobAction.START:
        if (job.status !== 'ACCEPTED') throw new BadRequestException('Job must be accepted to start');
        newStatus = 'IN_PROGRESS';
        startedAt = new Date();
        break;
      case WorkerJobAction.COMPLETE:
        if (job.status !== 'IN_PROGRESS') throw new BadRequestException('Job must be in progress to complete');
        newStatus = 'COMPLETED';
        completedAt = new Date();
        break;
    }

    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        status: newStatus,
        startedAt,
        completedAt,
        workerId: action === WorkerJobAction.REJECT ? null : workerId,
      },
    });

    // Notify customer about status change
    this.eventsGateway.emitJobStatus(job.serviceRequest.customerId, {
      jobId: updatedJob.id,
      status: updatedJob.status,
    });

    return updatedJob;
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: { serviceRequest: true, worker: true, payment: true },
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }
}
