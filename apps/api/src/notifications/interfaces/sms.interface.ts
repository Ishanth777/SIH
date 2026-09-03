/**
 * Interface and constants for DLT-compliant SMS delivery (Rule S8).
 * In India, commercial communications require DLT registration:
 * - Entity ID (Principal Entity ID)
 * - Header / Sender ID (6-character alpha)
 * - Template ID (Content Template ID)
 */

export interface DltTemplateConfig {
  templateId: string;
  description: string;
  defaultText: string;
}

export const DLT_TEMPLATES = {
  OTP: {
    templateId: 'DLT_TE_1107161234567890123',
    description: 'Cooperative Marketplace User Authentication OTP',
    defaultText: 'Your verification OTP for Cooperative Labour Marketplace is {#var#}. Valid for 5 minutes. Do not share this code.',
  },
  JOB_OFFER: {
    templateId: 'DLT_TE_1107161234567890124',
    description: 'Worker New Job Offer Alert',
    defaultText: 'New job request: {#var#} in {#var#}. Tap your app to review and accept.',
  },
  JOB_STATUS: {
    templateId: 'DLT_TE_1107161234567890125',
    description: 'Customer Job Status Update',
    defaultText: 'Your booking {#var#} status updated to {#var#}. Cooperative Labour Platform.',
  },
} as const;

export type DltTemplateKey = keyof typeof DLT_TEMPLATES;

export interface SendSmsOptions {
  phone: string;
  message: string;
  templateId?: string;
  variables?: Record<string, string>;
}

export interface SmsSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface ISmsProvider {
  send(options: SendSmsOptions): Promise<SmsSendResult>;
}
