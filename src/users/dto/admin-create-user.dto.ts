import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../database/schemas/user.schema';

export class AdminCreateUserDto {
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'teacher1',
  })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  username: string;

  @ApiProperty({
    description: 'Email',
    example: 'teacher1@example.com',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Mật khẩu',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({
    description: 'Họ tên',
    example: 'Nguyễn Văn B',
  })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  fullName: string;

  @ApiProperty({
    description: 'Vai trò',
    enum: UserRole,
    example: UserRole.TEACHER,
  })
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role: UserRole;

  @ApiProperty({
    description: 'Trạng thái hoạt động',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái hoạt động phải là boolean' })
  isActive?: boolean;

  @ApiProperty({
    description: 'Số điện thoại',
    example: '0987654321',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Đường dẫn ảnh đại diện',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Đường dẫn ảnh đại diện phải là chuỗi' })
  avatar?: string;
}