import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Submission,
  SubmissionStatus,
} from '../database/schemas/submission.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { ExamsService } from '../exams/exams.service';
import { UsersService } from '../users/users.service';
import { QuestionsService } from '../questions/questions.service';
import { QuestionType } from '../database/schemas/question.schema';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    private examsService: ExamsService,
    private usersService: UsersService,
    private questionsService: QuestionsService,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto): Promise<Submission> {
    // Kiểm tra xem bài thi và người dùng có tồn tại không
    const exam = await this.examsService.findById(createSubmissionDto.examId);
    await this.usersService.findById(createSubmissionDto.userId);

    // Kiểm tra xem người dùng đã nộp bài thi này bao nhiêu lần
    const submissionCount = await this.submissionModel.countDocuments({
      exam: createSubmissionDto.examId,
      student: createSubmissionDto.userId,
    });

    // Nếu bài thi có giới hạn số lần làm và người dùng đã vượt quá giới hạn
    if (exam.maxAttempts && submissionCount >= exam.maxAttempts) {
      throw new BadRequestException(
        `Bạn đã vượt quá số lần làm bài cho phép (${exam.maxAttempts} lần)`,
      );
    }

    const newSubmission = new this.submissionModel(createSubmissionDto);

    // Nếu trạng thái là COMPLETED, tự động chấm điểm cho các câu hỏi trắc nghiệm
    if (createSubmissionDto.status === SubmissionStatus.COMPLETED) {
      await this.autoGradeSubmission(newSubmission);
    }

    return newSubmission.save();
  }

  async findAll(): Promise<Submission[]> {
    return this.submissionModel.find().exec();
  }

  async findById(id: string): Promise<Submission> {
    const submission = await this.submissionModel.findById(id).exec();

    if (!submission) {
      throw new NotFoundException(`Không tìm thấy bài nộp với ID: ${id}`);
    }

    return submission;
  }

  async findByExam(examId: string): Promise<Submission[]> {
    return this.submissionModel.find({ exam: examId }).exec();
  }

  async findByUser(userId: string): Promise<Submission[]> {
    return this.submissionModel.find({ student: userId }).exec();
  }

  async findByExamAndUser(
    examId: string,
    userId: string,
  ): Promise<Submission[]> {
    return this.submissionModel.find({ exam: examId, student: userId }).exec();
  }

  async update(
    id: string,
    updateSubmissionDto: UpdateSubmissionDto,
  ): Promise<Submission> {
    const submission = await this.submissionModel.findById(id).exec();

    if (!submission) {
      throw new NotFoundException(`Không tìm thấy bài nộp với ID: ${id}`);
    }

    // Nếu trạng thái thay đổi từ IN_PROGRESS sang COMPLETED, tự động chấm điểm
    if (
      submission.status === SubmissionStatus.IN_PROGRESS &&
      updateSubmissionDto.status === SubmissionStatus.COMPLETED
    ) {
      // Cập nhật các trường khác trước
      Object.assign(submission, updateSubmissionDto);
      await this.autoGradeSubmission(submission);
    } else {
      Object.assign(submission, updateSubmissionDto);
    }

    return submission.save();
  }

  async remove(id: string): Promise<Submission> {
    const deletedSubmission = await this.submissionModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedSubmission) {
      throw new NotFoundException(`Không tìm thấy bài nộp với ID: ${id}`);
    }

    return deletedSubmission;
  }

  private async autoGradeSubmission(submission: Submission): Promise<void> {
    // Lấy tất cả câu hỏi của bài thi
    const questions = await this.questionsService.findByExam(
      submission.exam.toString(),
    );

    let totalScore = 0;
    let totalPoints = 0;

    // Duyệt qua từng câu trả lời
    for (const answer of submission.answers) {
      const question = questions.find(
        (q) => q._id && q._id.toString() === answer.questionId.toString(),
      );

      if (!question) continue;

      totalPoints += question.points;

      // Chỉ tự động chấm điểm cho câu hỏi trắc nghiệm
      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        // Lấy các lựa chọn đúng
        const correctOptions = question.options
          .filter((opt) => opt.isCorrect)
          .map((opt) => opt._id && opt._id.toString());

        // Lấy các lựa chọn của người dùng
        const selectedOptions = answer.selectedOptions || [];

        // So sánh các lựa chọn
        const isCorrect =
          correctOptions.length === selectedOptions.length &&
          correctOptions.every((opt) => selectedOptions.includes(opt));

        if (isCorrect) {
          totalScore += question.points;
        }
      }
    }

    // Cập nhật điểm số
    submission.score = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
  }
}
