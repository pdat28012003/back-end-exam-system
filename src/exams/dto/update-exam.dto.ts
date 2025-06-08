import { ExamStatus, ExamType } from '../../database/schemas/exam.schema';

export class UpdateExamDto {
  title?: string;
  description?: string;
  subject?: string;
  duration?: number;
  startTime?: Date;
  endTime?: Date;
  type?: ExamType;
  status?: ExamStatus;
  passingScore?: number;
  maxAttempts?: number;
  isRandomized?: boolean;
  showResults?: boolean;
}
