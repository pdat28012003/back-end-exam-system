import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '../database/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import * as bcrypt from 'bcrypt';
import { 
  UserResponseModel, 
  UsersResponseModel, 
  ErrorResponseModel, 
  SuccessResponseModel 
} from '../swagger/models/response.model';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Tạo người dùng mới (Chỉ dành cho Admin)' })
  @ApiResponse({
    status: 201,
    description: 'Tạo người dùng thành công',
    type: UserResponseModel
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền truy cập',
    type: ErrorResponseModel
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Tên đăng nhập hoặc email đã tồn tại',
    type: ErrorResponseModel
  })
  @ApiBody({ type: CreateUserDto })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;
    
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách người dùng',
    type: UsersResponseModel
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền truy cập',
    type: ErrorResponseModel
  })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(@Query('role') role?: UserRole): Promise<User[]> {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin cá nhân',
    type: UserResponseModel
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập',
    type: ErrorResponseModel
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any): Promise<User> {
    return this.usersService.findById(user.userId);
  }

  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin người dùng',
    type: UserResponseModel
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng',
    type: ErrorResponseModel
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền truy cập',
    type: ErrorResponseModel
  })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: UserResponseModel
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng',
    type: ErrorResponseModel
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền truy cập',
    type: ErrorResponseModel
  })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    // Nếu có cập nhật mật khẩu, mã hóa mật khẩu trước khi lưu
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Xóa thành công',
    type: SuccessResponseModel
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng',
    type: ErrorResponseModel
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Không có quyền truy cập',
    type: ErrorResponseModel
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }
}
