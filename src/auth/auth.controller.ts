import { Controller, Post, Body, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '../database/schemas/user.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { 
  LoginResponseModel, 
  UserResponseModel, 
  ErrorResponseModel, 
  SuccessResponseModel 
} from '../swagger/models/response.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  @ApiResponse({
    status: 200,
    description: 'Đăng nhập thành công',
    type: LoginResponseModel
  })
  @ApiResponse({
    status: 401,
    description: 'Tên đăng nhập hoặc mật khẩu không đúng',
    type: ErrorResponseModel
  })
  @ApiBody({ type: LoginDto })
  @Post('login')
  login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Tạo tài khoản mới (Chỉ dành cho Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Tạo tài khoản thành công',
    type: UserResponseModel
  })
  @ApiResponse({
    status: 409,
    description: 'Tên đăng nhập hoặc email đã tồn tại',
    type: ErrorResponseModel
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
    type: ErrorResponseModel
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBody({ type: RegisterDto })
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Đổi mật khẩu' })
  @ApiResponse({
    status: 200,
    description: 'Đổi mật khẩu thành công',
    type: SuccessResponseModel
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Mật khẩu cũ không đúng',
    type: ErrorResponseModel
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        oldPassword: { type: 'string', example: 'password123' },
        newPassword: { type: 'string', example: 'newpassword123' },
      },
      required: ['oldPassword', 'newPassword'],
    },
  })
  @Put('change-password/:userId')
  changePassword(
    @Param('userId') userId: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<boolean> {
    return this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }
}
