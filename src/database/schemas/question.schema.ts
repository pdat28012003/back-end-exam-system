import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TRUE_FALSE = 'true_false',
  ESSAY = 'essay',
  MATCHING = 'matching',
  FILL_IN_BLANK = 'fill_in_blank',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Schema()
export class Option {
  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop()
  explanation?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  type: QuestionType;

  @Prop({ type: [OptionSchema], default: [] })
  options: Option[];

  @Prop()
  correctAnswer?: string; // For essay, fill-in-blank, etc.

  @Prop({
    type: String,
    enum: DifficultyLevel,
    default: DifficultyLevel.MEDIUM,
  })
  difficulty: DifficultyLevel;

  @Prop({ default: 1 })
  points: number;

  @Prop()
  explanation?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam', required: true })
  examId: MongooseSchema.Types.ObjectId;

  @Prop({ default: 1 })
  order: number;

  @Prop()
  image?: string;

  @Prop({ type: Object })
  additionalData?: Record<string, any>;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
