/**
 * Application entry point.
 *
 * - Global ValidationPipe with whitelist + forbidNonWhitelisted (rule B2)
 * - Swagger auto-documentation at /api/docs (rule C4)
 * - Helmet for security headers
 * - CORS configuration
 * - Correlation-ID interceptor (rule C7)
 * - Global exception filter (rule C6)
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { CorrelationIdInterceptor } from './common/interceptors';
import { GlobalExceptionFilter } from './common/filters';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // ── Security ──
  app.use(helmet());

  // ── CORS ──
  const corsOrigins = process.env['CORS_ORIGINS'] || 'http://localhost:3001';
  app.enableCors({
    origin: corsOrigins.split(','),
    credentials: true,
  });

  // ── Global prefix ──
  const prefix = process.env['API_PREFIX'] || 'api';
  app.setGlobalPrefix(prefix);

  // ── Global pipes (rule B2) ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ── Global interceptors (rule C7) ──
  app.useGlobalInterceptors(new CorrelationIdInterceptor());

  // ── Global filters (rule C6) ──
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ── Swagger (rule C4) ──
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Cooperative Labour Marketplace API')
    .setDescription(
      'Multi-tenant platform connecting cooperative societies with workers and customers',
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
      'access-token',
    )
    .addTag('auth', 'Phone+OTP authentication and JWT management')
    .addTag('federations', 'Federation management')
    .addTag('cooperatives', 'Cooperative Society management')
    .addTag('workers', 'Worker profiles and verification')
    .addTag('customers', 'Customer profiles')
    .addTag('services-catalog', 'Service category catalog')
    .addTag('requests', 'Service requests')
    .addTag('matching', 'Worker matching (geo-spatial)')
    .addTag('jobs', 'Job lifecycle management')
    .addTag('payments', 'Payment processing')
    .addTag('welfare', 'Worker welfare schemes')
    .addTag('disputes', 'Dispute management')
    .addTag('notifications', 'Notification management')
    .addTag('forecasting', 'AI-powered demand forecasting')
    .addTag('analytics', 'Admin analytics & dashboards')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  // ── Start ──
  const port = process.env['API_PORT'] || 3000;
  await app.listen(port);
  logger.log(`🚀 API running on http://localhost:${port}/${prefix}`);
  logger.log(`📚 Swagger docs at http://localhost:${port}/${prefix}/docs`);
}

bootstrap();
