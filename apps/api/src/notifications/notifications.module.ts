import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { SmsProviderService } from './providers/sms-provider.service';
import { FcmProviderService } from './providers/fcm-provider.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    SmsProviderService,
    FcmProviderService,
  ],
  exports: [NotificationsService, SmsProviderService, FcmProviderService],
})
export class NotificationsModule {}
