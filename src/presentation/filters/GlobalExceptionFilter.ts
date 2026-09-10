import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../domain/errors/DomainError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof DomainError) {
      const domainError = exception as DomainError;
      response.status(domainError.statusCode).json({
        statusCode: domainError.statusCode,
        error: domainError.code,
        message: domainError.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response.status(status).json({
        statusCode: status,
        error:
          typeof body === 'object' && body !== null && 'error' in body
            ? (body as { error: string }).error
            : exception.name,
        message:
          typeof body === 'object' && body !== null && 'message' in body
            ? (body as { message: string | string[] }).message
            : exception.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    console.error('Unhandled exception:', exception);
    response.status(500).json({
      statusCode: 500,
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }
}
