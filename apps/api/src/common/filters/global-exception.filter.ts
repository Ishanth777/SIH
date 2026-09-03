/**
 * Global exception filter.
 * Per rule C6: consistent error response shape { statusCode, message, errorCode }.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode } from '../constants/error-codes';
import { CORRELATION_ID_HEADER } from '../interceptors/correlation-id.interceptor';

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errorCode: string;
  correlationId?: string;
  timestamp: string;
  path: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId = request.headers[CORRELATION_ID_HEADER] as string;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode: string = ErrorCode.INTERNAL_ERROR;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp['message'] as string) || exception.message;
        errorCode = (resp['errorCode'] as string) || this.mapStatusToErrorCode(status);
      } else {
        message = exception.message;
        errorCode = this.mapStatusToErrorCode(status);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      message,
      errorCode,
      correlationId,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `[${correlationId}] ${request.method} ${request.url} ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(status).json(errorResponse);
  }

  private mapStatusToErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCode.RATE_LIMITED;
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_ERROR;
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }
}
