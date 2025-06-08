import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatus } from '../../database/schemas/submission.schema';

export class AnswerDto {
  @ApiProperty({
    description: 'ID của câu hỏi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  @IsNotEmpty({ message: 'ID câu hỏi không được để trống' })
  @IsString({ message: 'ID câu hỏi phải là chuỗi' })
  questionId: string;

  @ApiProperty({
    description:
      'Danh sách ID của các lựa chọn được chọn (đối với câu hỏi trắc nghiệm)',
    type: [String],
    example: ['60d5ec9af682fbd12a0b4b72', '60d5ec9af682fbd12a0b4b73'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Các lựa chọn phải là mảng' })
  selectedOptions?: string[]; // IDs của các lựa chọn được chọn (đối với câu hỏi trắc nghiệm)

  @ApiProperty({
    description: 'Câu trả lời dạng văn bản (đối với câu hỏi tự luận)',
    example: 'Đây là câu trả lời của tôi...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Câu trả lời phải là chuỗi' })
  textAnswer?: string; // Câu trả lời dạng văn bản (đối với câu hỏi tự luận)
}

export class CreateSubmissionDto {
  @ApiProperty({
    description: 'ID của bài thi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  @IsNotEmpty({ message: 'ID bài thi không được để trống' })
  @IsString({ message: 'ID bài thi phải là chuỗi' })
  examId: string; // ID của bài thi

  @ApiProperty({
    description: 'ID của người dùng',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  @IsNotEmpty({ message: 'ID người dùng không được để trống' })
  @IsString({ message: 'ID người dùng phải là chuỗi' })
  userId: string; // ID của người dùng

  @ApiProperty({
    description: 'Danh sách câu trả lời',
    type: [AnswerDto],
  })
  @IsArray({ message: 'Câu trả lời phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[]; // Danh sách câu trả lời

  @ApiProperty({
    description: 'Thời gian bắt đầu làm bài',
    example: '2023-06-21T09:00:00.000Z',
  })
  @IsDate({ message: 'Thời gian bắt đầu phải là ngày' })
  @Type(() => Date)
  startTime: Date; // Thời gian bắt đầu làm bài

  @ApiProperty({
    description: 'Thời gian kết thúc làm bài',
    example: '2023-06-21T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Thời gian kết thúc phải là ngày' })
  @Type(() => Date)
  endTime?: Date; // Thời gian kết thúc làm bài

  @ApiProperty({
    description: 'Trạng thái bài nộp',
    enum: SubmissionStatus,
    example: SubmissionStatus.IN_PROGRESS,
  })
  @IsEnum(SubmissionStatus, { message: 'Trạng thái không hợp lệ' })
  status: SubmissionStatus; // Trạng thái bài nộp

  @ApiProperty({
    description: 'Điểm số (0-100)',
    example: 85,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Điểm số phải là số' })
  score?: number; // Điểm số
}
