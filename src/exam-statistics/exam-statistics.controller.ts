import { Controller, Get, Param } from '@nestjs/common';
import { ExamStatisticsService } from './exam-statistics.service';
import { ExamStatistics } from '../database/schemas/exam-statistics.schema';

@Controller('exam-statistics')
export class ExamStatisticsController {
  constructor(private readonly examStatisticsService: ExamStatisticsService) {}

  @Get(':examId')
  findByExam(@Param('examId') examId: string): Promise<ExamStatistics> {
    return this.examStatisticsService.findByExam(examId);
  }
}
