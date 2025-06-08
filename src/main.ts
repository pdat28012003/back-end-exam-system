import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Kích hoạt CORS
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Sử dụng Helmet để bảo mật HTTP headers
  app.use(helmet());

  // Thiết lập global prefix cho API
  app.setGlobalPrefix('api');

  // Kích hoạt validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có thuộc tính không được định nghĩa
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );

  // Sử dụng global interceptor để định dạng response
  app.useGlobalInterceptors(new TransformInterceptor());

  // Sử dụng global filter để xử lý lỗi
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Hệ thống thi trực tuyến API')
    .setDescription('API cho hệ thống thi trực tuyến')
    .setVersion('1.0')
    .addTag('auth', 'Xác thực và phân quyền')
    .addTag('users', 'Quản lý người dùng')
    .addTag('admin/users', 'Quản lý người dùng (Admin)')
    .addTag('exams', 'Quản lý bài thi')
    .addTag('questions', 'Quản lý câu hỏi')
    .addTag('submissions', 'Quản lý bài nộp')
    .addTag('notifications', 'Quản lý thông báo')
    .addTag('exam-statistics', 'Thống kê bài thi')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Nhập token JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [
      require('./swagger/models/response.model').LoginResponseModel,
      require('./swagger/models/response.model').UserResponseModel,
      require('./swagger/models/response.model').UsersResponseModel,
      require('./swagger/models/response.model').ExamResponseModel,
      require('./swagger/models/response.model').ExamsResponseModel,
      require('./swagger/models/response.model').QuestionResponseModel,
      require('./swagger/models/response.model').QuestionsResponseModel,
      require('./swagger/models/response.model').SubmissionResponseModel,
      require('./swagger/models/response.model').SubmissionsResponseModel,
      require('./swagger/models/response.model').ErrorResponseModel,
      require('./swagger/models/response.model').SuccessResponseModel,
    ],
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  logger.log(`Ứng dụng đang chạy trên cổng ${port}`);
  logger.log(`MongoDB đã được cấu hình và sẵn sàng sử dụng`);
}
bootstrap();
