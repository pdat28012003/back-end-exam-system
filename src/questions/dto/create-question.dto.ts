import { QuestionType } from '../../database/schemas/question.schema';

export class OptionDto {
  text: string;
  isCorrect: boolean;
}

export class CreateQuestionDto {
  examId: string; // ID của bài thi
  text: string; // Nội dung câu hỏi
  type: QuestionType; // Loại câu hỏi
  options: OptionDto[]; // Các lựa chọn (đối với câu hỏi trắc nghiệm)
  correctAnswer?: string; // Đáp án đúng (đối với câu hỏi tự luận)
  points: number; // Điểm số
  order?: number; // Thứ tự câu hỏi trong bài thi
}