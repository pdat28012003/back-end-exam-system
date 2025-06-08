import { QuestionType } from '../../database/schemas/question.schema';
import { OptionDto } from './create-question.dto';

export class UpdateQuestionDto {
  text?: string;
  type?: QuestionType;
  options?: OptionDto[];
  correctAnswer?: string;
  points?: number;
  order?: number;
}