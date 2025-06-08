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

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(id, updateQuestionDto, { new: true })
      .exec();
    
    if (!updatedQuestion) {
      throw new NotFoundException(`Không tìm thấy câu hỏi với ID: ${id}`);
    }
    
    return updatedQuestion;
  }

  async remove(id: string): Promise<Question> {
    const deletedQuestion = await this.questionModel.findByIdAndDelete(id).exec();
    
    if (!deletedQuestion) {
      throw new NotFoundException(`Không tìm thấy câu hỏi với ID: ${id}`);
    }
    
    return deletedQuestion;
  }

  async reorderQuestions(examId: string, questionIds: string[]): Promise<Question[]> {
    // Kiểm tra xem bài thi có tồn tại không
    await this.examsService.findById(examId);
    
    // Cập nhật thứ tự cho từng câu hỏi
    const updatePromises = questionIds.map((id, index) => {
      return this.questionModel
        .findOneAndUpdate(
          { _id: id, examId },
          { order: index + 1 },
          { new: true }
        )
        .exec();
    });
    
    const updatedQuestions = await Promise.all(updatePromises);
    
    // Lọc ra các câu hỏi null (không tìm thấy)
    const validQuestions = updatedQuestions.filter(q => q !== null);
    
    if (validQuestions.length !== questionIds.length) {
      throw new NotFoundException('Một số câu hỏi không tồn tại hoặc không thuộc bài thi này');
    }
    
    return validQuestions;
  }
}