import { ApiProperty } from '@nestjs/swagger';
import { ExamStatus, ExamType } from '../../database/schemas/exam.schema';

export class ExamModel {
  @ApiProperty({
    description: 'ID của bài thi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Tiêu đề bài thi',
    example: 'Bài kiểm tra giữa kỳ môn Toán',
  })
  title: string;

  @ApiProperty({
    description: 'Mô tả bài thi',
    example: 'Bài kiểm tra kiến thức cơ bản về đại số và hình học',
  })
  description: string;

  @ApiProperty({
    description: 'Môn học',
    example: 'Toán học',
  })
  subject: string;

  @ApiProperty({
    description: 'Thời gian làm bài (phút)',
    example: 60,
  })
  duration: number;

  @ApiProperty({
    description: 'Thời gian bắt đầu',
    example: '2023-06-21T09:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc',
    example: '2023-06-21T17:00:00.000Z',
  })
  endTime: Date;

  @ApiProperty({
    description: 'Loại bài thi',
    enum: ExamType,
    example: ExamType.QUIZ,
  })
  type: ExamType;

  @ApiProperty({
    description: 'Trạng thái bài thi',
    enum: ExamStatus,
    example: ExamStatus.PUBLISHED,
  })
  status: ExamStatus;

  @ApiProperty({
    description: 'ID người tạo',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  createdBy: string;

  @ApiProperty({
    description: 'Điểm đạt',
    example: 70,
    required: false,
  })
  passingScore?: number;

  @ApiProperty({
    description: 'Số lần làm bài tối đa',
    example: 1,
    required: false,
  })
  maxAttempts?: number;

  @ApiProperty({
    description: 'Xáo trộn câu hỏi',
    example: false,
    required: false,
  })
  isRandomized?: boolean;

  @ApiProperty({
    description: 'Hiển thị kết quả ngay sau khi nộp bài',
    example: false,
    required: false,
  })
  showResults?: boolean;

  @ApiProperty({
    description: 'Danh sách ID câu hỏi',
    type: [String],
    example: ['60d5ec9af682fbd12a0b4b72', '60d5ec9af682fbd12a0b4b73'],
  })
  questions: string[];

  @ApiProperty({
    description: 'Thời gian tạo',
    example: '2023-06-21T15:24:58.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật gần nhất',
    example: '2023-06-21T15:24:58.000Z',
  })
  updatedAt: Date;
}
