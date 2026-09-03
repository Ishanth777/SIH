import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { NOTIFICATION_QUEUE } from '../common/queue';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { SmsProviderService } from './providers/sms-provider.service';
import { FcmProviderService } from './providers/fcm-provider.service';
import { DLT_TEMPLATES } from './interfaces/sms.interface';
import { Job } from 'bullmq';

describe('Notifications Module', () => {
  let service: NotificationsService;
  let processor: NotificationsProcessor;
  let mockQueue: { add: jest.Mock };
  let mockSmsProvider: { send: jest.Mock };
  let mockFcmProvider: { send: jest.Mock };

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn().mockResolvedValue({ id: 'job-123' }),
    };

    mockSmsProvider = {
      send: jest.fn().mockResolvedValue({ success: true, messageId: 'sms-msg-1' }),
    };

    mockFcmProvider = {
      send: jest.fn().mockResolvedValue({ success: true, messageId: 'fcm-msg-1' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        NotificationsProcessor,
        {
          provide: getQueueToken(NOTIFICATION_QUEUE),
          useValue: mockQueue,
        },
        {
          provide: SmsProviderService,
          useValue: mockSmsProvider,
        },
        {
          provide: FcmProviderService,
          useValue: mockFcmProvider,
        },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    processor = module.get<NotificationsProcessor>(NotificationsProcessor);
  });

  describe('NotificationsService', () => {
    it('should enqueue send-sms with DLT template ID and retry configuration (Rule B3, S8)', async () => {
      const phone = '+919876543210';
      const message = 'Your OTP is 123456';
      await service.sendSms(phone, message);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'send-sms',
        {
          phone,
          message,
          templateId: DLT_TEMPLATES.OTP.templateId,
          variables: undefined,
        },
        expect.objectContaining({
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        }),
      );
    });

    it('should enqueue send-push with retry options', async () => {
      const payload = {
        token: 'test-device-token',
        title: 'New Job Available',
        body: 'Electrician needed in Sector 4',
      };
      await service.sendPushNotification(payload);

      expect(mockQueue.add).toHaveBeenCalledWith(
        'send-push',
        payload,
        expect.objectContaining({
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        }),
      );
    });
  });

  describe('NotificationsProcessor', () => {
    it('should delegate send-sms job to SmsProviderService', async () => {
      const job = {
        id: 'job-sms-1',
        name: 'send-sms',
        attemptsMade: 0,
        data: {
          phone: '+919876543210',
          message: 'Your verification OTP is 654321',
          templateId: DLT_TEMPLATES.OTP.templateId,
        },
      } as unknown as Job<any, any, string>;

      await processor.process(job);

      expect(mockSmsProvider.send).toHaveBeenCalledWith({
        phone: '+919876543210',
        message: 'Your verification OTP is 654321',
        templateId: DLT_TEMPLATES.OTP.templateId,
        variables: undefined,
      });
    });

    it('should delegate send-push job to FcmProviderService', async () => {
      const job = {
        id: 'job-push-1',
        name: 'send-push',
        attemptsMade: 0,
        data: {
          token: 'token-abc-123',
          title: 'Job Assigned',
          body: 'You have been matched to Job #123',
        },
      } as unknown as Job<any, any, string>;

      await processor.process(job);

      expect(mockFcmProvider.send).toHaveBeenCalledWith({
        token: 'token-abc-123',
        topic: undefined,
        title: 'Job Assigned',
        body: 'You have been matched to Job #123',
        data: undefined,
      });
    });

    it('should rethrow error on provider failure so BullMQ triggers retry', async () => {
      mockSmsProvider.send.mockResolvedValueOnce({
        success: false,
        error: 'Network timeout to SMS gateway',
      });

      const job = {
        id: 'job-fail-1',
        name: 'send-sms',
        attemptsMade: 1,
        data: { phone: '123', message: 'test' },
      } as unknown as Job<any, any, string>;

      await expect(processor.process(job)).rejects.toThrow('SMS delivery failed');
    });
  });
});
