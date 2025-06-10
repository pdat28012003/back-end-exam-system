import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question, QuestionType } from '../database/schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ExamsService } from '../exams/exams.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    private examsService: ExamsService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // Kiểm tra xem bài thi có tồn tại không
    await this.examsService.findById(createQuestionDto.examId);

    // Nếu không có order, lấy số lượng câu hỏi hiện tại + 1
    if (!createQuestionDto.order) {
      const count = await this.questionModel.countDocuments({
        examId: createQuestionDto.examId,
      });
      createQuestionDto.order = count + 1;
    }

    const newQuestion = new this.questionModel(createQuestionDto);
    return newQuestion.save();
  }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async findById(id: string): Promise<Question> {
    const question = await this.questionModel.findById(id).exec();

    if (!question) {
      throw new NotFoundException(`Không tìm thấy câu hỏi với ID: ${id}`);
    }

    return question;
  }

  async findByExam(examId: string): Promise<Question[]> {
    return this.questionModel.find({ examId }).sort({ order: 1 }).exec();
  }

  async findByType(type: QuestionType): Promise<Question[]> {
    return this.questionModel.find({ type }).exec();
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .exec();

    if (!updatedQuestion) {
      throw new NotFoundException(`Không tìm thấy câu hỏi với ID: ${id}`);
    }

    return updatedQuestion;
  }

  async remove(id: string): Promise<Question> {
    const deletedQuestion = await this.questionModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedQuestion) {
      throw new NotFoundException(`Không tìm thấy câu hỏi với ID: ${id}`);
    }

    return deletedQuestion;
  }

  async reorderQuestions(
    examId: string,
    questionIds: string[],
  ): Promise<Question[]> {
    // Kiểm tra xem bài thi có tồn tại không
    await this.examsService.findById(examId);

    // Kiểm tra xem tất cả các câu hỏi có tồn tại không
    const questions = await this.questionModel
      .find({
        _id: { $in: questionIds },
      })
      .exec();

    // Kiểm tra số lượng câu hỏi tìm thấy có khớp với số lượng ID đã cung cấp không
    if (questions.length !== questionIds.length) {
      throw new NotFoundException('Một số câu hỏi không tồn tại');
    }

    // Kiểm tra xem tất cả các câu hỏi có thuộc về cùng một bài thi không
    const invalidQuestions = questions.filter(
      (q) => q.examId.toString() !== examId,
    );
    if (invalidQuestions.length > 0) {
      throw new NotFoundException(
        `Các câu hỏi với ID: ${invalidQuestions.map((q) => q._id).join(', ')} không thuộc về bài thi này`,
      );
    }

    // Vì chúng ta đã kiểm tra tất cả các câu hỏi tồn tại và thuộc về bài thi,
    // chúng ta có thể cập nhật từng câu hỏi một cách tuần tự để tránh lỗi kiểu dữ liệu
    const updatedQuestions: Question[] = [];

    for (let i = 0; i < questionIds.length; i++) {
      const id = questionIds[i];
      const updatedQuestion = await this.questionModel
        .findByIdAndUpdate(id, { order: i + 1 }, { new: true })
        .exec();

      if (!updatedQuestion) {
        throw new NotFoundException(`Không thể cập nhật câu hỏi với ID: ${id}`);
      }

      updatedQuestions.push(updatedQuestion);
    }

    return updatedQuestions;
  }
}
