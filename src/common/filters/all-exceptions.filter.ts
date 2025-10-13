import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') message = res;
      else if (typeof res === 'object' && res !== null && 'message' in res)
        message = (res as any).message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // log server errors
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // eslint-disable-next-line no-console
      console.error('Unhandled exception', exception);
    }

    response.status(status).json({ message });
  }
}
