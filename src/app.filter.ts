import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (exception.name == BadRequestException.name) {
      return response.status(status).json({
        success: false,
        message: exception.message,
        path: request.url,
        error: exception.getResponse(),
      });
    }

    if (exception.name == NotFoundException.name) {
      return response.status(status).json({
        success: false,
        message: exception.message,
        path: request.url,
      });
    }

    return response.status(status).json({
      success: false,
      message: exception.message,
      path: request.url,
      error: exception,
    });
  }
}
