/**
 * BullMQ Queue Module — handles all async work.
 *
 * Per rule B3: notifications, payment retries, matching fan-out
 * all go through BullMQ. A notification failure must never block
 * the API request that triggered it.
 */
import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import type { EnvConfig } from '../config/env.validation';

// Queue name constants
export const NOTIFICATION_QUEUE = 'notifications';
export const PAYMENT_QUEUE = 'payments';
export const MATCHING_QUEUE = 'matching';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvConfig, true>) => ({
        connection: {
          host: config.get('REDIS_HOST', { infer: true }),
          port: config.get('REDIS_PORT', { infer: true }),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: NOTIFICATION_QUEUE },
      { name: PAYMENT_QUEUE },
      { name: MATCHING_QUEUE },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
