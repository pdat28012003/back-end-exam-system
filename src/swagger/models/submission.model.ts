import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatus } from '../../database/schemas/submission.schema';

class AnswerModel {
  @ApiProperty({
    description: 'ID của câu hỏi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  questionId: string;

  @ApiProperty({
    description: 'Danh sách ID của các lựa chọn được chọn (đối với câu hỏi trắc nghiệm)',
    type: [String],
    example: ['60d5ec9af682fbd12a0b4b72', '60d5ec9af682fbd12a0b4b73'],
    required: false,
  })
  selectedOptions?: string[];

  @ApiProperty({
    description: 'Câu trả lời dạng văn bản (đối với câu hỏi tự luận)',
    example: 'Đây là câu trả lời của tôi...',
    required: false,
  })
  textAnswer?: string;
}

export class SubmissionModel {
  @ApiProperty({
    description: 'ID của bài nộp',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'ID của bài thi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  exam: string;

  @ApiProperty({
    description: 'ID của học sinh',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  student: string;

  @ApiProperty({
    description: 'Danh sách câu trả lời',
    type: [AnswerModel],
  })
  answers: AnswerModel[];

  @ApiProperty({
    description: 'Thời gian bắt đầu làm bài',
    example: '2023-06-21T09:00:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc làm bài',
    example: '2023-06-21T10:00:00.000Z',
    required: false,
  })
  endTime?: Date;

  @ApiProperty({
    description: 'Trạng thái bài nộp',
    enum: SubmissionStatus,
    example: SubmissionStatus.COMPLETED,
  })
  status: SubmissionStatus;

  @ApiProperty({
    description: 'Điểm số (0-100)',
    example: 85,
    required: false,
  })
  score?: number;

  @ApiProperty({
    description: 'Phản hồi của giáo viên',
    example: 'Bài làm tốt, cần cải thiện phần...',
    required: false,
  })
  feedback?: string;

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