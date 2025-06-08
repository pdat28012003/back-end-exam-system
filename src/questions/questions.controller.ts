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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question, QuestionType } from '../database/schemas/question.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/schemas/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiOperation({ summary: 'Tạo câu hỏi mới' })
  @ApiResponse({
    status: 201,
    description: 'Tạo câu hỏi thành công',
    type: Question,
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiBody({ type: CreateQuestionDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionsService.create(createQuestionDto);
  }

  @ApiOperation({ summary: 'Lấy danh sách tất cả câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi',
    type: [Question],
  })
  @ApiQuery({
    name: 'type',
    enum: QuestionType,
    required: false,
    description: 'Lọc theo loại câu hỏi',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Get()
  findAll(@Query('type') type?: QuestionType): Promise<Question[]> {
    if (type) {
      return this.questionsService.findByType(type);
    }
    return this.questionsService.findAll();
  }

  @ApiOperation({ summary: 'Lấy danh sách câu hỏi theo bài thi' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách câu hỏi của bài thi',
    type: [Question],
  })
  @ApiParam({ name: 'examId', description: 'ID của bài thi' })
  @UseGuards(JwtAuthGuard)
  @Get('exam/:examId')
  findByExam(@Param('examId') examId: string): Promise<Question[]> {
    return this.questionsService.findByExam(examId);
  }

  @ApiOperation({ summary: 'Lấy thông tin câu hỏi theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin câu hỏi',
    type: Question,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi' })
  @ApiParam({ name: 'id', description: 'ID của câu hỏi' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Question> {
    return this.questionsService.findById(id);
  }

  @ApiOperation({ summary: 'Cập nhật câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật câu hỏi thành công',
    type: Question,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi' })
  @ApiParam({ name: 'id', description: 'ID của câu hỏi' })
  @ApiBody({ type: UpdateQuestionDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.update(id, updateQuestionDto);
  }

  @ApiOperation({ summary: 'Xóa câu hỏi' })
  @ApiResponse({
    status: 200,
    description: 'Xóa câu hỏi thành công',
    type: Question,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy câu hỏi' })
  @ApiParam({ name: 'id', description: 'ID của câu hỏi' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Question> {
    return this.questionsService.remove(id);
  }

  @ApiOperation({ summary: 'Sắp xếp lại thứ tự câu hỏi trong bài thi' })
  @ApiResponse({
    status: 200,
    description: 'Sắp xếp lại thứ tự câu hỏi thành công',
    type: [Question],
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bài thi' })
  @ApiParam({ name: 'examId', description: 'ID của bài thi' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        questionIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Danh sách ID câu hỏi theo thứ tự mới',
          example: ['60d5ec9af682fbd12a0b4b72', '60d5ec9af682fbd12a0b4b73'],
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Put('reorder/:examId')
  reorderQuestions(
    @Param('examId') examId: string,
    @Body() body: { questionIds: string[] },
  ): Promise<Question[]> {
    return this.questionsService.reorderQuestions(examId, body.questionIds);
  }
}
