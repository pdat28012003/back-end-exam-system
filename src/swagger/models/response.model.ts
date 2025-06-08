import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from './user.model';
import { ExamModel } from './exam.model';
import { QuestionModel } from './question.model';
import { SubmissionModel } from './submission.model';

// Mẫu response cho thông tin người dùng
export class UserResponseModel {
  @ApiProperty({
    description: 'ID của người dùng',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: 'Email',
    example: 'admin@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Administrator',
  })
  fullName: string;

  @ApiProperty({
    description: 'Vai trò',
    example: 'admin',
    enum: ['admin', 'teacher', 'student'],
  })
  role: string;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  isActive: boolean;

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

// Mẫu response cho đăng nhập
export class LoginResponseModel {
  @ApiProperty({
    description: 'Token truy cập',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MGQ1ZWM5YWY2ODJmYmQxMmEwYjRiNzIiLCJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjI0MjkwNzQ4LCJleHAiOjE2MjQzNzcxNDh9.7QQnfg4Nf9KgcnD_lAH9cVUVFj8',
  })
  access_token: string;

  @ApiProperty({
    description: 'Thông tin người dùng',
    type: () => UserResponseModel,
  })
  user: UserResponseModel;
}

// Mẫu response cho danh sách người dùng
export class UsersResponseModel {
  @ApiProperty({
    description: 'Danh sách người dùng',
    type: [UserResponseModel],
  })
  users: UserResponseModel[];
}

// Mẫu response cho lựa chọn trong câu hỏi
export class OptionResponseModel {
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
    description: 'Đánh dấu đáp án đúng',
    example: true,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Giải thích cho lựa chọn',
    example: 'Đây là đáp án đúng vì...',
    required: false,
  })
  explanation?: string;
}

// Mẫu response cho câu hỏi
export class QuestionResponseModel {
  @ApiProperty({
    description: 'ID của câu hỏi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Nội dung câu hỏi',
    example: 'Tổng của 2 + 2 là bao nhiêu?',
  })
  text: string;

  @ApiProperty({
    description: 'Loại câu hỏi',
    example: 'multiple_choice',
    enum: [
      'multiple_choice',
      'single_choice',
      'true_false',
      'essay',
      'matching',
      'fill_in_blank',
    ],
  })
  type: string;

  @ApiProperty({
    description: 'Các lựa chọn',
    type: [OptionResponseModel],
  })
  options: OptionResponseModel[];

  @ApiProperty({
    description: 'Độ khó',
    example: 'medium',
    enum: ['easy', 'medium', 'hard'],
  })
  difficulty: string;

  @ApiProperty({
    description: 'Điểm số',
    example: 1,
  })
  points: number;

  @ApiProperty({
    description: 'Người tạo',
    type: () => UserResponseModel,
  })
  createdBy: UserResponseModel;

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

// Mẫu response cho danh sách câu hỏi
export class QuestionsResponseModel {
  @ApiProperty({
    description: 'Danh sách câu hỏi',
    type: [QuestionResponseModel],
  })
  questions: QuestionResponseModel[];
}

// Mẫu response cho bài thi
export class ExamResponseModel {
  @ApiProperty({
    description: 'ID của bài thi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Tiêu đề bài thi',
    example: 'Bài kiểm tra giữa kỳ môn Toán',
  })
  title: string;

  @ApiProperty({
    description: 'Mô tả bài thi',
    example: 'Bài kiểm tra kiến thức cơ bản về đại số và hình học',
  })
  description: string;

  @ApiProperty({
    description: 'Thời gian làm bài (phút)',
    example: 60,
  })
  duration: number;

  @ApiProperty({
    description: 'Thời gian bắt đầu',
    example: '2023-06-21T09:00:00.000Z',
  })
  startDate: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc',
    example: '2023-06-21T17:00:00.000Z',
  })
  endDate: Date;

  @ApiProperty({
    description: 'Trạng thái bài thi',
    example: 'published',
    enum: ['draft', 'published', 'active', 'completed', 'archived'],
  })
  status: string;

  @ApiProperty({
    description: 'Loại bài thi',
    example: 'quiz',
    enum: ['quiz', 'test', 'exam'],
  })
  type: string;

  @ApiProperty({
    description: 'Người tạo',
    type: () => UserResponseModel,
  })
  createdBy: UserResponseModel;

  @ApiProperty({
    description: 'Danh sách câu hỏi',
    type: [QuestionResponseModel],
  })
  questions: QuestionResponseModel[];

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

// Mẫu response cho danh sách bài thi
export class ExamsResponseModel {
  @ApiProperty({
    description: 'Danh sách bài thi',
    type: [ExamResponseModel],
  })
  exams: ExamResponseModel[];
}

// Mẫu response cho bài nộp
export class AnswerResponseModel {
  @ApiProperty({
    description: 'ID của câu hỏi',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  questionId: string;

  @ApiProperty({
    description: 'Các lựa chọn đã chọn',
    example: ['60d5ec9af682fbd12a0b4b72', '60d5ec9af682fbd12a0b4b73'],
    type: [String],
  })
  selectedOptions: string[];

  @ApiProperty({
    description: 'Câu trả lời dạng văn bản',
    example: 'Đây là câu trả lời của tôi...',
    required: false,
  })
  textAnswer?: string;

  @ApiProperty({
    description: 'Đánh dấu đúng/sai',
    example: true,
    required: false,
  })
  isCorrect?: boolean;

  @ApiProperty({
    description: 'Điểm số',
    example: 1,
  })
  score: number;
}

export class SubmissionResponseModel {
  @ApiProperty({
    description: 'ID của bài nộp',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Học sinh',
    type: () => UserResponseModel,
  })
  student: UserResponseModel;

  @ApiProperty({
    description: 'Bài thi',
    type: () => ExamResponseModel,
  })
  exam: ExamResponseModel;

  @ApiProperty({
    description: 'Trạng thái bài nộp',
    example: 'submitted',
    enum: ['in_progress', 'submitted', 'graded', 'completed'],
  })
  status: string;

  @ApiProperty({
    description: 'Các câu trả lời',
    type: [AnswerResponseModel],
  })
  answers: AnswerResponseModel[];

  @ApiProperty({
    description: 'Thời gian bắt đầu làm bài',
    example: '2023-06-21T09:30:00.000Z',
  })
  startTime: Date;

  @ApiProperty({
    description: 'Thời gian kết thúc làm bài',
    example: '2023-06-21T10:30:00.000Z',
    required: false,
  })
  endTime?: Date;

  @ApiProperty({
    description: 'Tổng điểm tối đa',
    example: 10,
  })
  totalScore: number;

  @ApiProperty({
    description: 'Điểm đạt được',
    example: 8,
  })
  score: number;

  @ApiProperty({
    description: 'Đánh dấu đạt/không đạt',
    example: true,
  })
  isPassed: boolean;

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

// Mẫu response cho danh sách bài nộp
export class SubmissionsResponseModel {
  @ApiProperty({
    description: 'Danh sách bài nộp',
    type: [SubmissionResponseModel],
  })
  submissions: SubmissionResponseModel[];
}

// Mẫu response cho thông báo lỗi
export class ErrorResponseModel {
  @ApiProperty({
    description: 'Mã lỗi HTTP',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Thông báo lỗi',
    example: 'Dữ liệu không hợp lệ',
  })
  message: string;

  @ApiProperty({
    description: 'Đường dẫn gây lỗi',
    example: '/api/users',
  })
  path: string;

  @ApiProperty({
    description: 'Thời gian xảy ra lỗi',
    example: '2023-06-21T15:24:58.000Z',
  })
  timestamp: string;
}

// Mẫu response cho thành công
export class SuccessResponseModel {
  @ApiProperty({
    description: 'Mã trạng thái HTTP',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Thông báo thành công',
    example: 'Thao tác thành công',
  })
  message: string;

  @ApiProperty({
    description: 'Dữ liệu trả về',
    example: { id: '60d5ec9af682fbd12a0b4b72' },
  })
  data: any;
}
