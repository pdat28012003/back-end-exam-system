import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => ({
        statusCode: response.statusCode,
        message: this.getSuccessMessage(request.method, request.route.path),
        data,
      })),
    );
  }

  private getSuccessMessage(method: string, path: string): string {
    const resource = path.split('/').pop() || 'resource';
    
    switch (method) {
      case 'GET':
        return `Lấy dữ liệu thành công`;
      case 'POST':
        return `Tạo mới thành công`;
      case 'PUT':
        return `Cập nhật thành công`;
      case 'DELETE':
        return `Xóa thành công`;
      default:
        return `Thao tác thành công`;
    }
  }
}