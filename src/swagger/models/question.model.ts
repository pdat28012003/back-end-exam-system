import { ApiProperty } from '@nestjs/swagger';
import { QuestionType, DifficultyLevel } from '../../database/schemas/question.schema';

class OptionModel {
  @ApiProperty({
    description: 'ID của lựa chọn',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Nội dung lựa chọn',
    example: 'Đáp án A',
  })
  text: string;

  @ApiProperty({
    description: 'Có phải đáp án đúng không',
    example: true,
  })
  isCorrect: boolean;
}

export class QuestionModel {
  @ApiProperty({
    description: 'ID của câu hỏi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Nội dung câu hỏi',
    example: 'Thủ đô của Việt Nam là gì?',
  })
  text: string;

  @ApiProperty({
    description: 'Loại câu hỏi',
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  type: QuestionType;

  @ApiProperty({
    description: 'Mức độ khó',
    enum: DifficultyLevel,
    example: DifficultyLevel.MEDIUM,
  })
  difficulty: DifficultyLevel;

  @ApiProperty({
    description: 'Điểm số của câu hỏi',
    example: 2,
  })
  points: number;

  @ApiProperty({
    description: 'ID của bài thi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  exam: string;

  @ApiProperty({
    description: 'Danh sách các lựa chọn (đối với câu hỏi trắc nghiệm)',
    type: [OptionModel],
    required: false,
  })
  options?: OptionModel[];

  @ApiProperty({
    description: 'Đáp án mẫu (đối với câu hỏi tự luận)',
    example: 'Hà Nội là thủ đô của Việt Nam...',
    required: false,
  })
  correctAnswer?: string;

  @ApiProperty({
    description: 'Giải thích đáp án',
    example: 'Hà Nội trở thành thủ đô từ năm...',
    required: false,
  })
  explanation?: string;

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