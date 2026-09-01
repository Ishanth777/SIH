import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NOTIFICATION_QUEUE } from '../common/queue';
import { Logger } from '@nestjs/common';

@Processor(NOTIFICATION_QUEUE)
export class NotificationsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationsProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-sms': {
        const { phone, message } = job.data;
        // MOCK: Integration with DLT-registered SMS provider (Rule S8)
        this.logger.log(`[MOCK SMS] To: ${phone} | Message: ${message}`);
        break;
      }
      case 'send-push': {
        const { userId, title, body, data } = job.data;
        // MOCK: Integration with FCM (Rule M2)
        this.logger.log(`[MOCK FCM] To User: ${userId} | Title: ${title} | Body: ${body}`);
        break;
      }
      default:
        this.logger.warn(`Unknown notification job: ${job.name}`);
    }
  }
}
