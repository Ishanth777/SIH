/**
 * Shared Auth DTOs — mirrored from backend (rule C3).
 * These Zod schemas are used with react-hook-form on web (rule C5)
 * and equivalent validation on mobile.
 */
import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, 'Phone must be a valid Indian mobile number (e.g., +919876543210)'),
});

export type SendOtpDto = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, 'Phone must be a valid Indian mobile number'),
  code: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
});

export type VerifyOtpDto = z.infer<typeof verifyOtpSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;

// Response types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface SendOtpResponse {
  message: string;
  expiresInSeconds: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errorCode: string;
  correlationId?: string;
  timestamp: string;
  path: string;
}
