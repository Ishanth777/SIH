import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE } from '../common/queue';
import { DLT_TEMPLATES } from './interfaces/sms.interface';

export interface SendSmsPayload {
  phone: string;
  message: string;
  templateId?: string;
  variables?: Record<string, string>;
}

export interface SendPushPayload {
  userId?: string;
  token?: string;
  topic?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue) {}

  /**
   * Enqueue an SMS dispatch job.
   * Per rule B3: never blocks the calling API request.
   * Per rule S8: uses DLT-compliant templates.
   */
  async sendSms(
    phone: string,
    message: string,
    templateId: string = DLT_TEMPLATES.OTP.templateId,
    variables?: Record<string, string>,
  ): Promise<void> {
    try {
      await this.notificationQueue.add(
        'send-sms',
        { phone, message, templateId, variables },
        {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
        },
      );
      this.logger.log(`Enqueued SMS to ${phone} with template ${templateId}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to enqueue SMS to ${phone}: ${errMsg}`);
    }
  }

  /**
   * Enqueue a push notification job.
   * Per rule B3: asynchronous via BullMQ queue.
   */
  async sendPushNotification(payload: SendPushPayload): Promise<void> {
    try {
      await this.notificationQueue.add('send-push', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      });
      this.logger.log(`Enqueued push notification: "${payload.title}"`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to enqueue push notification: ${errMsg}`);
    }
  }
}
