import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { NOTIFICATION_QUEUE } from '../common/queue';
import { SmsProviderService } from './providers/sms-provider.service';
import { FcmProviderService } from './providers/fcm-provider.service';

export interface SendSmsJobData {
  phone: string;
  message: string;
  templateId?: string;
  variables?: Record<string, string>;
}

export interface SendPushJobData {
  userId?: string;
  token?: string;
  topic?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Processor(NOTIFICATION_QUEUE)
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  constructor(
    private readonly smsProvider: SmsProviderService,
    private readonly fcmProvider: FcmProviderService,
  ) {
    super();
  }

  async process(job: Job<SendSmsJobData | SendPushJobData, void, string>): Promise<void> {
    this.logger.debug(`Processing notification job: ${job.name} [ID: ${job.id}] (Attempt: ${job.attemptsMade + 1})`);

    try {
      switch (job.name) {
        case 'send-sms': {
          const data = job.data as SendSmsJobData;
          const result = await this.smsProvider.send({
            phone: data.phone,
            message: data.message,
            templateId: data.templateId,
            variables: data.variables,
          });

          if (!result.success) {
            throw new Error(`SMS delivery failed: ${result.error}`);
          }
          this.logger.log(`SMS job ${job.id} dispatched successfully to ${data.phone}`);
          break;
        }

        case 'send-push': {
          const data = job.data as SendPushJobData;
          const result = await this.fcmProvider.send({
            token: data.token,
            topic: data.topic,
            title: data.title,
            body: data.body,
            data: data.data,
          });

          if (!result.success) {
            throw new Error(`Push delivery failed: ${result.error}`);
          }
          this.logger.log(`Push notification job ${job.id} dispatched successfully`);
          break;
        }

        default:
          this.logger.warn(`Unknown notification job name: ${job.name}`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error in notification job ${job.id} (${job.name}): ${errMsg}`);
      // Re-throw so BullMQ applies retry / backoff per rule B3
      throw error;
    }
  }
}
