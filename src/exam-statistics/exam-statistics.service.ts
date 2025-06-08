import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExamStatistics } from '../database/schemas/exam-statistics.schema';
import { ExamsService } from '../exams/exams.service';

@Injectable()
export class ExamStatisticsService {
  constructor(
    @InjectModel(ExamStatistics.name)
    private examStatisticsModel: Model<ExamStatistics>,
    private examsService: ExamsService,
  ) {}

  async findByExam(examId: string): Promise<ExamStatistics> {
    // Kiểm tra xem bài thi có tồn tại không
    await this.examsService.findById(examId);

    // Tìm hoặc tạo thống kê cho bài thi
    let statistics = await this.examStatisticsModel.findOne({ examId }).exec();

    if (!statistics) {
      statistics = (await this.createEmptyStatistics(examId)) as any;
    }

    return statistics as ExamStatistics;
  }

  async updateParticipantCount(examId: string): Promise<ExamStatistics> {
    const statistics = await this.findByExam(examId);

    statistics.participantCount += 1;

    return statistics.save();
  }

  async updateScoreDistribution(
    examId: string,
    score: number,
  ): Promise<ExamStatistics> {
    const statistics = await this.findByExam(examId);

    // Cập nhật phân phối điểm số
    if (score < 40) {
      statistics.scoreDistribution.below40 += 1;
    } else if (score < 60) {
      statistics.scoreDistribution.between40And60 += 1;
    } else if (score < 80) {
      statistics.scoreDistribution.between60And80 += 1;
    } else {
      statistics.scoreDistribution.above80 += 1;
    }

    // Cập nhật điểm trung bình
    const totalScores =
      statistics.scoreDistribution.below40 * 20 +
      statistics.scoreDistribution.between40And60 * 50 +
      statistics.scoreDistribution.between60And80 * 70 +
      statistics.scoreDistribution.above80 * 90;

    const totalParticipants =
      statistics.scoreDistribution.below40 +
      statistics.scoreDistribution.between40And60 +
      statistics.scoreDistribution.between60And80 +
      statistics.scoreDistribution.above80;

    statistics.averageScore =
      totalParticipants > 0 ? totalScores / totalParticipants : 0;

    return statistics.save();
  }

  async updateCompletionRate(
    examId: string,
    isCompleted: boolean,
  ): Promise<ExamStatistics> {
    const statistics = await this.findByExam(examId);

    if (isCompleted) {
      statistics.completedCount += 1;
    }

    // Cập nhật tỷ lệ hoàn thành
    statistics.completionRate =
      statistics.participantCount > 0
        ? (statistics.completedCount / statistics.participantCount) * 100
        : 0;

    return statistics.save();
  }

  async updateAverageTime(
    examId: string,
    timeSpentInMinutes: number,
  ): Promise<ExamStatistics> {
    const statistics = await this.findByExam(examId);

    // Cập nhật thời gian trung bình
    const totalTime =
      statistics.averageTimeInMinutes * statistics.completedCount;
    statistics.completedCount += 1;
    statistics.averageTimeInMinutes =
      statistics.completedCount > 0
        ? (totalTime + timeSpentInMinutes) / statistics.completedCount
        : 0;

    return statistics.save();
  }

  private async createEmptyStatistics(examId: string): Promise<ExamStatistics> {
    const newStatistics = new this.examStatisticsModel({
      examId,
      participantCount: 0,
      completedCount: 0,
      completionRate: 0,
      averageScore: 0,
      averageTimeInMinutes: 0,
      scoreDistribution: {
        below40: 0,
        between40And60: 0,
        between60And80: 0,
        above80: 0,
      },
    });

    return newStatistics.save();
  }
}
