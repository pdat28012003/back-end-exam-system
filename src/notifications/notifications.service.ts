import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationType } from '../database/schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
    private usersService: UsersService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    // Kiểm tra xem người dùng có tồn tại không
    await this.usersService.findById(createNotificationDto.userId);
    
    const newNotification = new this.notificationModel({
      ...createNotificationDto,
      isRead: false, // Mặc định là chưa đọc
      createdAt: new Date(),
    });
    
    return newNotification.save();
  }

  async findAll(): Promise<Notification[]> {
    return this.notificationModel.find().sort({ createdAt: -1 }).exec();
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.notificationModel.findById(id).exec();
    
    if (!notification) {
      throw new NotFoundException(`Không tìm thấy thông báo với ID: ${id}`);
    }
    
    return notification;
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ userId, isRead: false })
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto): Promise<Notification> {
    const updatedNotification = await this.notificationModel
      .findByIdAndUpdate(id, updateNotificationDto, { new: true })
      .exec();
    
    if (!updatedNotification) {
      throw new NotFoundException(`Không tìm thấy thông báo với ID: ${id}`);
    }
    
    return updatedNotification;
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.update(id, { isRead: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }

  async remove(id: string): Promise<Notification> {
    const deletedNotification = await this.notificationModel.findByIdAndDelete(id).exec();
    
    if (!deletedNotification) {
      throw new NotFoundException(`Không tìm thấy thông báo với ID: ${id}`);
    }
    
    return deletedNotification;
  }

  async createExamNotification(
    userId: string,
    examId: string,
    examTitle: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      title: 'Bài thi mới',
      message: `Bài thi "${examTitle}" đã được tạo và sẵn sàng cho bạn tham gia.`,
      type: NotificationType.EXAM,
      relatedId: examId,
    });
  }

  async createSubmissionGradedNotification(
    userId: string,
    examId: string,
    examTitle: string,
    score: number,
  ): Promise<Notification> {
    return this.create({
      userId,
      title: 'Bài thi đã được chấm điểm',
      message: `Bài thi "${examTitle}" của bạn đã được chấm điểm. Điểm số: ${score}.`,
      type: NotificationType.SUBMISSION,
      relatedId: examId,
    });
  }
}