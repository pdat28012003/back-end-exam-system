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
    // Xác định resource từ path
    const resource = this.extractResourceFromPath(path);

    switch (method) {
      case 'GET':
        return `Lấy dữ liệu ${resource} thành công`;
      case 'POST':
        return `Tạo mới ${resource} thành công`;
      case 'PUT':
      case 'PATCH':
        return `Cập nhật ${resource} thành công`;
      case 'DELETE':
        return `Xóa ${resource} thành công`;
      default:
        return `Thao tác với ${resource} thành công`;
    }
  }

  /**
   * Trích xuất tên resource từ đường dẫn API
   * Xử lý các trường hợp path phức tạp như:
   * - /users
   * - /users/:id
   * - /users/:id/profile
   * - /api/v1/users
   */
  private extractResourceFromPath(path: string): string {
    if (!path) return 'dữ liệu';

    // Loại bỏ các tham số động (như :id, :userId)
    const segments = path.split('/').filter((segment) => segment.length > 0);

    if (segments.length === 0) return 'dữ liệu';

    // Xác định resource chính từ cấu trúc path
    let mainResource = '';

    // Bỏ qua các phần tử đầu tiên nếu là 'api', 'v1', 'v2', etc.
    let startIndex = 0;
    if (segments[0] === 'api') startIndex++;
    if (startIndex < segments.length && segments[startIndex].match(/^v\d+$/))
      startIndex++;

    // Lấy resource chính (thường là phần tử đầu tiên sau api/v1)
    if (startIndex < segments.length) {
      mainResource = segments[startIndex];

      // Chuyển đổi tên resource sang dạng thân thiện hơn
      switch (mainResource) {
        case 'users':
          return 'người dùng';
        case 'exams':
          return 'bài thi';
        case 'questions':
          return 'câu hỏi';
        case 'submissions':
          return 'bài nộp';
        case 'auth':
          return 'xác thực';
        case 'results':
          return 'kết quả';
        case 'categories':
          return 'danh mục';
        default:
          // Kiểm tra nếu resource ở dạng số ít (thường kết thúc bằng 's')
          if (mainResource.endsWith('s')) {
            return mainResource.slice(0, -1);
          }
          return mainResource;
      }
    }

    return 'dữ liệu';
  }
}
