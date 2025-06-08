import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export enum NotificationType {
  EXAM_SCHEDULED = 'exam_scheduled',
  EXAM_REMINDER = 'exam_reminder',
  EXAM_RESULT = 'exam_result',
  SYSTEM = 'system',
  CUSTOM = 'custom',
  EXAM = 'exam',
  SUBMISSION = 'submission',
}

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: String,
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type: NotificationType;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: User;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Object })
  data?: Record<string, any>;

  @Prop()
  link?: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
