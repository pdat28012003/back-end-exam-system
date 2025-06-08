import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import {
  Submission,
  SubmissionStatus,
} from '../database/schemas/submission.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('submissions')
@ApiBearerAuth()
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @ApiOperation({ summary: 'Tạo bài nộp mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo bài nộp thành công',
    type: Submission,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc vượt quá số lần làm bài cho phép',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài thi hoặc người dùng',
  })
  @ApiBody({ type: CreateSubmissionDto })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createSubmissionDto: CreateSubmissionDto,
    @CurrentUser() user: any,
  ): Promise<Submission> {
    // Đảm bảo người dùng chỉ có thể tạo bài nộp cho chính mình
    createSubmissionDto.userId = user.userId;
    return this.submissionsService.create(createSubmissionDto);
  }

  @ApiOperation({ summary: 'Lấy danh sách tất cả bài nộp' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài nộp',
    type: [Submission],
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Get()
  findAll(): Promise<Submission[]> {
    return this.submissionsService.findAll();
  }

  @ApiOperation({ summary: 'Lấy thông tin bài nộp theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin bài nộp',
    type: Submission,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài nộp' })
  @ApiParam({ name: 'id', description: 'ID của bài nộp' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Submission> {
    const submission = await this.submissionsService.findById(id);

    // Kiểm tra quyền truy cập: chỉ admin, giáo viên hoặc chủ sở hữu mới có thể xem
    if (
      user.role === UserRole.STUDENT &&
      submission.student.toString() !== user.userId
    ) {
      throw new Error('Bạn không có quyền xem bài nộp này');
    }

    return submission;
  }

  @ApiOperation({ summary: 'Lấy danh sách bài nộp theo bài thi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài nộp của bài thi',
    type: [Submission],
  })
  @ApiParam({ name: 'examId', description: 'ID của bài thi' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Get('exam/:examId')
  findByExam(@Param('examId') examId: string): Promise<Submission[]> {
    return this.submissionsService.findByExam(examId);
  }

  @ApiOperation({ summary: 'Lấy danh sách bài nộp của người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài nộp của người dùng',
    type: [Submission],
  })
  @ApiParam({ name: 'userId', description: 'ID của người dùng' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ): Promise<Submission[]> {
    // Kiểm tra quyền: chỉ admin, giáo viên hoặc chính người dùng đó mới có thể xem
    if (user.role === UserRole.STUDENT && userId !== user.userId) {
      throw new Error('Bạn không có quyền xem bài nộp của người khác');
    }

    return this.submissionsService.findByUser(userId);
  }

  @ApiOperation({
    summary: 'Lấy danh sách bài nộp của người dùng cho một bài thi cụ thể',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài nộp của người dùng cho bài thi',
    type: [Submission],
  })
  @ApiParam({ name: 'examId', description: 'ID của bài thi' })
  @ApiParam({ name: 'userId', description: 'ID của người dùng' })
  @UseGuards(JwtAuthGuard)
  @Get('exam/:examId/user/:userId')
  async findByExamAndUser(
    @Param('examId') examId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: any,
  ): Promise<Submission[]> {
    // Kiểm tra quyền: chỉ admin, giáo viên hoặc chính người dùng đó mới có thể xem
    if (user.role === UserRole.STUDENT && userId !== user.userId) {
      throw new Error('Bạn không có quyền xem bài nộp của người khác');
    }

    return this.submissionsService.findByExamAndUser(examId, userId);
  }

  @ApiOperation({ summary: 'Cập nhật bài nộp' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật bài nộp thành công',
    type: Submission,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài nộp' })
  @ApiParam({ name: 'id', description: 'ID của bài nộp' })
  @ApiBody({ type: UpdateSubmissionDto })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubmissionDto: UpdateSubmissionDto,
    @CurrentUser() user: any,
  ): Promise<Submission> {
    const submission = await this.submissionsService.findById(id);

    // Kiểm tra quyền: chỉ admin, giáo viên hoặc chính người dùng đó mới có thể cập nhật
    if (
      user.role === UserRole.STUDENT &&
      submission.student.toString() !== user.userId
    ) {
      throw new Error('Bạn không có quyền cập nhật bài nộp này');
    }

    return this.submissionsService.update(id, updateSubmissionDto);
  }

  @ApiOperation({ summary: 'Xóa bài nộp' })
  @ApiResponse({
    status: 200,
    description: 'Xóa bài nộp thành công',
    type: Submission,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài nộp' })
  @ApiParam({ name: 'id', description: 'ID của bài nộp' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Submission> {
    return this.submissionsService.remove(id);
  }
}
