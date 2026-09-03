import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ISmsProvider, SendSmsOptions, SmsSendResult, DLT_TEMPLATES } from '../interfaces/sms.interface';
import type { EnvConfig } from '../../common/config/env.validation';

@Injectable()
export class SmsProviderService implements ISmsProvider {
  private readonly logger = new Logger(SmsProviderService.name);
  private readonly provider: string;
  private readonly apiKey?: string;
  private readonly senderId?: string;
  private readonly dltEntityId?: string;

  constructor(
    private readonly configService: ConfigService<EnvConfig, true>,
    private readonly httpService: HttpService,
  ) {
    this.provider = this.configService.get('SMS_PROVIDER', { infer: true }) || 'mock';
    this.apiKey = this.configService.get('SMS_API_KEY', { infer: true });
    this.senderId = this.configService.get('SMS_SENDER_ID', { infer: true });
    this.dltEntityId = this.configService.get('SMS_DLT_ENTITY_ID', { infer: true });
  }

  async send(options: SendSmsOptions): Promise<SmsSendResult> {
    const { phone, message, templateId, variables } = options;

    // Use registered DLT template id or default OTP template
    const resolvedTemplateId = templateId || DLT_TEMPLATES.OTP.templateId;

    if (this.provider === 'mock' || !this.apiKey) {
      this.logger.log(
        `[MOCK SMS - Rule S8 DLT] To: ${phone} | DLT Template: ${resolvedTemplateId} | Entity: ${this.dltEntityId || 'COOP_ENT_DEFAULT'} | Message: ${message}`,
      );
      return { success: true, messageId: `mock-sms-${Date.now()}` };
    }

    try {
      if (this.provider === 'msg91') {
        return await this.sendMsg91(phone, resolvedTemplateId, variables, message);
      } else if (this.provider === 'fast2sms') {
        return await this.sendFast2Sms(phone, message, resolvedTemplateId);
      } else {
        this.logger.warn(`Unsupported SMS provider: ${this.provider}. Falling back to mock logger.`);
        return { success: true, messageId: `fallback-sms-${Date.now()}` };
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send SMS to ${phone}: ${errMsg}`);
      return { success: false, error: errMsg };
    }
  }

  private async sendMsg91(
    phone: string,
    templateId: string,
    variables?: Record<string, string>,
    fallbackMessage?: string,
  ): Promise<SmsSendResult> {
    // Normalise Indian 10-digit phone to country code format (91XXXXXXXXXX)
    const formattedPhone = phone.replace(/^\+/, '').replace(/^0/, '');
    const mobileNumber = formattedPhone.length === 10 ? `91${formattedPhone}` : formattedPhone;

    const payload = {
      template_id: templateId,
      sender: this.senderId,
      short_url: '0',
      mobiles: mobileNumber,
      recipients: [
        {
          mobiles: mobileNumber,
          ...(variables || { var: fallbackMessage || '' }),
        },
      ],
    };

    const response = await lastValueFrom(
      this.httpService.post('https://control.msg91.com/api/v5/flow', payload, {
        headers: {
          authkey: this.apiKey,
          'content-type': 'application/json',
          'dlt-entity-id': this.dltEntityId || '',
        },
      }),
    );

    return {
      success: true,
      messageId: response.data?.message || `msg91-${Date.now()}`,
    };
  }

  private async sendFast2Sms(
    phone: string,
    message: string,
    templateId: string,
  ): Promise<SmsSendResult> {
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

    const payload = {
      route: 'dlt',
      sender_id: this.senderId,
      message: [templateId],
      flash: 0,
      numbers: cleanPhone,
    };

    const response = await lastValueFrom(
      this.httpService.post('https://www.fast2sms.com/dev/bulkV2', payload, {
        headers: {
          authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
      }),
    );

    const isSuccess = Boolean(response.data?.return);
    return {
      success: isSuccess,
      messageId: response.data?.request_id,
      error: isSuccess ? undefined : 'Fast2SMS returned failure response',
    };
  }
}
