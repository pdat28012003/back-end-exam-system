import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Notification } from '../database/schemas/notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto): Promise<Notification> {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.findById(id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationsService.findByUser(userId);
  }

  @Get('user/:userId/unread')
  findUnreadByUser(@Param('userId') userId: string): Promise<Notification[]> {
    return this.notificationsService.findUnreadByUser(userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return this.notificationsService.update(id, updateNotificationDto);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Put('user/:userId/read-all')
  async markAllAsRead(@Param('userId') userId: string): Promise<{ success: boolean }> {
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.remove(id);
  }
}