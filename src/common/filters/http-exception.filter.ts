import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global filter that captures all HTTP exceptions
 * Formats errors in a consistent format for the entire API
 * Applied globally in main.ts with app.useGlobalFilters()
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // Captures and formats HTTP exceptions
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'Error en la petición',
      error:
        typeof exceptionResponse === 'object' &&
        (exceptionResponse as any).error
          ? (exceptionResponse as any).error
          : HttpStatus[status],
    };

    response.status(status).json(errorResponse);
  }
}
