import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '../database/schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';
import { 
  UserResponseModel, 
  UsersResponseModel, 
  ErrorResponseModel, 
  SuccessResponseModel 
} from '../swagger/models/response.model';

@ApiTags('admin/users')
@ApiBearerAuth()
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Tạo người dùng mới (Admin)' })
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
  @ApiBody({ type: AdminCreateUserDto })
  @Post()
  async create(@Body() createUserDto: AdminCreateUserDto): Promise<User> {
    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng (Admin)' })
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
  findAll(@Query('role') role?: UserRole): Promise<User[]> {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID (Admin)' })
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
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Cập nhật thông tin người dùng (Admin)' })
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

  @ApiOperation({ summary: 'Xóa người dùng (Admin)' })
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
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id);
  }

  @ApiOperation({ summary: 'Đặt lại mật khẩu người dùng (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Đặt lại mật khẩu thành công',
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
  @Put(':id/reset-password')
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { newPassword: string },
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    
    return this.usersService.update(id, { password: hashedPassword });
  }

  @ApiOperation({ summary: 'Thay đổi vai trò người dùng (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Thay đổi vai trò thành công',
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
  @Put(':id/change-role')
  changeRole(
    @Param('id') id: string,
    @Body() body: { role: UserRole },
  ): Promise<User> {
    return this.usersService.update(id, { role: body.role });
  }

  @ApiOperation({ summary: 'Kích hoạt/Vô hiệu hóa người dùng (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Thay đổi trạng thái thành công',
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
  @Put(':id/toggle-active')
  async toggleActive(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ): Promise<User> {
    return this.usersService.update(id, { isActive: body.isActive });
  }
}