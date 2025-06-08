import { NotificationType } from '../../database/schemas/notification.schema';

export class CreateNotificationDto {
  userId: string; // ID của người nhận thông báo
  title: string; // Tiêu đề thông báo
  message: string; // Nội dung thông báo
  type: NotificationType; // Loại thông báo
  relatedId?: string; // ID của đối tượng liên quan (bài thi, bài nộp, v.v.)
  isRead?: boolean; // Đã đọc hay chưa
}