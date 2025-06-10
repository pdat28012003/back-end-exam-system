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

    // Kiểm tra thời gian làm bài
    const now = new Date();

    // Kiểm tra xem bài thi đã bắt đầu chưa
    if (now < exam.startDate) {
      throw new BadRequestException(
        `Bài thi chưa bắt đầu. Thời gian bắt đầu: ${exam.startDate.toLocaleString()}`,
      );
    }

    // Kiểm tra xem bài thi đã kết thúc chưa
    if (now > exam.endDate) {
      throw new BadRequestException(
        `Bài thi đã kết thúc. Thời gian kết thúc: ${exam.endDate.toLocaleString()}`,
      );
    }

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

    // Ánh xạ từ DTO sang schema
    const submissionData = {
      ...createSubmissionDto,
      student: createSubmissionDto.userId,
      exam: createSubmissionDto.examId,
    };

    const newSubmission = new this.submissionModel(submissionData);

    // Nếu trạng thái là COMPLETED, tự động chấm điểm cho các câu hỏi
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

    // Nếu trạng thái thay đổi từ IN_PROGRESS sang COMPLETED, kiểm tra thời gian và tự động chấm điểm
    if (
      submission.status === SubmissionStatus.IN_PROGRESS &&
      updateSubmissionDto.status === SubmissionStatus.COMPLETED
    ) {
      // Lấy thông tin bài thi
      const exam = await this.examsService.findById(submission.exam.toString());

      // Kiểm tra thời gian làm bài
      const now = new Date();

      // Kiểm tra xem bài thi đã kết thúc chưa
      if (now > exam.endDate) {
        throw new BadRequestException(
          `Bài thi đã kết thúc. Không thể nộp bài sau thời gian kết thúc: ${exam.endDate.toLocaleString()}`,
        );
      }

      // Cập nhật thời gian kết thúc làm bài
      updateSubmissionDto.endTime = now;

      // Cập nhật các trường khác
      Object.assign(submission, updateSubmissionDto);

      // Tự động chấm điểm
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

      // Tự động chấm điểm cho các loại câu hỏi khác nhau
      switch (question.type) {
        case QuestionType.MULTIPLE_CHOICE:
          // Lấy các lựa chọn đúng
          const correctOptions = question.options
            .filter((opt) => opt.isCorrect)
            .map((opt) => opt._id && opt._id.toString());

          // Lấy các lựa chọn của người dùng
          const selectedOptions = answer.selectedOptions || [];

          // So sánh các lựa chọn - phải chọn đúng tất cả các đáp án đúng
          const isCorrectMultiple =
            correctOptions.length === selectedOptions.length &&
            correctOptions.every((opt) => selectedOptions.includes(opt));

          if (isCorrectMultiple) {
            totalScore += question.points;
          }
          break;

        case QuestionType.SINGLE_CHOICE:
          // Lấy lựa chọn đúng duy nhất
          const correctOption = question.options.find((opt) => opt.isCorrect);

          // Lấy lựa chọn của người dùng
          const selectedOption =
            answer.selectedOptions && answer.selectedOptions.length > 0
              ? answer.selectedOptions[0]
              : null;

          // So sánh lựa chọn - chỉ cần chọn đúng đáp án đúng duy nhất
          if (
            correctOption &&
            selectedOption &&
            correctOption._id &&
            correctOption._id.toString() === selectedOption
          ) {
            totalScore += question.points;
          }
          break;

        case QuestionType.TRUE_FALSE:
          // TRUE_FALSE cũng là một dạng SINGLE_CHOICE, xử lý tương tự
          const correctTrueFalse = question.options.find(
            (opt) => opt.isCorrect,
          );

          const selectedTrueFalse =
            answer.selectedOptions && answer.selectedOptions.length > 0
              ? answer.selectedOptions[0]
              : null;

          if (
            correctTrueFalse &&
            selectedTrueFalse &&
            correctTrueFalse._id &&
            correctTrueFalse._id.toString() === selectedTrueFalse
          ) {
            totalScore += question.points;
          }
          break;

        case QuestionType.FILL_IN_BLANK:
          // Đối với câu hỏi điền vào chỗ trống, so sánh câu trả lời với đáp án đúng
          if (
            question.correctAnswer &&
            answer.textAnswer &&
            question.correctAnswer.trim().toLowerCase() ===
              answer.textAnswer.trim().toLowerCase()
          ) {
            totalScore += question.points;
          }
          break;

        // Các loại câu hỏi khác như ESSAY, MATCHING cần giáo viên chấm điểm thủ công
        default:
          // Không tự động chấm điểm
          break;
      }
    }

    // Cập nhật điểm số
    submission.score = totalPoints > 0 ? (totalScore / totalPoints) * 100 : 0;
  }
}
