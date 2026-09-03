import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getFederationMetrics(federationId: string) {
    this.logger.log(`Aggregating metrics for federation ${federationId}`);

    // Total workers
    const totalWorkers = await this.prisma.worker.count({
      where: { cooperative: { federationId } },
    });

    // Total jobs
    const totalJobs = await this.prisma.job.count({
      where: { cooperative: { federationId } },
    });

    // Completed jobs
    const completedJobs = await this.prisma.job.count({
      where: { cooperative: { federationId }, status: 'COMPLETED' },
    });

    // Total revenue from completed jobs
    const revenueResult = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'COMPLETED',
        job: { cooperative: { federationId } },
      },
    });

    // Active disputes
    const activeDisputes = await this.prisma.dispute.count({
      where: {
        status: { in: ['OPEN', 'UNDER_REVIEW', 'ESCALATED'] },
        job: { cooperative: { federationId } },
      },
    });

    return {
      totalWorkers,
      totalJobs,
      completedJobs,
      completionRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0,
      totalRevenue: revenueResult._sum.amount || 0,
      activeDisputes,
    };
  }

  async getSocietyMetrics(cooperativeId: string) {
    this.logger.log(`Aggregating metrics for cooperative ${cooperativeId}`);

    const totalWorkers = await this.prisma.worker.count({
      where: { cooperativeId },
    });

    const totalJobs = await this.prisma.job.count({
      where: { cooperativeId },
    });

    const completedJobs = await this.prisma.job.count({
      where: { cooperativeId, status: 'COMPLETED' },
    });

    const revenueResult = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: 'COMPLETED',
        job: { cooperativeId },
      },
    });

    return {
      totalWorkers,
      totalJobs,
      completedJobs,
      completionRate: totalJobs > 0 ? (completedJobs / totalJobs) * 100 : 0,
      totalRevenue: revenueResult._sum.amount || 0,
    };
  }
}
