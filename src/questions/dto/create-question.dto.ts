import {
  QuestionType,
  DifficultyLevel,
} from '../../database/schemas/question.schema';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OptionDto {
  @IsString({ message: 'Nội dung lựa chọn phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung lựa chọn không được để trống' })
  text: string;

  @IsBoolean({ message: 'Trạng thái đúng/sai phải là boolean' })
  isCorrect: boolean;

  @IsString({ message: 'Giải thích phải là chuỗi' })
  @IsOptional()
  explanation?: string;
}

export class CreateQuestionDto {
  @IsString({ message: 'ID bài thi phải là chuỗi' })
  @IsNotEmpty({ message: 'ID bài thi không được để trống' })
  examId: string; // ID của bài thi

  @IsString({ message: 'Nội dung câu hỏi phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung câu hỏi không được để trống' })
  text: string; // Nội dung câu hỏi

  @IsEnum(QuestionType, { message: 'Loại câu hỏi không hợp lệ' })
  @IsNotEmpty({ message: 'Loại câu hỏi không được để trống' })
  type: QuestionType; // Loại câu hỏi

  @IsArray({ message: 'Các lựa chọn phải là một mảng' })
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @ArrayMinSize(1, { message: 'Phải có ít nhất một lựa chọn' })
  options: OptionDto[]; // Các lựa chọn (đối với câu hỏi trắc nghiệm)

  @IsString({ message: 'Đáp án đúng phải là chuỗi' })
  @IsOptional()
  correctAnswer?: string; // Đáp án đúng (đối với câu hỏi tự luận)

  @IsNumber({}, { message: 'Điểm số phải là số' })
  @Min(0, { message: 'Điểm số không được âm' })
  points: number; // Điểm số

  @IsNumber({}, { message: 'Thứ tự phải là số' })
  @IsOptional()
  order?: number; // Thứ tự câu hỏi trong bài thi

  @IsEnum(DifficultyLevel, { message: 'Mức độ khó không hợp lệ' })
  @IsOptional()
  difficulty?: DifficultyLevel; // Mức độ khó

  @IsString({ message: 'Giải thích phải là chuỗi' })
  @IsOptional()
  explanation?: string; // Giải thích cho câu hỏi

  @IsArray({ message: 'Tags phải là một mảng chuỗi' })
  @IsString({ each: true, message: 'Mỗi tag phải là chuỗi' })
  @IsOptional()
  tags?: string[]; // Các tag cho câu hỏi
}
