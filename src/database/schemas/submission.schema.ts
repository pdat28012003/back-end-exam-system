import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';
import { Exam } from './exam.schema';
import { Question } from './question.schema';

export enum SubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  COMPLETED = 'completed',
}

@Schema()
export class Answer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Question', required: true })
  questionId: Question;

  @Prop({ type: [String], default: [] })
  selectedOptions: string[]; // IDs or indices of selected options

  @Prop()
  textAnswer?: string; // For essay questions

  @Prop()
  isCorrect?: boolean;

  @Prop({ default: 0 })
  score: number;

  @Prop()
  feedback?: string;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  student: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam', required: true })
  exam: Exam;

  @Prop({ type: String, enum: SubmissionStatus, default: SubmissionStatus.IN_PROGRESS })
  status: SubmissionStatus;

  @Prop({ type: [AnswerSchema], default: [] })
  answers: Answer[];

  @Prop()
  startTime: Date;

  @Prop()
  endTime?: Date;

  @Prop({ default: 0 })
  totalScore: number;

  @Prop({ default: 0 })
  score: number;

  @Prop({ default: false })
  isPassed: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  gradedBy?: User;

  @Prop()
  gradedAt?: Date;

  @Prop()
  feedback?: string;

  // Thêm trường examId để dễ truy vấn
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam' })
  get examId() {
    return this.exam;
  }
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);