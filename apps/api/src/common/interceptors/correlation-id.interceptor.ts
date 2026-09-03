/**
 * Request Correlation ID Interceptor.
 * Per rule C7: attach a UUID to every log entry and propagate through downstream calls.
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Use existing correlation ID from header or generate a new one
    const correlationId =
      (request.headers[CORRELATION_ID_HEADER] as string) || uuidv4();

    // Attach to request for downstream use
    request.headers[CORRELATION_ID_HEADER] = correlationId;

    // Include in response headers
    response.setHeader(CORRELATION_ID_HEADER, correlationId);

    const { method, originalUrl } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `[${correlationId}] ${method} ${originalUrl} ${response.statusCode} ${duration}ms`,
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `[${correlationId}] ${method} ${originalUrl} ERROR ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
