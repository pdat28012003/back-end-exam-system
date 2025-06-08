import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../database/schemas/user.schema';

export class UserModel {
  @ApiProperty({
    description: 'ID của người dùng',
    example: '60d5ec9af682fbd12a0b4b72',
  })
  _id: string;

  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'student1',
  })
  username: string;

  @ApiProperty({
    description: 'Email',
    example: 'student1@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu (đã được mã hóa)',
    example: '$2b$10$X7JkfkZHAJ3X8YJh9uVVaOzV0MJ3TZmCYDI.fP.87YQUu1/lKRPYa',
  })
  password: string;

  @ApiProperty({
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
  })
  fullName: string;

  @ApiProperty({
    description: 'Đường dẫn đến ảnh đại diện',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0987654321',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Vai trò người dùng',
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Thời gian đăng nhập gần nhất',
    example: '2023-06-21T15:24:58.000Z',
    required: false,
  })
  lastLogin?: Date;

  @ApiProperty({
    description: 'Thông tin bổ sung',
    example: { class: '12A1', school: 'THPT Nguyễn Huệ' },
    required: false,
  })
  additionalInfo?: Record<string, any>;

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