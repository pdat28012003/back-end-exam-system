import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    let message = 'Đã xảy ra lỗi';
    if (typeof errorResponse === 'object' && 'message' in errorResponse) {
      message = Array.isArray(errorResponse['message'])
        ? errorResponse['message'][0]
        : errorResponse['message'];
    } else if (typeof errorResponse === 'string') {
      message = errorResponse;
    }

    const responseBody = {
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status}: ${message}`,
    );

    response.status(status).json(responseBody);
  }
}