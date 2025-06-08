import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExamStatistics,
  ExamStatisticsSchema,
} from '../database/schemas/exam-statistics.schema';
import { ExamStatisticsController } from './exam-statistics.controller';
import { ExamStatisticsService } from './exam-statistics.service';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExamStatistics.name, schema: ExamStatisticsSchema },
    ]),
    ExamsModule,
  ],
  controllers: [ExamStatisticsController],
  providers: [ExamStatisticsService],
  exports: [ExamStatisticsService],
})
export class ExamStatisticsModule {}
