import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Exam } from './exam.schema';

@Schema({ timestamps: true })
export class ExamStatistics extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam', required: true })
  exam: Exam;

  @Prop({ default: 0 })
  totalParticipants: number;

  @Prop({ default: 0 })
  passedCount: number;

  @Prop({ default: 0 })
  failedCount: number;

  @Prop({ default: 0 })
  averageScore: number;

  @Prop({ default: 0 })
  highestScore: number;

  @Prop({ default: 0 })
  lowestScore: number;

  @Prop({ type: Object })
  scoreDistribution: Record<string, number>;

  @Prop({ type: Object })
  questionPerformance: Record<string, {
    correctCount: number;
    incorrectCount: number;
    averageScore: number;
  }>;

  @Prop({ type: Object })
  additionalMetrics?: Record<string, any>;
}

export const ExamStatisticsSchema = SchemaFactory.createForClass(ExamStatistics);