import { ExamStatus, ExamType } from '../../database/schemas/exam.schema';

export class UpdateExamDto {
  title?: string;
  description?: string;
  subject?: string;
  duration?: number;
  startDate?: Date;
  endDate?: Date;
  type?: ExamType;
  status?: ExamStatus;
  passingScore?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  showResults?: boolean;
}
