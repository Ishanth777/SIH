/**
 * Root application module.
 *
 * Imports:
 * - ConfigModule with Zod validation (rule E4)
 * - ThrottlerModule backed by Redis (rule B4)
 * - PrismaModule (global)
 * - QueueModule — BullMQ with Redis (rule B3)
 * - EventsModule — Socket.IO with Redis adapter (rule A10)
 * - Foundation Modules 1–5 (auth, federations, cooperatives, workers, customers)
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './common/prisma';
import { QueueModule } from './common/queue';
import { EventsModule } from './common/gateway';
import { validateEnv } from './common/config/env.validation';
import { AuthModule } from './auth/auth.module';
import { FederationsModule } from './federations/federations.module';
import { CooperativesModule } from './cooperatives/cooperatives.module';
import { WorkersModule } from './workers/workers.module';
import { CustomersModule } from './customers/customers.module';
import { ServicesCatalogModule } from './services-catalog/services-catalog.module';
import { RequestsModule } from './requests/requests.module';
import { MatchingModule } from './matching/matching.module';
import { JobsModule } from './jobs/jobs.module';
import { PaymentsModule } from './payments/payments.module';
import { WelfareModule } from './welfare/welfare.module';
import { DisputesModule } from './disputes/disputes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ForecastingModule } from './forecasting/forecasting.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // ── Config with startup validation (rule E4) ──
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: '.env',
    }),

    // ── Rate limiting (rule B4) ──
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,    // 1 minute window
        limit: 60,     // 60 requests per minute
      },
    ]),

    // ── Database ──
    PrismaModule,

    // ── Async Queues (rule B3) ──
    QueueModule,

    // ── Real-time Events (rule A10) ──
    EventsModule,

    // ── Foundation Modules (1–5) ──
    AuthModule,
    FederationsModule,
    CooperativesModule,
    WorkersModule,
    CustomersModule,

    // ── Domain Modules (6–10) ──
    ServicesCatalogModule,
    RequestsModule,
    MatchingModule,
    JobsModule,
    PaymentsModule,

    // ── Support Modules (11–13) ──
    WelfareModule,
    DisputesModule,
    NotificationsModule,

    // ── Intelligence Modules (14–15) ──
    ForecastingModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
