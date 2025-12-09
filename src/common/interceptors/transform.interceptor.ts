import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  message: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: this.getMessage(context, data),
      })),
    );
  }

  private getMessage(context: ExecutionContext, data: any): string {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (method === 'POST') return 'Recurso creado exitosamente';
    if (method === 'PATCH' || method === 'PUT') return 'Recurso actualizado exitosamente';
    if (method === 'DELETE') return 'Recurso eliminado exitosamente';
    
    return 'Operación exitosa';
  }
}
