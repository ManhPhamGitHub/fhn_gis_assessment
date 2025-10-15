import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const ctx = context.switchToHttp();
        const res = ctx.getResponse();
        const status = res?.statusCode;

        if (
          data &&
          typeof data === 'object' &&
          ('success' in data || 'data' in data)
        ) {
          return data;
        }

        return {
          success: true,
          data,
          meta: { timestamp: new Date().toISOString() },
        };
      }),
    );
  }
}
