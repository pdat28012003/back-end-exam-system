import {
  IsArray,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatus } from '../../database/schemas/submission.schema';
import { AnswerDto } from './create-submission.dto';

export class UpdateSubmissionDto {
  @ApiProperty({
    description: 'Danh sách câu trả lời',
    type: [AnswerDto],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Câu trả lời phải là mảng' })
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers?: AnswerDto[];

  @ApiProperty({
    description: 'Thời gian kết thúc làm bài',
    example: '2023-06-21T10:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDate({ message: 'Thời gian kết thúc phải là ngày' })
  @Type(() => Date)
  endTime?: Date;

  @ApiProperty({
    description: 'Trạng thái bài nộp',
    enum: SubmissionStatus,
    example: SubmissionStatus.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(SubmissionStatus, { message: 'Trạng thái không hợp lệ' })
  status?: SubmissionStatus;

  @ApiProperty({
    description: 'Điểm số (0-100)',
    example: 85,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Điểm số phải là số' })
  score?: number;

  @ApiProperty({
    description: 'Phản hồi của giáo viên',
    example: 'Bài làm tốt, cần cải thiện phần...',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phản hồi phải là chuỗi' })
  feedback?: string;
}
