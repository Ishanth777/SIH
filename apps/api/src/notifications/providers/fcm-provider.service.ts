import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { App, initializeApp, getApps, cert } from 'firebase-admin/app';
import { getMessaging, Message } from 'firebase-admin/messaging';
import type { EnvConfig } from '../../common/config/env.validation';

export interface PushNotificationOptions {
  token?: string;
  topic?: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface PushSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class FcmProviderService implements OnModuleInit {
  private readonly logger = new Logger(FcmProviderService.name);
  private firebaseApp: App | null = null;
  private isInitialized = false;

  constructor(private readonly configService: ConfigService<EnvConfig, true>) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    const projectId = this.configService.get('FIREBASE_PROJECT_ID', { infer: true });
    const clientEmail = this.configService.get('FIREBASE_CLIENT_EMAIL', { infer: true });
    const privateKey = this.configService.get('FIREBASE_PRIVATE_KEY', { infer: true });

    if (!projectId || !clientEmail || !privateKey) {
      this.logger.warn(
        'FCM credentials not fully provided (FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY). Running FCM in MOCK / dry-run mode.',
      );
      return;
    }

    try {
      const existingApps = getApps();
      if (existingApps.length > 0 && existingApps[0]) {
        this.firebaseApp = existingApps[0];
      } else {
        const formattedKey = privateKey.replace(/\\n/g, '\n');
        this.firebaseApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey: formattedKey,
          }),
        });
      }
      this.isInitialized = true;
      this.logger.log(`FCM Admin SDK initialized for project: ${projectId}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to initialize Firebase Admin: ${errMsg}`);
    }
  }

  async send(options: PushNotificationOptions): Promise<PushSendResult> {
    const { token, topic, title, body, data = {} } = options;

    if (!this.isInitialized || !this.firebaseApp) {
      this.logger.log(
        `[MOCK FCM - Rule M2] Target: ${token || topic || 'unknown'} | Title: ${title} | Body: ${body} | Data: ${JSON.stringify(data)}`,
      );
      return { success: true, messageId: `mock-fcm-${Date.now()}` };
    }

    try {
      const messaging = getMessaging(this.firebaseApp);

      if (token) {
        const message: Message = {
          token,
          notification: {
            title,
            body,
          },
          data,
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'job_offers',
            },
          },
        };

        const messageId = await messaging.send(message);
        this.logger.log(`FCM push sent successfully to token ${token.slice(0, 10)}... ID: ${messageId}`);
        return { success: true, messageId };
      } else if (topic) {
        const message: Message = {
          topic,
          notification: {
            title,
            body,
          },
          data,
        };

        const messageId = await messaging.send(message);
        this.logger.log(`FCM push sent successfully to topic ${topic}. ID: ${messageId}`);
        return { success: true, messageId };
      } else {
        throw new Error('Neither token nor topic was provided for push notification');
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`FCM send error: ${errMsg}`);
      return { success: false, error: errMsg };
    }
  }
}
