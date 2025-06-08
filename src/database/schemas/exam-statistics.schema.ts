import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Exam } from './exam.schema';

@Schema({
  timestamps: true,
})
export class ExamStatistics extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam', required: true })
  examId: Exam;

  @Prop({ default: 0 })
  participantCount: number;

  @Prop({ default: 0 })
  completedCount: number;

  @Prop({ default: 0 })
  completionRate: number;

  @Prop({ default: 0 })
  averageScore: number;

  @Prop({ default: 0 })
  averageTimeInMinutes: number;

  @Prop({
    type: {
      below40: { type: Number, default: 0 },
      between40And60: { type: Number, default: 0 },
      between60And80: { type: Number, default: 0 },
      above80: { type: Number, default: 0 },
    },
    _id: false,
  })
  scoreDistribution: {
    below40: number;
    between40And60: number;
    between60And80: number;
    above80: number;
  };
}

export const ExamStatisticsSchema = SchemaFactory.createForClass(ExamStatistics);