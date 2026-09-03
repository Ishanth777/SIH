/**
 * Environment configuration validation schema.
 * Per rule E4: the app refuses to boot if a required secret is missing.
 */
import { z } from 'zod';

export const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),

  // JWT (rule S2: two separate secrets)
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // OTP
  OTP_EXPIRY_SECONDS: z.coerce.number().default(300),
  OTP_LENGTH: z.coerce.number().default(6),

  // SMS (rule S8)
  SMS_API_KEY: z.string().optional(),
  SMS_SENDER_ID: z.string().optional(),
  SMS_DLT_ENTITY_ID: z.string().optional(),
  SMS_PROVIDER: z.enum(['mock', 'msg91', 'fast2sms']).default('mock'),

  // Firebase Cloud Messaging (FCM, rule M2)
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // MinIO / S3
  MINIO_ENDPOINT: z.string().default('http://localhost:9000'),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET: z.string().default('coop-documents'),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.coerce.number().default(3000),
  API_PREFIX: z.string().default('api'),
  CORS_ORIGINS: z.string().default('http://localhost:3001'),

  // Forecasting
  FORECASTING_SERVICE_URL: z.string().default('http://localhost:8000'),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validate environment variables at startup.
 * Throws a descriptive error if validation fails — the app will not boot.
 */
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  ✗ ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `\n\n❌ Environment validation failed:\n${formatted}\n\nFix the above issues in your .env file and restart.\n`,
    );
  }

  return result.data;
}
