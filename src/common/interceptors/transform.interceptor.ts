import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interfaz para estandarizar las respuestas de la API
 */
export interface Response<T> {
  success: boolean; // Indica si la operación fue exitosa
  data: T; // Los datos de respuesta
  message: string; // Mensaje descriptivo
}

/**
 * Interceptor that transforms all API responses
 * Wraps data in a standard format: { success, data, message }
 * Applied globally in main.ts with app.useGlobalInterceptors()
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  // Transforms the response before sending it to the client
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
