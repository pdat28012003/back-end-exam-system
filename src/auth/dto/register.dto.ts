import { IsNotEmpty, IsString, IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../database/schemas/user.schema';

export class RegisterDto {
  @ApiProperty({
    description: 'Tên đăng nhập',
    example: 'student1',
  })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  @MinLength(3, { message: 'Tên đăng nhập phải có ít nhất 3 ký tự' })
  username: string;

  @ApiProperty({
    description: 'Email',
    example: 'student1@example.com',
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
    description: 'Họ và tên',
    example: 'Nguyễn Văn A',
  })
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString({ message: 'Họ tên phải là chuỗi' })
  fullName: string;

  @ApiProperty({
    description: 'Vai trò người dùng',
    enum: UserRole,
    default: UserRole.STUDENT,
    example: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;
}