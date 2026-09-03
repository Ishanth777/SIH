/**
 * Prisma service — wraps Prisma Client for NestJS DI.
 * Handles lifecycle events (connect on init, disconnect on destroy).
 */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      this.logger.log('Prisma connected to database');
    } catch (err: any) {
      this.logger.warn(`Database connection deferred (offline mode): ${err.message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from database');
  }

  /**
   * Set the current cooperative ID on the Postgres session for RLS.
   * Per rule A1: every authenticated request must set `app.current_cooperative_id`
   * before any query executes.
   */
  async setTenantContext(cooperativeId: string): Promise<void> {
    await this.$executeRawUnsafe(
      `SET LOCAL app.current_cooperative_id = '${cooperativeId}'`,
    );
  }

  /**
   * Clear the tenant context — used in tests and between requests.
   */
  async clearTenantContext(): Promise<void> {
    await this.$executeRawUnsafe(
      `RESET app.current_cooperative_id`,
    );
  }
}
