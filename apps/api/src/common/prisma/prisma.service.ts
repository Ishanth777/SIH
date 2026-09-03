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
   * before any query executes. Uses parameterized set_config to prevent SQL injection.
   */
  async setTenantContext(cooperativeId: string): Promise<void> {
    await this.$executeRaw`SELECT set_config('app.current_cooperative_id', ${cooperativeId}, true)`;
  }

  /**
   * Set the current federation ID on the Postgres session for RLS.
   * Enables federation-level administrative access across cooperatives.
   * Uses parameterized set_config to prevent SQL injection.
   */
  async setFederationContext(federationId: string): Promise<void> {
    await this.$executeRaw`SELECT set_config('app.current_federation_id', ${federationId}, true)`;
  }

  /**
   * Clear the tenant context — used in tests and between requests.
   */
  async clearTenantContext(): Promise<void> {
    await this.$executeRaw`SELECT set_config('app.current_cooperative_id', '', true), set_config('app.current_federation_id', '', true)`;
  }
}
