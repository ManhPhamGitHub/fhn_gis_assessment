import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
export const formatErrorResponse = (code: any, msg: any, data: any = null) => {
  return {
    status: 0,
    error: code,
    msg: msg,
    currentTime: new Date().toISOString(),
    data: data,
  };
};
export const getStatusCode = (exception: unknown): number => {
  return exception instanceof HttpException
    ? exception.getStatus()
    : HttpStatus.INTERNAL_SERVER_ERROR;
};

export const getErrorMessage = (exception: any): any => {
  const { response = null } = exception;
  if (response) {
    return response.message || String(response);
  }
  return String(exception);
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const code = getStatusCode(exception);
    const message = getErrorMessage(exception);
    const { originalUrl, method } = request;
    const { validateCode = null } = exception.response || {};

    this.logger.error(
      `[Error] Code:${code} Request: ${originalUrl} method: ${method} message: ${message} `,
    );

    response.status(code).json(formatErrorResponse(validateCode, message, {}));
  }
}
