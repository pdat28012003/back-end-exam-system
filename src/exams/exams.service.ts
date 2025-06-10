import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamStatus } from '../database/schemas/exam.schema';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ExamsService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<Exam>,
    private usersService: UsersService,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    // Kiểm tra xem người tạo có tồn tại không
    await this.usersService.findById(createExamDto.createdBy);

    const newExam = new this.examModel(createExamDto);
    return newExam.save();
  }

  async findAll(): Promise<Exam[]> {
    return this.examModel.find().exec();
  }

  async findById(id: string): Promise<Exam> {
    const exam = await this.examModel.findById(id).exec();

    if (!exam) {
      throw new NotFoundException(`Không tìm thấy bài thi với ID: ${id}`);
    }

    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const updatedExam = await this.examModel
      .findByIdAndUpdate(id, updateExamDto, { new: true })
      .exec();

    if (!updatedExam) {
      throw new NotFoundException(`Không tìm thấy bài thi với ID: ${id}`);
    }

    return updatedExam;
  }

  async remove(id: string): Promise<Exam> {
    const deletedExam = await this.examModel.findByIdAndDelete(id).exec();

    if (!deletedExam) {
      throw new NotFoundException(`Không tìm thấy bài thi với ID: ${id}`);
    }

    return deletedExam;
  }

  async findByCreator(creatorId: string): Promise<Exam[]> {
    return this.examModel.find({ createdBy: creatorId }).exec();
  }

  async findByStatus(status: ExamStatus): Promise<Exam[]> {
    return this.examModel.find({ status }).exec();
  }

  async findActiveExams(): Promise<Exam[]> {
    const now = new Date();
    return this.examModel
      .find({
        status: ExamStatus.PUBLISHED,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
      .exec();
  }

  async findUpcomingExams(): Promise<Exam[]> {
    const now = new Date();
    return this.examModel
      .find({
        status: ExamStatus.PUBLISHED,
        startDate: { $gt: now },
      })
      .exec();
  }
}
