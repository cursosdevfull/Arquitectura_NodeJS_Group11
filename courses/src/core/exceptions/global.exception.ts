import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response, Request } from 'express';
import { queryChannel } from 'node_modules/mysql2/typings/mysql/lib/Tracing';

@Catch(HttpException)
export class GlobalException implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const errorMessage =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : exceptionResponse['message'];

    response
      .status(status)
      .header('x-trace-id', randomUUID())
      .json({
        status,
        message: errorMessage || 'An error occurred',
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        body: request.body,
        query: request.query,
        params: request.params,
        headers: request.headers,
        errorId: exceptionResponse['errorId'] || null,
        name: exceptionResponse['name'] || null,
        cause: exceptionResponse['cause'] || null,
        code: exceptionResponse['code'] || null,
        stack: exceptionResponse['stack'] || null,
      });
  }
}
