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
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam, ExamStatus } from '../database/schemas/exam.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../database/schemas/user.schema';

@ApiTags('exams')
@ApiBearerAuth()
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @ApiOperation({ summary: 'Tạo bài thi mới' })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo bài thi thành công',
    type: Exam
  })
  @ApiResponse({ status: 401, description: 'Không có quyền truy cập' })
  @ApiBody({ type: CreateExamDto })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  create(
    @Body() createExamDto: CreateExamDto,
    @CurrentUser() user: any,
  ): Promise<Exam> {
    // Tự động gán người tạo là người dùng hiện tại
    createExamDto.createdBy = user.userId;
    return this.examsService.create(createExamDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('status') status?: ExamStatus): Promise<Exam[]> {
    if (status) {
      return this.examsService.findByStatus(status);
    }
    return this.examsService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  findActiveExams(): Promise<Exam[]> {
    return this.examsService.findActiveExams();
  }

  @Get('upcoming')
  @UseGuards(JwtAuthGuard)
  findUpcomingExams(): Promise<Exam[]> {
    return this.examsService.findUpcomingExams();
  }

  @Get('my-exams')
  @UseGuards(JwtAuthGuard)
  findMyExams(@CurrentUser() user: any): Promise<Exam[]> {
    return this.examsService.findByCreator(user.userId);
  }

  @Get('creator/:creatorId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findByCreator(@Param('creatorId') creatorId: string): Promise<Exam[]> {
    return this.examsService.findByCreator(creatorId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Exam> {
    return this.examsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
    @CurrentUser() user: any,
  ): Promise<Exam> {
    // Kiểm tra xem người dùng có quyền cập nhật bài thi này không
    const exam = await this.examsService.findById(id);
    
    if (user.role !== UserRole.ADMIN && exam.createdBy.toString() !== user.userId) {
      throw new Error('Bạn không có quyền cập nhật bài thi này');
    }
    
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<Exam> {
    // Kiểm tra xem người dùng có quyền xóa bài thi này không
    const exam = await this.examsService.findById(id);
    
    if (user.role !== UserRole.ADMIN && exam.createdBy.toString() !== user.userId) {
      throw new Error('Bạn không có quyền xóa bài thi này');
    }
    
    return this.examsService.remove(id);
  }
}