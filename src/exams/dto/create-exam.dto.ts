import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDate,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamStatus, ExamType } from '../../database/schemas/exam.schema';

export class CreateExamDto {
  @ApiProperty({
    description: 'Tiêu đề bài thi',
    example: 'Bài kiểm tra giữa kỳ môn Toán',
  })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @IsString({ message: 'Tiêu đề phải là chuỗi' })
  title: string;

  @ApiProperty({
    description: 'Mô tả bài thi',
    example: 'Bài kiểm tra kiến thức cơ bản về đại số và hình học',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description: string;

  @ApiProperty({
    description: 'Môn học',
    example: 'Toán học',
  })
  @IsString({ message: 'Môn học phải là chuỗi' })
  subject: string;

  @ApiProperty({
    description: 'Thời gian làm bài (phút)',
    example: 60,
  })
  @IsNotEmpty({ message: 'Thời gian làm bài không được để trống' })
  @IsNumber({}, { message: 'Thời gian làm bài phải là số' })
  @Min(1, { message: 'Thời gian làm bài phải lớn hơn 0' })
  @Max(300, { message: 'Thời gian làm bài không được vượt quá 300 phút' })
  duration: number;

  @ApiProperty({
    description: 'Thời gian bắt đầu',
    example: '2023-06-21T09:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate({ message: 'Thời gian bắt đầu phải là ngày' })
  startDate: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc',
    example: '2023-06-21T17:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate({ message: 'Thời gian kết thúc phải là ngày' })
  endDate: Date;

  @ApiProperty({
    description: 'Loại bài thi',
    enum: ExamType,
    default: ExamType.QUIZ,
    example: ExamType.QUIZ,
  })
  @IsEnum(ExamType, { message: 'Loại bài thi không hợp lệ' })
  type: ExamType;

  @ApiProperty({
    description: 'Trạng thái bài thi',
    enum: ExamStatus,
    default: ExamStatus.DRAFT,
    example: ExamStatus.DRAFT,
  })
  @IsEnum(ExamStatus, { message: 'Trạng thái không hợp lệ' })
  status: ExamStatus;

  @ApiProperty({
    description: 'ID người tạo',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  @IsString({ message: 'ID người tạo phải là chuỗi' })
  createdBy: string;

  @ApiProperty({
    description: 'Điểm đạt',
    example: 70,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Điểm đạt phải là số' })
  @Min(0, { message: 'Điểm đạt phải lớn hơn hoặc bằng 0' })
  @Max(100, { message: 'Điểm đạt không được vượt quá 100' })
  passingScore?: number;

  @ApiProperty({
    description: 'Số lần làm bài tối đa',
    example: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Số lần làm bài tối đa phải là số' })
  @Min(1, { message: 'Số lần làm bài tối đa phải lớn hơn 0' })
  maxAttempts?: number;

  @ApiProperty({
    description: 'Xáo trộn câu hỏi',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Xáo trộn câu hỏi phải là boolean' })
  shuffleQuestions?: boolean;

  @ApiProperty({
    description: 'Xáo trộn các lựa chọn trong câu hỏi',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Xáo trộn các lựa chọn phải là boolean' })
  shuffleOptions?: boolean;

  @ApiProperty({
    description: 'Hiển thị kết quả ngay sau khi nộp bài',
    default: false,
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Hiển thị kết quả ngay phải là boolean' })
  showResults?: boolean;
}
