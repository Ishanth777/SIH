import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE } from '../common/queue';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@InjectQueue(NOTIFICATION_QUEUE) private readonly notificationQueue: Queue) {}

  async sendSms(phone: string, message: string) {
    await this.notificationQueue.add('send-sms', { phone, message });
    this.logger.log(`Enqueued SMS to ${phone}`);
  }

  async sendPushNotification(userId: string, title: string, body: string, data?: any) {
    await this.notificationQueue.add('send-push', { userId, title, body, data });
    this.logger.log(`Enqueued push notification to user ${userId}`);
  }
}
