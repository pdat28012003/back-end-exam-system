import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

export enum ExamType {
  QUIZ = 'quiz',
  TEST = 'test',
  EXAM = 'exam',
}

@Schema({ timestamps: true })
export class Exam extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  duration: number; // in minutes

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: String, enum: ExamStatus, default: ExamStatus.DRAFT })
  status: ExamStatus;

  @Prop({ type: String, enum: ExamType, default: ExamType.QUIZ })
  type: ExamType;

  @Prop({ default: 1 })
  maxAttempts: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ default: false })
  shuffleQuestions: boolean;

  @Prop({ default: false })
  shuffleOptions: boolean;

  @Prop({ default: 0 })
  passingScore: number;

  @Prop({ default: false })
  showResults: boolean;

  @Prop({ default: false })
  showCorrectAnswers: boolean;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Question' }] })
  questions: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  allowedUsers?: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Object })
  additionalSettings?: Record<string, any>;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
